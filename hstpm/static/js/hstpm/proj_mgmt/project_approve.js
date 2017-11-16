/*
项目管理-项目审批页面相关js
pzhang
2017.8.11
*/
var userList = [];
var approveInfoMap = {};

$(document).ready(function() {
    initStatusSelect();
    initDateRangePicker();
    searchProjectList(1);

    userList = JSON.parse($("#hidden_userList").val());

    setUserListShowOrHide();

    addFocusEvent(document.getElementById('runTemp_mailTo_userDiv'), function(e){});
    addFocusEvent(document.getElementById('runTemp_mailCC_userDiv'), function(e){});
    addFocusEvent(document.getElementById('finishTemp_mailTo_userDiv'), function(e){});
    addFocusEvent(document.getElementById('finishTemp_mailCC_userDiv'), function(e){});

});

/**
* @Method: setUserListShowOrHide
* @Description: 为自定义的下拉框写全局点击事件
* @param
* @author pzhang
* @date 2017年8月30日
*/
function setUserListShowOrHide() {
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
 * @Method: searchProjectList
 * @Description: 搜索我负责的项目列表
 * @param type 第几页
 * @return void
 * @author yhguo
 * @date 2017年8月18
*/
function searchProjectList (type) {
    var project_param = {};
    project_param['project_name'] = $('#nameInput').val().trim();
    project_param['status'] = $('#statusSelect option:checked').val().trim();
    project_param['creator'] = $('#creatorSelect option:checked').val();
    project_param['owner'] = $('#ownerSelect').val();
    project_param['priority'] = $('#prioritySelect').val().trim();
    var create_time = $("#createTimeInput").val().trim();
    if (create_time != "" && !(create_time.match("^[0-9]{4}\-[0-9]{2}\-[0-9]{2}$") || create_time.match("^[0-9]{4}\-[0-9]{2}\-[0-9]{2}\/[0-9]{4}\-[0-9]{2}\-[0-9]{2}$"))) {
        modalDialog('warning', '错误的日期格式，请输入正确的日期格式如：YYYY-MM-DD或YYYY-MM-DD/YYYY-MM-DD！');
        return;
    }
    project_param['create_time'] = create_time;
    project_param['noDrafFlag'] = '1';/*查询 not draft 状态的所有项目*/

    var params = {};
    params['project_param'] = JSON.stringify(project_param);
    params['pageinfo_param'] = JSON.stringify(getPageInfoDict(type));

    $.get('/hstpm/proj_sustain/search_proj', params, returnSearchProjectList, 'json');
}

/**
 * @Method: returnSearchProjectList
 * @Description: 搜索我负责的项目列表ajax回调
 * @param data 后台返回的数据
 * @return void
 * @author yhguo
 * @date 2017年8月18
*/
function returnSearchProjectList (data) {
    if (data.result == -1) {
        modalDialog('error', data.message);
        return;
    }
    var projectList = data.rcdata.project_list_info;
    var pageInfo = data.rcdata.page_info;
    var trStr = '';
    for (var i = 0, len = projectList.length; i < len; i++) {
        var projectSingle = projectList[i];
        var creator = projectSingle.creator == null ? '' : projectSingle.creator;
        var start_time = projectSingle.start_time == 'None' ? '--' : projectSingle.start_time;
        var finish_time = projectSingle.finish_time == 'None' ? '--' : projectSingle.finish_time;
        var risk = projectSingle.summary_risk;
        if (risk == '') {
            risk = projectSingle.sustain_risk;
            if (risk == '') {
                risk = projectSingle.evaluete_risk;
            }
        }
        var status = projectSingle.status;
        var operate = '';
        if (status == HSTPMVARS["STATUS"]["APPROVE_PENDING"]) {//待审批
            operate = '<a class="btn btn-primary btn-xs" href="/hstpm/proj_sustain/own_edit?project_id=' + projectSingle.project_id + '">审批</a>'

        } else {
            operate += '<button class="btn btn-info btn-xs" onclick="getProjectInfo(' + projectSingle.project_id + ');">修改</button>';

        }

        trStr += '<tr id="tr_' + projectSingle.project_id + '">'
              +      '<td>' + projectSingle.project_id + '</td>';
        if (status == HSTPMVARS["STATUS"]["SUSPENDED"]) {
            trStr += '<td><a href="/hstpm/proj_sustain/query_view?project_id=' + projectSingle.project_id + '">' + projectSingle.project_name + '</a></td>';
        } else {
            trStr += '<td><a href="/hstpm/proj_sustain/own_edit?project_id=' + projectSingle.project_id + '">' + projectSingle.project_name + '</a></td>';
        }
        trStr +=     '<td>' + projectSingle.create_time + '</td>'
              +      '<td>' + status + '</td>'
              +      '<td>' + creator + '</td>'
              +      '<td>' + projectSingle.owner + '</td>'
              +      '<td style="text-align: left; padding-left: 10px;">' + risk.replace(/\n/g, "<br>").replace(/\t/g, "&nbsp;&nbsp;") + '</td>'
              +      '<td>' + start_time + '</td>'
              +      '<td>' + finish_time + '</td>'
              +      '<td>' + operate + '</td>';
    }
    if (trStr == '') {
        trStr = '<tr><td class="text-warning" colspan="10">没有记录</td></tr>';
    }
    $("#tableOwnProjectList tbody").empty().append(trStr);
    operateHover();//只有在异步append()元素之后才能去初始化元素事件和操作按钮样式
    initDivMoreOperatePosition();//只有在异步append()元素之后才能去初始化元素事件和操作按钮样式

    $("#pageSize").val(pageInfo.page_size);
    $("#totalPage").text(pageInfo.total_page);
    $("#totalRecord").text(pageInfo.total_record);
    $("#currentPage").val(pageInfo.current_page);
    $("#firstPage").attr("onclick", "searchProjectList(1);");
    $("#lastPage").attr("onclick", "searchProjectList(" + pageInfo.total_page + ");");
    $("#nextPage").attr("onclick", "searchProjectList(" + pageInfo.next_page+ ");");
    $("#previousPage").attr("onclick", "searchProjectList(" + pageInfo.previous_page + ");");
}

/**
* @Method: getProjectInfo
* @Description: 获取项目信息map
* @param projectId 项目ID
* @author pzhang
* @date 2017年8月30日
*/
function getProjectInfo(projectId) {
    var params = {};
    params["project_id"] = projectId;
    $.get("/hstpm/proj_sustain/get_project_info", params, function(data) {
        returnGetProjectInfo(data, projectId);
    }, 'json');
}

/**
* @Method: returnGetProjectInfo
* @Description: 获取项目信息map回调
* @param data
* @param projectId
* @author pzhang
* @date 2017年8月30日
*/
function returnGetProjectInfo(data, projectId) {
    approveInfoMap = data.rcdata["approve_info_map"];
    for(key in approveInfoMap) {
        index = key.indexOf("_val")
        if (index < 0) {
            elemId = key;
        } else {
            elemId = key.substring(0, index);
        }
        $("#" + elemId).val(approveInfoMap[key]);

        //设置自定义下拉框默认勾选选项
        var elemIdList = ["runTemp_mailTo", "runTemp_mailCC", "finishTemp_mailTo", "finishTemp_mailCC"];
        var checkedUserIdList = [approveInfoMap["runTemp_mailTo_id"], approveInfoMap["runTemp_mailCC_id"],
                                   approveInfoMap["finishTemp_mailTo_id"], approveInfoMap["finishTemp_mailCC_id"]];
        initCheckedUser(elemIdList, checkedUserIdList);

        $("#sureBtn").attr("onclick", "saveApproveInfo(" + projectId + ")");
        $("#editApproveInfoDialog").modal("show");
    }
}

/**
* @Method: initCheckedUser
* @Description: 初始化已经选择的用户勾选上
* @param elemIdList 元素ID
* @param checkedUserIdList 用户ID列表
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
* @Method: saveApproveInfo
* @Description: 保存项目的审批信息
* @param projectId 项目ID
* @author pzhang
* @date 2017年8月30日
*/
function saveApproveInfo(projectId) {
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
    for (var key in approveInfoMap) {
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
    params["project_id"] = projectId;
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
    modalDialog('info', "保存成功！");
    $("#editApproveInfoDialog").modal("hide");
    searchProjectList('currentpage');
}

/**
* @Method: showOrHideUser
* @Description: 显示或隐藏自定义的下拉框
* @param elemId 区分是哪个自定义的下拉框
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
* @Method: setCheckedShow
* @Description: 勾选中的用户显示用户名
* @param self 元素的this对象
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

var charStr = "";
var lastCharStr = "", lastIndex = 0;
var timeOff = 0;
var curUlDiv = "";

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

    var curTime = new Date().getTime();
    if (curTime - timeOff > 500) {
        timeOff = curTime;
        charStr = char;
    } else {
        charStr += char;
    }
    // 连续搜索一样的字符时，继续往下搜索
    var startIndex = -1;
    if (charStr == lastCharStr) {
        startIndex = lastIndex;
    }

    var containerOffTop = $("#" + elemId).offset().top, indexOffTop = 0, moveTop = 0;
    var height = containerOffTop + $("#" + elemId).height() -30;
    for (var i = startIndex+1; i < userList.length; i++) {
        if (userList[i].showname.toLowerCase().indexOf(charStr) == 0) {
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