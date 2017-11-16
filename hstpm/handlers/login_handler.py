#!/usr/bin/python
# -*- coding: utf-8 -*-

"""
Author: pzhang
Date: 2016/12/28
Comments: 登录验证handler
"""

import tornado
import tornado.httpserver
import tornado.httpclient
import json
import base_handler
import util.sso_util as sso_util
import models.system_model as system_model
import conf.config as config


class CheckLoginHandler(base_handler.BaseHandler):
    def get(self):
        user_id = self.get_argument("userId", "")
        rc, user_info = sso_util.get_user_info(user_id)
        title = "> 首页"
        if rc == 0:
            ret, msg, rcdata = system_model.sync_login_info(user_info)
            menu_list = rcdata["authority_list"]
            role_id = rcdata["role_id"]
            self.set_secure_cookie("name", user_info["user_name"], 7)
            self.set_secure_cookie("id", str(user_info["user_id"]), 7)
            self.set_secure_cookie("showname", user_info["user_showname"], 7)
            self.set_secure_cookie("department", user_info["department"], 7)
            self.set_secure_cookie("email", user_info["user_email"], 7)
            self.set_secure_cookie("role_id", str(role_id), 7)
            self.set_secure_cookie("menulist", json.dumps(menu_list), 7)

            self.redirect("/hstpm/index")
        else:
            self.redirect("http://" + config.SSO_AUTH_SERVER + '/hspauth/managedesk.do')


class LogoutHandler(base_handler.BaseHandler):
    def post(self):
        self.clear_cookie("name")
        self.clear_cookie("autologin")
        self.clear_cookie("password")
        result_dict = {"result": 0, "message": ""}
        self.write(json.dumps(result_dict))


class IndexHandler(base_handler.BaseHandler):
    @tornado.web.authenticated
    def get(self):
        title="> 首页"
        menu_list = self.get_secure_cookie("menulist", max_age_days=2)
        active_menu = "index"
        self.render('hstpm/index.html', user=self.current_user, title=title, active_menu=active_menu)


class DefaultHandler(tornado.web.RequestHandler):
    def get(self):
        self.redirect("/hstpm")
