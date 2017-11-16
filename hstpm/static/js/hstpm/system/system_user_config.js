/*
用户配置页面相关js
pzhang
2017.8.11
*/

$(document).ready(function() {
    getRoleInfo();
    searchUserList(1);
});

/*用户配置页面获取所有角色信息，展示在下拉框中*/

/**
 * @Method: getRoleInfo
 * @Description: 用户配置页面获取所有角色信息，展示在下拉框中
 * @param role_id 角色id
 * @return void
 * @author yhguo
 * @date 2017年8月18
*/
function getRoleInfo(role_id){
    var role_name = '';

    var pageSize = 100;
    if (!checkPageSize(pageSize)) {
			return false;
	}
	var totalPage = 1;
	var totalRecord = 100;
	var currentPage = 1;
	currentPage = getCurSearchPage({
	    "pageSize": pageSize,
	    "currentPageNum": currentPage,
	    "totalRecord": totalRecord,
	    "type": 1,
	    "curTotalPage": totalPage});
    var page_info = {};
	page_info['current_page'] = parseInt(currentPage);
	page_info['page_size'] = parseInt(pageSize);

    var params = {};
    params['role_name'] = role_name;
	params['page_info'] = JSON.stringify(page_info);

	$.get('/hstpm/system/search_role', params, returnGetRoleInfo, 'json');
}

/**
 * @Method: returnGetRoleInfo
 * @Description: 户配置页面获取所有角色信息，展示在下拉框中 ajax回调
 * @param data 后台返回的数据
 * @return void
 * @author yhguo
 * @date 2017年8月18
*/
function returnGetRoleInfo(data){
    if (data.result == -1) {
        modalDialog('error', data.message);
        return;
    }
    var roleList = data.rcdata.role_list;
    var optionStr = '';
    for (var i = 0, len = roleList.length; i < len; i++) {
        var roleSingle = roleList[i];
        optionStr += '<option value="'+ roleSingle.id+'">' + roleSingle.name + '</option>'
    }
    $('#userRoleIdSelect').empty().append('<option value="">请选择用户角色</option>' + optionStr);
    $('#roleSelect').empty().append(optionStr);
}

/**
 * @Method: searchUserList
 * @Description: 用户配置页面获取所有的用户信息，展示在表格中以及搜索
 * @param type 第几页
 * @return void
 * @author yhguo
 * @date 2017年8月18
*/
function searchUserList (type) {
    var user_param = {};
    user_param['id'] = $('#userIdInput').val().trim();
    if ( user_param['id'] != '' && !onlyNumber('userIdInput') ) {
         return;
    }
    user_param['name'] = $('#userNameInput').val().trim();
    user_param['role_id'] = $('#userRoleIdSelect').val();
    if (user_param['role_id'] == undefined) {
        user_param['role_id'] = '';
    }
    user_param['department'] = $('#userDepartmentInput').val().trim();

    var params = {};
    params['user_param'] = JSON.stringify(user_param);
	params['page_info'] = JSON.stringify(getPageInfoDict(type));

	$.get('/hstpm/system/search_user', params, returnSearchUserList, 'json');
}

/**
 * @Method: returnSearchUserList
 * @Description: 用户配置页面获取所有的用户信息，展示在表格中以及搜索  ajax回调
 * @param data 后台返回的数据
 * @return void
 * @author yhguo
 * @date 2017年8月18
*/
function returnSearchUserList (data) {
    if (data.result == -1) {
        modalDialog('error', data.message);
        return;
    }
    var userList = data.rcdata.user_list;
    var pageInfo = data.rcdata.page_info;
    var trStr = '';
    for (var i = 0, len = userList.length; i < len; i++) {
        var userSingle = userList[i];
        trStr += '<tr id="tr_' + userSingle.id + '">'
              +      '<td>' + userSingle.id + '</td>'
              +      '<td>' + userSingle.showname + '</td>'
              +      '<td>' + userSingle.email + '</td>'
              +      '<td>' + userSingle.role_name + '</td>'
              +      '<td>' + userSingle.department + '</td>'
              +      '<td><button onclick="setUserRoleModal(' + userSingle.id + ', ' + userSingle.role_id + ')" type="button" class="btn btn-primary btn-xs" data-toggle="modal" data-target="#div_set_user_role_modal">设置角色</button></td>';
    }
    if (trStr == '') {
        trStr = '<tr><td class="text-warning" colspan="6">暂无用户记录</td></tr>';
    }
    $("#tableUserList tbody").empty().append(trStr);

    $("#pageSize").val(pageInfo.page_size);
    $("#totalPage").text(pageInfo.total_page);
    $("#totalRecord").text(pageInfo.total_record);
    $("#currentPage").val(pageInfo.current_page);
    $("#firstPage").attr("onclick", "searchUserList(1);");
    $("#lastPage").attr("onclick", "searchUserList(" + pageInfo.total_page + ");");
    $("#nextPage").attr("onclick", "searchUserList(" + pageInfo.next_page+ ");");
    $("#previousPage").attr("onclick", "searchUserList(" + pageInfo.previous_page + ");");
}

/**
 * @Method: setUserRoleModal
 * @Description: 点击设置用户角色按钮弹出模态框
 * @param user_id 用户id
 * @param role_id 角色id
 * @return void
 * @author yhguo
 * @date 2017年8月18
*/
function setUserRoleModal(user_id, role_id){
    $('#roleSelect').val(role_id);
    $('#setRoleBtn').attr('onclick', "setUserRole(" + user_id + ", " + role_id + ");");
}

/**
 * @Method: returnSearchUserList
 * @Description: 用模态框中的保存按钮触发的事件，设置用户角色
 * @param user_id 用户id
 * @param old_role_id 原来的角色id
 * @return void
 * @author yhguo
 * @date 2017年8月18
*/
function setUserRole (user_id, old_role_id) {
    var new_role_id = $('#roleSelect').val();
    if (new_role_id == old_role_id) {
        $('#div_set_user_role_modal').modal('toggle');
        return;
    }
    var params = {};
    params['user_id'] = user_id;
    params['role_id'] = new_role_id;
    $.post('/hstpm/system/set_user_role', params, returnSetUserRole, 'json');
}
/**
 * @Method: returnSetUserRole
 * @Description: 用模态框中的保存按钮触发的事件，设置用户角色  ajax回调
 * @param data 后台返回的数据
 * @return void
 * @author yhguo
 * @date 2017年8月18
*/
function returnSetUserRole(data) {
    global_user_id = 0;//重置该全局变量
    $('#div_set_user_role_modal').modal('toggle');//关闭模态框
    $("#roleSelect").val(0).change();//重置模态框内的选项
    if (data.result == 0) {
        searchUserList($("#currentPage").val());//设置成功，重刷页面
        return;
    } else if (data.result == -1) {
        modalDialog('error', data.message);
        return;
    }
}