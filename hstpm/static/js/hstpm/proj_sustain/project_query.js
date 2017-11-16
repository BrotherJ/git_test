/*
项目运维-项目查询页面相关js
pzhang
2017.8.11
*/

$(document).ready(function() {
    initStatusSelect();
    initDateRangePicker();
    searchProjectList(1);
});

/**
 * @Method: searchProjectList
 * @Description: 搜索所有项目列表
 * @param type 第几页
 * @return void
 * @author yhguo
 * @date 2017年8月18
*/
function searchProjectList (type) {
    var project_param = {};
    project_param['project_name'] = $('#nameInput').val().trim();
    project_param['status'] = $('#statusSelect').val().trim();
    project_param['creator'] = $('#creatorSelect').val();
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
 * @Description: 搜索所有项目列表ajax回调
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

        trStr += '<tr id="tr_' + projectSingle.project_id + '">'
              +      '<td>' + projectSingle.project_id + '</td>'
              +      '<td><a href="/hstpm/proj_sustain/query_view?project_id=' + projectSingle.project_id + '">' + projectSingle.project_name + '</a></td>'
              +      '<td>' + projectSingle.create_time + '</td>'
              +      '<td>' + projectSingle.status + '</td>'
              +      '<td>' + creator + '</td>'
              +      '<td>' + projectSingle.owner + '</td>'
              +      '<td style="text-align: left; padding-left: 10px;">' + risk.replace(/\n/g, "<br>").replace(/\t/g, "&nbsp;&nbsp;") + '</td>'
              +      '<td>' + start_time + '</td>'
              +      '<td>' + finish_time + '</td>';
    }
    if (trStr == '') {
        trStr = '<tr><td class="text-warning" colspan="9">暂无项目记录</td></tr>';
    }
    $("#tableProjectList tbody").empty().append(trStr);

    $("#pageSize").val(pageInfo.page_size);
    $("#totalPage").text(pageInfo.total_page);
    $("#totalRecord").text(pageInfo.total_record);
    $("#currentPage").val(pageInfo.current_page);
    $("#firstPage").attr("onclick", "searchProjectList(1);");
    $("#lastPage").attr("onclick", "searchProjectList(" + pageInfo.total_page + ");");
    $("#nextPage").attr("onclick", "searchProjectList(" + pageInfo.next_page+ ");");
    $("#previousPage").attr("onclick", "searchProjectList(" + pageInfo.previous_page + ");");
}