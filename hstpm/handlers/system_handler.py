#!/usr/bin/python
# -*-coding:utf-8-*

"""
File: system_handler.py
Author: pzhang
Date: 2017/8/11 12:44
Comments: 
"""

import tornado
import base_handler
import json
import system_model

class RoleConfigHandler(base_handler.BaseHandler):
    """
        角色配置页面 -- 同步
    """
    @tornado.web.authenticated
    def get(self):
        title = "> 系统配置 > 平台角色配置"
        active_menu = "role"
        self.render('hstpm/system/system_role_config.html', title=title, user=self.current_user, active_menu=active_menu)


class UserConfigHandler(base_handler.BaseHandler):
    """
        用户配置页面 -- 同步
    """
    @tornado.web.authenticated
    def get(self):
        title = "> 系统配置 > 平台用户配置"
        active_menu = "user"
        self.render('hstpm/system/system_user_config.html', title=title, user=self.current_user, active_menu=active_menu)


class SearchRoleListHandler(tornado.web.RequestHandler):
    """
        搜索角色列表 -- 异步
    """

    def get(self):
        role_name = self.get_argument("role_name")
        page_dict_str = self.get_argument("page_info")
        page_dict = json.loads(page_dict_str)
        result, message, rcdata = system_model.search_role_list(role_name, page_dict)
        result_dict = {"result": result, "message": message, "rcdata": rcdata}
        self.write(json.dumps(result_dict))

class SearchUserListHandler(tornado.web.RequestHandler):
    """
        搜索用户列表 -- 异步
    """

    def get(self):
        user_param_str = self.get_argument("user_param")
        user_param = json.loads(user_param_str)
        page_dict_str = self.get_argument("page_info")
        page_dict = json.loads(page_dict_str)
        result, message, rcdata = system_model.search_user_list(user_param, page_dict)
        result_dict = {"result": result, "message": message, "rcdata": rcdata}
        self.write(json.dumps(result_dict))


class SetUserRoleHandler(tornado.web.RequestHandler):
    """
        设置用户角色 -- 异步
    """

    def post(self):
        user_id = self.get_argument("user_id")
        role_id = self.get_argument("role_id")
        result, message, rcdata = system_model.set_user_role(user_id, role_id)
        result_dict = {"result": result, "message": message, "rcdata": rcdata}
        self.write(json.dumps(result_dict))

class GetMailTemplateContent(tornado.web.RequestHandler):
    """
        获取模板内容 -- 异步
    """

    def get(self):
        template_id = self.get_argument("template_id")
        result, message, rcdata = system_model.get_mail_template_content(template_id)
        result_dict = {"result": result, "message": message, "rcdata": rcdata}
        self.write(json.dumps(result_dict))