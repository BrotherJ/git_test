# encoding: utf-8
"""
@desc: 出错处理handler
@author:  ‘ttqin‘
@time: 2017/1/11 11:28
"""

import tornado

class ErrorHandler(tornado.web.RequestHandler):
    def get(self):
        self.write_error(404)

    def write_error(self, status_code, **kwargs):
        if status_code == 404:
            self.render('exception/404.html')
        elif status_code == 500:
            self.render('exception/500.html')
        else:
            self.write('error:' + str(status_code))

    def post(self):
        self.write_error(404)