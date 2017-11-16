/*
项目运维-我负责的项目页面相关js
pzhang
2017.8.11
*/

$(document).ready(function() {
    initStatusSelect();
    initDateRangePicker();
    searchOwnProjectList(1);
});

/**
 * @Method: searchOwnProjectList
 * @Description: 搜索我负责的项目列表
 * @param type 第几页
 * @return void
 * @author yhguo
 * @date 2017年8月18
*/
function searchOwnProjectList (type) {
//    $('#ajaxLoadingGif').modal({show: true});
    var project_param = {};
    project_param['project_name'] = $('#nameInput').val().trim();
    project_param['status'] = $('#statusSelect').val().trim();
    project_param['creator'] = $('#creatorSelect').val();

    var adminRoleId = HSTPMVARS["ADIMIN"]["ROLEID"];
    var currentUserRoleId = $('#hidden_userRoleId').val().trim();
    if (currentUserRoleId == adminRoleId) {/*如果当前用户是管理员，可以查看所有负责人的项目，owner参数传空*/
        project_param['owner'] = $('#ownerSelect').val();
    } else {/*如果当前用户是游客，只能查看自己负责的项目，owner参数就是当前用户自己*/
        project_param['owner'] = $('#hidden_userId').val().trim();
    }
//    project_param['owner'] = $('#hidden_userId').val().trim();

//    project_param['tester'] = $('#testerSelect').val();
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

    $.get('/hstpm/proj_sustain/search_proj', params, returnSearchOwnProjectList, 'json');
}

/**
 * @Method: returnSearchOwnProjectList
 * @Description: 搜索我负责的项目列表ajax回调
 * @param data 后台返回的数据
 * @return void
 * @author yhguo
 * @date 2017年8月18
*/
function returnSearchOwnProjectList (data) {
//    $('#ajaxLoadingGif').modal('toggle');
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

        if (status == HSTPMVARS["STATUS"]["RUNNING"]) { //正在运行状态==========终止|挂起|发送报告
            operate += '<div class="div_operate">'
                    +     '<button class="btn btn-primary btn-xs" onclick="sendReport(' + projectSingle.project_id + ');">'
                    +         '<span class="glyphicon glyphicon-triangle-left" aria-hidden="true"></span>'
                    +         '发送报告'
                    +     '</button>'
                    +     '<div>'
                    +         '<button class="btn btn-danger btn-xs" onclick="openReasonDialog(\'suspend\', ' + projectSingle.project_id + ', \'' + projectSingle.project_name + '\');">挂起</button>'
                    +         '<button class="btn btn-danger btn-xs" onclick="openReasonDialog(\'finish\', ' + projectSingle.project_id + ', \'' + projectSingle.project_name + '\');">终止</button>'
                    +     '</div>'
                    + '</div>';
        } else if (status == HSTPMVARS["STATUS"]["RUN_PENDING"]) { //待运行状态===========开始|终止
            operate += '<div class="div_operate">'
                    +     '<button type="button" class="btn btn-primary btn-xs" onclick="operateProject(\'start\', ' + projectSingle.project_id + ', \'' + projectSingle.project_name + '\');">'
                    +         '<span class="glyphicon glyphicon-triangle-left" aria-hidden="true"></span>'
                    +         '开始'
                    +     '</button>'
                    +     '<div>'
                    +         '<button class="btn btn-danger btn-xs" onclick="openReasonDialog(\'finish\', ' + projectSingle.project_id + ', \'' + projectSingle.project_name + '\');"">终止</button>'
                    +     '</div>'
                    + '</div>';
        } else if (status == HSTPMVARS["STATUS"]["SUSPENDED"]) { //挂起状态==============开始
            operate += '<button type="button" class="btn btn-primary btn-xs" onclick="operateProject(\'start\', ' + projectSingle.project_id + ', \'' + projectSingle.project_name + '\');">开始</button>'
        } else if (status == HSTPMVARS["STATUS"]["FINISH"]) {
            //operate += '<button type="button" class="btn btn-danger btn-xs" onclick="openConfirmDialog(\'delete\', ' + projectSingle.project_id + ', \'' + projectSingle.project_name + '\');">删除</button>'
            operate += '<div class="div_operate">'
                    +     '<button class="btn btn-primary btn-xs" onclick="sendReport(' + projectSingle.project_id + ');">'
                    +         '<span class="glyphicon glyphicon-triangle-left" aria-hidden="true"></span>'
                    +         '发送报告'
                    +     '</button>'
                    +     '<div>'
                    +         '<button class="btn btn-danger btn-xs" onclick="openConfirmDialog(\'delete\', ' + projectSingle.project_id + ', \'' + projectSingle.project_name + '\');">删除</button>'
                    +     '</div>'
                    + '</div>';
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
        trStr = '<tr><td class="text-warning" colspan="10">暂无项目记录</td></tr>';
    }
    $("#tableOwnProjectList tbody").empty().append(trStr);
    operateHover();//只有在异步append()元素之后才能去初始化元素事件和操作按钮样式
    initDivMoreOperatePosition();//只有在异步append()元素之后才能去初始化元素事件和操作按钮样式

    $("#pageSize").val(pageInfo.page_size);
    $("#totalPage").text(pageInfo.total_page);
    $("#totalRecord").text(pageInfo.total_record);
    $("#currentPage").val(pageInfo.current_page);
    $("#firstPage").attr("onclick", "searchOwnProjectList(1);");
    $("#lastPage").attr("onclick", "searchOwnProjectList(" + pageInfo.total_page + ");");
    $("#nextPage").attr("onclick", "searchOwnProjectList(" + pageInfo.next_page+ ");");
    $("#previousPage").attr("onclick", "searchOwnProjectList(" + pageInfo.previous_page + ");");
}

