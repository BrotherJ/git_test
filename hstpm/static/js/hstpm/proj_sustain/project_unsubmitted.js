/*
项目运维-项目查询页面相关js
pzhang
2017.8.11
*/

$(document).ready(function() {
    initDraftStatusSelect();
    initDateRangePicker();
    searchUnSubmittedProjectList(1);
});


/**
 * @Method: initDraftStatusSelect
 * @Description: 初始化状态信息
 * @return void
 * @author yhguo
 * @date 2017年8月18
*/
function initDraftStatusSelect () {
    var draft = HSTPMVARS["STATUS"]["DRAFT"] = "草稿";
    var approveFail = HSTPMVARS["STATUS"]["APPROVE_FAIL"] = "审批退回";
    var evaluateFail = HSTPMVARS["STATUS"]["EVALUATE_FAIL"] = "评估退回";
    var optionStr = '<option value="">项目状态</option>';
    optionStr += '<option value="'+draft+'">'+draft+'</option>'
              +  '<option value="'+approveFail+'">'+approveFail+'</option>'
              +  '<option value="'+evaluateFail+'">'+evaluateFail+'</option>'
    $('#statusSelect').empty().append(optionStr);
}


/**
 * @Method: searchUnSubmittedProjectList
 * @Description: 搜索我的待提交项目
 * @param type 第几页
 * @return void
 * @author yhguo
 * @date 2017年8月18
*/
function searchUnSubmittedProjectList (type) {
    var project_param = {};
    project_param['project_name'] = $('#nameInput').val().trim();
    var create_time = $("#createTimeInput").val().trim();
    if (create_time != "" && !(create_time.match("^[0-9]{4}\-[0-9]{2}\-[0-9]{2}$") || create_time.match("^[0-9]{4}\-[0-9]{2}\-[0-9]{2}\/[0-9]{4}\-[0-9]{2}\-[0-9]{2}$"))) {
        modalDialog('warning', '错误的日期格式，请输入正确的日期格式如：YYYY-MM-DD或YYYY-MM-DD/YYYY-MM-DD！');
        return;
    }
    project_param['create_time'] = create_time;
    project_param['status'] = $('#statusSelect').val().trim();
    project_param['creator'] = $('#hidden_userId').val().trim();
    project_param['noDrafFlag'] = '0';/*查询 draft ， approveFail ， evaluteFail 状态的项目*/

    var params = {};
    params['project_param'] = JSON.stringify(project_param);
    params['pageinfo_param'] = JSON.stringify(getPageInfoDict(type));

    $.get('/hstpm/proj_sustain/search_proj', params, returnSearchUnSubmittedProjectList, 'json');
}

/**
 * @Method: returnSearchUnSubmittedProjectList
 * @Description: 搜索我的待提交项目列表ajax回调
 * @param data 后台返回的数据
 * @return void
 * @author yhguo
 * @date 2017年8月18
*/
function returnSearchUnSubmittedProjectList (data) {
    if (data.result == -1 || data.project_list_info == false) {
        modalDialog('error', data.message);
        return;
    }
    var projectList = data.rcdata.project_list_info;
    var pageInfo = data.rcdata.page_info;
    var trStr = '';
    for (var i = 0, len = projectList.length; i < len; i++) {
        var projectSingle = projectList[i];
        var operateStr = "";
        operateStr  += '<div class="div_operate">'
                    +     '<button class="btn btn-primary btn-xs">'
                    +         '<span class="glyphicon glyphicon-triangle-left" aria-hidden="true"></span>'
                    +         '<a href="/hstpm/proj_sustain/apply?project_id=' + projectSingle.project_id + '">编辑</a>'
                    +     '</button>'
                    +     '<div>'
                    +         '<button class="btn btn-danger btn-xs" onclick="openConfirmDialog(' + projectSingle.project_id + ', \'' + projectSingle.project_name + '\')">删除</button>'
                    +     '</div>'
                    + '</div>';
        trStr += '<tr id="tr_' + projectSingle.project_id + '">'
              +      '<td>' + projectSingle.project_id + '</td>'
              +      '<td><a href="/hstpm/proj_sustain/query_view?project_id=' + projectSingle.project_id + '&active_menu=unsubmitted">' + projectSingle.project_name + '</a></td>'
              +      '<td>' + projectSingle.create_time + '</td>'
              +      '<td>' + projectSingle.status + '</td>'
              +      '<td style="text-align: left;padding-left:10px;">' + projectSingle.test_content.replace(/\n/g, "<br>").replace(/\t/g, "&nbsp;&nbsp;") + '</td>'
              +      '<td>' + projectSingle.owner + '</td>'
              +      '<td>' + projectSingle.priority + '</td>'
              +      '<td style="text-align: left; padding-left: 10px;">' + projectSingle.evaluete_risk.replace(/\n/g, "<br>").replace(/\t/g, "&nbsp;&nbsp;") + '</td>'
              +      '<td>' + operateStr + '</td>';
    }
    if (trStr == '') {
        trStr = '<tr><td class="text-warning" colspan="9">暂无项目记录</td></tr>';
    }
    $("#tableUnsubmittedList tbody").empty().append(trStr);

    operateHover();//只有在异步append()元素之后才能去初始化元素事件和操作按钮样式
    initDivMoreOperatePosition();//只有在异步append()元素之后才能去初始化元素事件和操作按钮样式

    $("#pageSize").val(pageInfo.page_size);
    $("#totalPage").text(pageInfo.total_page);
    $("#totalRecord").text(pageInfo.total_record);
    $("#currentPage").val(pageInfo.current_page);
    $("#firstPage").attr("onclick", "searchUnSubmittedProjectList(1);");
    $("#lastPage").attr("onclick", "searchUnSubmittedProjectList(" + pageInfo.total_page + ");");
    $("#nextPage").attr("onclick", "searchUnSubmittedProjectList(" + pageInfo.next_page+ ");");
    $("#previousPage").attr("onclick", "searchUnSubmittedProjectList(" + pageInfo.previous_page + ");");
}

/**
 * @Method: openConfirmDialog
 * @Description: 删除我的待提交项目弹出模态框
 * @param projectId 项目id
 * @param projectName 项目名称
 * @return void
 * @author yhguo
 * @date 2017年8月18
*/
function openConfirmDialog(projectId, projectName) {
    modalDialog("confirm", "确定删除项目：" + projectName + "?", "deleteProject(" + projectId + ")");
}

/**
 * @Method: deleteProject
 * @Description: 删除我的待提交项目
 * @param projectId 项目id
 * @return void
 * @author yhguo
 * @date 2017年8月18
*/
function deleteProject (projectId) {
    var operateMap = {
        "operator": $("#hidden_userId").attr("name"),
        "operator_id": $("#hidden_userId").val(),
        "operation": HSTPMVARS["ACTION"]["DELETE"]
    };
    var params = {};
    params["proj_info"] = "{}";
    params["project_id"] = projectId;
    params["operate_info"] = JSON.stringify(operateMap);
    $.post("/hstpm/proj_sustain/project_op", params, returnDeleteProject, 'json');
}

/**
 * @Method: returnDeleteProject
 * @Description: 删除我的待提交项目ajax回调
 * @param data 后台返回的数据
 * @return void
 * @author yhguo
 * @date 2017年8月18
*/
function returnDeleteProject(data) {
    if (data.result == -1 || data.project_list_info == false) {
        modalDialog('error', data.message);
        return;
    }
    searchUnSubmittedProjectList('currentpage');
}