#!/usr/bin/python
# -*- coding: utf-8 -*-

"""
Author: pzhang
Date: 2016/12/28
Comments: url mapping 配置
"""

import login_handler
import error_handler
import system_handler
import project_handler

url_mapping = [
    # ----------同步请求-----------
    (r'/', login_handler.DefaultHandler),
    (r'/hstpm', login_handler.CheckLoginHandler),  # 检测auth登录是否超时
    (r'/hstpm/index', login_handler.IndexHandler),  # 首页
    (r'/hstpm/system/role', system_handler.RoleConfigHandler),  # 角色配置页面
    (r'/hstpm/system/user', system_handler.UserConfigHandler),  # 用户配置页面
    (r'/hstpm/proj_sustain/apply', project_handler.ProjectSustainApply),  # 项目运维-项目申请页面
    (r'/hstpm/proj_sustain/query', project_handler.ProjectSustainQuery),  # 项目运维-项目查询页面
    (r'/hstpm/proj_sustain/query_view', project_handler.ProjectSustainQueryView),  # 项目运维-项目查询-查看项目详情页面
    (r'/hstpm/proj_sustain/unsubmitted', project_handler.ProjectSustainUnsubmitted),  # 项目运维-我的待提交项目页面
    (r'/hstpm/proj_sustain/own', project_handler.ProjectSustainOwn),  # 项目运维-我负责的项目页面
    (r'/hstpm/proj_sustain/own_edit', project_handler.ProjectSustainOwnEdit),  # 项目运维-我负责的项目-项目编辑页面
    (r'/hstpm/proj_mgmt/approve', project_handler.ProjectManagementApprove),  # 项目管理-项目审批页面

    # ----------异步请求-系统配置-角色、用户配置相关-----------
    (r'/hstpm/system/search_role', system_handler.SearchRoleListHandler),  # 角色搜索
    (r'/hstpm/system/search_user', system_handler.SearchUserListHandler),  # 用户搜索
    (r'/hstpm/system/set_user_role', system_handler.SetUserRoleHandler),  # 设置用户角色

    # ----------异步请求-项目运维-项目申请相关-----------
    (r'/hstpm/proj_sustain/save_project', project_handler.SaveProjectHandler),  # 保存项目
    (r'/hstpm/proj_sustain/project_op', project_handler.OperateProjectHandler),  # 项目所有操作

    # ----------异步请求-项目运维-我负责的项目相关-----------
    (r'/hstpm/proj_sustain/get_project_info', project_handler.GetProjectInfoHandler),  # 异步获取项目所有map信息
    (r'/hstpm/proj_sustain/get_sustain_history_date', project_handler.GetSustainHistoryDateList),  # 异步获取项目运维信息的历史保存日期
    (r'/hstpm/proj_sustain/get_sustain_history_info', project_handler.GetSustainHistoryInfo),  # 异步获取项目运维信息的历史保存

    # ----------异步请求-项目运维-查询所有项目，查询我负责的项目，查询我的未提交项目相关-----------
    (r'/hstpm/proj_sustain/search_proj', project_handler.SearchProject),

    # ----------异步请求-项目管理-项目审批页面相关-----------
    (r'/hstpm/proj_mgmt/save_approve_info', project_handler.SaveApproveInfoHandler),  # 单独保存项目的审批信息

    (r'/hstpm/proj_sustain/view_template', system_handler.GetMailTemplateContent),

    # ----------错误请求-----------
    (r".*", error_handler.ErrorHandler), #404 来到这里
];
