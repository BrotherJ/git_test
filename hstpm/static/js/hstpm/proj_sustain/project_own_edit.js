/*
项目运维-我负责的项目页面相关js
pzhang
2017.8.11
*/
var globalIndex = 1;
var proj_info = JSON.parse($("#hidden_projectInfo").val());
var runTempList = proj_info["run_temp_list"];
var finishTempList = proj_info["finish_temp_list"];
var userList = proj_info["user_list"];
var testUserList = proj_info["test_user_list"];
var userMap = {};

var runTempOptStr = "", finishTempOptStr = "", userOptStr = "", userLiStr = "", testUserListStr = "";


$(document).ready(function() {
    delete proj_info["run_temp_list"];
    delete proj_info["finish_temp_list"];
    delete proj_info["user_list"];
    delete proj_info["test_user_list"];
    $("#req_info_map input, #req_info_map select, #req_info_map textarea").attr("disabled", true);
    initListOptStr();
    initTab();
    setUserListShowOrHide();

    if ($('#runTemp_mailTo_userDiv').length > 0) {
        addFocusEvent(document.getElementById('runTemp_mailTo_userDiv'), function(e){});
        addFocusEvent(document.getElementById('runTemp_mailCC_userDiv'), function(e){});
        addFocusEvent(document.getElementById('finishTemp_mailTo_userDiv'), function(e){});
        addFocusEvent(document.getElementById('finishTemp_mailCC_userDiv'), function(e){});
    }

    if ($('#projTesters_userDiv').length > 0) {
        addFocusEvent(document.getElementById('projTesters_userDiv'), function(e){});
    }
});

/**
* @Method: setUserListShowOrHide
* @Description: 为自定义下拉框设置全局的隐藏事件
* @param elemId
* @author pzhang
* @date 2017年8月30日
*/
function setUserListShowOrHide(elemId) {
    $(document).bind("click", function(e) {
        var e = e || window.event;
        var elem = e.target || e.srcElement;
        while (elem) {
            if (elem.id && elem.id == "runTemp_mailTo_userDiv") {
                $("#runTemp_mailCC_userUlDiv").css("display", "none");
                $("#finishTemp_mailTo_userUlDiv").css("display", "none");
                $("#finishTemp_mailCC_userUlDiv").css("display", "none");
                return;
            } else if (elem.id && elem.id == "runTemp_mailCC_userDiv") {
                $("#runTemp_mailTo_userUlDiv").css("display", "none");
                $("#finishTemp_mailTo_userUlDiv").css("display", "none");
                $("#finishTemp_mailCC_userUlDiv").css("display", "none");
                return;
            } else if (elem.id && elem.id == "finishTemp_mailTo_userDiv") {
                $("#runTemp_mailTo_userUlDiv").css("display", "none");
                $("#runTemp_mailCC_userUlDiv").css("display", "none");
                $("#finishTemp_mailCC_userUlDiv").css("display", "none");
                return;
            } else if (elem.id && elem.id == "finishTemp_mailCC_userDiv") {
                $("#runTemp_mailTo_userUlDiv").css("display", "none");
                $("#runTemp_mailCC_userUlDiv").css("display", "none");
                $("#finishTemp_mailTo_userUlDiv").css("display", "none");
                return;
            } else if (elem.id && elem.id == "projTesters_userDiv") {
                return;
            }
            elem = elem.parentNode;
        }
        $("#runTemp_mailTo_userUlDiv").css("display", "none");
        $("#runTemp_mailCC_userUlDiv").css("display", "none");
        $("#finishTemp_mailTo_userUlDiv").css("display", "none");
        $("#finishTemp_mailCC_userUlDiv").css("display", "none");
        $("#projTesters_userUlDiv").css("display", "none");
    });
}

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
    var showName = "", showName2 = "";
    for (var k = 0; k < userList.length; k++) {
        userOptStr += '<option value="' + userList[k].id + '" name="' + userList[k].name + '">' + userList[k].showname + '</option>';
        userLiStr += '<li class="list-unstyled" onclick="clearLassIndex(this);">'
                  +      '<span>' + userList[k].showname + '</span>'
                  +      '<input type="checkbox" value="' + userList[k].id + '" name="' + userList[k].name + '" showname="' + userList[k].showname + '" onclick="setCheckedShow(this);">'
                  +  '</li>';
        showName = userList[k].showname;
        showName2 = showName.substring(showName.indexOf("(")+1, showName.indexOf(")"));
        if (showName2 == "") {
            showName2 = showName.substring(showName.indexOf("（")+1, showName.indexOf("）"));
        }
        userMap[showName2] = userList[k].name;
    }

    for (var m = 0; m < testUserList.length; m++) {
        testUserListStr += '<li class="list-unstyled" onclick="clearLassIndex(this);">'
                        +      '<span>' + testUserList[m].showname + '</span>'
                        +      '<input type="checkbox" value="' + testUserList[m].id + '" name="' + testUserList[m].name + '" showname="' + testUserList[m].showname + '" onclick="setCheckedShow(this);">'
                        +  '</li>';
    }
}

