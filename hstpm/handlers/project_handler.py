#!/usr/bin/python
# -*-coding:utf-8-*

"""
File: project_handler.py
Author: pzhang
Date: 2017/8/11 12:56
Comments: 
"""

import tornado
import json
import base_handler
import project_model
import system_model
import config


class ProjectSustainApply(base_handler.BaseHandler):
    """
        项目运维-项目申请页面 -- 同步
    """
    @tornado.web.authenticated
    def get(self):
        title = "> 项目运维 > 测试项目申请"
        active_menu = "apply"

        project_id = self.get_argument("project_id", "")
        ret, msg, rcdata = project_model.get_project_info(project_id)
        req_info_map = rcdata["req_info_map"]
        if req_info_map["platform_check_val"] != "":
            req_info_map["platform_check_val"] += ","
        project_name = req_info_map["projName_val"];
        self.render('hstpm/proj_sustain/project_apply.html', title=title, user=self.current_user, active_menu=active_menu, project_id=project_id, project_name=project_name, req_info_map=req_info_map)


class ProjectSustainQuery(base_handler.BaseHandler):
    """
        项目运维-项目查询页面 -- 同步
    """
    @tornado.web.authenticated
    def get(self):
        title = "> 项目运维 > 在线项目查询"
        active_menu = "query"
        ret, msg, submitter_list = project_model.get_project_group("submitter")
        ret, msg, owner_list = project_model.get_project_group("owner")
        self.render('hstpm/proj_sustain/project_query.html', title=title, user=self.current_user, active_menu=active_menu, submitter_list=submitter_list, owner_list=owner_list)


class ProjectSustainQueryView(base_handler.BaseHandler):
    """
        项目运维-项目查询页面 -- 同步
    """
    @tornado.web.authenticated
    def get(self):
        project_id = self.get_argument("project_id", "")
        ret, msg, rcdata = project_model.get_project_info(project_id)
        project_name = rcdata["req_info_map"]["projName_val"];

        active_menu = self.get_argument("active_menu", "")
        title = "> 项目运维 > 草稿项目查询 — " + project_name
        if active_menu == "":
            active_menu = "query"
            title = "> 项目运维 > 在线项目查询 — " + project_name

        ret, msg, user_list = system_model.search_users()
        ret, msg, run_temp_list = system_model.get_mail_template_by_type("0")
        ret, msg, finish_temp_list = system_model.get_mail_template_by_type("1")
        rcdata["user_list"] = user_list
        rcdata["run_temp_list"] = run_temp_list
        rcdata["finish_temp_list"] = finish_temp_list

        if rcdata["req_info_map"]["platform_check_val"] != "":
            rcdata["req_info_map"]["platform_check_val"] += ","

        message = json.dumps(rcdata)
        self.render('hstpm/proj_sustain/project_query_view.html', title=title, user=self.current_user, active_menu=active_menu, project_id=project_id, rcdata=rcdata, msg=message)


class ProjectSustainOwn(base_handler.BaseHandler):
    """
        项目运维-我负责的项目页面 -- 同步
    """
    @tornado.web.authenticated
    def get(self):
        title = "> 项目运维 > 我负责的项目"
        active_menu = "own"
        ret, msg, submitter_list = project_model.get_project_group("submitter")
        ret, msg, owner_list = project_model.get_project_group("owner")
        self.render('hstpm/proj_sustain/project_own.html', title=title, user=self.current_user, active_menu=active_menu, submitter_list=submitter_list, owner_list=owner_list)

class ProjectSustainOwnEdit(base_handler.BaseHandler):
    """
        项目运维-我负责的项目-编辑页面 -- 同步
    """
    @tornado.web.authenticated
    def get(self):
        active_menu = "own"
        project_id = self.get_argument("project_id", "")
        ret, msg, rcdata = project_model.get_project_info(project_id)
        project_name = rcdata["req_info_map"]["projName_val"];
        title = "> 项目运维 > 我负责的项目 — " + project_name

        ret, msg, user_list = system_model.search_users()
        ret, msg, test_user_list = system_model.search_all_test_users()
        ret, msg, run_temp_list = system_model.get_mail_template_by_type("0")
        ret, msg, finish_temp_list = system_model.get_mail_template_by_type("1")
        rcdata["user_list"] = user_list
        rcdata["test_user_list"] = test_user_list
        rcdata["run_temp_list"] = run_temp_list
        rcdata["finish_temp_list"] = finish_temp_list

        if rcdata["req_info_map"]["platform_check_val"] != "":
            rcdata["req_info_map"]["platform_check_val"] += ","

        message = json.dumps(rcdata)
        self.render('hstpm/proj_sustain/project_own_edit.html', title=title, user=self.current_user, active_menu=active_menu, project_id=project_id, rcdata=rcdata, msg=message)


class ProjectSustainUnsubmitted(base_handler.BaseHandler):
    """
        项目运维-我的待提交项目页面 -- 同步
    """
    @tornado.web.authenticated
    def get(self):
        title = "> 项目运维 > 我的草稿项目"
        active_menu = "unsubmitted"
        self.render('hstpm/proj_sustain/project_unsubmitted.html', title=title, user=self.current_user, active_menu=active_menu)


