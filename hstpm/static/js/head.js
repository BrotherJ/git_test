/*
首页topbar相关js
pzhang
2017.8.8
*/
var showOrHideClickFlag = "0";

function initShowOrHideBtnClick() {
    $("button[data-target=sidebar]").click(function() {
        //$("#sidebarDiv a").slideToggle();
        //$("#sidebarDiv span:not(.span_menuIcon)").slideToggle();
        if (showOrHideClickFlag == "0") {
            showOrHideClickFlag = "1";
        } else {
            showOrHideClickFlag = "0";
        }
        showOrHideSidebar();

    });
    $("#sidebarDiv").hover(
        function() {
            if (showOrHideClickFlag == "1") {
                showOrHideSidebar();
            }
        },
        function() {
            if (showOrHideClickFlag == "1") {
                showOrHideSidebar();
            }
        }
    );
}

function showOrHideSidebar() {
    if ($("#sidebarDiv a:first").css("display") != "none") {
        $("#sidebarDiv span:not(.span_menuIcon)").css("display", "none");
        $("#sidebarDiv a").css("display", "none");
        $("#sidebarDiv").width("4%");
        $(".maincontent").css("margin-left", "4%");
    } else {
        $("#sidebarDiv span:not(.span_menuIcon)").css("display", "");
        $("#sidebarDiv a").css("display", "");
        $("#sidebarDiv").width("15%");
        $(".maincontent").css("margin-left", "15%");
    }
}

function initLeftMenu(menuListStr, activeMenu) {
    menuListStr = menuListStr.replace(/&quot;/g, "\"");//用正则表达式解码
    var menuList = JSON.parse(menuListStr);//将字符串解析为JSON对象

    var menuListArr =  [{
            'name': '首页',
            'url': '/hstpm/index',
            'icon': 'glyphicon-home',
            'menu': 'index'
        },
        {
            'name': '项目运维',
            'subMenu': [],
            'icon': 'glyphicon-th-list'
        },
        {
            'name': '项目管理',
            'subMenu': [],
            'icon': 'glyphicon-check',

        },
        {
            'name': '系统配置',
            'subMenu': [],
            'icon': 'glyphicon-cog'
        }];
    for (var i = 0, len = menuList.length; i < len; i++) {
        var subMenu = menuList[i];
        menuListArr[subMenu.type].subMenu.push({
            'name': subMenu.name,
            'url': subMenu.url,
            'menu': subMenu.pagekey
        })
    }
    for (var j = 1; j < menuListArr.length; j++) {
        if (menuListArr[j].subMenu.length == 0) {
            menuListArr.splice(j, 1);
            j--;
        }
    }
    var options = {
        'menuList': menuListArr,
        'activeMenu': activeMenu
    };
    $("#sidebarDiv").leftBar(options);
}