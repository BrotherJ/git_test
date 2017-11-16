# -*- coding: utf-8 -*-

"""
@desc:
@author:  ‘jiongsun‘
@time: 2017/8/10 16:34
"""
import unittest
import xmltodict
import models.project_model as projectmodel
import datetime
import time
from enum_status import EnumStatus


class TestProjectModel(unittest.TestCase):

    def runTest(self):
        pass

    def test_search_project_list(self):
        """
        接口5测试   -- 查询项目列表
        :return:
        """

        #查询参数
        param_dict = {}
        # param_dict["project_name"] = "test_proj"
        # param_dict["creator"] = "192120479"
        # param_dict["owner"] = "180"
        # param_dict["status"] = "running"
        # param_dict["out_run_time"] =  "2017-08-10/2017-08-14"
        # param_dict["tester"] = "180"
        # param_dict["priority"] = "p1"
        param_dict["noDrafFlag"] = "1"
        # param_dict["create_time"] = "2017-08-10/2017-08-14"


        #分页信息
        page_dict = {}
        page_dict['current_page'] = 1
        page_dict['page_size'] = 20
        rtn, msg, ret = projectmodel.search_project_list(param_dict,page_dict)

        project_list  =  ret["project_list_info"]
        if project_list:
            for project_info in project_list:
                print (str(project_info["project_id"]) + "," + project_info["project_name"]+ ","+ project_info["start_time"]
                    + "," + project_info["owner"] + "," + project_info["tester"] + "," + project_info["evaluete_risk"]
                       + "," + project_info["sustain_risk"] + "," + project_info["summary_risk"]) + "," + project_info["estimate_startdate"] + "," + project_info["estimate_enddate"]


    def test_get_project_group(self):
        act_role = ""
        rtn,msg,ret = projectmodel.get_project_group(act_role)

        if ret:
            for user in ret:
                print str(user["user_id"]) + user["user_showname"]

    def test_delete_project(self):
        rtn,msg,ret = projectmodel.delete_project(2,180)


if __name__ == '__main__':
    model = TestProjectModel()
    model.test_search_project_list()

    # print EnumStatus.DRAFT
    # model.test_delete_project()