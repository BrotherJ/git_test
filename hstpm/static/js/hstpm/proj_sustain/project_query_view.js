/*
项目运维-项目查询项目页面相关js
pzhang
2017.8.11
*/
var globalIndex = 0;
var proj_info = JSON.parse($("#hidden_projectInfo").val());
var runTempList = proj_info["run_temp_list"];
var finishTempList = proj_info["finish_temp_list"];
var userList = proj_info["user_list"];
var userMap = {};

var runTempOptStr = "", finishTempOptStr = "", userOptStr = "", userLiStr = "";


$(document).ready(function() {
    delete proj_info["run_temp_list"];
    delete proj_info["finish_temp_list"];
    delete proj_info["user_list"];
    $("#req_info_map input, #req_info_map select, #req_info_map textarea").attr("disabled", true);
    if (proj_info["approve_info_map"]) {
        initListOptStr();
    }
    if (proj_info["op_history_info_list"]) {
        initTab();
    } else {
        $("#tabUl li:eq(0) a").tab("show");
    }

});

/**
* @Method: initListOptStr
* @Description: 拼装各个模板和用户列表的下拉框
* @param param
* @author pzhang
* @date 2017年8月30日
*/
function initListOptStr() {
    for (var i = 0; i < runTempList.length; i++) {
        if (runTempList[i].id == proj_info["approve_info_map"]["runTemp_val"]) {
            runTempOptStr += '<option value="' + runTempList[i].id + '" checked>' + runTempList[i].name + '</option>';
        } else {
            runTempOptStr += '<option value="' + runTempList[i].id + '">' + runTempList[i].name + '</option>';
        }
    }

    for (var j = 0; j < finishTempList.length; j++) {
        if (finishTempList[j].id == proj_info["approve_info_map"]["finishTemp_val"]) {
            finishTempOptStr += '<option value="' + finishTempList[j].id + '" checked>' + finishTempList[j].name + '</option>';
        } else {
            finishTempOptStr += '<option value="' + finishTempList[j].id + '">' + finishTempList[j].name + '</option>';
        }
    }

    userOptStr = '<option value="">请选择负责人</option>';
    for (var k = 0; k < userList.length; k++) {
        userOptStr += '<option value="' + userList[k].id + '" name="' + userList[k].name + '">' + userList[k].showname + '</option>';
        userLiStr += '<li class="list-unstyled">'
                  +      '<span>' + userList[k].showname + '</span>'
                  +      '<input type="checkbox" value="' + userList[k].id + '" name="' + userList[k].name + '" showname="' + userList[k].showname + '">'
                  +  '</li>';
        userMap[userList[k].showname] = userList[k].name;
    }
}

/**
* @Method: initTab
* @Description: 初始化tab内容
* @param
* @author pzhang
* @date 2017年8月30日
*/
function initTab() {
    var chStrMap = {
        "req_info_map": "提交信息",
        "approve_info_map": "审批信息",
        "evaluate_info_map": "评估信息",
        "sustain_info_map": "运维信息",
        "summary_info_map": "总结信息",
        "op_history_info_list": "操作记录"
    };
    var mapList = ["req_info_map", "approve_info_map", "evaluate_info_map", "sustain_info_map", "summary_info_map"];

    // 提交信息已经显示，不用再显示
    delete proj_info["req_info_map"];

    if (proj_info["approve_info_map"] != null) {
        globalIndex = 2;
    }
    if (proj_info["evaluate_info_map"] != null) {
        globalIndex = 3;
    }
    if (proj_info["sustain_info_map"] != null) {
        globalIndex = 4;
    }
    if (proj_info["summary_info_map"] != null) {
        globalIndex = 5;
    }

    var tabLiStr = "", tabDivStr = "", key = "";
    var showType = "view";
    for (var i = 1; i < globalIndex; i++) {
        /*if (i == (globalIndex-1)) {
            showType = "edit";
        }*/

        key = mapList[i];
        mapInfo = proj_info[key];

        tabLiStr = '<li id="' + key + '_li"><a href="#' + key + '" data-toggle="tab">' + chStrMap[key] + '</a></li>';

        $("#tabUl").append(tabLiStr);

        initTabContent(key, mapInfo);
    }
    initOperateLogTab(proj_info["op_history_info_list"]);

    var liLength = $("#tabUl li").length;
    if (liLength == 1) {
        $("#tabUl li:eq(0) a").tab("show");
    } else {
        $("#tabUl li:eq(" + (liLength-2) + ") a").tab("show");
    }

}

