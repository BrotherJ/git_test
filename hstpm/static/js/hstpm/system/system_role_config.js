/*
角色配置页面相关js
pzhang
2017.8.11
*/

$(document).ready(function() {
    searchRoleList(1);
});

/**
 * @Method: searchRoleList
 * @Description: 角色配置页面搜索所有角色
 * @param type 第几页
 * @return void
 * @author yhguo
 * @date 2017年8月18
*/
function searchRoleList (type) {
    var role_name = $('#roleNameInput').val().trim();

    var params = {};
    params['role_name'] = role_name;
	params['page_info'] = JSON.stringify(getPageInfoDict(type));

	$.get('/hstpm/system/search_role', params, returnSearchRoleList, 'json');
}

/**
 * @Method: returnSearchRoleList
 * @Description: 角色配置页面搜索所有角色ajax回调
 * @param data 后台返回的数据
 * @return void
 * @author yhguo
 * @date 2017年8月18
*/
function returnSearchRoleList(data) {
    if (data.result == -1) {
        modalDialog('error', data.message);
        return;
    }
    var roleList = data.rcdata.role_list;
    var pageInfo = data.rcdata.page_info;
    var trStr = '';
    for (var i = 0, len = roleList.length; i < len; i++) {
        var roleSingle = roleList[i];
        var roleSingleDesc = roleSingle.description == '' ? '暂无描述' : roleSingleDesc.description;
        trStr += '<tr id="tr_' + roleSingle.id + '">'
              +      '<td>' + roleSingle.id + '</td>'
              +      '<td>' + roleSingle.name + '</td>'
              +      '<td>' + roleSingleDesc + '</td>'
              +      '<td>' + roleSingle.register_time + '</td></tr>';
    }
    if (trStr == '') {
        trStr = '<tr><td class="text-warning" colspan="4">暂无角色记录</td></tr>';
    }
    $("#tableRoleList tbody").empty().append(trStr);

    $("#pageSize").val(pageInfo.page_size);
    $("#totalPage").text(pageInfo.total_page);
    $("#totalRecord").text(pageInfo.total_record);
    $("#currentPage").val(pageInfo.current_page);
    $("#firstPage").attr("onclick", "searchRoleList(1);");
    $("#lastPage").attr("onclick", "searchRoleList(" + pageInfo.total_page + ");");
    $("#nextPage").attr("onclick", "searchRoleList(" + pageInfo.next_page+ ");");
    $("#previousPage").attr("onclick", "searchRoleList(" + pageInfo.previous_page + ");");
}

/**
 * @Method: resetRoleListSearch
 * @Description: 搜索表单的重置按钮
 * @return void
 * @author yhguo
 * @date 2017年8月18
*/
function resetRoleListSearch(){
    $('#roleNameInput').val('');

    searchRoleList($("#currentPage").val());
}