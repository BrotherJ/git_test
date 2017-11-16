/*
首页topbar相关js
pzhang
2016.12.28
*/

$(document).ready(function() {
    searchRunningProjectList();
    searchFinishProjectList();
    searchRunPendingProjectList();
    //setRotationChange();
    $("#indexCarousel").carousel("cycle");
});

/**
 * @Method: setRotationChange
 * @Description: 设置三个任务图表定时切换
 * @return void
 * @throws
 * @author pzhang
 * @date 2016年5月3
*/
function setRotationChange() {
    var imageNum = 3,  // 图片数量
        imageWidth = $(".imageRotation").width(),
        imageReelWidth = imageWidth*imageNum + 10,  // 图片容器宽度
        icoArr = $(".icoBox").children(),  // 取得所有图标，并保存为数组

        nextID = 0,  // 下张图片ID
        setIntervalID,  // setInterval() 函数ID
        intervalTime = 600000,  // 间隔时间
        speed =500,  // 执行速度
        tagSpanArr = $("#tag span"),  //获取tagspan的元素
        activeID = parseInt($(".icoBox .ico_active").attr("rel"));  // 当前图片ID
    // 设置 图片容器 的宽度
    $(".imageBox").css({'width' : imageReelWidth + "px"});

    // 图片轮换函数
    var rotate=function(clickID){
        if(clickID){
            nextID = clickID;
        } else {
            nextID=activeID<=2 ? activeID+1 : 1;
        }


        $(icoArr[activeID-1]).attr("src", "/static/img/bullet-grey.png");
        $(icoArr[nextID-1]).attr("src", "/static/img/bullet-yellow.png");
        if (activeID == 3 && nextID == 1) {
             $(".imageBox").css("left", " " + imageWidth + "px");
             $(".imageBox").animate({left:"-"+((nextID-1)*imageWidth)+"px"} , speed);
        } else {
            $(".imageBox").animate({left:"-"+((nextID-1)*imageWidth)+"px"} , speed);
        }

        activeID = nextID;
    }
    setIntervalID  =setInterval(rotate, intervalTime);

    $(".imageBox").hover(
        function(){ clearInterval(setIntervalID); },
        function(){ setIntervalID = setInterval(rotate, intervalTime); }
    );

    $(".icoBox img").hover(
        function(){
            clearInterval(setIntervalID);
            var clickID = parseInt($(this).attr("rel"));
            rotate(clickID);
        },
        function(){
            setIntervalID=setInterval(rotate,intervalTime);
        }
    );
}

function searchRunningProjectList() {
    var project_param = {};
    project_param['status'] = HSTPMVARS["STATUS"]["RUNNING"] + "," + HSTPMVARS["STATUS"]["SUSPENDED"];

    var pageInfo_param = {};
    pageInfo_param["current_page"] = 1;
    pageInfo_param["page_size"] = 100;

    var params = {};
    params['project_param'] = JSON.stringify(project_param);
    params['pageinfo_param'] = JSON.stringify(pageInfo_param);

    $.get('/hstpm/proj_sustain/search_proj', params, returnSearchRunningProjectList, 'json');
}

