# encoding: utf-8
"""
@desc: 
@author:  ‘mcyan‘
@time: 2017/8/9 20:03
"""
import db.db_project as dbproj
import db.db_users as dbuser
import beans.req_info_obj
import objs.Proj
import objs.proj_approvepending_status
import objs.proj_draft_status
import objs.proj_evaluatepending_status
import objs.proj_failapprove_status
import objs.proj_finish_status
import objs.proj_running_status
import objs.proj_runpending_status
import objs.proj_suspended_status
import objs.proj_failevaluate_status
import conf.enum_action as enum_action
import conf.enum_status  as enum_status


db_proj = dbproj.DbProject()
db_users = dbuser.DbUsers()


def search_project_list(project_param, pageinfo_param):
    """
    查询项目列表
    :param project_param:
                project_name :项目名
                creator  项目提交人id
                owner(责任人id)
                status:项目状态
                tester:参与人id
                proority:优先级
                create_time:提交时间，时间2017-08-05 或范围2017-08-05/2017-08-09
                out_run_time :项目结束时间，时间2017-08-05 或范围2017-08-05/2017-08-09
                noDrafFlag: 0--> 查询除draft、approveFail和evaluteFail状态的项目
                            1--> 查询raft、approveFail和evaluteFail状态的项目
    :param pageinfo_param
    :return: result、message 、project_list :List<Map>
            [{project_id:"",project_name:"",test_content:"",test_progress:"",creator(申请人):"",owner(负责人):"",tester(测试人):"",
            priority:"",start_time:"",finish_time:"",create_time:"",evaluete_risk:"",sustain_risk:"",summary_risk:""}]
    :remark:有些字段存放在DB中可以直接查询，有些字段存放在text中，需要dump文件中的内容通过文件的map的key值获取value
    """
    return db_proj.search_project_list(project_param, pageinfo_param)


def project_op(operate_info, action_info, project_id, template_id=1):

    # 如果是新任务保存，没有id
    if project_id is None or project_id == "":
        user_id = operate_info['operator_id']
        rc, msg, project_id = save_project(project_id, user_id, action_info, template_id)
        if rc != 0:
            return rc, msg, project_id
    # 获取当前任务状态
    pj_res, message, proj_status = db_proj.get_project_status(project_id)
    if pj_res != 0:
        return pj_res, message, proj_status

    proj = objs.Proj.Proj(project_id)
    proj.set_status(proj_status)
    return proj.take_action(operate_info, action_info)


def save_project(project_id, userid, info_map, templateid):
    """
    保存任务，不造成状态变更
    :return:
    """
    if project_id is None or project_id == "":
        res,   out, proj_id = db_proj.save_new_project_info(info_map, userid, templateid)
        if res != 0:
            return res, out, proj_id
        proj = objs.Proj.Proj(proj_id)
        proj.set_status(enum_status.EnumStatus.DRAFT)
        return proj.save_stage_info(info_map)
    else:
        # 更新原有任务
        res, mess, status = db_proj.get_project_status(project_id)
        if res != 0:
            return res, mess, status
        proj = objs.Proj.Proj(project_id)
        proj.set_status(status)
        return proj.save_stage_info(info_map)


def get_project_info(project_id=None):

    resultmap = dict()
    if project_id is None or project_id == "":
        # 返回空map，其中含有req_map的空map
        reqobj = beans.req_info_obj.CReqInfo()
        req_map = reqobj.req_info_map
        resultmap['req_info_map'] = req_map
        return 0, "", resultmap
    else:
        rest, mess, status = db_proj.get_project_status(project_id)
        if rest != 0:
            return rest, mess, status
        proj = objs.Proj.Proj(project_id)
        proj.set_status(status)
        return proj.get_stage_info()


def search_project_users(project_id):
    """
    获取项目相关用户
    :param project_id:  项目ID
    :return:
    """
    return db_proj.search_project_users(project_id)


def get_project_group(act_role):
    """
    查询所有项目参与人
    :param act_role:   用户角色
    :return: List<>
        [{"user_id":"","user_showname":""}]
    """
    return db_proj.get_project_group(act_role)


def update_approve_info(project_id, approve_info):
    proj = objs.Proj.Proj(project_id)
    return proj.edit_approve_info(approve_info)


def get_sustain_history(project_id, target_date):
    proj = objs.Proj.Proj(project_id)
    return proj.load_sustain_history(target_date)


def get_sustain_history_datelist(project_id):
    proj = objs.Proj.Proj(project_id)
    return proj.get_sustain_history_list()

