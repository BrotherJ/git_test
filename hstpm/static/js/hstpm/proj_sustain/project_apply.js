/*
项目运维-项目申请页面相关js
pzhang
2017.8.11
*/
var projInfoMap = {};

$(document).ready(function() {
    setTitle();
    setAllPlaceholder();
});

/**
* @Method: setTitle
* @Description: title后面跟着项目名称
* @param
* @author pzhang
* @date 2017年8月30日
*/
function setTitle() {
    if ($("#hidden_projectId").val() != "") {
        $("#pageTitleSpan").text( $("#pageTitleSpan").text() + " ——— " + $("#hidden_projectId").attr("name"));
    }
}

/**
* @Method: saveOrSubmitProject
* @Description: 保存或者提交项目
* @param opType 1：提交，0：保存
* @param projInfo 项目提交map信息
* @author pzhang
* @date 2017年8月30日
*/
function saveOrSubmitProject(opType, projInfo) {

    if (!beforeSubmitCheck()) {// 定义在模板自己的js中
        $("html body").animate({scrollTop:0}, 50);
        return;
    };

    var projMap = {};
    projMap = getParamMap(projInfo);

    var params = {};
    params["proj_info"] = JSON.stringify(projMap);
    params["project_id"] = $("#hidden_projectId").val();

    // 锁住页面
    $("#ajaxLoadingGif").modal({backdrop: 'static', keyboard: false});
    if (opType == "1") {
        var operateInfo = {};
        operateInfo["operator"] = $("#hidden_userId").attr("name");
        operateInfo["operator_id"] = $("#hidden_userId").val();
        operateInfo["operation"] = HSTPMVARS["ACTION"]["SUBMIT_APPROVE"];
        params["operate_info"] = JSON.stringify(operateInfo);
        $.post("/hstpm/proj_sustain/project_op", params, function(data) {
            returnSaveOrSubmitProject(data, opType);
        }, 'json');
    } else {
        params["operator_id"] = $("#hidden_userId").val();
        $.post("/hstpm/proj_sustain/save_project", params, function(data) {
            returnSaveOrSubmitProject(data, opType);
        }, 'json');
    }
}

/**
* @Method: returnSaveOrSubmitProject
* @Description: 保存或者提交项目回调
* @param data
* @param opType 1：提交，0：保存
* @author pzhang
* @date 2017年8月30日
*/
function returnSaveOrSubmitProject(data, opType) {
    // 解除页面锁定
    $("#ajaxLoadingGif").modal("hide");
    if (data.result == -1) {
        modalDialog('error', data.message);
        return;
    }
    if (opType == "0") {
        window.location = "/hstpm/proj_sustain/apply?project_id=" + data.message;
    } else {
        window.location = "/hstpm/proj_sustain/query";
    }

}