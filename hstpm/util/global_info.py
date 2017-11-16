#!/usr/bin/python
# -*-coding:utf-8-*

"""
File: global_info.py
Author: pzhang
Date: 2017/1/5 15:25
Comments: 
"""

#####################
# project status
#####################
CONFIG = 'config'
RUNNING = 'running'
FINISH = 'finish'

PROJECT_STATUS_LIST = [ CONFIG, RUNNING, FINISH]

#定义全局变量，存放所有项目状态key-value
# PROJECT_STATUS_DICT = {}
# PROJECT_STATUS_DICT["draft"] = "草稿"
# PROJECT_STATUS_DICT["approvePending"] = "待审批"
# PROJECT_STATUS_DICT["evaluatePending"] = "待评估"
# PROJECT_STATUS_DICT["approveFail"] = "未通过审批"
# PROJECT_STATUS_DICT["evaluateFail"] = "未通过评估"
# PROJECT_STATUS_DICT["runPending"] = "待运行"
# PROJECT_STATUS_DICT["running"] = "正在运行"
# PROJECT_STATUS_DICT["suspended"] = "挂起"
# PROJECT_STATUS_DICT["finish"] = "结束"
#
# #定义全局变量，存放所有项目操作 key-value
# PROJECT_ACTION_DICT = {}
# PROJECT_ACTION_DICT["delete"] = "删除项目"
# PROJECT_ACTION_DICT["submitApprove"] = "提交审批"
# PROJECT_ACTION_DICT["rejectApprove"] = "审批不通过"
# PROJECT_ACTION_DICT["passApprove"] = "审批通过"
# PROJECT_ACTION_DICT["rejectEvaluate"] = "评估不通过"
# PROJECT_ACTION_DICT["passEvaluate"] = "评估通过"
# PROJECT_ACTION_DICT["startRun"] = "开始运行"
# PROJECT_ACTION_DICT["suspendRun"] = "挂起"
# PROJECT_ACTION_DICT["terminate"] = "终止运行"

PROJECT_STATUS_DICT = {}
PROJECT_STATUS_DICT["草稿"] = "草稿"
PROJECT_STATUS_DICT["待审批"] = "待审批"
PROJECT_STATUS_DICT["待评估"] = "待评估"
PROJECT_STATUS_DICT["审批退回"] = "审批退回"
PROJECT_STATUS_DICT["评估退回"] = "评估退回"
PROJECT_STATUS_DICT["待运行"] = "待运行"
PROJECT_STATUS_DICT["运行"] = "运行"
PROJECT_STATUS_DICT["挂起"] = "挂起"
PROJECT_STATUS_DICT["完成"] = "完成"

#定义全局变量，存放所有项目操作 key-value
PROJECT_ACTION_DICT = {}
PROJECT_ACTION_DICT["删除"] = "删除"
PROJECT_ACTION_DICT["提交"] = "提交"
PROJECT_ACTION_DICT["审批不通过"] = "审批不通过"
PROJECT_ACTION_DICT["审批通过"] = "审批通过"
PROJECT_ACTION_DICT["评估不通过"] = "评估不通过"
PROJECT_ACTION_DICT["评估通过"] = "评估通过"
PROJECT_ACTION_DICT["开始"] = "开始"
PROJECT_ACTION_DICT["挂起"] = "挂起"
PROJECT_ACTION_DICT["终止"] = "终止"
