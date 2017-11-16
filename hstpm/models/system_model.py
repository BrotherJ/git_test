#!/usr/bin/python
# -*- coding: utf-8 -*-


'''
Author:jiongsun
Date:2017/08/09
Comments:用户、权限、角色业务模块
'''

import  sys
import  os.path
import  db.db_users as dbuser
import  conf.config as config

db_user = dbuser.DbUsers()



def search_role_list(role_name,page_dict):
    '''
    搜索角色列表接口
    :param  role_param    角色名称
                page_info  分页信息
    :return:  result、message、role_list:List<Map>
            [{id:"",name:"",description:"",register_time:"".....}]
    '''
    return  db_user.search_role_list(role_name,page_dict)


def search_user_list(user_param,page_dict):
    '''
     搜索用户列表接口
     :param user_param   查询条件 (id,name/showname, role_name,department)
            page_dict    分页信息
    :return:  result、message、role_list:List<Map>
        [{id:"",name:"",showname:"",email:"",role_id:"",role_name:"",department:"".....}]
    '''
    return db_user.search_user_list(user_param,page_dict)


def set_user_role(user_id,role_id):
    '''
    设置用户角色
    :param user_id: 用户id
    :param role_id: 角色id
    :return:
    '''
    return db_user.set_user_role(user_id,role_id)

def sync_login_info(user_info):
    '''
    同步用户信息及权限接口
    :param user_info:  user_id,user_name,user_showname,user_email,role_id:2(游客),department
    :return:result、message、authority_list:List<Map>
            [{id:"",name:"",type:"",pagekey:""}]
    :remark:1.根据user_id查询user表中是否存在该用户，若存在，直接执行步骤3;若不存在，执行步骤2
            2.根据user_info 中信息插入至user表中，用户角色默认为游客
            3.根据role_id ,搜索角色权限关系表和权限表，返回该用户支持的所有权限列表
    '''
    return db_user.sync_login_info(user_info)

def get_mail_template_by_id(template_id):
    '''
    根据邮件模板ID 获取邮件模板信息
    :param template_id:
    :return:
    '''
    return db_user.get_mail_template_by_id(template_id)

def get_mail_template_by_type(type):
    '''
    根据邮件模板类型查询所有邮件模板
    :param type:
    :return:
    '''
    return db_user.get_mail_template_by_type(type)


def search_users(user_param={}):
    '''
    搜索用户列表接口
    :param user_param   查询条件 (id,name/showname, role_name,department)
    :return:  result、message、role_list:List<Map>
       [{id:"",name:"",showname:"",email:"",role_id:"",role_name:"",department:"".....}]
    '''
    return db_user.search_users(user_param)

def get_mail_template_content(template_id):
    '''
    获取邮件模板内容
    :param template_id:
    :return:
    '''
    rtn,msg,mail_template = db_user.get_mail_template_by_id(template_id)
    try:
        file_path = ""
        if mail_template:
            # 根据邮件模板类型，获取邮件模板路径
            if mail_template["type"] == 0:
                file_path = config.SUSEMAIL_TEMPLATE_FOLDER + "/" + template_id + ".txt"
            elif mail_template["type"] == 1:
                file_path = config.SUMEMAIL_TEMPLATE_FOLDER + "/" + template_id + ".txt"

            # 判断模板文件路径是否为空
            if file_path != "":
                mail_template_file = open(file_path, 'r')
                #对于原text文本内容进行中文乱码处理
                mail_content = mail_template_file.read()
                return 0, "succeed", mail_content
            else:
                return -1, "mail template path is not exists", ""
        else:
            return -1, "mail template is not exists", ""
    except Exception,e:
        return -1, "failed", e

def search_all_test_users():
    '''
    查询所有测试人员
    :return:
    '''
    return db_user.search_all_test_users()

