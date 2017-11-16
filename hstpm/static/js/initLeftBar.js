/*
初始化左边导航栏相关js
pzhang
2017.8.8
*/
;(function($, window, document, undefined) {
	var defaults = {
	    menuList: [],
	    activeMenu: ''
	};
	var Leftbar = function (elem, opt) {
		this.$elem = elem;
		this._defaults = defaults;
		this.options = $.extend({}, this._defaults, opt);
		this.menuList = this.options.menuList;
		this.activeMenu = this.options.activeMenu;
	};

	Leftbar.prototype = {
		initLeftBar: function() {
			if (this.menuList.length == 0) {
				return;
			}
			var $ul = $('<ul class="ul_nav"></ul>').appendTo(this.$elem);
			$ul.parent().addClass("div_sideBar");
			var menu = "", $p, $menuLi, $subUl, $subLi, subMenu, $icon;
			for (var i = 0; i < this.menuList.length; i++) {
				menu = this.menuList[i];
				if (!menu.subMenu || menu.subMenu.length == 0) {

				    $menuLi = $('<li menu="' + menu.menu + '"></li>').appendTo($ul);

				     if (this.activeMenu == menu.menu) {
				        $menuLi.addClass("activeLi");
				    }

				    $p = $('<p></p>').appendTo($menuLi);
				    $('<a href="' + menu.url + '">' + menu.name + '</a>').appendTo($p);
					if (menu.icon && menu.icon != "") {
				        $icon = $('<span class="glyphicon ' + menu.icon + ' span_menuIcon"></span>');
				        $icon.prependTo($p);
				    }

				} else {
					$menuLi = $('<li class="li_hasSub"></li>').appendTo($ul);
					$p = $('<p></p>').appendTo($menuLi);
					$('<a href="javascript:void(0);">' + menu.name + '</a><span class="glyphicon glyphicon-menu-right x-small float_right"></span>').appendTo($p);
					if (menu.icon && menu.icon != "") {
				        $icon = $('<span class="glyphicon ' + menu.icon + ' span_menuIcon">');
				        $icon.prependTo($p);
				    }
					$subUl = $('<ul class="ul_subMenu" style="display: none;"></ul>');
					for (var j = 0; j < menu.subMenu.length; j++) {
						subMenu = menu.subMenu[j];
						$subLi = $('<li menu="' + subMenu.menu + '"><a href="' + subMenu.url + '">' + subMenu.name + '</a></li>')
						.appendTo($subUl);
						if (this.activeMenu == subMenu.menu) {
						    $subLi.addClass("activeSubLi");
						    $menuLi.addClass("activeParentLi");
						    $subUl.css("display", "");
						}
					}
					$subUl.appendTo($menuLi);
				}
			}

            this._setSubLiClick();
            //this._initActiveMenu();
		},

		_setSubLiClick: function() {
		    $(".li_hasSub>p").click(function() {
		        $(this).parent().siblings().find(".ul_subMenu").slideUp();
		        $(this).parent().siblings().find(".float_right").removeClass("glyphicon-menu-down").addClass("glyphicon-menu-right");
		        $(this).parent().find(".ul_subMenu").slideToggle();
		        if ($(this).find(">span:last").hasClass("glyphicon-menu-right")) {
		            $(this).find(">span:last").removeClass("glyphicon-menu-right").addClass("glyphicon-menu-down");
		        } else {
		            $(this).find(">span:last").removeClass("glyphicon-menu-down").addClass("glyphicon-menu-right");
		        }

		    });
		},

		_initActiveMenu: function() {
            $('.activeSubLi').removeClass("activeSubLi");
            $('.activeLi').removeClass("activeLi");
            var activeLi = $("li[menu=" + this.activeMenu + "]");
            if (activeLi.parent().parent().hasClass("li_hasSub")) {
                activeLi.parent().parent().find(">p").click();
                activeLi.addClass("activeSubLi");
                activeLi.parent().parent().addClass("activeParentLi");
            } else {
                activeLi.addClass("activeLi");
            }
		}
	}
	$.fn.leftBar = function(options) {
			var leftBar = new Leftbar(this, options);
			return leftBar.initLeftBar();
	}

})(jQuery, window, document)