/**
* @Method: initTabContent
* @Description: 初始化tab内容
* @param key 哪个tab
* @param mapInfo tab中的内容
* @param showType edit或者是view，只有最后一个tab可以编辑
* @author pzhang
* @date 2017年8月30日
*/
function initTabContent(key, mapInfo) {
    switch(key) {
        case "approve_info_map":
            initApproveInfoTap(key, mapInfo);
            break;
        case "evaluate_info_map":
            initEvaluateInfoTap(key, mapInfo);
            break;
        case "sustain_info_map":
            initSustainInfoTap(key, mapInfo);
            break;
        case "summary_info_map":
            initSummaryInfoTab(key, mapInfo);
            break;
    }
}

/**
* @Method: initApproveInfoTap
* @Description: 初始化审批信息tab
* @param key 哪个tab
* @param mapInfo tab中的内容
* @param showType edit或者是view，只有最后一个tab可以编辑
* @author pzhang
* @date 2017年8月30日
*/
function initApproveInfoTap(key, mapInfo) {

    var tabDivStr = "";
    var opStr = JSON.stringify(proj_info["op_history_info_list"]);
    if (opStr.indexOf(HSTPMVARS["ACTION"]["PASS_APPROVE"]) > -1) {
        tabDivStr += '<div id="' + key + '" class="tab-pane fade">'
               +      '<table class="tb_approve">'
               +          '<tr>'
               +              '<td class="td_label">项目负责人</td>'
               +              '<td class="td_value">'
               +                  '<select id="owner_id">' + userOptStr + '</select>'
               +                  '<input type="hidden" id="owner" value="' + mapInfo["owner_val"] + '">'
               +              '</td>'
               +              '<td class="td_label">项目优先级</td>'
               +              '<td><input id="priority" value="' + mapInfo["priority_val"] + '"></td>'
               +          '</tr>'
               +          '<tr>'
               +              '<td colspan="4">'
               +                  '<table class="tb_approve_sub">'
               +                      '<tr>'
               +                          '<td class="td_label">运维邮件模板</td>'
               +                          '<td class="td_value">'
               +                              '<select id="runTemp">' + runTempOptStr + '</select>'
               +                          '</td>'
               +                          '<td colspan="2"></td>'
               +                      '</tr>'
               +                      '<tr>'
               +                          '<td>发送至</td>'
               +                          '<td>'
               +                              '<div class="div_userList" id="runTemp_mailTo_userDiv">'
               +                                  '<span id="runTemp_mailTo_userPart">'
               +                                      '<span id="runTemp_mailTo_user">请选择用户</span>'
               +                                      '<span class="caret img_updown"></span>'
               +                                  '</span>'
               +                                  '<div class="div_userList_ul" id="runTemp_mailTo_userUlDiv" style="display: none">'
               +                                      '<ul id="runTemp_mailTo_userUl">'
               +                                          userLiStr
               +                                      '</ul>'
               +                                  '</div>'
               +                              '</div>'
               +                          '<td>'
               +                          '<td colspan="2">'
               +                              '<input type="hidden" id="runTemp_mailTo" value="' + mapInfo["runTemp_mailTo_val"] + '">'
               +                              '<input type="hidden" id="runTemp_mailTo_id" value="' + mapInfo["runTemp_mailTo_id"] + '">'
               +                              '<input type="text" id="runTemp_mailTo_name" class="input_long" value="' + mapInfo["runTemp_mailTo_name"] + '">'
               +                          '</td>'
               +                      '</tr>'
               +                      '<tr>'
               +                          '<td>抄送至</td>'
               +                          '<td>'
               +                              '<div class="div_userList" id="runTemp_mailCC_userDiv">'
               +                                  '<span id="runTemp_mailCC_userPart">'
               +                                      '<span id="runTemp_mailCC_user">请选择用户</span>'
               +                                      '<span class="caret img_updown"></span>'
               +                                  '</span>'
               +                                  '<div class="div_userList_ul" id="runTemp_mailCC_userUlDiv" style="display: none">'
               +                                      '<ul id="runTemp_mailCC_userUl">'
               +                                          userLiStr
               +                                      '</ul>'
               +                                  '</div>'
               +                              '</div>'
               +                          '<td>'
               +                          '<td colspan="2">'
               +                              '<input type="hidden" id="runTemp_mailCC" value="' + mapInfo["runTemp_mailCC_val"] + '">'
               +                              '<input type="hidden" id="runTemp_mailCC_id" value="' + mapInfo["runTemp_mailCC_id"] + '">'
               +                              '<input type="text" id="runTemp_mailCC_name" class="input_long" value="' + mapInfo["runTemp_mailCC_name"] + '">'
               +                          '</td>'
               +                      '</tr>'
               +                  '</table>'
               +              '</td>'
               +          '</tr>'
               +          '<tr>'
               +              '<td colspan="4">'
               +                  '<table class="tb_approve_sub" style="margin-bottom: 20px;">'
               +                      '<tr>'
               +                          '<td class="td_label">结束邮件模板</td>'
               +                          '<td class="td_value">'
               +                              '<select id="finishTemp">' + finishTempOptStr + '</select>'
               +                          '</td>'
               +                          '<td colspan="2"></td>'
               +                      '</tr>'
               +                      '<tr>'
               +                          '<td>发送至</td>'
               +                          '<td>'
               +                              '<div class="div_userList" id="finishTemp_mailTo_userDiv">'
               +                                  '<span id="finishTemp_mailTo_userPart">'
               +                                      '<span id="finishTemp_mailTo_user">请选择用户</span>'
               +                                      '<span class="caret img_updown"></span>'
               +                                  '</span>'
               +                                  '<div class="div_userList_ul" id="finishTemp_mailTo_userUlDiv" style="display: none">'
               +                                      '<ul id="finishTemp_mailTo_userUl">'
               +                                          userLiStr
               +                                      '</ul>'
               +                                  '</div>'
               +                              '</div>'
               +                          '<td>'
               +                          '<td colspan="2">'
               +                              '<input type="hidden" id="finishTemp_mailTo" value="' + mapInfo["finishTemp_mailTo_val"] + '">'
               +                              '<input type="hidden" id="finishTemp_mailTo_id" value="' + mapInfo["finishTemp_mailTo_id"] + '">'
               +                              '<input type="text" id="finishTemp_mailTo_name" class="input_long" value="' + mapInfo["finishTemp_mailTo_name"] + '">'
               +                          '</td>'
               +                      '</tr>'
               +                      '<tr>'
               +                          '<td>抄送至</td>'
               +                          '<td>'
               +                              '<div class="div_userList" id="finishTemp_mailCC_userDiv">'
               +                                  '<span id="finishTemp_mailCC_userPart">'
               +                                      '<span id="finishTemp_mailCC_user">请选择用户</span>'
               +                                      '<span class="caret img_updown"></span>'
               +                                  '</span>'
               +                                  '<div class="div_userList_ul" id="finishTemp_mailCC_userUlDiv" style="display: none">'
               +                                      '<ul id="finishTemp_mailCC_userUl">'
               +                                          userLiStr
               +                                      '</ul>'
               +                                  '</div>'
               +                              '</div>'
               +                          '<td>'
               +                          '<td colspan="2">'
               +                              '<input type="hidden" id="finishTemp_mailCC" value="' + mapInfo["finishTemp_mailCC_val"] + '">'
               +                              '<input type="hidden" id="finishTemp_mailCC_id" value="' + mapInfo["finishTemp_mailCC_id"] + '">'
               +                              '<input type="text" id="finishTemp_mailCC_name" class="input_long" value="' + mapInfo["finishTemp_mailCC_name"] + '">'
               +                          '</td>'
               +                      '</tr>'
               +                  '</table>'
               +              '</td>'
               +          '</tr>'
               +          '<tr style="border-top: 1px solid #ccc;">'
               +              '<td class="td_label">审批备注</td>'
               +          '</tr>'
               +          '<tr>'
               +              '<td colspan="4">'
               +                  '<textarea id="approve_comments" style="width: 93%;">' + mapInfo["approve_comments_val"] + '</textarea>'
               +              '</td>'
               +          '</tr>'
               +      '</table>'
               +  '</div>';

        $("#tabContentDiv").append(tabDivStr);

        $("#owner_id").val(mapInfo["owner_id"]);
        $("#runTemp").val(mapInfo["runTemp_val"]);
        $("#finishTemp").val(mapInfo["finishTemp_val"]);

        $("#" + key + " input").attr("disabled", true);
        $("#" + key + " select").attr("disabled", true);
        $("#" + key + " checkbox").attr("disabled", true);
        $("#" + key + " textarea").attr("disabled", true);
    } else {
        $("#" + key + "_li").remove();
    }

}