function openConfirmDialog(opType, projectId, projectName) {
    modalDialog("confirm", "确定删除项目：" + projectName + "?", "operateProject('" + opType + "', " + projectId + ", '" + projectName + "')");
}

/**
 * @Method: startProject
 * @Description: 项目操作
 * @param opType 操作类型
 * @param projectId 项目ID
 * @param projectName 项目名称
 * @return void
 * @author pzhang
 * @date 2017年8月18
*/
function operateProject(opType, projectId, projectName) {


    var operateMap = {
        "operator": $("#hidden_userId").attr("name"),
        "operator_id": $("#hidden_userId").val(),
    };

    var operation = "";
    if (opType == "start") {
        operation = HSTPMVARS["ACTION"]["START_RUN"];
    } else if (opType == "delete") {
        operation = HSTPMVARS["ACTION"]["DELETE"];
    } else {
        var comments = $("#opComments").val().trim();
        var checkLabel1 = [{"labelname": "opComments", "request": "notNull"}];
        if (!checkClick(checkLabel1)) {
            return false;
        }

        $("#reasonDialog").modal("hide");

        operateMap["comments"] = comments;
        if (opType == "finish") {
            operation = HSTPMVARS["ACTION"]["TERMINATE_RUN"];
        } else {
            operation = HSTPMVARS["ACTION"]["SUSPEND_RUN"];
        }
    }

    operateMap["operation"] = operation;
    var params = {};
    params["proj_info"] = "{}";
    params["project_id"] = projectId;
    params["operate_info"] = JSON.stringify(operateMap);
    $.post("/hstpm/proj_sustain/project_op", params, function(data) {
        returnOperateProject(data, projectName, opType);
    }, 'json');
}

/**
 * @Method: returnOperateProject
 * @Description: 项目操作回调
 * @param projectId 项目ID
 * @return void
 * @author pzhang
 * @date 2017年8月18
*/
function returnOperateProject(data, projectName, opType) {
    if (data.result == -1) {
        modalDialog('error', data.message);
        return;
    }
    if(opType == "start") {
        modalDialog('info', "项目--" + projectName + " 已成功开始，请点击列表中项目名称进入详情页面，查看或更新项目测试进度！");
    } else if (opType == "finish") {
        modalDialog("info", "项目--" + projectName + " 已经成功结束，点击列表中项目名称进入详情页面，可以填写项目总结！");
    } else if (opType == "start"){
        modalDialog("info", "项目--" + projectName + " 已经成功挂起，可点击“开始”按钮继续运行！");
    } else if (opType == "delete") {
        modalDialog("info", "项目--" + projectName + " 删除成功！");
    }

    searchOwnProjectList('currentpage');
}

/**
* @Method: openReasonDialog
* @Description: 打开原因弹出框
* @param opType 1：提交，0：保存
* @param projectId 项目ID
* @param projectName 项目名称
* @author pzhang
* @date 2017年8月30日
*/
function openReasonDialog(opType, projectId, projectName) {
    $("#sureBtn").attr("onclick", "operateProject('" + opType + "', '" + projectId + "', '" + projectName + "')");
    $("#reasonDialog").modal("show");
}

/**
* @Method: sendReport
* @Description: 发送报告
* @param projectId 项目ID
* @author pzhang
* @date 2017年8月30日
*/
function sendReport(projectId) {
    var operateMap = {
        "operator": $("#hidden_userId").attr("name"),
        "operator_id": $("#hidden_userId").val(),
        "operation": HSTPMVARS["ACTION"]["SEND_REPORT"]
    };
    var params = {};
    params["proj_info"] = "{}";
    params["project_id"] = projectId;
    params["operate_info"] = JSON.stringify(operateMap);
    $.post("/hstpm/proj_sustain/project_op", params, returnSendReport, 'json');
}

/**
* @Method: returnSendReport
* @Description: 发送报告回调
* @param data
* @author pzhang
* @date 2017年8月30日
*/
function returnSendReport(data) {
    if (data.result == -1) {
        modalDialog('error', data.message);
        return;
    }
    modalDialog('info', "发送报告邮件成功，请至邮箱查看！");
}