function returnSearchRunningProjectList(data) {
    var projList = data.rcdata.project_list_info;
    var trStr = "", risk = "", classStr = "", statusClass = "", progObj = "", progStr = "", subProjStr = "";
    for (var i = 0; i < projList.length; i++) {
        risk =  projList[i].sustain_risk == "" ? projList[i].evaluete_risk:projList[i].sustain_risk;
        if (risk != "") {
            classStr = "text-danger";
            risk = risk.replace(/\n/g, "<br>").replace(/\t/g, "&nbsp;&nbsp;");
        }
        if (projList[i].status == HSTPMVARS["STATUS"]["SUSPENDED"]) {
            statusClass = "text-danger";
        }
        if (!isEmptyObj(projList[i].test_progress)) {
            progStr = "";
            progObj = projList[i].test_progress;
            for (key in progObj) {
                progStr += '<li>' + key + '：</li>';
                if (typeof(progObj[key]) == "object") {
                    subProjStr = "";
                    for(var tester in progObj[key]) {
                        subProjStr += '<li title="' + progObj[key][tester] + '">' + tester + '：<span>' + cutString(progObj[key][tester], 25) + '</span></li>';
                    }
                    if (subProjStr != "") {
                        progStr += "<ul>" + subProjStr + "</ul>";
                    }
                } else {
                    progStr += '<ul><li title="' + progObj[key] + '">' + cutString(progObj[key], 25) + '</li></ul>';
                }
            }
            progStr = '<ul>' + progStr + '</ul>';
        }


        trStr += '<tr>'
              +      '<td>' + projList[i].project_name + '</td>'
              +      '<td style="text-align: left;padding-left:10px;">' + projList[i].test_content.replace(/\n/g, "<br>").replace(/\t/g, "&nbsp;&nbsp;") + '</td>'
              +      '<td>' + projList[i].priority + '</td>'
              +      '<td align="left">' + progStr + '</td>'
              +      '<td class="' + classStr + '">' + risk + '</td>'
              +      '<td>' + (projList[i].start_time == "None" ? "--":projList[i].start_time.split(" ")[0])+ '</td>'
              +      '<td>' + projList[i].creator + '</td>'
              +      '<td>' + projList[i].owner + '</td>'
              +      '<td>' + projList[i].tester.replace(/,/g, "<br>") + '</td>'
              +      '<td>' + projList[i].status + '</td>'
              +  '</tr>';
    }
    if (trStr == "") {
        trStr = '<tr><td colspan="10" class="text-danger">没有记录</td></tr>';
    }
    $("#runningProjTb tbody").empty().append(trStr);
}

function searchFinishProjectList() {
    var project_param = {};
    project_param['status'] = HSTPMVARS["STATUS"]["FINISH"];

    var curDate = new Date();
    var beforeDate = new Date(curDate.getTime() - 24*60*60*60*1000*7);
    project_param["out_run_time"] = beforeDate.Format("yyyy-MM-dd") + "/" + curDate.Format("yyyy-MM-dd");

    var pageInfo_param = {};
    pageInfo_param["current_page"] = 1;
    pageInfo_param["page_size"] = 100;

    var params = {};
    params['project_param'] = JSON.stringify(project_param);
    params['pageinfo_param'] = JSON.stringify(pageInfo_param);

    $.get('/hstpm/proj_sustain/search_proj', params, returnSearchFinishProjectList, 'json');
}

function returnSearchFinishProjectList(data) {
    var projList = data.rcdata.project_list_info;
    var trStr = "", risk = "", classStr = "", progObj = "", progStr = "", subProjStr = "";
    for (var i = 0; i < projList.length; i++) {
        risk =  projList[i].summary_risk == "" ? (projList[i].sustain_risk == "" ? projList[i].evaluete_risk:projList[i].sustain_risk):projList[i].summary_risk;
        if (risk != "") {
            classStr = "text-danger";
            risk = risk.replace(/\n/g, "<br>").replace(/\t/g, "&nbsp;&nbsp;");
        }
        if (!isEmptyObj(projList[i].test_progress)) {
            progStr = "";
            progObj = projList[i].test_progress;
            for (key in progObj) {
                progStr += '<li>' + key + '：</li>';
                if (typeof(progObj[key]) == "object") {
                    subProjStr = "";
                    for(var tester in progObj[key]) {
                        subProjStr += '<li title="' + progObj[key][tester] + '">' + tester + '：<span>' + cutString(progObj[key][tester], 25) + '</span></li>';
                    }
                    if (subProjStr != "") {
                        progStr += "<ul>" + subProjStr + "</ul>";
                    }
                } else {
                    progStr += '<ul><li title="' + progObj[key] + '">' + cutString(progObj[key], 25) + '</li></ul>';
                }
            }
            progStr = '<ul>' + progStr + '</ul>';
        }
        trStr += '<tr>'
              +      '<td>' + projList[i].project_name + '</td>'
              +      '<td style="text-align: left;padding-left:10px;">' + projList[i].test_content.replace(/\n/g, "<br>").replace(/\t/g, "&nbsp;&nbsp;") + '</td>'
              +      '<td>' + projList[i].priority + '</td>'
              +      '<td align="left">' + progStr + '</td>'
              +      '<td class="' + classStr + '">' + risk + '</td>'
              +      '<td>' + (projList[i].start_time == "None" ? "--":projList[i].start_time.split(" ")[0]) + '</td>'
              +      '<td>' + projList[i].creator + '</td>'
              +      '<td>' + projList[i].owner + '</td>'
              +      '<td>' + projList[i].tester.replace(/,/g, "<br>") + '</td>'
              +  '</tr>';
    }
    if (trStr == "") {
        trStr = '<tr><td colspan="9" class="text-danger">没有记录</td></tr>';
    }
    $("#finishProjTb tbody").empty().append(trStr);
}

