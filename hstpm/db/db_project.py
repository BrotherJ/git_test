#!/usr/bin/python
# -*- coding: utf-8 -*-

"""
Author: mcyan
Date: 2016/1/4
Comments: db operation about project
"""

import db.db_mysql as sqlutil
import conf.enum_status
import conf.config
from conf.enum_status import EnumStatus

class DbProject:
    def __init__(self):
        self.mysql = sqlutil.Mysql()

    def search_project_list(self, param_dict, page_dict):
        """
        查询项目列表
        :param project_param:
                    project_name :项目名
                    creator  项目提交人id
                    owner(责任人id)
                    status:项目状态，支持多个，以“,”分割
                    tester:参与人id
                    prority:优先级
                    create_time:提交时间，时间2017-08-05 或范围2017-08-05/2017-08-09
                    out_run_time :项目结束时间，时间2017-08-05 或范围2017-08-05/2017-08-09
                    noDrafFlag: 0--> 查询除draft、approveFail和evaluteFail状态的项目
                                1--> 查询raft、approveFail和evaluteFail状态的项目
        :param pageinfo_param
        :return: result、message 、project_list :List<Map>
                [{project_id:"",project_name:"",test_content:"",test_progress:"",creator(申请人):"",owner(负责人):"",tester(测试人):"",
                priority:"",start_time:"",finish_time:"",create_time:"",evaluete_risk:"",sustain_risk:"",summary_risk:""}]
        :remark:有些字段存放在DB中可以直接查询，有些字段存放在text中，需要dump文件中的内容通过文件的map的key值获取value
        """

        where_str = ' where '

        #分页信息
        current_page = page_dict['current_page']
        page_size = page_dict['page_size']
        first_num = str((current_page - 1) * page_size)
        page_size = str(page_dict['page_size'])
        page_info_dict = {}
        result_dict = {}

        #sql语句
        select_sql = "select pro.id as project_id,pro.name as project_name," \
                     "pro.create_user_id,user.user_showname as creator,pro.create_time,pro.status," \
                     "pro.priority,pro.into_run_time as start_time,pro.out_run_time as finish_time " \
                     "from project_list pro " \
                     "left join config_users user  on pro.create_user_id = user.user_id "

        count_sql = "select count(*) " \
                     "from project_list pro " \
                     "left join config_users user  on pro.create_user_id = user.user_id "

        # 存放所有project_list表中条件
        sql_conditions = ""
        # 存放 根据责任人和参与人ID进行筛选项目的sql条件
        proj_group_conditions = "";
        #存放责任人或测试人的条件
        owner_condition = ""
        tester_condition = ""

        #遍历所有参数
        for key in param_dict.keys():
            if param_dict[key] != '':
                if key =="project_name":
                    # 判断项目名称是否为空
                    if param_dict["project_name"] != "":
                        sql_conditions = sql_conditions + "pro.name like '%" + param_dict["project_name"] + "%' and "
                if key == "creator":
                    # 判断创建者是否为空
                    if param_dict["creator"] != "":
                        sql_conditions = sql_conditions + "pro.create_user_id = '" + param_dict["creator"] + "' and "
                if key == "status":
                    # 判断项目状态是否为空
                    if param_dict["status"] != "":
                        #对于有多个状态
                        status_arr =  param_dict["status"].split(",")
                        status = "'" +"','".join(status_arr) + "'"
                        sql_conditions = sql_conditions + "pro.status in (" + status + ") and "
                if key == "priority":
                    # 判断优先级是否为空
                    if param_dict["priority"] != "":
                        sql_conditions = sql_conditions + "pro.priority = '" + param_dict["priority"] + "' and "
                if key == "noDrafFlag":
                    #判断是否是草稿状态(草稿状态包含draft,approveFail和evaluteFail)
                    if param_dict["noDrafFlag"] == "0":
                        sql_conditions = sql_conditions + "(pro.status = '" + EnumStatus.DRAFT + "' or pro.status = '" + EnumStatus.APPROVE_FAIL + "'or pro.status = '" + EnumStatus.EVALUATE_FAIL + "') and "
                    elif param_dict["noDrafFlag"] == "1":
                        sql_conditions = sql_conditions + "(pro.status <> '" + EnumStatus.DRAFT + "' and pro.status <> '" + EnumStatus.APPROVE_FAIL + "'and pro.status <> '" + EnumStatus.EVALUATE_FAIL + "') and "
                if key == "create_time":
                    # 判断创建时间是否为空
                    if param_dict["create_time"] != "":
                        if param_dict["create_time"].find('/') < 0:
                            sql_conditions = sql_conditions + "pro.create_time LIKE '" + param_dict[
                                "create_time"] + "%' and "
                        else:
                            # 时间参数为日期范围
                            str_value_list = param_dict[key].split('/')
                            min_time = str_value_list[0]
                            max_time = str_value_list[1]
                            sql_conditions = sql_conditions + "pro.create_time between '" + str(
                                min_time) + "' and '" + str(
                                max_time) + " 23:59:59' and "
                if key == "out_run_time":
                    # 判断创建时间是否为空
                    if param_dict["out_run_time"] != "":
                        if param_dict["out_run_time"].find('/') < 0:
                            sql_conditions = sql_conditions + "pro.out_run_time LIKE '" + param_dict[
                                "out_run_time"] + "%' and "
                        else:
                            # 时间参数为日期范围
                            str_value_list = param_dict[key].split('/')
                            min_time = str_value_list[0]
                            max_time = str_value_list[1]
                            sql_conditions = sql_conditions + "pro.out_run_time between '" + str(
                                min_time) + "' and '" + str(
                                max_time) + " 23:59:59' and "
                if key == "owner":
                    # 对于责任人和参与者，在project_group表中进行过滤并获取项目ID
                    if param_dict["owner"] != "":
                        owner_condition = owner_condition + "select proj_id from project_group where act_role='owner'  and user_id = '" + \
                                          param_dict["owner"] + "'"
                if key == "tester":
                    if param_dict["tester"] != "":
                        tester_condition = tester_condition + "select proj_id from project_group where act_role='tester'  and user_id = '" + \
                                           param_dict["tester"] + "'"

        #若责任人和参与者都存在，则取交集
        if owner_condition !="" and tester_condition!="":
            proj_group_conditions = proj_group_conditions + owner_condition + "union all "+tester_condition
            sql_conditions = sql_conditions +"pro.id in (select  proj_id from("+proj_group_conditions+") p_g GROUP BY p_g.proj_id HAVING COUNT(proj_id) >1) and "
        else:
            proj_group_conditions = proj_group_conditions + owner_condition  + tester_condition
            if proj_group_conditions!="":
                sql_conditions = sql_conditions + "pro.id in (select  proj_id from("+proj_group_conditions+") p_g ) and"

        limit_sql = " LIMIT " + first_num + "," + page_size

        order_sql = " order by pro.id desc"

        #判断筛选条件是否存在
        if  sql_conditions != "":
            # 删除最后一个多余的and
            sql_conditions = sql_conditions [:-4]
            select_sql = select_sql + where_str + sql_conditions + order_sql + limit_sql
            count_sql = count_sql + where_str + sql_conditions
        else:
            select_sql = select_sql + order_sql + limit_sql
            count_sql = count_sql

        try:
            count = self.mysql.get_one(count_sql)["count(*)"]
            ret = self.mysql.get_all(select_sql)
        except Exception as e:
            return -1, 'search project list failed', str(e)

        # 若查询结果非空,将时间格式转化为字符串
        if ret:
            for project_info_dict in ret:
                project_info_dict['start_time'] = str(project_info_dict['start_time'])
                project_info_dict['finish_time'] = str(project_info_dict['finish_time'])
                project_info_dict['create_time'] = str(project_info_dict['create_time'])
                #获取负责人、测试人(多个以","分割)、测试内容、测试进度、风险评估等信息
                project_info_dict["test_content"] = self.get_project_stage_param(project_info_dict["project_id"],"req_info.txt","otherExplain_val")
                project_info_dict["test_progress"] = self.get_project_test_progress(project_info_dict["project_id"],"sustain_info.txt")
                project_info_dict["evaluete_risk"] = self.get_project_stage_param(project_info_dict["project_id"],"evaluate_info.txt","projRisk_val")
                project_info_dict["sustain_risk"] = self.get_project_stage_param(project_info_dict["project_id"],"sustain_info.txt","sustainRisk_val")
                project_info_dict["summary_risk"] = self.get_project_stage_param(project_info_dict["project_id"],"summary_info.txt","summaryRisk_val")
                #预计开始时间、预计结束时间
                project_info_dict["estimate_startdate"] = self.get_project_stage_param(project_info_dict["project_id"],"evaluate_info.txt", "projEstimateStartDate_val")
                project_info_dict["estimate_enddate"] = self.get_project_stage_param(project_info_dict["project_id"],"evaluate_info.txt", "projEstimateEndDate_val")
                project_info_dict["owner"] = self.get_project_owner_or_tester(project_info_dict["project_id"],"owner")
                project_info_dict["tester"] = self.get_project_owner_or_tester(project_info_dict["project_id"],"tester")
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
        result_dict['project_list_info'] = ret

        return 0, 'success', result_dict

    def get_project_owner_or_tester(self,project_id,act_role):
        '''
        根据项目ID 和用户角色，获取用户showname
        :param project_id:
        :param act_role:
        :return:
        '''

        result = ""
        try:
            query_user_sql = "select user.user_showname from project_group pg " \
                             "left join config_users user on user.user_id = pg.user_id " \
                             "where proj_id=%s and act_role=%s"
            ret = self.mysql.get_all(query_user_sql,[project_id,act_role])
            if ret:
                for user in ret:
                    result = result + user["user_showname"]+","

            if result!="":
                result = result[:-1]
        except Exception,e:
            return ""
        return result

    def get_project_status(self, project_id):
        getsql = "SELECT status FROM project_list WHERE id=%s" % project_id
        result = self.mysql.get_one(getsql)
        if not result:
            return -1, "project not exist", ""
        return 0, "", result['status']

    def delete_project(self, project_id):
        '''
        删除项目   删除表project_list 和project_group
        :param project_id:
        :return:
        '''
        del_proj_sql = "DELETE FROM project_list WHERE id=%s" % project_id
        del_proj_group_sql = "DELETE FROM project_group WHERE proj_id=%s" % project_id
        try:
            self.mysql.delete(del_proj_sql)
            self.mysql.end()
        except Exception as e:
            self.mysql.end(0)
            return -1, str(e),  ""
        try:
            self.mysql.delete(del_proj_group_sql)
            self.mysql.end()
            return 0, "succeed", ""
        except Exception as e:
            self.mysql.end(0)
            return -1, str(e),  ""

    def update_project_status(self, project_id, status):
        update_sql = "UPDATE project_list SET status = %s WHERE id = %s"
        try:
            self.mysql.update(update_sql,[status, project_id])
            self.mysql.end()
            return 0, "", ""
        except Exception as e:
            self.mysql.end(0)
            return -1, str(e),  ""

    def save_new_project_info(self, req_info_map, userid, templateid):
        projname = req_info_map['projName_val']
        status = conf.enum_status.EnumStatus.DRAFT

        insersql = ("INSERT INTO project_list"
                    " SET name = %s, create_user_id = %s, status= %s, proj_template_id = %s")
        try:
            result = self.mysql.insert_one(insersql, [projname, userid, status, templateid])
            self.mysql.end()
            return 0, "", result
        except Exception as e:
            self.mysql.end(0)
            if 'uniqname' in str(e):
                return -1, '项目名称冲突', ""
            return -1, str(e),  ""

    def update_existed_project_info(self, param_dict, proj_id):

        update_sql = "UPDATE project_list SET "
        # 遍历拼接所有信息
        if len(param_dict) == 0:
            return 0, "", proj_id
        for key in param_dict:
            if key != "id":
                update_sql = update_sql + key + "='" + str(param_dict[key]) + "',"

        # 去掉最后一个逗号
        update_sql = update_sql[:-1]

        update_sql += " WHERE id=%s"
        try:
            result = self.mysql.update(update_sql, [str(proj_id)])
            self.mysql.end()
            return 0, "", result
        except Exception as e:
            self.mysql.end(0)
            if 'uniqname' in str(e):
                return -1, '项目名称冲突', ""
            return -1, str(e),  ""

    def get_project_stage_param(self,proj_id,filename,param_name):
        '''
        获取各项目阶段中，不同属性对应的值
        :param proj_id  项目id
        :param filename: 文件名
        :param param_name: 需获取字段名称
        :return:
        '''
        params_json = ""
        app_file = None
        try:
            #根据文件名获取文件内容，并转换成json
            file = open(conf.config.PROJ_TASKMAP_SAVE_FOLDER + "/" + str(proj_id) + "/"+filename, 'r')
            if file:
                params_str = file.read()
                params_json = eval(params_str)
            return params_json[param_name]
        except Exception,e:
            return params_json
        finally:
            if app_file is not None:
                app_file.close()

    def get_project_test_progress(self,proj_id,filename):
        '''
            获取测试进度
            :param proj_id  项目id
            :param filename: 文件名
            :param param_name: 需获取字段名称
            :return:
            '''
        app_file = None
        process_str = ""
        #各人员测试进度
        totalProgress_map_val = ""
        #返回信息
        rtn_map = {}
        try:
            # 根据文件名获取文件内容，并转换成json
            file = open(conf.config.PROJ_TASKMAP_SAVE_FOLDER + "/" + str(proj_id) + "/" + filename, 'r')
            if file:
                params_str = file.read()
                params_json = eval(params_str)
                #获取totalProgress_val和totalProgress_map_val内容
                for key in params_json.keys():
                    if key =="totalProgress_val":
                        totalProgress_val = params_json["totalProgress_val"]
                    if key == "totalProgress_map_val":
                        totalProgress_map_val = params_json["totalProgress_map_val"]

                rtn_map["总体运维进度"] = totalProgress_val
                rtn_map["个人测试进度"] = totalProgress_map_val
                # process_str = str(rtn_map)
                return rtn_map
        except Exception, e:
            return rtn_map
        finally:
            if app_file is not None:
                app_file.close()

    def search_project_users(self,project_id):
        '''
        获取项目相关用户
        :param project_id:  项目ID
        :return:
        '''
        result = []
        try:
            query_sql = "select users.user_id,users.user_name,users.user_showname,users.user_email " \
                        "from project_group pg " \
                        "LEFT JOIN config_users users on pg.user_id = users.user_id " \
                        "where proj_id = %s"
            ret = self.mysql.get_all(query_sql,[project_id])
            if ret :
                result = ret
        except Exception ,e:
            return -1,"search failed",str(e)
        return 0,"succeed",result

    def update_project_group(self, project_id, tester_id_list):

        get_exist_sql = ("SELECT user_id FROM project_group WHERE proj_id =%s"
                         " AND act_role = 'tester'")

        ret = self.mysql.get_all(get_exist_sql, [project_id])
        to_remove_list = []
        to_add_list = []
        if ret:
            for tester in ret:
                one_tester = str(tester['user_id'])
                to_remove_list.append(one_tester)
        for userid in tester_id_list:
            if userid in to_remove_list:
                to_remove_list.remove(userid)
            else:
                to_add_list.append(userid)

        # 清除不存在的
        if len(to_remove_list) > 0:
            to_remove_str = str(to_remove_list).replace("[", "").replace("]", "")
            remove_sql = ("DELETE FROM project_group WHERE user_id in(%s)"
                          " AND act_role = 'tester' AND proj_id = %s")
            try:
                self.mysql.delete(remove_sql, [to_remove_str, project_id])
                self.mysql.end()
            except Exception as e:
                self.mysql.end(0)
                return -1, "delete not existed tester failed:" + str(e), ""
        # 增加新增的
        for new_test in to_add_list:
            insert_sql = "INSERT INTO project_group set user_id=%s, act_role = 'tester', proj_id=%s"
            try:
                self.mysql.insert_one(insert_sql, [new_test, project_id])
                self.mysql.end()
            except Exception as e:
                self.mysql.end(0)
                return -1, "add tester failed:" + str(e), ""

        return 0, "success", ""

    def update_project_out_run_time(self,time, project_id):
        # 检查项目是否已经有启动时间
        get_time_sql = "SELECT out_run_time FROM project_list where id = %s" % project_id
        result = self.mysql.get_one(get_time_sql)
        if result:
            if result['out_run_time'] is None or str(result['out_run_time']).startswith("0"):
                # 没有时间的结果是0000-00-00，更新开始时间
                update_sql = "UPDATE project_list SET out_run_time='%s'  where id = %s " % (time, project_id)
                try:
                    self.mysql.update(update_sql)
                    self.mysql.end()
                    return 0, "success", ""
                except Exception as e:
                    self.mysql.end(0)
                    return -1, "update failed:" + str(e), ""

        return 0, "already exist out run time", ""

    def update_project_into_run_time(self, time, project_id):
        # 检查项目是否已经有启动时间
        get_time_sql = "SELECT into_run_time FROM project_list where id = %s" % project_id
        result = self.mysql.get_one(get_time_sql)
        if result:
            if result['into_run_time'] is None or str(result['into_run_time']).startswith("0"):
                # 没有时间的结果是0000-00-00，更新开始时间
                update_sql = "UPDATE project_list SET into_run_time='%s'  where id = %s " % (time, project_id)
                try:
                    self.mysql.update(update_sql)
                    self.mysql.end()
                    return 0, "success", ""
                except Exception as e:
                    self.mysql.end(0)
                    return -1, "update failed:" + str(e), ""

        return 0, "already exist into run time", ""

    def insert_project_bugs(self, buglist, project_id):

        insert_sql = "INSERT INTO proj_bug SET bug_id = %s, proj_id = %s"

        for bug_info in buglist:
            if "id" not in bug_info or bug_info["id"].isdigit() is False:
                continue
            try:
                self.mysql.insert_one(insert_sql, [bug_info["id"], project_id])
                self.mysql.end()
            except Exception as e:
                self.mysql.end(0)
                return -1, "insert bug failed:" + str(e), ""
        return 0, 'success', ""

    def get_project_testers(self, proj_id):
        """
        查询当前项目的测试人员
        Args:
            proj_id:

        Returns:

        """
        sel_sql = "SELECT user_id FROM project_group WHERE proj_id=%s  AND act_role = 'tester'"
        result = self.mysql.get_all(sel_sql, [str(proj_id)])
        user_ids = []

        if result:
            for user in result:
                user_ids.append(user['user_id'])
            return 0, 'success', user_ids
        else:
            return 0, "tester not found", ""

    def get_project_group(self, act_role):
        '''
        查询所有项目参与人
        :param act_role:   用户角色
        :return: List<>
            [{"user_id":"","user_showname":""}]
        '''
        result = []
        try:
            query_sql = "select distinct users.user_id,users.user_showname " \
                        "from project_group pg " \
                        "inner JOIN config_users users on pg.user_id = users.user_id "
            if act_role != "":
                query_sql = query_sql + "where pg.act_role = %s"
                ret = self.mysql.get_all(query_sql, [act_role])
            else:
                ret = self.mysql.get_all(query_sql)

            if ret:
                result = ret
        except Exception, e:
            return -1, "search failed", str(e)
        return 0, "succeed", result

    def get_project_name(self, proj_id):
        sele_sql = "SELECT name FROM project_list WHERE id=%s"
        result = self.mysql.get_one(sele_sql, [proj_id])
        if result:
            return 0, "success", result['name']
        else:
            return -1, "get proj name failed", ""

    def update_project_group_owner(self, userid, proj_id):
        if userid is None:
            return -1, "project owner id not exist", ""

        # 查找项目负责人是否存在
        select_sql = "SELECT user_id FROM project_group WHERE act_role='owner' AND proj_id=%s"
        result = self.mysql.get_one(select_sql, [str(proj_id)])
        if result:
            # 存在则更新负责人
            update_owner_sql = ("UPDATE project_group SET user_id=%s "
                                "WHERE act_role='owner' AND proj_id=%s")
            try:
                self.mysql.update(update_owner_sql, [str(userid), str(proj_id)])
                self.mysql.end()
            except Exception as e:
                self.mysql.end(0)
                return -1, str(e),  ""

            return 0, "", ""
        try:
            # 插入项目申请人
            insert_submitter_sql = ("INSERT INTO project_group SET user_id=%s,"
                                    "act_role='owner', proj_id=%s")
            self.mysql.insert_one(insert_submitter_sql, [str(userid), str(proj_id)])
            self.mysql.end()
            return 0, "", ""
        except Exception as e:
            self.mysql.end(0)
            return -1, str(e),  ""

    def update_project_group_submitter(self, userid, proj_id):
        # 查找项目申请人是否存在
        select_sql = "SELECT user_id FROM project_group WHERE act_role='submitter' AND proj_id=%s AND user_id=%s"
        result = self.mysql.get_one(select_sql, [str(proj_id), str(userid)])
        if result:
            # 存在则不更新
            return 0, "", ""
        try:
            # 插入项目申请人
            insert_submitter_sql = ("INSERT INTO project_group SET user_id=%s,"
                                    "act_role='submitter', proj_id=%s")
            self.mysql.insert_one(insert_submitter_sql, [str(userid), str(proj_id)])
            self.mysql.end()
        except Exception as e:
            self.mysql.end(0)
            return -1, str(e),  ""

if __name__ == '__main__':
    print "aaa"
    prj = DbProject()
    reqinfo = dict()
    reqinfo['projName_val'] = "bbbb"
    print prj.save_new_project_info(reqinfo, "192120404", 1)