if __name__ == '__main__':
    req_info_map = dict()
    req_info_map['projName_val'] = 'Nameof nePJ'
    req_info_map['projPubDate_val'] = "2002-11-12"
    req_info_map['frLink_val'] = "http:notexist"
    req_info_map['projLiaison_val'] = "mcyan-1"
    req_info_map['desc_val'] = "adfasdf"
    req_info_map['stoneOsBaseLine_val'] = "MxMain"
    req_info_map['testImage_val'] = "/image"
    req_info_map['platform_check_val'] = "t"
    req_info_map['expectTestStartDate_val'] = "2004-12-12"
    req_info_map['otherExplain_val'] = "otherexplain"
    req_info_map['newPlatDevName_val'] = "2005-1-1"
    req_info_map['newPlatVersion_val'] = "nevwer"
    req_info_map['defaultHostName_val'] = "10.10.10.10"
    req_info_map['adminAccountInfo_val'] = "xxx:sxx"
    req_info_map['urldb_support_val'] = "yes"
    req_info_map['urldb_defaultStatus_val'] = "aa"
    req_info_map['urldb_unsetallStatus_val'] = "bb"
    req_info_map['vsys_support_val'] = "yes"
    req_info_map['vsys_defaultStatus_val'] = "sss"
    req_info_map['vsys_unsetallStatus_val'] = "yes"
    req_info_map['vr_support_val'] = "yes"
    req_info_map['vr_defaultStatus_val'] = "no"
    req_info_map['vr_unsetallStatus_val'] = "no"

    req_info_map['commandLineSupportResult_val'] = "yes"
    req_info_map['commandLineComments_val'] = "a"
    req_info_map['shellPwResult_val'] = "b"
    req_info_map['shellPwComments_val'] = "c"
    req_info_map['rebootUnsetallResult_val'] = "d"
    req_info_map['rebootUnsetallComments_val'] = "e"
    req_info_map['unsetallSaveConfigResult_val'] = "f"
    req_info_map['unsetallSaveConfigComments_val'] = "g"
    req_info_map['longestRebootTimeResult_val'] = "h"
    req_info_map['longestRebootTimeComments_val'] = "i"
    req_info_map['consolePrintResult_val'] = "j"
    req_info_map['consolePrintComments_val'] = "l"
    req_info_map['startCheckResult_val'] = "k"
    req_info_map['startCheckComments_val'] = "m"

    # res, mess, pjid = save_project("", "192120404", req_info_map, 1)
    pjid = 11
    operate_info = dict()
    # operate_info['operator'] = "mcyan"
    # operate_info['action'] = enum_action.EnumAction.SUBMIT_APPROVE
    # operate_info['comments'] = "send approve comments"

    # print project_op(operate_info, req_info_map, pjid)
    # print save_project(42, 192120432, req_info_map, 1)
    # print get_project_info(11)

    approve = dict()
    approve["owner_id"] = "192120432"
    approve["owner_val"] = "2"
    approve["priority_val"] = "3a"

    approve['runTemp_val'] = "2"
    approve['runTemp_mailTo_val'] = "6"
    approve['runTemp_mailTo_name'] = "8"
    approve['runTemp_mailTo_id'] = "0"
    approve['runTemp_mailCC_val'] = "="
    approve['runTemp_mailCC_name'] = "y"
    approve['runTemp_mailCC_id'] = "f"

    approve['finishTemp_val'] = "5"
    approve['finishTemp_mailTo_val'] = "邮件地址"
    approve['finishTemp_mailTo_name'] = "a"
    approve['finishTemp_mailTo_id'] = "5"
    approve['finishTemp_mailCC_val'] = "b"
    approve['finishTemp_mailCC_name'] = "s"
    approve['finishTemp_mailCC_id'] = "b"

    operate_info['operator_id'] = '192120432'
    operate_info['operator'] = "mcyan"
    operate_info['operation'] = enum_action.EnumAction.PASS_EVALUATE
    operate_info['comments'] = "send aeva comments"
    pjid = '46'

    evaluate_info_map = dict()
    evaluate_info_map['projEstimateStartDate_val'] = ""
    evaluate_info_map['projEstimateEndDate_val'] = ""
    evaluate_info_map['projTesters_name_val'] = ""
    evaluate_info_map['projTesters_id'] = "11;22;33"
    evaluate_info_map['projSpendTime_val'] = ""
    evaluate_info_map['projRisk_val'] = ""

    projgres = dict()

    projgres['testerA'] = "%68"
    projgres['testerB'] = "%88"

    sustain_info_map = dict()
    sustain_info_map['sustainRisk_val'] = "无"
    sustain_info_map['totalProgress_val'] = projgres
    sustain_info_map['bugAdded_val'] = "123;234;567"

    sustain_label_map = dict()
    sustain_label_map['sustainRisk_label'] = "运维风险评估"
    sustain_label_map['totalProgress_label'] = "项目总体进度"
    sustain_label_map['bugAdded_label'] = "增加的bug"

    summary_info_map = dict()
    summary_info_map['summary_val'] = 'summaryfffd'
    summary_info_map['summaryRisk_val'] = 'may rffis'

    # print eidt_approve_info("46", approve)
    # print project_op(operate_info, evaluate_info_map, "46")
    print get_sustain_history_datelist(46)
    # print save_project("46", "192120432", summary_info_map, 1)
    # ret, mes, result = get_project_info(pjid)
    # print " "