/**
* @Method: initEvaluateInfoTap
* @Description: 初始化评估信息tab
* @param key 哪个tab
* @param mapInfo tab中的内容
* @param showType edit或者是view，只有最后一个tab可以编辑
* @author pzhang
* @date 2017年8月30日
*/
function initEvaluateInfoTap(key, mapInfo) {
    var tabDivStr = "";

    //var opLength = proj_info["op_history_info_list"].length;
    //var lastOperation = proj_info["op_history_info_list"][opLength-1]["operation"];
    //若最后一次操作是通过评估，则还没有点击开始运行按钮，此时只返回至评估map，但是不能有操作按钮
    var opStr = JSON.stringify(proj_info["op_history_info_list"]);
    if (opStr.indexOf(HSTPMVARS["ACTION"]["PASS_EVALUATE"]) > -1) {
        tabDivStr += '<div id="' + key + '" class="tab-pane fade">'
              +      '<table class="tb_approve">'
              +          '<tr>'
              +              '<td class="td_label td_align">预计开始时间</td>'
              +              '<td class="td_value">'
              +                  '<input type="text" id="projEstimateStartDate" value="' + mapInfo["projEstimateStartDate_val"] + '">'
              +              '</td>'
              +              '<td align="left">预计结束时间</td>'
              +              '<td align="left">'
              +                  '<input type="text" id="projEstimateEndDate" value="' + mapInfo["projEstimateEndDate_val"] + '">'
              +              '</td>'
              +          '</tr>'
              +          '<tr>'
              +              '<td class="td_align">'
              +                  '投入测试人员'
              +              '</td>'
              +              '<td>'
              +                  '<div class="div_userList" id="projTesters_userDiv">'
              +                      '<span id="projTesters_userPart">'
              +                          '<span id="projTesters_user">请选择用户</span>'
              +                          '<span class="caret img_updown"></span>'
              +                      '</span>'
              +                      '<div class="div_userList_ul" id="projTesters_userUlDiv" style="display: none">'
              +                          '<ul id="projTesters_userUl">'
              +                              userLiStr
              +                          '</ul>'
              +                     '</div>'
              +                  '</div>'
              +              '</td>'
              +              '<td colspan="2" align="left">'
              +                  '<input type="text" id="projTesters_name" style="width: 100%;" value="' + mapInfo["projTesters_name_val"] + '" title="' + mapInfo["projTesters_name_val"] + '">'
              +                  '<input type="hidden" id="projTesters_id" value="' + mapInfo["projTesters_id"] + '">'
              +              '</td>'
              +          '<tr>'
              +              '<td class="td_align">投入测试时间</td>'
              +              '<td>'
              +                  '<input type="text" id="projSpendTime" value="' + mapInfo["projSpendTime_val"] + '">'
              +              '</td>'
              +          '</tr>'
              +          '<tr>'
              +              '<td class="td_align">预计风险</td>'
              +          '</tr>'
              +          '<tr>'
              +              '<td colspan="4" class="td_align">'
              +                  '<textarea style="width: 100%; height: 150px;" id="projRisk">'+ mapInfo["projRisk_val"] + '</textarea>'
              +              '</td>'
              +          '</tr>'
              +      '</table>'
              +  '</div>';
        $("#tabContentDiv").append(tabDivStr);

        $("#" + key + " input").attr("disabled", true);
        $("#" + key + " select").attr("disabled", true);
        $("#" + key + " checkbox").attr("disabled", true);
    } else {
        $("#" + key + "_li").remove();
    }
}

