#!/usr/bin/python
# -*- coding: utf-8 -*-

"""
Author: mcyan
Date: 2016/12/29
Comments: user相关信息数据库操作类，操作user_info表
"""
import db.db_mysql as sqlutil
import conf.config as config


class DbUsers:
    def __init__(self):
        self.mysql = sqlutil.Mysql()

    def query_user_by_email(self, email):
        """
        根据email查询用户信息
        :param email: 用户email地址
        :return: 用户信息/False
        """
        # 查找user_info是否有此条记录
        if email is None or email == '':
            return False

        query_sql = 'select * from config_users where email=%s'
        param = [email]
        return self.mysql.get_all(query_sql, param)

    def query_user_by_id(self, user_id):
        """
        根据user_info表的id字段查找user信息
        可以验证用户id在数据库中是否存在
        :param user_id:
        :return: user信息/False
        """
        query_sql = 'select * from config_users where user_id=%s'
        param = [user_id]
        return self.mysql.get_one(query_sql, param)

    def query_all_user_showname(self):
        """
        返回所有user的showname
        :return:
        """
        try:
            query_sql = 'SELECT user_id, user_showname FROM config_users WHERE group_id IS NOT NULL ORDER BY user_showname ASC'

            re = self.mysql.get_all(query_sql)
            if re is False:
                return 0, 'success', []
            else:
                return 0, 'success', re

        except Exception, e:
            return -1, e, ''


    def search_role_list(self,role_name,page_dict):
        '''
        搜索角色列表
        :return:
        '''
        #最终返回的集合及分页信息
        page_info_dict = {}
        result_dict = {}

        # 分页信息
        current_page = page_dict['current_page']
        page_size = page_dict['page_size']
        first_num = str((current_page - 1) * page_size)
        page_size = str(page_dict['page_size'])

        try:
            query_sql ="select role_id as id,role_name as name,role_description as description,role_registertime as register_time from config_roles"
            count_sql = "select count(*) from config_roles"

            limit_sql = " LIMIT " + first_num + "," + page_size
            order_sql = " order by role_id asc"
            if role_name!="":
                condition = " where role_name like '%%"+role_name+"%%' "
                query_sql = query_sql + condition + order_sql + limit_sql
                count_sql = count_sql + condition
            else:
                query_sql = query_sql  + order_sql + limit_sql

            count = self.mysql.get_one(count_sql)["count(*)"]
            ret = self.mysql.get_all(query_sql)

            #日期转字符串
            if ret:
                for role in ret:
                    role["register_time"] = str(role["register_time"])

            # 生成页面信息字典
            page_info_dict['current_page'] = current_page
            page_info_dict['total_record'] = count
            page_info_dict['total_page'] = count / int(page_size)
            if count % int(page_size) != 0:
                page_info_dict['total_page'] += 1
            page_info_dict['previous_page'] = current_page - 1
            page_info_dict['next_page'] = current_page + 1
            page_info_dict['page_size'] = page_size
            if page_info_dict['previous_page'] < 1:
                page_info_dict['previous_page'] = 1
            if page_info_dict['next_page'] > page_info_dict['total_page']:
                page_info_dict['next_page'] = page_info_dict['total_page']
            # 生成要返回的字典，包括一个字典和任务信息表
            result_dict['page_info'] = page_info_dict
            result_dict['role_list'] = ret
        except Exception,e:
            return -1, 'search role list failed', str(e)
        return 0, 'success', result_dict

    def search_user_list(self,user_param,page_dict):
        '''
        搜索用户列表
         :param user_param   查询条件 (id,name/showname, role_name,department)
            page_dict    分页信息
        :return:  result、message、role_list:List<Map>
        [{id:"",name:"",showname:"",email:"",role_id:"",role_name:"",department:"".....}]
        '''
        # 最终返回的集合及分页信息
        page_info_dict = {}
        result_dict = {}

        # 分页信息
        current_page = page_dict['current_page']
        page_size = page_dict['page_size']
        first_num = str((current_page - 1) * page_size)
        page_size = str(page_dict['page_size'])

        try:
            query_sql = "select user.user_id as id,user.user_name as name,user.user_showname as showname," \
                        "user.user_email as email,role.role_id as role_id,role.role_name as role_name," \
                        "user.department as department " \
                        "from config_users user " \
                        "left join config_roles role on user.role_id = role.role_id "

            count_sql = "select count(*) from config_users user " \
                        "left join config_roles role on user.role_id = role.role_id "

            #拼接条件语句
            conditions = ""

            limit_sql = " LIMIT " + first_num + "," + page_size
            order_sql = " order by user.user_id asc"

            # 遍历所有参数
            for key in user_param.keys():
                if user_param[key] != '':
                    if key == "id":
                        # 判断项目名称是否为空
                        if user_param[key] != "":
                            conditions = conditions + "user.user_id = " + user_param[key] + " and "
                    if key == "name":
                        # 判断项目名称是否为空
                        if user_param[key] != "":
                            conditions = conditions + "(user.user_name like '%" + user_param[key] + "%' or user.user_showname like '%%"+user_param[key]+"%%') and "
                    if key == "role_id":
                        # 判断项目名称是否为空
                        if user_param[key] != "":
                            conditions = conditions + "role.role_id = " + user_param[key] +" and "
                    if key == "department":
                        # 判断项目名称是否为空
                        if user_param[key] != "":
                            conditions = conditions + "user.department like '%" + user_param[key] + "%' and "

            if conditions!="":
                conditions = conditions[:-4]
                query_sql = query_sql + " where " + conditions + order_sql + limit_sql
                count_sql = count_sql + " where " + conditions
            else:
                query_sql = query_sql + order_sql + limit_sql

            ret = self.mysql.get_all(query_sql)
            count = self.mysql.get_one(count_sql)["count(*)"]

            # 生成页面信息字典
            page_info_dict['current_page'] = current_page
            page_info_dict['total_record'] = count
            page_info_dict['total_page'] = count / int(page_size)
            if count % int(page_size) != 0:
                page_info_dict['total_page'] += 1
            page_info_dict['previous_page'] = current_page - 1
            page_info_dict['next_page'] = current_page + 1
            page_info_dict['page_size'] = page_size
            if page_info_dict['previous_page'] < 1:
                page_info_dict['previous_page'] = 1
            if page_info_dict['next_page'] > page_info_dict['total_page']:
                page_info_dict['next_page'] = page_info_dict['total_page']
            # 生成要返回的字典，包括一个字典和任务信息表
            result_dict['page_info'] = page_info_dict
            result_dict['user_list'] = ret
        except Exception, e:
            return -1, 'search user list failed', str(e)
        return 0, 'success', result_dict

    def set_user_role(self,user_id, role_id):
        '''
        设置用户角色
        :param user_id: 用户id
        :param role_id: 角色id
        :return:
        '''
        try:
            #参数
            param = [role_id,user_id]
            #更新user表角色id
            update_sql = "update config_users set role_id=%s where user_id=%s"
            self.mysql.update(update_sql,param)
            self.mysql.end()
        except Exception,e:
            return  -1,"failed",[]
        return 0,"success",[]

    def sync_login_info(self,user_info):
        '''
        同步用户信息及权限接口
        :param user_info:  user_id,user_name,user_showname,user_email,role_id:2(游客),department
        :return:result、message、authority_list:List<Map>
                [{id:"",name:"",type:"",pagekey:""}]
        :remark:1.根据user_id查询user表中是否存在该用户，若存在，直接执行步骤3;若不存在，执行步骤2
                2.根据user_info 中信息插入至user表中，用户角色默认为游客
                3.根据role_id ,搜索角色权限关系表和权限表，返回该用户支持的所有权限列表
        '''
        result = {}
        #默认角色id为2（游客）
        role_id = config.USER_GUEST_ROLE_ID
        try:
            #1.根据user_id 查询
            query_user_sql = "select * from config_users where user_id=%s"
            # user = self.mysql.get_one(query_user_sql,)
            user = self.mysql.get_one(query_user_sql,[user_info["user_id"]])
            #判断用户是否存在
            if not user:
                #2.若不存在，将user_info 数据插入到user表中
                insert_user_sql = "insert into config_users set user_id=%s,user_name=%s,user_showname=%s,user_email=%s,department=%s"
                param = [user_info["user_id"],user_info["user_name"],user_info["user_showname"],user_info["user_email"],user_info["department"]]
                self.mysql.insert_one(insert_user_sql,param)
                self.mysql.end()
            else:
                #获取用户对应的角色id
                role_id = user["role_id"]

            # 3.根据role_id 获取 角色权限信息
            query_authority_sql = "select auth.authority_id as id,auth.authority_name as name,auth.authority_type as type," \
                                  "auth.authority_url as url,auth.authority_pagekey as pagekey " \
                                  "from config_authoritys auth " \
                                  "left join config_role_authority_relations relation on auth.authority_id = relation.authority_id " \
                                  "where relation.role_id = %s"
            authority_list = self.mysql.get_all(query_authority_sql, [role_id])
            # 判断是否没有结果 (若无结果，则返回false,为避免前端异常，对于非false的情况将查询结果赋给result集合)
            result["role_id"] = role_id
            if authority_list:
                result["authority_list"]=authority_list
        except Exception ,e:
            print e
            return -1,"failed",str(e)
        return 0,"succeed",result

    def get_mail_template_by_id(self,template_id):
        '''
        根据邮件模板ID 获取邮件模板信息
        :param template_id:
        :return:
        '''
        try:
            query_sql = "select name,type from config_mail_template where id=%s"
            ret = self.mysql.get_one(query_sql,[template_id])
            return 0,"succeed",ret
        except Exception,e:
            return -1,"failed",str(e)

    def get_mail_template_by_type(self,type):
        '''
        根据邮件模板类型查询所有邮件模板
        :param type:
        :return:
        '''
        result = []
        try:
            query_sql = "select id,name from config_mail_template"
            #判断邮件模板类型是否为空
            if type =="":
                ret = self.mysql.get_all(query_sql)
            else:
                query_sql = query_sql + " where type =%s"
                ret = self.mysql.get_all(query_sql,[type])
            if ret:
                result = ret
        except Exception, e:
            return -1, "failed", str(e)
        return 0, "succeed", result

    def search_users(self,user_param):
        '''
        搜索用户列表接口
        :param user_param   查询条件 (id,name/showname, role_name,department)
        :return:  result、message、role_list:List<Map>
           [{id:"",name:"",showname:"",email:"",role_id:"",role_name:"",department:"".....}]
        '''
        result = []
        try:
            query_sql = "select user.user_id as id,user.user_name as name,user.user_showname as showname,user.user_email " \
                        "from config_users user " \
                        "left join config_roles role on user.role_id = role.role_id "

            # 拼接条件语句
            conditions = ""

            # 遍历所有参数
            for key in user_param.keys():
                if user_param[key] != '':
                    if key == "id":
                        # 判断项目名称是否为空
                        if user_param[key] != "":
                            conditions = conditions + "user.user_id = " + user_param[key] + " and "
                    if key == "name":
                        # 判断项目名称是否为空
                        if user_param[key] != "":
                            conditions = conditions + "(user.user_name like '%" + user_param[
                                key] + "%' or user.user_showname like '%%" + user_param[key] + "%%') and "
                    if key == "role_id":
                        # 判断项目名称是否为空
                        if user_param[key] != "":
                            conditions = conditions + "role.role_id = " + user_param[key] + " and "
                    if key == "department":
                        # 判断项目名称是否为空
                        if user_param[key] != "":
                            conditions = conditions + "user.department like '%" + user_param[key] + "%' and "

            if conditions != "":
                conditions = conditions[:-4]
                query_sql = query_sql + " where " + conditions + " order by user.user_showname asc"
            else:
                query_sql = query_sql + " order by user.user_showname asc"
            ret = self.mysql.get_all(query_sql)
            # 判断是否没有结果 (若无结果，则返回false,为避免前端异常，对于非false的情况将查询结果赋给result集合)
            if ret:
                result = ret
        except Exception,e:
            return -1,"failed",str(e)
        return 0,"succeed",result


    def search_all_test_users(self):
        '''
        查询所有测试人员
        :return:
        '''
        result =[]
        try:
            query_sql = "select user_id as id,user_name as name,user_showname as showname from config_users where sustain_member=1"
            ret = self.mysql.get_all(query_sql)
            # 判断是否没有结果 (若无结果，则返回false,为避免前端异常，对于非false的情况将查询结果赋给result集合)
            if ret:
                result = ret
        except Exception,e:
            return -1,"failed",str(e)
        return 0,"succeed",result

if __name__ == '__main__':
    dbuser = DbUsers()
    # user = dbuser.query_user_by_id(180)
    user = dbuser.search_all_test_users()
    print user
    # print user["user_id"]