function searchRunPendingProjectList() {
    var project_param = {};
    project_param['status'] = HSTPMVARS["STATUS"]["EVALUATE_PENDING"] + "," + HSTPMVARS["STATUS"]["RUN_PENDING"];

    var pageInfo_param = {};
    pageInfo_param["current_page"] = 1;
    pageInfo_param["page_size"] = 100;
    var params = {};
    params['project_param'] = JSON.stringify(project_param);
    params['pageinfo_param'] = JSON.stringify(pageInfo_param);

    $.get('/hstpm/proj_sustain/search_proj', params, returnSearchRunPendingProjectList, 'json');
}

function returnSearchRunPendingProjectList(data) {
    var projList = data.rcdata.project_list_info;
    var trStr = "", risk = "", classStr = "", progressStr = "";
    for (var i = 0; i < projList.length; i++) {
        risk =  projList[i].sustain_risk == "" ? projList[i].evaluete_risk:projList[i].sustain_risk;
        if (risk != "") {
            classStr = "text-danger";
            risk = risk.replace(/\n/g, "<br>");
        }
        trStr += '<tr>'
              +      '<td>' + projList[i].project_name + '</td>'
              +      '<td style="text-align: left;padding-left:10px;">' + projList[i].test_content.replace(/\n/g, "<br>").replace(/\t/g, "&nbsp;&nbsp;") + '</td>'
              +      '<td>' + projList[i].priority + '</td>'
              +      '<td align="left">' + progressStr + '</td>'
              +      '<td class="' + classStr + '">' + risk + '</td>'
              +      '<td>' + (projList[i].estimate_startdate == "None" ? "--":projList[i].estimate_startdate) + '</td>'
              +      '<td>' + projList[i].creator + '</td>'
              +      '<td>' + projList[i].owner + '</td>'
              +      '<td>' + projList[i].tester.replace(/,/g, "<br>") + '</td>'
              +  '</tr>';
    }
    if (trStr == "") {
        trStr = '<tr><td colspan="9" class="text-danger">没有记录</td></tr>';
    }
    $("#runPendingProjTb tbody").empty().append(trStr);
}

Date.prototype.Format = function(format){
    var o = {
        "M+" : this.getMonth()+1, //month
        "d+" : this.getDate(), //day
        "h+" : this.getHours(), //hour
        "m+" : this.getMinutes(), //minute
        "s+" : this.getSeconds(), //second
        "q+" : Math.floor((this.getMonth()+3)/3), //quarter
        "S" : this.getMilliseconds() //millisecond
    }
    if(/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    for(var k in o) {
        if(new RegExp("("+ k +")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
        }
    }

    return format;
}