/**
* @Method: initSustainInfoTap
* @Description: 初始化运维信息tab
* @param key 哪个tab
* @param mapInfo tab中的内容
* @param showType edit或者是view，只有最后一个tab可以编辑
* @author pzhang
* @date 2017年8月30日
*/
function initSustainInfoTap(key, mapInfo, showType) {
    var bugMapList = mapInfo["bugAdded_mapList_val"];
    var bugFrStr = "";
    var bugMapListStr = "";
    for (var i = 0; i < bugMapList.length; i++) {
        bugFrStr += '<a href="bug.hillstonenet.com/jquery.cgi?id=' + bugMapList[i].id + '" target="_blank">' + bugMapList[i].id + '</a>';
        bugMapListStr += '<hr>'
                      +  '<div id="bugDiv_' + bugMapList[i].id + '" class="div_addedBug">'
                      +      '<table class="tb_bug">'
                      +          '<tr>'
                      +              '<td class="td_label">bug ID</td>'
                      +              '<td><input id="id_' + bugMapList[i].id + '" value="' + bugMapList[i].id + '"><span class="text-danger">*</span></td>'
                      +              '<td class="td_label">状态</td>'
                      +              '<td><input id="status_' + bugMapList[i].id + '" value="' + bugMapList[i].status + '"><span class="text-danger">*</span></td>'
                      +          '</tr>'
                      +          '<tr>'
                      +              '<td class="td_label">简介</td>'
                      +              '<td colspan="3"><input style="width: 90%;" id="intro_' + bugMapList[i].id + '" class="input_long" value="' + bugMapList[i].intro + '"><span class="text-danger">*</span></td>'
                      +          '</tr>'
                      +          '<tr>'
                      +              '<td class="td_label" style="vertical-align: top;">备注</td>'
                      +              '<td colspan="4"><textarea id="comments_' + bugMapList[i].id + '">' + bugMapList[i].comments + '</textarea>&nbsp;&nbsp;</td>'
                      +          '</tr>'
                      +       '</table>'
                      +  '</div>';
    }
    bugMapListStr = bugMapListStr.substring(4, bugMapListStr.length);
    var tabDivStr = "";
    tabDivStr += '<div id="' + key + '" class="tab-pane fade" showtype="' + showType + '">'
              +      '<table class="tb_approve">'
              +          '<tr>'
              +              '<td class="td_label td_align">总体运维进度</td>'
              +              '<td colspan="3" style="text-align: right; padding-right: 5%;">'
              +                  '<button class="btn btn-info btn-xs" onclick="getSustainHistoryDateList();">查看历史运维记录</button>'
              +              '</td>'
              +          '</tr>'
              +          '<tr>'
              +              '<td colspan="4">'
              +                  '<textarea id="totalProgress">' + mapInfo["totalProgress_val"] + '</textarea>'
              +              '</td>'
              +          '</tr>'
              +          '<tr>'
              +              '<td class="td_label td_align">个人测试进度</td>'
              +          '</tr>'
              +          '<tr>'
              +              '<td colspan="4">'
              +                  '<div id="totalProgress">';
    for (var tester in mapInfo["totalProgress_map_val"]) {
        tabDivStr +=                 '<p style="margin: 0;">'
                  +                      '<span class="span_progress">' + tester + "：</span>"
                  +                      '<textarea id="' + userMap[tester]+ '" class="textarea_progresss">' + mapInfo["totalProgress_map_val"][tester] + '</textarea>'
                  +                  '</p>';
    }
    tabDivStr +=                 '</div>'
              +              '</td>'
              +          '</tr>'
              +          '<tr>'
              +              '<td class="td_label td_align">bug列表</td>'
              +          '</tr>'
              +          '<tr>'
              +              '<td colspan="4">'
              +                  '<div id="bugMapListTd" class="div_bug_map">'
              +                      bugMapListStr
              +                  '</div>'
              +              '</td>'
              +          '<tr>'
              +          '<tr>'
              +              '<td class="td_label td_align">bug链接</td>'
              +              '<td colspan="3" class="td_bug_a">'
              +                  bugFrStr
              +              '</td>'
              +          '</tr>'
              +          '<tr>'
              +              '<td class="td_label td_align">风险评估</td>'
              +          '</tr>'
              +          '<tr>'
              +              '<td colspan="4">'
              +                  '<textarea id="sustainRisk">' + mapInfo["sustainRisk_val"] + '</textarea>'
              +              '</td>'
              +          '</tr>'
              +      '</table>'
              +  '</div>';
    $("#tabContentDiv").append(tabDivStr);
    if (bugMapListStr == "") {
        $(".div_bug_map").css("border", "0 solid #ccc");
    }

    $("#" + key + " input").attr("disabled", true);
    $("#" + key + " select").attr("disabled", true);
    $("#" + key + " checkbox").attr("disabled", true);
    $("#" + key + " textarea").attr("disabled", true);
}

