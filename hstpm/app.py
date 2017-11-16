#!/usr/bin/python
# -*- coding: utf-8 -*-

"""
Author: pzhang
Date: 2016/12/28
Comments: web服务器启动部分
"""

import tornado.httpserver
import tornado.ioloop
import tornado.web
import tornado.options
import os.path
import sys
basedir = os.path.split(os.path.realpath(__file__))[0]
sys.path.append('%s/%s' % (basedir, '/handlers'))
sys.path.append('%s/%s' % (basedir, '/models'))
sys.path.append('%s/%s' % (basedir, '/conf'))
sys.path.append('%s/%s' % (basedir, '/objs'))

import url
import module_mapping as module

from tornado.options import define, options

define("port", default=9715, help="run on the given port", type=int)



if __name__ == "__main__":
    tornado.options.parse_command_line()

    module_mapping = module.module_mapping;
    settings = {
        "template_path": os.path.join(os.path.dirname(__file__), "templates"),
        "static_path": os.path.join(os.path.dirname(__file__), "static"),
        "cookie_secret": "fZDYNK8VRyuhAcI5uATE6x4j8eUM/E8hnIpjl0Xybds=",
        "xsrf_cookie": True,
        "login_url": "/hstpm",
        "ui_modules": module_mapping,
        "debug": True
    }

    url_mapping = url.url_mapping;

    application = tornado.web.Application(url_mapping, **settings)
    http_server = tornado.httpserver.HTTPServer(application)
    http_server.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()