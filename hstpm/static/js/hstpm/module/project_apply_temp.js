/*
项目运维-项目申请页面相关js
pzhang
2017.8.11
*/

/**
* @Method: beforeSubmitCheck
* @Description: 模板对应的提交检查
* @param
* @author pzhang
* @date 2017年8月30日
*/
function beforeSubmitCheck() {
    $(".error_border").removeClass("error_border");
    var checkLabel = [{
        "labelname": "projName,projPubDate,qaLiaison,projLiaison,desc,stoneOsBaseLine,testImage,expectTestStartDate,otherExplain",
        "request": "notNullBorderTips"
    }];
    if (!checkClick(checkLabel)) {
        return false;
    }

    var publishDate = new Date($("#projPubDate").val().trim() + " 23:59:59");
    var curDate = new Date();
    if (publishDate < curDate) {
        modalDialog('error', "发布日期不能小于当前日期！");
        showBorderTips("projPubDate", false);
        return false;
    }

    if (!checkPlatform()) {
        modalDialog('error', "测试平台不能为空！");
        return false;
    }

    var startDate = new Date($("#expectTestStartDate").val().trim() + " 23:59:59");
    if (startDate < curDate) {
        modalDialog('error', "期望开始日期不能小于当前日期！");
        showBorderTips("expectTestStartDate", false);
        return false;
    }
    return true;
}

/**
* @Method: checkPlatform
* @Description: 检测平台
* @param
* @author pzhang
* @date 2017年8月30日
*/
function checkPlatform() {
    var result = false;
    elemObjList = $("input[type=checkbox][id*=platform]");
    elemObjList.each(function() {
        if ($(this).prop("checked")) {
            result = true;
            return false;
        }
    });
    return result;
}

function getParamMap(projInfoMap) {
    var keyId = "";
    var projMap = {};
    var elemObjList = "";
    for (var key in projInfoMap) {
        if (key.indexOf("_check") > -1) {
            keyId = key.substring(0, key.indexOf("_check")+1);
            projMap[key] = "";
            elemObjList = $("input[type=checkbox][id*=" + keyId + "]");
            elemObjList.each(function() {
                if ($(this).prop("checked")) {
                    projMap[key] += $(this).val() + ",";
                }
            });
            projMap[key] = projMap[key].substring(0, projMap[key].length-1);
            continue;
        }
        keyId = key.substring(0, key.length-4);
        projMap[key] = $("#" + keyId).val();
    }
    return projMap;
}

/**
* @Method: setAllPlaceholder
* @Description: 需换行的placeholder，单独写js填充
* @param
* @author pzhang
* @date 2017年8月30日
*/
function setAllPlaceholder() {
    setPlaceHolder("desc", "简要说明下项目的情况，格式如下：\n"
                    + "项目介绍：Polaris项目第1个P分支，合入4个FR分支、10个线上问题\n"
                    + "测试目标：优先保证E平台路由、Policy、VPN3大模块功能没有衰退\n"
                    + "项目FR链接：请给出FR的具体访问链接（多个时请用“，”隔开），如果无可以不填写\n"
                    + "特殊说明：对于新增平台需要提供特殊说明，如可以互切的平台型号等，如果无可以不填写\n");

    setPlaceHolder("otherExplain", "请详细描述测试内容，格式如下：\n "
                    + "优先关注测试平台：VFW的VM02、X平台\n"
                    + "自动化需求/测试模块等需求：\n"
                    + "     1. 对HA、路由、URL过滤、DHCP跑Module Full的脚本。\n"
                    + "     2. 对其他基础模块（接口、Policy等）跑Module Basic的脚本。\n"
                    + "版本路径：ftp://10.100.6.10/qa/Saipan/HAWAII_REL_R5_P/ \n"
                    + "特殊说明：同于X平台X6180、X7180的2个型号的URL过滤功能实现逻辑不一样，都需要分别测试 \n")
}

/**
* @Method: setPlaceHolder
* @Description: 需换行的placeholder，单独写js填充
* @param
* @author pzhang
* @date 2017年8月30日
*/
function setPlaceHolder(elemId, placeholderStr) {
    $("#" + elemId).attr("placeholder", placeholderStr);
}

function copyValue(self) {
    var elemObj = $($(self).find(">input")[0]);
    if (elemObj.attr("disabled") == "disabled") {
        elemObj.attr("disabled", false);
        elemObj.select();
        document.execCommand("Copy");
        elemObj.attr("disabled", true);
    } else {
        elemObj.select();
        document.execCommand("Copy");
    }
}