/**
* @Method: initSummaryInfoTab
* @Description: 初始化总结信息tab
* @param key 哪个tab
* @param mapInfo tab中的内容
* @param showType edit或者是view，只有最后一个tab可以编辑
* @author pzhang
* @date 2017年8月30日
*/
function initSummaryInfoTab(key, mapInfo, showType) {
    var tabDivStr = "";
    tabDivStr += '<div id="' + key + '" class="tab-pane fade" showtype="' + showType + '">'
              +      '<table class="tb_approve">'
              +          '<tr>'
              +              '<td colspan="4" class="td_label td_align">测试结论</td>'
              +          '</tr>'
              +          '<tr>'
              +              '<td colspan="4">'
              +                  '<textarea id="summary">' + mapInfo["summary_val"] + '</textarea>'
              +              '</td>'
              +          '</tr>'
              +          '<tr>'
              +              '<td colspan="4" class="td_label td_align">风险评估</td>'
              +          '</tr>'
              +          '<tr>'
              +              '<td colspan="4">'
              +                  '<textarea id="summaryRisk">' + mapInfo["summaryRisk_val"] + '</textarea>'
              +              '</td>'
              +          '</tr>'
              +      '</table>'
              +  '</div>';
    $("#tabContentDiv").append(tabDivStr);

    $("#" + key + " input").attr("disabled", true);
    $("#" + key + " select").attr("disabled", true);
    $("#" + key + " checkbox").attr("disabled", true);
    $("#" + key + " textarea").attr("disabled", true);
}

