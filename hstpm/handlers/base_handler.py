#!/usr/bin/python
# -*- coding: utf-8 -*-

"""
Author: pzhang
Date: 2016/12/28
Comments: 登录验证handler
"""

import tornado


class BaseHandler(tornado.web.RequestHandler):

    def write_error(self, status_code, **kwargs):
        if status_code == 500:
            self.render('exception/500.html', error_code=status_code, error_info=kwargs)
        else:
            self.write("occur a %d error. <br> error infomation: %s" % (status_code, kwargs))

    def get_current_user(self):
        if self.get_secure_cookie("name", max_age_days=2):
            user_dict = {
                "name": self.get_secure_cookie("name", max_age_days=2),
                "id": self.get_secure_cookie("id", max_age_days=2),
                "showname": self.get_secure_cookie("showname", max_age_days=2),
                "department": self.get_secure_cookie("department", max_age_days=2),
                "email": self.get_secure_cookie("email", max_age_days=2),
                "role_id": self.get_secure_cookie("role_id", max_age_days=2),
                "menulist": self.get_secure_cookie("menulist", max_age_days=2)
            }
            return user_dict
        else:
            return None