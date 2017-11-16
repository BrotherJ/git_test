# encoding: utf-8
"""
@desc: system model单元测试
@author:  ‘jiongsun‘
@time: 2017/8/9 19:01
"""

import unittest
import models.system_model as systemmodel


class TestSystemModel(unittest.TestCase):

    def runTest(self):
        pass

    def test_search_role_list(self):
        """
        搜索角色列表接口测试
        :return:
        """
        role_name = ""
        # 分页信息
        page_dict = {}
        page_dict['current_page'] = 1
        page_dict['page_size'] = 20

        rtn, msg, ret = systemmodel.search_role_list(role_name,page_dict)
        print rtn,msg

        role_list = ret["role_list"]
        if role_list:
            for role_info in role_list:
                print str(role_info["id"])+","+role_info["name"] + role_info["register_time"]


    def test_search_user_list(self):
        '''
        搜索用户列表接口 测试
        :return:  result、message、role_list:List<Map>
           [{id:"",name:"",showname:"",email:"",role_id:"",role_name:"",department:"".....}]
        '''


        user_param = {}
        # user_param["id"] = "180"
        # user_param["name"] = "jiongsun"
        user_param["role_id"] = "2"
        # user_param["department"] = "研发"
        # 分页信息
        page_dict = {}
        page_dict['current_page'] = 1
        page_dict['page_size'] = 3
        rtn, msg, ret = systemmodel.search_user_list(user_param,page_dict)

        user_list = ret["user_list"]
        if user_list:
            for user in user_list:
                print (str(user["id"]) + "," + user["name"]+","+ user["showname"]
                +"," + user["email"] +","+ str(user["role_id"]) + "," + user["role_name"]
                +"," + user["department"])

    def test_set_user_role(self):
        user_id = "192120479"
        role_id = "1"
        rtn,msg = systemmodel.set_user_role(user_id,role_id)
        print rtn ,msg


    def test_sync_login_info(self):
        user_info = {"user_id": "192120485", "user_name": "yhguo", "user_showname": "YanHong Guo(郭艳泓)",
                      "user_email": "yhguo@hillstonenet.com",
                      "role_id": "2", "department": "研发部"}
        rtn,msg,result = systemmodel.sync_login_info(user_info)
        print rtn, msg
        authority_list = result["authority_list"]
        role_id = result["role_id"]
        print role_id
        if authority_list:
                for authority in authority_list:
                    print (str(authority["id"]) + "," + authority["name"] + "," + str(authority["type"]) \
                      + "," + str(authority["url"]) + "," + authority["pagekey"])

    def test_get_mail_template_by_id(self):
        rtn,msg,template = systemmodel.get_mail_template_by_id(1)

        print rtn,msg
        print str(template["name"]) + "," + str(template["type"])

    def test_get_mail_template_by_type(self):
        type = "0"
        rtn,msg,template_list = systemmodel.get_mail_template_by_type(type)

        if template_list:
            for template in template_list:
                print str(template["id"]) + "," + template["name"]

    def test_search_users(self):
        '''
        搜索用户列表接口 测试
        :return:  result、message、role_list:List<Map>
           [{id:"",name:"",showname:"",email:"",role_id:"",role_name:"",department:"".....}]
        '''

        user_param = {}
        # user_param["id"] = "180"
        user_param["name"] = "jiongsun"
        # user_param["role_id"] = "2"
        # user_param["department"] = "研发"
        # 分页信息
        # rtn, msg, ret = systemmodel.search_users(user_param)
        rtn, msg, ret = systemmodel.search_users()

        if ret:
            for user in ret:
                print (str(user["id"]) + "," + user["name"] + "," + user["showname"]
                       + "," + user["email"] + "," + str(user["role_id"]) + "," + user["role_name"]
                       + "," + user["department"])

    def test_get_mail_template_content(self):
        '''
        根据邮件模板ID 获取邮件模板内容  --测试
        :return:
        '''
        rtn,msg,content = systemmodel.get_mail_template_content("1")
        print rtn,msg
        print content


if __name__ == '__main__':
    model = TestSystemModel()
    #接口1
    # model.test_search_role_list()
    #接口2
    # model.test_search_user_list()
    #接口3
    # model.test_set_user_role()
    #接口4
    # model.test_sync_login_info()

    # model.test_get_mail_template_by_id()
    # model.test_get_mail_template_by_type()
    # model.test_search_users()
    model.test_get_mail_template_content()