/**
* @Method: initOperateLogTab
* @Description: 初始化操作日志tab
* @param key 哪个tab
* @param mapInfo tab中的内容
* @param showType edit或者是view，只有最后一个tab可以编辑
* @author pzhang
* @date 2017年8月30日
*/
function initOperateLogTab(opLogList) {
    var opLogDivStr = "";
    for (var i = opLogList.length-1; i > -1; i--) {
        opLogDivStr += '<div class="div_oplog">'
                    +      '<p>操作人：' + opLogList[i].operator + '</p>'
                    +      '<p>操作：' + opLogList[i].operation + '</p>'
                    +      '<p>操作时间：' + opLogList[i].operate_time + '</p>'
                    +      '<p>操作备注：' + opLogList[i].comments + '</p>'
                    +  '</div>'
                    +  '<hr>';
    }
    opLogDivStr = opLogDivStr.substring(0, opLogDivStr.length-4);
    var tabDivStr = "";
    tabDivStr += '<div id="op_history_info_list" class="tab-pane fade" showtype="view">'
              +      opLogDivStr
              +  '</div>';
    $("#tabContentDiv").append(tabDivStr);
    $("#tabUl").append('<li><a href="#op_history_info_list" data-toggle="tab">操作日志</a></li>');
}

/**
* @Method: getSustainHistoryDateList
* @Description: 获取历史运维记录日期列表
* @param param
* @author pzhang
* @date 2017年8月30日
*/
function getSustainHistoryDateList() {
    var params = {};
    params["project_id"] = $("#hidden_projectId").val();
    $.get("/hstpm/proj_sustain/get_sustain_history_date", params, returnGetSustainHistoryDateList, 'json');
}