/**
* @Method: setCheckedShow
* @Description: 为自定义的下拉框的checkbox添加click事件
* @param self 元素this对象
* @author pzhang
* @date 2017年8月30日
*/
function setCheckedShow(self) {
    var selfUl = $(self).parent().parent();
    var checkedUser = selfUl.find("input[type=checkbox]:checked");
    var checkedUserId = "", checkedUserName = "", checkedUserShowName = "", showName = "", showName2;
    checkedUser.each(function(){
        checkedUserId += $(this).val() + ";";
        checkedUserName += $(this).attr("name") + "@hillstonenet.com;";
        showName = $(this).attr("showname");
        showName2 = showName.substring(showName.indexOf('(')+1, showName.indexOf(')'));
        if (showName2 == "") {
            showName2 = showName.substring(showName.indexOf('（')+1, showName.indexOf('）'));
        }
        checkedUserShowName += showName2 + ";";
    });
    checkedUserId = checkedUserId.substring(0, checkedUserId.length-1);
    checkedUserName = checkedUserName.substring(0, checkedUserName.length-1);
    checkedUserShowName = checkedUserShowName.substring(0, checkedUserShowName.length-1);
    var elemId = $(self).parent().parent().attr("id");
    elemId = elemId.substring(0, elemId.lastIndexOf("_"));
    $("#" + elemId).val(checkedUserName);
    $("#" + elemId + "_id").val(checkedUserId);
    $("#" + elemId + "_name").val(checkedUserShowName);
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
        if (i == (globalIndex-1)) {
            showType = "edit";
        }

        key = mapList[i];
        mapInfo = proj_info[key];

        tabLiStr = '<li showtype="' + showType + '"><a href="#' + key + '" data-toggle="tab">' + chStrMap[key] + '</a></li>';
        //添加tab内容
        initTabContent(key, mapInfo, showType);
        //添加tab内容的li
        $("#tabUl").append(tabLiStr);
    }
    //不管什么状态的项目都有操作记录tab
    initOperateLogTab(proj_info["op_history_info_list"]);

    var liLength = $("#tabUl li").length;
    $("#tabUl li:eq(" + (liLength-2) + ") a").tab("show");
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
function initTabContent(key, mapInfo, showType) {
    switch(key) {
        case "approve_info_map":
            initApproveInfoTap(key, mapInfo, showType);
            break;
        case "evaluate_info_map":
            initEvaluateInfoTap(key, mapInfo, showType);
            break;
        case "sustain_info_map":
            initSustainInfoTap(key, mapInfo, showType);
            break;
        case "summary_info_map":
            initSummaryInfoTab(key, mapInfo, showType);
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
function initApproveInfoTap(key, mapInfo, showType) {
    if(mapInfo["runTemp_mailTo_id"].length == 0) {
        mapInfo["runTemp_mailTo_id"] = "";
        mapInfo["runTemp_mailTo_val"] = "";
        mapInfo["runTemp_mailTo_name"] = "";
    }
    if (mapInfo["runTemp_mailCC_id"].length == 0) {
        mapInfo["runTemp_mailCC_id"] = "8;192120505;192120388;192120300;192120093;192120299";
        mapInfo["runTemp_mailCC_val"] = "ahyu@hillstonenet.com;azjiang@hillstonenet.com;jhan@hillstonenet.com;jiaolongli@hillstonenet.com;wfdong@hillstonenet.com;yhchen@hillstonenet.com;zlhu@hillstonenet.com";
        mapInfo["runTemp_mailCC_name"] = "虞安虎;江爱珍;李蛟龙;董炜芳;陈雨慧;胡子龙";
    }

    var tabDivStr = "";
    tabDivStr += '<div id="' + key + '" class="tab-pane fade" showtype="' + showType + '">'
           +      '<table class="tb_approve">'
           +          '<tr>'
           +              '<td class="td_label">项目负责人</td>'
           +              '<td class="td_value">'
           +                  '<select id="owner_id" onchange="setUserName(this);" title="输入首字母进行索引搜索">' + userOptStr + '</select>'
           +                  '<span class="text-danger">*</span>'
           +                  '<input type="hidden" id="owner" value="' + mapInfo["owner_val"] + '">'
           +              '</td>'
           +              '<td class="td_label">项目优先级</td>'
           +              '<td>'
           +                  '<select id="priority">'
           +                      '<option>p0</option><option>p1</option><option>p2</option><option>p3</option><option>p4</option><option>p5</option>'
           +                  '</select>'
           +              '</td>'
           +          '</tr>'
           +          '<tr>'
           +              '<td colspan="4">'
           +                  '<table class="tb_approve_sub">'
           +                      '<tr>'
           +                          '<td class="td_label">运维邮件模板</td>'
           +                          '<td class="td_value">'
           +                              '<select id="runTemp">' + runTempOptStr + '</select>'
           +                              '<span class="text-danger">*</span>'
           +                              '<button type="button" class="btn btn-info btn-xs" style="position:absolute;margin-left: 3px; margin-top: 6px;" onclick="getMailTemplateContent(this, \'sustain\')">查看</button>'
           +                          '</td>'
           +                          '<td colspan="2"></td>'
           +                      '</tr>'
           +                      '<tr>'
           +                          '<td>发送至</td>'
           +                          '<td>'
           +                              '<div class="div_userList" id="runTemp_mailTo_userDiv" onkeypress="indexUser(event, \'runTemp_mailTo_userUlDiv\');" title="输入字符进行索引搜索，按enter键持续索引">'
           +                                  '<span id="runTemp_mailTo_userPart" onclick="showOrHideUser(\'runTemp_mailTo\')">'
           +                                      '<span id="runTemp_mailTo_user">请选择用户</span>'
           +                                      '<span class="caret img_updown"></span>'
           +                                  '</span>&nbsp;'
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
           +                              '<input type="text" id="runTemp_mailTo_name" class="input_long" value="' + mapInfo["runTemp_mailTo_name"] + '" readonly="readonly">'
           +                              '<span class="text-danger">*</span>'
           +                          '</td>'
           +                      '</tr>'
           +                      '<tr>'
           +                          '<td>抄送至</td>'
           +                          '<td>'
           +                              '<div class="div_userList" id="runTemp_mailCC_userDiv" onkeypress="indexUser(event, \'runTemp_mailCC_userUlDiv\');" title="输入字符进行索引搜索，按enter键持续索引">'
           +                                  '<span id="runTemp_mailCC_userPart" onclick="showOrHideUser(\'runTemp_mailCC\')">'
           +                                      '<span id="runTemp_mailCC_user">请选择用户</span>'
           +                                      '<span class="caret img_updown"></span>'
           +                                  '</span>&nbsp;'
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
           +                              '<input type="text" id="runTemp_mailCC_name" class="input_long" value="' + mapInfo["runTemp_mailCC_name"] + '" readonly="readonly">&nbsp;'
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
           +                              '<span class="text-danger">*</span>'
           +                              '<button type="button" class="btn btn-info btn-xs" style="position:absolute;margin-left: 3px; margin-top: 6px;" onclick="getMailTemplateContent(this, \'end\')">查看</button>'
           +                          '</td>'
           +                          '<td colspan="2"></td>'
           +                      '</tr>'
           +                      '<tr>'
           +                          '<td>发送至</td>'
           +                          '<td>'
           +                              '<div class="div_userList" id="finishTemp_mailTo_userDiv" onkeypress="indexUser(event, \'finishTemp_mailTo_userUlDiv\');" title="输入字符进行索引搜索，按enter键持续索引">'
           +                                  '<span id="finishTemp_mailTo_userPart" onclick="showOrHideUser(\'finishTemp_mailTo\')">'
           +                                      '<span id="finishTemp_mailTo_user">请选择用户</span>'
           +                                      '<span class="caret img_updown"></span>'
           +                                  '</span>&nbsp;'
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
           +                              '<input type="text" id="finishTemp_mailTo_name" class="input_long" value="' + mapInfo["finishTemp_mailTo_name"] + '" readonly="readonly">'
           +                              '<span class="text-danger">*</span>'
           +                          '</td>'
           +                      '</tr>'
           +                      '<tr>'
           +                          '<td>抄送至</td>'
           +                          '<td>'
           +                              '<div class="div_userList" id="finishTemp_mailCC_userDiv" onkeypress="indexUser(event, \'finishTemp_mailCC_userUlDiv\');" title="输入字符进行索引搜索，按enter键持续索引">'
           +                                  '<span id="finishTemp_mailCC_userPart" onclick="showOrHideUser(\'finishTemp_mailCC\')">'
           +                                      '<span id="finishTemp_mailCC_user">请选择用户</span>'
           +                                      '<span class="caret img_updown"></span>'
           +                                  '</span>'
           +                              '&nbsp;'
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
           +                              '<input type="text" id="finishTemp_mailCC_name" class="input_long" value="' + mapInfo["finishTemp_mailCC_name"] + '" readonly="readonly">'
           +                              '&nbsp;'
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
           +      '</table>';
    if (showType == "edit") {
        tabDivStr += '<div class="div_op_btn">'
                  +      '<button class="btn btn-info btn-sm" onclick="submitOrSaveProject(0)">保存</button>'
                  +      '<button class="btn btn-primary btn-sm" onclick="submitOrSaveProject(1);">审批通过</button>'
                  +      '<button class="btn btn-danger btn-sm" onclick="openApproveReasonDialog();">审批不通过</button>'
                  +  '</div>';
    } else {
        tabDivStr += '<div class="div_op_btn">'
                  +      '<button class="btn btn-info btn-sm" onclick="saveApproveInfo()">保存</button>'
                  +  '</div>';
    }
    tabDivStr +=  '</div>';

    $("#tabContentDiv").append(tabDivStr);

    $("#owner_id").val(mapInfo["owner_id"]);
    $("#priority").val(mapInfo["priority_val"]);
    $("#runTemp").val(mapInfo["runTemp_val"]);
    $("#finishTemp").val(mapInfo["finishTemp_val"]);

    var elemIdList = ["runTemp_mailTo", "runTemp_mailCC", "finishTemp_mailTo", "finishTemp_mailCC"];
    var checkedUserIdList = [mapInfo["runTemp_mailTo_id"], mapInfo["runTemp_mailCC_id"], mapInfo["finishTemp_mailTo_id"], mapInfo["finishTemp_mailCC_id"]];

    //初始化已经选择用户checked
    initCheckedUser(elemIdList, checkedUserIdList);

    if (showType == "view") {
        /*$("#" + key + " input").attr("disabled", true);
        $("#" + key + " select").attr("disabled", true);
        $("#" + key + " checkbox").attr("disabled", true);
        $("#" + key + " textarea").attr("disabled", true);*/
        $("#owner_id").attr("disabled", true);
        $("#priority").attr("disabled", true);
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
function initEvaluateInfoTap(key, mapInfo, showType) {
    var tabDivStr = "";
    tabDivStr += '<div id="' + key + '" class="tab-pane fade" showtype="' + showType + '">'
              +      '<table class="tb_approve">'
              +          '<tr>'
              +              '<td class="td_label td_align">预计开始时间</td>'
              +              '<td class="td_value">'
              +                  '<input type="text" id="projEstimateStartDate" onFocus="WdatePicker({minDate:\'%y-%M-%d\',dateFmt:\'yyyy-MM-dd\'})" value="' + mapInfo["projEstimateStartDate_val"] + '">'
              +                  '<span class="text-danger">*</span>'
              +              '</td>'
              +              '<td align="left">预计结束时间</td>'
              +              '<td align="left">'
              +                  '<input type="text" id="projEstimateEndDate" onFocus="WdatePicker({minDate:\'%y-%M-%d\',dateFmt:\'yyyy-MM-dd\'})" value="' + mapInfo["projEstimateEndDate_val"] + '">'
              +                  '<span class="text-danger">*</span>'
              +              '</td>'
              +          '</tr>'
              +          '<tr>'
              +              '<td class="td_align">'
              +                  '投入测试人员'
              +              '</td>'
              +              '<td>'
              +                  '<div class="div_userList" id="projTesters_userDiv" onkeypress="indexUser(event, \'projTesters_userUlDiv\');" title="输入字符进行索引搜索，按enter键持续索引">'
              +                      '<span id="projTesters_userPart" onclick="showOrHideUser(\'projTesters\')">'
              +                          '<span id="projTesters_user">请选择用户</span>'
              +                          '<span class="caret img_updown"></span>'
              +                      '</span>&nbsp;'
              +                      '<div class="div_userList_ul" id="projTesters_userUlDiv" style="display: none">'
              +                          '<ul id="projTesters_userUl">'
              +                              testUserListStr
              +                          '</ul>'
              +                     '</div>'
              +                  '</div>'
              +              '</td>'
              +              '<td colspan="2" align="left">'
              +                  '<input type="text" id="projTesters_name" style="width: 99%;" value="' + mapInfo["projTesters_name_val"] + '" title="' + mapInfo["projTesters_name_val"] + '">'
              +                  '<span class="text-danger">*</span>'
              +                  '<input type="hidden" id="projTesters_id" value="' + mapInfo["projTesters_id"] + '">'
              +              '</td>'
              +          '<tr>'
              +              '<td class="td_align">投入测试时间</td>'
              +              '<td>'
              +                  '<input type="text" id="projSpendTime" value="' + mapInfo["projSpendTime_val"] + '">'
              +                  '<span class="text-danger">*</span>'
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
              +      '</table>';

    //var opLength = proj_info["op_history_info_list"].length;
    //var lastOperation = proj_info["op_history_info_list"][opLength-1]["operation"];
    var opStr = JSON.stringify(proj_info["op_history_info_list"]);
    //已经评估通过的项目，评估信息不能编辑
    if (opStr.indexOf(HSTPMVARS["ACTION"]["PASS_EVALUATE"]) > -1) {
        tabDivStr +=  '</div>';
        $("#tabContentDiv").append(tabDivStr);

        $("#" + key + " input").attr("disabled", true);
        $("#" + key + " select").attr("disabled", true);
        $("#" + key + " checkbox").attr("disabled", true);
        $("#" + key + " textarea").attr("disabled", true);
    } else {
        if (showType == "edit") {
        tabDivStr += '<div class="div_op_btn">'
                  +      '<button class="btn btn-info btn-sm" onclick="evaluateOrSaveProject(0)">保存</button>'
                  +      '<button class="btn btn-primary btn-sm" onclick="evaluateOrSaveProject(1)">评估通过</button>'
                  +      '<button class="btn btn-danger btn-sm" onclick="openEvaluateReasonDialog();">评估不通过</button>'
                  +  '</div>';
        }

        tabDivStr +=  '</div>';
        $("#tabContentDiv").append(tabDivStr);
        //init多选的用户列表checkbox
        if (showType == "view") {
            $("#" + key + " input").attr("disabled", true);
            $("#" + key + " select").attr("disabled", true);
            $("#" + key + " checkbox").attr("disabled", true);
            $("#" + key + " textarea").attr("disabled", true);
        }
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
    var bugFrStr = "";
    var bugMapList = mapInfo["bugAdded_mapList_val"];
    var bugMapListStr = "";
    for (var i = 0; i < bugMapList.length; i++) {
        bugFrStr += '<a href="http://bug.hillstonenet.com/jquery.cgi?id=' + bugMapList[i].id + '" target="_blank">' + bugMapList[i].id + '</a>';

        bugMapListStr += '<hr>'
                      +  '<div id="bugDiv_' + bugMapList[i].id + '" class="div_addedBug">'
                      +      '<button class="close" aria-hidden="true" onclick="deleteBugDiv(' + bugMapList[i].id + ');" title="删除bug"><span class="glyphicon glyphicon-remove"></span></button>'
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
              +                  '<span class="text-danger">*</span>'
              +              '</td>'
              +          '</tr>'
              +          '<tr>'
              +              '<td class="td_label td_align">个人测试进度</td>'
              +          '</tr>'
              +          '<tr>'
              +              '<td colspan="4">'
              +                  '<div id="totalProgress">';
    var testerStr = "", his_testerStr = "";
    for (var tester in mapInfo["totalProgress_map_val"]) {
        testerStr +=                 '<p style="margin: 0;">'
                  +                      '<span class="span_progress">' + tester + "：</span>"
                  +                      '<textarea id="' + userMap[tester]+ '" class="textarea_progresss">' + mapInfo["totalProgress_map_val"][tester] + '</textarea>'
                  +                  '</p>';
    };
    for (var tester in mapInfo["totalProgress_map_val"]) {
        his_testerStr +=                 '<p style="margin: 0;">'
                      +                      '<span class="span_progress">' + tester + "：</span>"
                      +                      '<span id="his_' + userMap[tester]+ '" class="span_progress_content"></span>'
                      +                  '</p>';
    };
    $("#his_singleProgress").empty().append(his_testerStr);
    tabDivStr +=                    testerStr
              +                  '</div>'
              +              '</td>'
              +          '</tr>'
              +          '<tr>'
              +              '<td class="td_label td_align">bug列表</td>'
              +              '<td align="left"><button class="btn btn-info btn-xs" id="addBugBtn" onclick="addBug();">添加</button></td>'
              +          '</tr>'
              +          '<tr>'
              +              '<td colspan="4">'
              +                  '<div id="bugMapListTd" class="div_bug_map">'
              +                      bugMapListStr
              +                  '</div>'
              +              '</td>'
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
              +      '</table>';
    if (showType == "edit") {
        tabDivStr += '<div class="div_op_btn">'
                  +      '<button class="btn btn-info btn-sm" onclick="saveProjectSustainInfo();">保存</button>'
                  +  '</div>';
    }
    tabDivStr +=  '</div>';
    $("#tabContentDiv").append(tabDivStr);
    if (bugMapListStr == "") {
        $(".div_bug_map").css("border", "0 solid #ccc");
    }

    //init多选的用户列表checkbox
    if (showType == "view") {
        $("#" + key + " input").attr("disabled", true);
        $("#" + key + " select").attr("disabled", true);
        $("#" + key + " checkbox").attr("disabled", true);
        $("#" + key + " textarea").attr("disabled", true);
        $("#addBugBtn").attr("disabled", true);
    }
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
              +      '</table>';
    if (showType == "edit") {
        tabDivStr += '<div class="div_op_btn">'
                  +      '<button class="btn btn-info btn-sm" onclick="saveProejctSummaryInfo();">保存</button>'
                  +  '</div>';
    }
    tabDivStr +=  '</div>';
    $("#tabContentDiv").append(tabDivStr);
    //init多选的用户列表checkbox
    if (showType == "view") {
        $("#" + key + " input").attr("disabled", true);
        $("#" + key + " select").attr("disabled", true);
        $("#" + key + " checkbox").attr("disabled", true);
        $("#" + key + " textarea").attr("disabled", true);
    }
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
    $("#tabUl").append('<li showtype="view"><a href="#op_history_info_list" data-toggle="tab">操作日志</a></li>');
}

/**
* @Method: setUserName
* @Description: 设置隐藏的用户名称
* @param self 元素this对象
* @author pzhang
* @date 2017年8月30日
*/
function setUserName(self) {
    var userId = $(self).val();
    var elemId = $(self).attr("id");
    elemId = elemId.substring(0, elemId.length-3);
    $("#" + elemId).val($(self).find("option[value=" + userId + "]").text());
}

/**
* @Method: submitOrSaveProject
* @Description: 保存、审批通过、审批不通过操作
* @param opType 2：审批不通过，1：审批通过，0：保存
* @author pzhang
* @date 2017年8月30日
*/
function submitOrSaveProject(opType) {
    if (opType == "2") {
        var comments = $("#opComments").val().trim();
        var checkLabel1 = [{"labelname": "opComments", "request": "notNullBorderTips"}];
        if (!checkClick(checkLabel1)) {
            return false;
        }

        $("#reasonDialog").modal("hide");

        var operateMap = {
            "operator": $("#hidden_userId").attr("name"),
            "operator_id": $("#hidden_userId").val(),
            "operation": HSTPMVARS["ACTION"]["REJECT_APPROVE"],
            "comments": comments
        };
        var params = {};
        params["proj_info"] = "{}";
        params["project_id"] = $("#hidden_projectId").val();
        params["operate_info"] = JSON.stringify(operateMap);
        $.post("/hstpm/proj_sustain/project_op", params, function(data) {
            returnSubmitOrSaveProject(data, opType);
        }, 'json');
    } else {
        var checkLabel = [{
            "labelname": "owner_id,priority,runTemp,runTemp_mailTo_name,finishTemp,finishTemp_mailTo_name",
            "request": "notNullBorderTips"
        }];
        if (!checkClick(checkLabel)) {
            return false;
        }
        /*if (!/^(p|P)[0-5]$/).test($("#priority").val()) {
            setErrorMessage("priority", false, "优先级只能填写p0-p5或P0-P5!");
            return false;
        }*/
        if (!$("#priority").val().trim().match("^(p|P)[0-5]$")) {
            setErrorMessage("priority", false, "优先级只能填写p0-p5或P0-P5!");
            return false;
        }
        var elemId = "", index = "";
        var approveMap = {};
        for (var key in proj_info["approve_info_map"]) {
            index = key.indexOf("_val")
            if (index < 0) {
                elemId = key;
            } else {
                elemId = key.substring(0, index);
            }
            approveMap[key] = $("#" + elemId).val().trim();
        }
        var params = {};
        params["proj_info"] = JSON.stringify(approveMap);
        params["project_id"] = $("#hidden_projectId").val();
        if (opType == "0") {
            params["operator_id"] = $("#hidden_userId").val();
            $.post("/hstpm/proj_sustain/save_project", params, function(data) {
                returnSubmitOrSaveProject(data, opType);
            }, 'json');
        } else {
            var operateMap = {
                "operator": $("#hidden_userId").attr("name"),
                "operator_id": $("#hidden_userId").val(),
                "operation": HSTPMVARS["ACTION"]["PASS_APPROVE"]
            };

            params["operate_info"] = JSON.stringify(operateMap);
            $.post("/hstpm/proj_sustain/project_op", params, function(data) {
                returnSubmitOrSaveProject(data, opType);
            }, 'json');
        }
    }
}

/**
* @Method: returnSubmitOrSaveProject
* @Description: 保存、审批通过、审批不通过操作回调
* @param data
* @param opType 2：审批不通过，1：审批通过，0：保存
* @author pzhang
* @date 2017年8月30日
*/
function returnSubmitOrSaveProject(data, opType) {
    if (data.result == "-1") {
        modalDialog('error', data.message);
        return;
    }
    if (opType == "0") {
        window.location.reload();
    } else {
        window.location = "/hstpm/proj_sustain/own";
    }

}

/**
* @Method: showOrHideUser
* @Description: 显示或隐藏自定义下拉框
* @param elemId
* @author pzhang
* @date 2017年8月30日
*/
function showOrHideUser(elemId) {
    if ($("#" + elemId + "_userUlDiv").css("display") == "none") {
        $("#" + elemId + "_userUlDiv").css("display", "");
        if (curUlDiv != elemId) {
            charStr = "";
            lastCharStr = "";
            lastIndex = 0;
            timeOff = 0;
            curUlDiv = elemId;
            $(".index_li").removeClass("index_li");
        }
    } else {
        $("#" + elemId + "_userUlDiv").css("display", "none");
    }
}

/**
* @Method: initCheckedUser
* @Description: 初始化已经选择的用户勾选上
* @param elemIdList 所有的自定义下拉框
* @param checkedUserIdList 所有的用户ID列表
* @author pzhang
* @date 2017年8月30日
*/
function initCheckedUser(elemIdList, checkedUserIdList) {
    var checkedUserId = "";
    for (var i = 0; i < elemIdList.length; i++) {
        if (checkedUserIdList[i] == "") {
            continue;
        }
        checkedUserId = checkedUserIdList[i].split(";");
        for (var j = 0; j < checkedUserId.length; j++) {
            $("#" + elemIdList[i] + "_userUl input[value=" + checkedUserId[j] + "]").prop("checked", true);
        }
    }
}

/**
* @Method: openApproveReasonDialog
* @Description: 打开审批不通过原因弹出框
* @param param
* @author pzhang
* @date 2017年8月30日
*/
function openApproveReasonDialog() {
    $("#sureBtn").attr("onclick", "submitOrSaveProject(2)");
    $("#reasonDialog").modal("show");
}

/**
* @Method: openEvaluateReasonDialog
* @Description: 打开评估不通过原因弹出框
* @param param
* @author pzhang
* @date 2017年8月30日
*/
function openEvaluateReasonDialog() {
    $("#sureBtn").attr("onclick", "evaluateOrSaveProject(2)");
    $("#reasonDialog").modal("show");
}

/**
* @Method: evaluateOrSaveProject
* @Description: 评估不通过、评估通过、保存评估信息操作
* @param opType 2：评估不通过，1：评估通过，0：保存评估信息
* @author pzhang
* @date 2017年8月30日
*/
function evaluateOrSaveProject(opType) {
    if (opType == "2") {
        var comments = $("#opComments").val().trim();
        var checkLabel1 = [{"labelname": "opComments", "request": "notNullBorderTips"}];
        if (!checkClick(checkLabel1)) {
            return false;
        }

        $("#reasonDialog").modal("hide");

        var operateMap = {
            "operator": $("#hidden_userId").attr("name"),
            "operator_id": $("#hidden_userId").val(),
            "operation": HSTPMVARS["ACTION"]["REJECT_EVALUATE"],
            "comments": comments
        };
        var params = {};
        params["proj_info"] = "{}";
        params["project_id"] = $("#hidden_projectId").val();
        params["operate_info"] = JSON.stringify(operateMap);
        $.post("/hstpm/proj_sustain/project_op", params, function(data) {
            returnSubmitOrSaveProject(data, opType);
        }, 'json');
    } else {
        $(".error_border").removeClass("error_border");
        var checkLabel = [{
            "labelname": "projEstimateStartDate,projEstimateEndDate,projTesters_name,projSpendTime",
            "request": "notNullBorderTips"
        }];
        if (!checkClick(checkLabel)) {
            return;
        }

        var startDate = new Date($("#projEstimateStartDate").val().trim() + " 23:59:59");
        var endDate = new Date($("#projEstimateEndDate").val().trim()  + " 23:59:59");
        var curDate = new Date();
        if (startDate < curDate) {
            modalDialog("error", "预计开始时间不能小于当前时间！");
            showBorderTips("projEstimateStartDate", false);
            return;
        }
        if (endDate < curDate) {
            modalDialog("error", "预计结束时间不能小于当前时间！");
            showBorderTips("projEstimateEndDate", false);
            return;
        }
        if (startDate >= endDate) {
            modalDialog("error", "预计开始时间须小于预计结束时间！");
            return;
        }

        var elemId = "", index = "";
        var evaluateMap = {};
        for (var key in proj_info["evaluate_info_map"]) {
            index = key.indexOf("_val")
            if (index < 0) {
                elemId = key;
            } else {
                elemId = key.substring(0, index);
            }
            evaluateMap[key] = $("#" + elemId).val().trim();
        }
        var params = {};
        params["proj_info"] = JSON.stringify(evaluateMap);
        params["project_id"] = $("#hidden_projectId").val();
        if (opType == "0") {
            params["operator_id"] = $("#hidden_userId").val();
            $.post("/hstpm/proj_sustain/save_project", params, function(data) {
                returnEvaluateOrSaveProject(data, opType);
            }, 'json');
        } else {
            var operateMap = {
                "operator": $("#hidden_userId").attr("name"),
                "operator_id": $("#hidden_userId").val(),
                "operation": HSTPMVARS["ACTION"]["PASS_EVALUATE"]
            };

            params["operate_info"] = JSON.stringify(operateMap);
            $.post("/hstpm/proj_sustain/project_op", params, function(data) {
                returnEvaluateOrSaveProject(data, opType);
            }, 'json');
        }
    }
}

/**
* @Method: returnEvaluateOrSaveProject
* @Description: 评估不通过、评估通过、保存评估信息操作回调
* @param data
* @param opType 2：评估不通过，1：评估通过，0：保存评估信息
* @author pzhang
* @date 2017年8月30日
*/
function returnEvaluateOrSaveProject(data, opType) {
    if (data.result == "-1") {
        modalDialog('error', data.message);
        return;
    }
    if (opType == "0") {
        window.location.reload();
    } else {
        window.location = "/hstpm/proj_sustain/own";
    }
}

/**
* @Method: saveProjectSustainInfo
* @Description: 保存运维信息操作回调
* @param param
* @author pzhang
* @date 2017年8月30日
*/
function saveProjectSustainInfo() {
    var checkLabel = [{
            "labelname": "totalProgress",
            "request": "notNullBorderTips"
        }];
    if (!checkClick(checkLabel)) {
        $("html body").animate({scrollTop:0}, 50);
        return false;
    }



    var elemId = "", index = "";
    var sustainMap = {}
    for (var key in proj_info["sustain_info_map"]) {
        index = key.indexOf("_val")
        if (index < 0) {
            elemId = key;
        } else {
            if (key.indexOf("_map_") > -1) {
                sustainMap[key] = {};
                for (var tester in proj_info["sustain_info_map"][key]) {
                    elemId = tester;
                    sustainMap[key][tester] = $("#" + userMap[tester]).val().trim();
                }
                continue;
            } else if (key.indexOf("_mapList_") > -1) {
                var mapDiv = $("#bugMapListTd>div");
                var mapList = [];
                var divIndex = "", elemPrefix = "";
                var nullCheckFlag = true, checkLabel2 = "";
                mapDiv.each(function(){
                    divIndex = $(this).attr("id").split("_")[1];
                    if ($(this).attr("id").split("_")[0].indexOf("added") > -1) {
                        elemPrefix = "added_";
                    }
                    checkLabel2 = [{
                            "labelname": "id_" + elemPrefix + divIndex + ",status_" + elemPrefix + divIndex + ",intro_" + elemPrefix + divIndex,
                            "request": "notNullBorderTips"
                        }];
                    if (!checkClick(checkLabel2)) {
                        $("html body").animate({scrollTop:$("#bugMapListTd").offset().top-70}, 50);
                        nullCheckFlag = false;
                        return false;
                    }
                    var mapObj = {};
                    mapObj["id"] = $("#id_" + elemPrefix + divIndex).val().trim().replace(/_/g,'-').replace(/ /g, '-');
                    mapObj["status"] = $("#status_" + elemPrefix + divIndex).val().trim();
                    mapObj["intro"] = $("#intro_" + elemPrefix + divIndex).val().trim();
                    mapObj["comments"] = $("#comments_" + elemPrefix + divIndex).val().trim();
                    mapList.push(mapObj);
                });
                if (!nullCheckFlag) {
                    return;
                }
                sustainMap[key] = mapList;
                continue;
            } else {
                elemId = key.substring(0, index);
            }
        }
        sustainMap[key] = $("#" + elemId).val().trim();
    }
    var params = {};
    params["proj_info"] = JSON.stringify(sustainMap);
    params["project_id"] = $("#hidden_projectId").val();
    params["operator_id"] = $("#hidden_userId").val();

    $.post("/hstpm/proj_sustain/save_project", params, returnSaveProjectSustainInfo, 'json');
}

/**
* @Method: returnSaveProjectSustainInfo
* @Description: 保存运维信息操作回调
* @param data
* @author pzhang
* @date 2017年8月30日
*/
function returnSaveProjectSustainInfo(data) {
    if (data.result == "-1") {
        modalDialog('error', data.message);
        return;
    }
    window.location.reload();
}

/**
* @Method: saveProejctSummaryInfo
* @Description: 保存总结信息操作
* @param param
* @author pzhang
* @date 2017年8月30日
*/
function saveProejctSummaryInfo() {
    var checkLabel = [{
            "labelname": "summary",
            "request": "notNull"
        }];
    if (!checkClick(checkLabel)) {
        return false;
    }

    var elemId = "", index = "";
    var summaryMap = {};
    for (var key in proj_info["summary_info_map"]) {
        index = key.indexOf("_val")
        if (index < 0) {
            elemId = key;
        } else {
            elemId = key.substring(0, index);
        }
        summaryMap[key] = $("#" + elemId).val().trim();
    }
    var params = {};
    params["proj_info"] = JSON.stringify(summaryMap);
    params["project_id"] = $("#hidden_projectId").val();
    params["operator_id"] = $("#hidden_userId").val();

    $.post("/hstpm/proj_sustain/save_project", params, returnSaveProejctSummaryInfo, 'json');
}

/**
* @Method: returnSaveProejctSummaryInfo
* @Description: 保存总结信息操作回调
* @param data
* @author pzhang
* @date 2017年8月30日
*/
function returnSaveProejctSummaryInfo(data) {
    if (data.result == "-1") {
        modalDialog('error', data.message);
        return;
    }
    window.location.reload();
}

/**
 * @Method: getMailTemplateContent
 * @Description: 查看邮件模板内容
 * @param self 当前点击的查看按钮
 * @param type 表示是哪一种类型模板：运维模板、结束模板
 * @return void
 * @author yhguo
 * @date 2017年8月29
*/
function getMailTemplateContent (self, type) {
    var templateId = $(self).siblings().find("option:selected").val();
    var params = {};
    params['template_id'] = templateId;

    $.get("/hstpm/proj_sustain/view_template", params, returnGetMailTemplateContent.bind(this, type), 'json');
}

/**
 * @Method: returnGetMailTemplateContent
 * @Description: 查看邮件模板内容ajax回调
 * @param type 表示是哪一种类型模板：运维模板、结束模板
 * @param data ajax从后台获取到的数据
 * @return void
 * @author yhguo
 * @date 2017年8月29
*/
function returnGetMailTemplateContent (type, data) {
    var content = JSON.stringify(data.rcdata);
    content = content.replace(new RegExp('\"', 'g'), '')
                     .replace(/\\n/g, '<br>')
                     .replace(/\\t/g, '&nbsp;');

    if (data.result == '-1') {
        modalDialog('error', data.message);
        return;
    }
//    modalDialog('info', content);
    var title = '';
    if (type == 'sustain') {
        title = '查看运维邮件模板';
    } else if (type = 'end') {
        title = '查看结束邮件模板';
    }
    $('#viewTemplateDialog .modal-title').empty().append(title);
    $('#viewTemplateDialog .modal-body').empty().append(content);
    $('#viewTemplateDialog').modal('show');
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

var charStr = "";
var lastCharStr = "", lastIndex = 0;
var timeOff = 0;
var curUlDiv = "";
var timeOutEvent = "";

/**
* @Method: indexUser
* @Description: 索引搜索自定义用户多选下拉列表
* @param evt event对象
* @param elemId 元素ID
* @author pzhang
* @date 2017年8月30日
*/
function indexUser(evt, elemId) {
    var evt = window.event?window.event:evt;
    var char = String.fromCharCode(evt.keyCode).toLowerCase();

    if(evt.keyCode==13) {
        charStr = lastCharStr;
        searchIndex(elemId);
        return;
    }

    var curTime = new Date().getTime();
    if (curTime - timeOff > 500) {
        timeOff = curTime;
        charStr = char;
        timeOutEvent = setTimeout("searchIndex('" + elemId + "')",500);
    } else {
        charStr += char;
        clearTimeout(timeOutEvent);
        timeOutEvent = setTimeout("searchIndex('" + elemId + "')",500);
    }
    //charStr = evt;
}
function searchIndex(elemId) {
    var uList = [];
    if (elemId == "projTesters_userUlDiv") {
        uList = testUserList;
    } else {
        uList = userList;
    }

    // 连续搜索一样的字符时，继续往下搜索
    var startIndex = -1;
    if (charStr == lastCharStr) {
        startIndex = lastIndex;
    }

    var containerOffTop = $("#" + elemId).offset().top, indexOffTop = 0, moveTop = 0;
    var height = containerOffTop + $("#" + elemId).height() -30;
    for (var i = startIndex+1; i < uList.length; i++) {
        if (uList[i].showname.toLowerCase().indexOf(charStr) == 0) {
            $(".index_li").removeClass("index_li");
            // 索引到的li的offset top
            indexOffTop = $($("#" + elemId).find("li")[i]).offset().top;
            moveTop = indexOffTop - height + $("#" + elemId).scrollTop();
            $("#" + elemId).scrollTop(moveTop);
            $($("#" + elemId).find("li")[i]).addClass("index_li");

            lastCharStr = charStr;
            lastIndex = i;
            return;
        }
    }
    lastIndex = -1;
}

/**
* @Method: clearLassIndex
* @Description: 清除历史索引
* @param self li对象this
* @author pzhang
* @date 2017年8月30日
*/
function clearLassIndex(self) {
    $(".index_li").removeClass("index_li");
    $(self).addClass("index_li");
    lastIndex = $(".index_li").index();
}

var addedBugIndex = 0;

function addBug() {
    var bugMapListStr = "";
    bugMapListStr += '<hr>'
                  +  '<div id="addedBugDiv_' + addedBugIndex + '" class="div_addedBug">'
                  +      '<button class="close" aria-hidden="true" onclick="deleteBugDiv(' + addedBugIndex + ');" title="删除bug"><span class="glyphicon glyphicon-remove"></span></button>'
                  +      '<table class="tb_bug">'
                  +          '<tr>'
                  +              '<td class="td_label">bug ID</td>'
                  +              '<td><input id="id_added_' + addedBugIndex + '" value=""><span class="text-danger">*</span></td>'
                  +              '<td class="td_label">状态</td>'
                  +              '<td><input id="status_added_' + addedBugIndex + '" value=""><span class="text-danger">*</span></td>'
                  +          '</tr>'
                  +          '<tr>'
                  +              '<td class="td_label">简介</td>'
                  +              '<td colspan="3"><input id="intro_added_' + addedBugIndex + '" style="width: 90%;" value=""><span class="text-danger">*</span></td>'
                  +          '</tr>'
                  +          '<tr>'
                  +              '<td class="td_label" style="vertical-align: top;">备注</td>'
                  +              '<td colspan="4" style="vertical-align: middle;"><textarea id="comments_added_' + addedBugIndex + '"></textarea>&nbsp;&nbsp;</td>'
                  +          '</tr>'
                  +      '</table>'
                  +  '</div>';
    if ($("#bugMapListTd>div").length == 0) {
        bugMapListStr = bugMapListStr.substring(4, bugMapListStr.length);
    }
    $("#bugMapListTd").append(bugMapListStr);
    if ($(".div_bug_map").css("border-width") == "0px") {
        $(".div_bug_map").css("border", "1px solid #ccc");
    }
    addedBugIndex++;
}

function deleteBugDiv(divIndex) {
    if ($("#addedBugDiv_" + divIndex).length == 0) {
        if ($("#bugDiv_" + divIndex).next().length > 0) {
            $("#bugDiv_" + divIndex).next().remove();
        } else {
            $("#bugDiv_" + divIndex).prev().remove();
        }
        $("#bugDiv_" + divIndex).remove();
    } else {
        if ($("#addedBugDiv_" + divIndex).next().length > 0) {
            $("#addedBugDiv_" + divIndex).next().remove();
        } else {
            $("#addedBugDiv_" + divIndex).prev().remove();
        }
        $("#addedBugDiv_" + divIndex).remove();
    }
    if ($("#bugMapListTd>div").length == 0) {
        $(".div_bug_map").css("border", "0 solid #ccc");
    }
}

/**
* @Method: saveApproveInfo
* @Description: 保存项目的审批信息
* @param projectId 项目ID
* @author pzhang
* @date 2017年8月30日
*/
function saveApproveInfo() {
    var checkLabel = [{
            "labelname": "owner_id,priority,runTemp,runTemp_mailTo_name,finishTemp,finishTemp_mailTo_name",
            "request": "notNullBorderTips"
    }];
    if (!checkClick(checkLabel)) {
        return false;
    }

    if (!$("#priority").val().trim().match("^(p|P)[0-5]$")) {
        setErrorMessage("priority", false, "优先级只能填写p0-p5或P0-P5!");
        return false;
    }

    var elemId = "", index = "";
    var approveMap = {};
    for (var key in proj_info["approve_info_map"]) {
        index = key.indexOf("_val")
        if (index < 0) {
            elemId = key;
        } else {
            elemId = key.substring(0, index);
        }
        approveMap[key] = $("#" + elemId).val().trim();
    }
    var params = {};
    params["approve_info_map"] = JSON.stringify(approveMap);
    params["project_id"] = $("#hidden_projectId").val();
    $.post("/hstpm/proj_mgmt/save_approve_info", params, returnSaveApproveInfo, 'json');
}

/**
* @Method: returnSaveApproveInfo
* @Description: 保存项目的审批信息回调
* @param data
* @author pzhang
* @date 2017年8月30日
*/
function returnSaveApproveInfo(data) {
    if (data.result == -1) {
        modalDialog('error', data.message);
        return;
    }
    modalDialog('info', "保存审批成功！");
    window.location.reload();
}