class ProjectManagementApprove(base_handler.BaseHandler):
    """
        项目管理-项目审批页面 -- 同步
    """
    @tornado.web.authenticated
    def get(self):
        title = "> 项目管理 > 测试项目审批"
        active_menu = "approve"
        ret, msg, submitter_list = project_model.get_project_group("submitter")
        ret, msg, owner_list = project_model.get_project_group("owner")

        ret, msg, user_list = system_model.search_users()
        ret, msg, run_temp_list = system_model.get_mail_template_by_type("0")
        ret, msg, finish_temp_list = system_model.get_mail_template_by_type("1")

        list_dict = {"submitter_list": submitter_list, "owner_list": owner_list, "user_list": user_list, "run_temp_list": run_temp_list, "finish_temp_list": finish_temp_list, "user_list_str": json.dumps(user_list, ensure_ascii=False)}
        self.render('hstpm/proj_mgmt/project_approve.html', title=title, user=self.current_user, active_menu=active_menu, list_dict=list_dict)


class ProjectApplyTempModule(tornado.web.UIModule):
    """
        项目申请UI模板 -- 同步
    """
    def render(self, proj_info):
        return self.render_string('modules/project_apply_temp_edit.html', proj_info=proj_info)

    def css_files(self):
        css_path = config.MODULE_CSS_PATH_PREFIX + "/css/hstpm/module/project_apply_temp.css"
        return css_path

    def javascript_files(self):
        js_path = config.MODULE_CSS_PATH_PREFIX + "/js/hstpm/module/project_apply_temp.js"
        return js_path


class SaveProjectHandler(tornado.web.RequestHandler):
    """
        保存项目 -- 异步
    """
    def post(self):
        proj_info_str = self.get_argument("proj_info")
        proj_info = json.loads(proj_info_str)
        # 去除编码，中文不进行asc编码
        proj_info = eval(json.dumps(proj_info, ensure_ascii=False))
        project_id = self.get_argument("project_id")
        template_id = "1"
        user_id = self.get_argument("operator_id")
        ret, msg, rcdata = project_model.save_project(project_id, user_id, proj_info, template_id)
        result_dict = {"result": ret, "message": msg, "rcdata": rcdata}
        self.write(json.dumps(result_dict))


class OperateProjectHandler(tornado.web.RequestHandler):
    """
        项目所有操作 -- 异步
    """
    def post(self):
        operate_info_str = self.get_argument("operate_info")
        operate_info = json.loads(operate_info_str)
        proj_info_str = self.get_argument("proj_info")
        proj_info = json.loads(proj_info_str)
        # 去除编码，中文不进行asc编码
        operate_info = eval(json.dumps(operate_info, ensure_ascii=False))
        proj_info = eval(json.dumps(proj_info, ensure_ascii=False))
        project_id = self.get_argument("project_id")
        template_id = "1"
        ret, msg, rcdata = project_model.project_op(operate_info, proj_info, project_id, template_id)
        result_dict = {"result": ret, "message": msg, "rcdata": rcdata}
        self.write(json.dumps(result_dict))


class SearchProject(tornado.web.RequestHandler):
    """
        搜索项目列表 -- 异步
    """

    def get(self):
        project_param_str = self.get_argument("project_param")
        project_param = json.loads(project_param_str)
        pageinfo_param_str = self.get_argument("pageinfo_param")
        pageinfo_param = json.loads(pageinfo_param_str)
        result, message, rcdata = project_model.search_project_list(project_param, pageinfo_param)
        result_dict = {"result": result, "message": message, "rcdata": rcdata}
        self.write(json.dumps(result_dict))


class GetProjectInfoHandler(tornado.web.RequestHandler):
    """
        获取项目所有信息 -- 异步
    """
    def get(self):
        project_id = self.get_argument("project_id")
        ret, msg, rcdata = project_model.get_project_info(project_id)
        result_dict = {"result": ret, "message": msg, "rcdata": rcdata}
        self.write(json.dumps(result_dict))


class SaveApproveInfoHandler(tornado.web.RequestHandler):
    """
        单独保存项目的审批信息 -- 异步
    """
    def post(self):
        project_id = self.get_argument("project_id")
        approve_info_str = self.get_argument("approve_info_map")
        approve_info_map = json.loads(approve_info_str)
        # 去除编码，中文不进行asc编码
        approve_info_map = eval(json.dumps(approve_info_map, ensure_ascii=False))
        ret, msg, rcdata = project_model.update_approve_info(project_id, approve_info_map)
        result_dict = {"result": ret, "message": msg, "rcdata": rcdata}
        self.write(json.dumps(result_dict))


class GetSustainHistoryDateList(tornado.web.RequestHandler):
    """
        获取运维信息历史记录日期列表 -- 异步
    """
    def get(self):
        project_id = self.get_argument("project_id")
        ret, msg, rcdata = project_model.get_sustain_history_datelist(project_id)
        result_dict = {"result": ret, "message": msg, "rcdata": rcdata}
        self.write(json.dumps(result_dict))


class GetSustainHistoryInfo(tornado.web.RequestHandler):
    """
        获取运维信息历史记录 -- 异步
    """
    def get(self):
        project_id = self.get_argument("project_id")
        query_date = self.get_argument("query_date")
        ret, msg, rcdata = project_model.get_sustain_history(project_id, query_date)
        result_dict = {"result": ret, "message": msg, "rcdata": rcdata}
        self.write(json.dumps(result_dict))