/**
* @Method: returnGetSustainHistoryDateList
* @Description: 获取历史运维记录日期列表回调
* @param data
* @author pzhang
* @date 2017年8月30日
*/
function returnGetSustainHistoryDateList(data) {
    var dateList = data.rcdata;
    var dateStr = "";
    for (var i = dateList.length-1; i > -1; i--) {
        dateStr += '<option>' + dateList[i] + '</option>';
    }
    if (dateStr == "") {
        modalDialog('error', "该项目还没有历史运维记录！");
        return;
    }
    $("#sustainHistoryDate").empty().append(dateStr).change();
}

/**
* @Method: getSustainHistoryInfo
* @Description: 获取历史运维记录日回调
* @param self 日期控件的this对象
* @author pzhang
* @date 2017年8月30日
*/
function getSustainHistoryInfo(self) {
    var queryDate = $(self).val();
    var params = {};
    params["project_id"] = $("#hidden_projectId").val();
    params["query_date"] = queryDate;
    $.get("/hstpm/proj_sustain/get_sustain_history_info", params, returnGetSustainHistoryInfo, 'json');
}

/**
* @Method: returnGetSustainHistoryInfo
* @Description: 获取历史运维记录日回调
* @param data
* @author pzhang
* @date 2017年8月30日
*/
function returnGetSustainHistoryInfo(data) {
    var mapInfo = data.rcdata;
    var elemId = "", index = "";
    for (var key in mapInfo) {
        index = key.indexOf("_val")
        if (index < 0) {
            elemId = "his_" + key;
        } else {
            if (key.indexOf("_map_") > -1) {
                for (var tester in mapInfo[key]) {
                    elemId = 'his_' + userMap[tester];
                    $("#" + elemId).html(mapInfo[key][tester].replace(/\n/g, '<br>').replace(/\t/g, '&nbsp;&nbsp;'));
                }
                continue;
            } else if (key.indexOf("_mapList_") > -1) {
                elemId = "his_" + key.substring(0, key.indexOf("_mapList_"));
                var mapStr = "";
                for (var i = 0; i < mapInfo[key].length; i++) {
                    mapStr += '<div class="div_addedBug">'
                           +      '<table class="tb_bug">'
                           +          '<tr>'
                           +              '<td class="td_label">bug ID</td>'
                           +              '<td><span>' + mapInfo[key][i].id + '</span></td>'
                           +              '<td class="td_label">状态</td>'
                           +              '<td><span>' + mapInfo[key][i].status + '</span></td>'
                           +          '</tr>'
                           +          '<tr>'
                           +              '<td class="td_label">简介</td>'
                           +              '<td colspan="3"><span style="width: 100%;">' + mapInfo[key][i].intro + '</span></td>'
                           +          '</tr>'
                           +          '<tr>'
                           +              '<td class="td_label" style="vertical-align: top;">备注</td>'
                           +              '<td colspan="3"><span style="height: 50px;max-height: 50px;overflow-y:auto;width: 100%;">' + mapInfo[key][i].comments.replace(/\n/g, '<br>').replace(/\t/g, '&nbsp;&nbsp;') + '</span></td>'
                           +          '</tr>'
                           +      '</table>'
                           +  '</div>'
                           +  '<hr>';
                }
                if (mapStr != "") {
                    $("#his_bugAdded").css("border", "1px solid #ccc");
                    mapStr = mapStr.substring(0, mapStr.length-4);
                } else {
                    $("#his_bugAdded").css("border", "0 solid #ccc");
                }
                $("#" + elemId).html(mapStr);
                continue;
            } else {
                elemId = "his_" + key.substring(0, index);
            }
        }
        $("#" + elemId).html(mapInfo[key].replace(/\n/g, '<br>').replace(/\t/g, '&nbsp;&nbsp;'));
    }

    var bugMapList = mapInfo["bugAdded_mapList_val"];
    var bugFrStr = "";
    for (var i = 0; i < bugMapList.length; i++) {
        bugFrStr += '<a href="http://bug.hillstonenet.com/jquery.cgi?id=' + bugMapList[i].id + '" target="_blank">' + bugMapList[i].id + '</a>';
    }
    $("#his_bugATd").empty().append(bugFrStr);

    $("#sustainHistoryDialog").modal("show");
}
