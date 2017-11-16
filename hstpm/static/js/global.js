/*
全局js
pzhang
2016.12.28
*/
var HSTPMVARS = {};
HSTPMVARS["ACTION"] = {};
HSTPMVARS["ACTION"]["DELETE"] = "删除";
HSTPMVARS["ACTION"]["SUBMIT_APPROVE"] = '提交'; //提交审批
HSTPMVARS["ACTION"]["PASS_APPROVE"] = '审批通过'; //提交审批
HSTPMVARS["ACTION"]["REJECT_APPROVE"] = '审批不通过'; //审批不通过
HSTPMVARS["ACTION"]["REJECT_EVALUATE"] = "评估不通过"; //评估不通过
HSTPMVARS["ACTION"]["PASS_EVALUATE"] = "评估通过"; //通过评估
HSTPMVARS["ACTION"]["START_RUN"] = "开始"; //开始运行
HSTPMVARS["ACTION"]["SUSPEND_RUN"] = "挂起";  //挂起
HSTPMVARS["ACTION"]["TERMINATE_RUN"] = "终止"; //终止运行
HSTPMVARS["ACTION"]["SEND_REPORT"] = "发送报告"; //发送运维报告、总结报告

HSTPMVARS["STATUS"] = {};
HSTPMVARS["STATUS"]["DRAFT"] = "草稿"; //草稿
HSTPMVARS["STATUS"]["APPROVE_PENDING"] = '待审批'; //待审批
HSTPMVARS["STATUS"]["EVALUATE_PENDING"] = '待评估'; //待评估
HSTPMVARS["STATUS"]["APPROVE_FAIL"] = "审批退回"; //审批退回
HSTPMVARS["STATUS"]["EVALUATE_FAIL"] = "评估退回"; //评估退回
HSTPMVARS["STATUS"]["RUN_PENDING"] = "待运行"; //待运行
HSTPMVARS["STATUS"]["RUNNING"] = "运行"; //正在运行
HSTPMVARS["STATUS"]["SUSPENDED"] = "挂起"; //挂起
HSTPMVARS["STATUS"]["FINISH"] = "完成"; //完成

/*管理员角色id的全局常量*/
HSTPMVARS["ADIMIN"] = {};
HSTPMVARS["ADIMIN"]["ROLEID"] = "1"; //管理员的角色id是1


/**
* @Method: checkPageNum
* @Description: 检测页面页数
* @author pzhang
* @date 2017年1月18
*/
function checkPageNum (checkContent, title) {
	var reg=/[\D]{1,}/;
	if(reg.test(checkContent)) {
		modalDialog('warning', title + "Only for the digital");
		return false;
	}
	return true;
}

/**
* @Method: checkPageSize
* @Description: 检测页面数量
* @param pageSize 页面数量
* @param maxSize
* @param minSize
* @author pzhang
* @date 2017年1月18
*/
function checkPageSize(pageSize, maxSize, minSize) {
	//判断只可为数字
	if (!checkPageNum(pageSize, "Amount of page")) {
		return false;
	}

	//判断是否传入minSize，若未传入则默认限制为0
	if (!minSize) {
		minSize = 0;
	}

	//判断是否传入maxSize，若未传入则默认限制为100
	if (!maxSize) {
		maxSize = 100;
	}

	if(pageSize < minSize){
		modalDialog('warning', "Amount of page can't less than " + minSize);
		return false;
	}

	if(pageSize > maxSize){
		modalDialog('warning', "Amount of page can't be greater than " + maxSize);
		return false;
	}

	return true;
}

/**
* @Method: getCurSearchPage
* @Description: 获取当前页
* @param pagingInfoObject 页面信息对象
* @author pzhang
* @date 2017年1月18
*/
function getCurSearchPage(pagingInfoObject) {
	//判断是否传入对象
	if(!pagingInfoObject) {
		return false;
	}

	//判断传入输入的页码只可为数字
	if (!checkPageNum (pagingInfoObject.currentPageNum, "pagination")) {
		return false;
	}

	//获取当前页信息
	var currentPage = pagingInfoObject.type;

	//判断查询页面类型
	if(pagingInfoObject.type == "currentpage" || !pagingInfoObject.type) {
		currentPage = pagingInfoObject.currentPageNum;
	}

	//当页面数量大于总记录时，当前页置为1
	if(parseInt(pagingInfoObject.pageSize) > parseInt(pagingInfoObject.totalRecord)) {
		currentPage = 1;
	}

	//当传入的值为0时，将currentPage设置为1
	if(!currentPage || currentPage <= 0) {
		currentPage = 1;
	}

	//当查询的页码数大于总页码数时，将页码数置为总页码数
	if ( parseInt(currentPage) > pagingInfoObject.curTotalPage ) {
		if (pagingInfoObject.curTotalPage == 0){
			currentPage = 1;
		}
		else {
			currentPage = pagingInfoObject.curTotalPage;
		}
	}
	return currentPage;
}

/**
 * 当点击提交时判断输入的格式是否不符合格式
 * @param labelList 输入框ID数组
 * @returns {Boolean}
 */
function checkClick(labelList){
    error="";

    for(var i = 0; i < labelList.length;i++){
         label=labelList[i];
         if(label["labelname"].trim()==""){
             continue;
         }
         sublabelList=label["labelname"].split(",");
         for(var j=0;j < sublabelList.length;j++){
              var reqList = requestList(label["request"]);
              for(var k=0; k < reqList.length;k++){
                  if (!eval(reqList[k]+"(sublabelList[j])")) {
                      return false;
                      //检测出一个就退出
                      if(error == ""){
                          error=error + " | " + reqList[k];
                      }
                      else {
                          error=error + " | " + reqList[k];
                      }
                  }
              }

         }
    }
   if(error!=""){
       return false;
   }
   return true;
}

/**
 * 检测输入框中的内容是否正确
 *
 * 该方法使用说明：
 *
 * 	参数接受格式：
 * 		var checklabel=[{"labelname":"devicetypename,userrolename","request":"notChinese,notNull"},
 * 						{"labelname":"devicetypedescription","method":"onblur,onclick","request":"notNull,notChinese"},
 * 						{"labelname":"userrolename","method":"onclick,onblur"}];
 *
 * 	调用方法：   checkInput(checklabel) ;
 *
 * labelname 	表示要检测的标签框 ，可以一次写入多个标签名， 可以用,分开
 *
 * method	表示 什么动作检测(可以省略,默认为 onblur)，方法 也可以写入多个方法， 可以用,分开    可以省略： 默认 onblur
 *
 * request 表示检测的内容 （可以省略，默认检测 空 或不能为中文） 条件，写入多个条件并存， 使用逗号分开   可以省略   默认 combNullChinese 不能为空 不能为中文的组合
 *
 * request目前支持三种方式  combNullChinese， notNull， notChinese
 *
 * @param labelList 输入框ID数组
 */
function checkInput(labelList){
	//循环遍历传入的标签列表值
    for(var i=0;i < labelList.length;i++){

          label=labelList[i];

          sublabelList=label["labelname"].split(",");
          //里面存有多个标签名的时候的处理 是相同的，
          for(var j=0;j < sublabelList.length;j++){
               //requestList
                if(sublabelList[j]=="" || sublabelList[i]==" ")
                   continue;
               reqList = requestList(label["request"]);
               request=getCheckRequest(reqList,sublabelList[j]);
               metList = methodList(label["method"]);
               for( var l=0;l < metList.length;l++ ){
                  $("#"+sublabelList[j]).attr(metList[l],request);
               }
          }
    }
}

function getCheckRequest(reqList,labelname){
   requestAll="";
   for(var k=0;k < reqList.length;k++){
       //因为是或比较，当一个不满足 就要推出后面的 这里使用&& 当有任意一个为false就退出了
       if (requestAll == "")
           requestAll = "if ("+ reqList[k]+"('"+labelname+"','"+labelname+"aa')" ;
       //方法用：号分开
       else
           requestAll = requestAll + " && " + reqList[k]+"('"+labelname+"','"+labelname+"aa')";
   }
   requestAll = requestAll+") return false; else return true;";

   return requestAll;
}

function methodList(method){
    if (method == undefined || method == ""){
         metList = ["onblur"];
    }
    else {
          metList = method.split(",");
    }
    return metList;
}

function requestList(request){
 if (request == undefined || request == ""){
       reqList = ["combNullChinese"];
   }
   else {
       reqList = request.split(",");
   }
   return reqList;

}

//只能输入数值
function onlyNumber(labelid, position){
      labelValue = $("#"+labelid).val().trim();
  	  if (labelValue.match("^[0-9]+$")) {
  		   setErrorMessage(labelid,true,"", position);
	       return true;
      } else {
	       setErrorMessage(labelid,false,"Only enter positive integers！", position);
	       return false;
	  }
}

//只能输入大于0的数字
function positiveNumber(labelid, position) {
	 labelValue = $("#"+labelid).val().trim();
	 if (!onlyNumber(labelid, position)) {
	    return false;
	 };
	 if(labelValue.indexOf('.') != -1){
		 setErrorMessage(labelid,false,"Must be an integer！", position);
	     return false;
	 }
	 if(labelValue <= 0) {
		 setErrorMessage(labelid,false,"Must be greater than zero！", position);
	     return false;
	 }
	 else{
		 setErrorMessage(labelid,false,"", position);
		 return true;
	 }
}

//不能为空
function notNull(labelid){
    labelValue = $("#"+labelid).val().trim();
	  buttonReg=/.*button$/;
	  if(buttonReg.test(labelValue)){
         return true;
	  }
	  if(isNull(labelValue)){
          setErrorMessage(labelid,false,"Can not be empty！");
		  return false;
	  } else {
          setErrorMessage(labelid,true,"");
	      return true;
	  }

}

function notNullBorderTips(labelid) {
    labelValue = $("#"+labelid).val().trim();
        buttonReg=/.*button$/;
        if(buttonReg.test(labelValue)){
           return true;
        }
        if(isNull(labelValue)){
            showBorderTips(labelid,false);
            return false;
        } else {
            showBorderTips(labelid,true);
            return true;
        }
}

function showBorderTips(elemid,isPass) {
    //elem 是严重该标签的id
    //isPass 布尔类型，是否通过验证true 通过， false不通过

    if(isPass){
        $("#"+elemid).removeClass("error_border");
    } else{
        $("#"+elemid).removeClass("error_border");
        $("#"+elemid).addClass("error_border");
    }
}

/**
 * isNull（判断控件内容是否为空，若为空，则返回true）
 * @param labelValue 控件内容
 * @returns {Boolean}
 */
function isNull(labelValue) {
	 if(labelValue == undefined || labelValue.trim() == ""){
		 return true;
	 } else {
		 return false;
	 }
}

/**
 * 是否为IP
 * @param labelid
 * @returns {Boolean}
 */
function isIP(labelid){
    var ip = $("#"+labelid).val().trim();
    if(!ip.match("^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$")){
        return false;
    }
    return true;
}

/**
 * 判断时间段格式是否正确
 * @param labelid 控件ID
 * @returns {Boolean}
 */
function isdateRange(labelid){
    var dateRange = $("#"+labelid).val().split(" ").join(""); //去掉所取值中所有空格
    if(!(dateRange.match("^[0-9]{4}\-[0-9]{2}\-[0-9]{2}$") || dateRange.match("^[0-9]{4}\-[0-9]{2}\-[0-9]{2}\/[0-9]{4}\-[0-9]{2}\-[0-9]{2}$"))){
        setErrorMessage(labelid,false,"Please enter correct date format, such as “2013-08-15 / 2013-08-22” or “2013-08-22”");
        return false;
    }
    setErrorMessage(labelid,true,"");
    return true;
}

/**
* @Method: setErrorMessage
* @Description: 显示错误提示
* @param elemid 元素ID
* @param isPass 是否通过
* @param message 错误是显示的信息
* @param position 提示信息位置ID
* @author pzhang
* @date 2017年1月18
*/
function setErrorMessage(elemid,isPass,message,position){
    //elem 是严重该标签的id
    //isPass 布尔类型，是否通过验证true 通过， false不通过

    if(isPass){
        $("#"+elemid+"_message").remove();
    } else{
        $("#"+elemid+"_message").remove();
        if (position == null || position == "") {
        	$("#"+elemid).after("<span id='"+elemid+"_message' class='text-danger'>"+message+"</span>");
        } else {
        	$("#"+position).html("<span id='"+elemid+"_message' class='text-danger'>"+message+"</span>");
        }
    }
}

/**
 * 限制输入框中英字符的长度
 * @param len 数据库限制的长度，为英文字符的个数，中文自动为其一般数量
 * @param evt 要检测的控件信息
 */
function checkWord(len,self){
	//len为英文字符的个数，中文自动为其一般数量
	//evt是欲检测的对象
    var str = $(self).val().trim();
    var myLen = 0;
    for(var i=0; i<str.length && myLen<=len; i++) {
        if(str.charCodeAt(i)>0 && str.charCodeAt(i)<128) {
            myLen++;
        }
        else {
            myLen+=2;
        }
    }
    if(myLen>len) {
        $(self).val(str.substring(0,i-1));
        return false;
    }
}

/**
 * 转换输入的空值为na
 * @param paramNA 输入参数
 */
 function checkNA(paramNA) {
	//返回显示内容
	return (!paramNA || paramNA == '' || paramNA == null || paramNA == 'None' || paramNA == 'null')  ? "NA" : paramNA;
 }

/**
* @Method: checkNoChinese
* @Description: 检测不能有中文
* @param labelId 元素ID
* @param position 提示信息位置ID
* @author pzhang
* @date 2017年1月18
*/
function checkNoChinese(labelId, position) {
    var value = $("#" + labelId).val().trim();
    if (!value.match("^\w*$")) {
        setErrorMessage(labelId,false,'Chinese name is not supported！',position);
        return false;
    } else {
        setErrorMessage(labelId,true);
        return true;
    }
 }

/**
* 回车搜索，针对异步请求
* @param evt 事件
* @param func 按回车后要调用的函数
*/
function enterToSearch(evt, func){
    var evt = window.event?window.event:evt;
    if(evt.keyCode==13)
    {
    	if (typeof (func) == "string") {
    		eval(func);
		} else if (typeof (func) == "function") {
			func();
		}
    }
}

/**
* @Method: resetForm
* @Description: 重置表单
* @param formId 表单ID
* @author pzhang
* @date 2017年1月18
*/
function resetForm(formId) {
	$("#" + formId).find(':input').each(function() {
		switch (this.type) {
		case 'passsword':
		case 'select-multiple':
		case 'select-one':
		case 'text':
		case 'textarea':
			$(this).val('');
			break;
		case 'checkbox':
		case 'radio':
			this.checked = false;
	    case 'number':
	        $(this).val('');
	        $(this).attr("min", "0");
	        break;
		}
//        $(this).change();
	});
//	如果该表单下有多个表单元素拥有onchange函数，那么只调用一次就可以了，选择第一个
	$($("#" + formId).find('select')[0]).change();
}

/**
* @Method: modalDialog
* @Description: 自定义弹出框样式
* @param type info/warning/error/confirm
* @param message 现实的信息
* @param func 绑定的事件
* @author pzhang
* @date 2017年1月18
*/
function modalDialog(type, message, func, cancelFunc) {
    var modalElem = $('<div class="modal" tabindex="-1" role="dialog" aria-hidden="true"></div>');
    var modalStr = "", buttonStr = "";
    modalStr += '<div class="modal-dialog" style="width: 40%;">'
             +      '<div class="modal-content">'
             +          '<div class="modal-header">'
             +              '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button>';
    switch (type) {
    case 'info':
        modalStr += '<span class="modal-title text-info span_dialog_head"><span class="glyphicon glyphicon-info-sign"></span>信息提示</span>';
        if (func != null) {
            buttonStr += '<button class="btn btn-primary" onclick="' + func + ';$(this).parent().parent().parent().parent().modal(\'hide\');">确定</button>';
        } else {
            buttonStr += '<button class="btn btn-primary" data-dismiss="modal">确定</button>';
        }
        break;
    case 'warning':
        modalStr += '<span class="modal-title text-warning span_dialog_head" span_dialog_head><span class="glyphicon glyphicon-warning-sign"></span>警告提示</span>';
        if (func != null) {
            buttonStr += '<button class="btn btn-primary" onclick="' + func + ';$(this).parent().parent().parent().parent().modal(\'hide\');">确定</button>';
        } else {
            buttonStr += '<button class="btn btn-primary" data-dismiss="modal">确定</button>';
        }
        break;
    case 'error':
        modalStr += '<span class="modal-title text-danger span_dialog_head"><span class="glyphicon glyphicon-exclamation-sign"></span>错误提示</sapn>';
        if (func != null) {
            buttonStr += '<button class="btn btn-primary" onclick="' + func + ';$(this).parent().parent().parent().parent().modal(\'hide\');">确定</button>';
        } else {
            buttonStr += '<button class="btn btn-primary" data-dismiss="modal">确定</button>';
        }
        break;
    case 'confirm':
        func = func == null ? "" : (func + ";");
        cancelFunc = cancelFunc == null ? "" : (cancelFunc + ";");

        modalStr += '<span class="modal-title text-primary span_dialog_head"><span class="glyphicon glyphicon-question-sign"></span>确认提示</span>';
        buttonStr += '<button class="btn btn-primary" onclick="' + func + '$(this).parent().parent().parent().parent().modal(\'hide\');">是</button>';

        if (cancelFunc == "") {
            buttonStr += '<button class="btn btn-primary" data-dismiss="modal">否</button>';
        } else {
            buttonStr += '<button class="btn btn-primary" onclick="' + cancelFunc + '$(this).parent().parent().parent().parent().modal(\'hide\');">否</button>';
        }
        break;
    }
    modalStr +=         '</div>'
             +          '<div class="modal-body">'
             +              message
             +          '</div>'
             +          '<div class="modal-footer">'
             +              buttonStr
             +          '</div>'
             +      '</div>'
             +  '</div>';

    modalElem.empty().append(modalStr);
    modalElem.modal({backdrop: 'static', keyboard: false});
}

/**
* @Method: isEmptyObj
* @Description: 判断是否为空对象
* @param
* @author pzhang
* @date 2017年1月18
*/
function isEmptyObj(obj) {
    for (var item in obj) {
        return false;
    }
    return true;
}





/**
 * @Method: initDateRangePicker
 * @Description: 初始化项目创建时间的DateRangePicker
 * @param
 * @return void
 * @author yhguo
 * @date 2017年8月18
*/
function initDateRangePicker () {
    var start = moment().subtract(1, 'month').startOf('month');
    var end = moment().endOf('month');
    $('#createTimeInput').daterangepicker({
        autoUpdateInput: false,//（boolean）指示日期范围选择器是否应在初始化时以及所选日期更改时自动更新其附加到的<input>元素的值。
        startDate: start,//最初选择的日期范围的开始
        endDate: end,//最初选定的日期范围的结束
        showDropdowns : true,//（boolean）显示日历上方的年份和月份选择框跳转到特定的月份和年份
        maxDate : moment(), //最大时间（用户可以选择的最新日期）
        ranges: {//（object）设置用户可以选择的预定义日期范围。 每个键是范围的标签，其值是一个数组，其中两个日期表示范围的界限
            '今天': [moment(), moment()],
            '昨天': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            '最近7天': [moment().subtract(6, 'days'), moment()],
            '最近30天': [moment().subtract(29, 'days'), moment()],
            '当前月': [moment().startOf('month'), moment().endOf('month')],
            '上一月': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        locale: {//（object）允许您为按钮和标签提供本地化的字符串，自定义日期格式，并更改日历的第一天。
            format: 'YYYY-MM-DD',
            separator: '/',
            applyLabel: '确定',
            cancelLabel: '取消',
            customRangeLabel: '自定义',
            daysOfWeek : [ '日', '一', '二', '三', '四', '五', '六' ],
            monthNames : [ '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月' ],
            firstDay : 1
        }
    }, function (start, end) {
        $("#createTimeInput").val(start.format('YYYY-MM-DD') + '/' + end.format('YYYY-MM-DD'));
    });
}

/**
 * @Method: initStatusSelect
 * @Description: 初始化项目状态的下拉框，状态为draft、evaluateFail、approveFail的不显示在下拉框中
 * @param
 * @return void
 * @author yhguo
 * @date 2017年8月18
*/
function initStatusSelect () {
    var projectStatus = HSTPMVARS["STATUS"];
    var optionStr = '<option value="">项目状态</option>';
    for (var i in projectStatus) {
        if (i == 'DRAFT' || i == 'APPROVE_FAIL' || i == 'EVALUATE_FAIL') {
            continue;
        }
        optionStr += '<option value=" ' + projectStatus[i] + ' ">' + projectStatus[i] + '</option>';
    }
    $('#statusSelect').empty().append(optionStr);
}

/**
 * @Method: initDivMoreOperatePosition
 * @Description: 操作按钮子菜单按钮位置初始化
 * @param
 * @return void
 * @author yhguo
 * @date 2017年8月18
*/
function initDivMoreOperatePosition () {
    var operateBtnPaddingRight = '';
    var operateDivWidth = '';
    $('.div_operate').each(function(){
		var mainBtn = $($(this).find('>button')[0]);//显示的按钮
		var subMenuDiv = $($(this).find(">div")[0]);//hover之后才显示的包裹按钮的div

		operateBtnPaddingRight = $($(this).find(">button")[0]).css("padding-right");
		operateDivWidth = -subMenuDiv.width() + ( $(this).parent().width() - mainBtn.width() - parseInt(operateBtnPaddingRight)*2 ) / 2;
//        operateDivWidth = - parseInt(subMenuDiv.css('width')) + ( parseInt($(this).css('width')) - parseInt(mainBtn.css('width')) ) / 2;

		subMenuDiv.css("margin-left", operateDivWidth + "px");
		subMenuDiv.css("margin-top", "-" + $(this).css('height'));

		$(subMenuDiv).find('>button').css('width', subMenuDiv.css('width'));
    });
}

/**
* @Method: operateHover
* @Description: 操作按钮区域样式变化控制函数
* @param $ele 操作按钮元素
* @author yhguo
* @date 2017年8月21
*/
function operateHover () {
    $('.div_operate').hover(
        function () {
            $(this).find('.glyphicon').removeClass('glyphicon-triangle-left').addClass('glyphicon-triangle-right');
            $($(this).find(">div")[0]).css('display', 'block');
        },
        function () {
            $(this).find('.glyphicon').removeClass('glyphicon-triangle-right').addClass('glyphicon-triangle-left');
            $($(this).find(">div")[0]).css('display', 'none');
        }
    )
}

/**
* @Method: getPageInfoDict
* @Description: 获取需要传递给后台的页面信息的数据（基本每一个搜索都需要）
* @param: type（搜索哪一页的数据）
* @author yhguo
* @date 2017年8月15
*/
function getPageInfoDict (type) {
    var pageSize = $("#pageSize").val().trim();
    if (!checkPageSize(pageSize)) {
        return false;
	}
	var totalPage = $("#totalPage").text().trim();
	var totalRecord = $("#totalRecord").text().trim();
	var currentPage = $("#currentPage").val().trim();
	currentPage = getCurSearchPage({
	    "pageSize": pageSize,
	    "currentPageNum": currentPage,
	    "totalRecord": totalRecord,
	    "type": type,
	    "curTotalPage": totalPage
	});

    var pageinfo_param = {};
    pageinfo_param['current_page'] = parseInt(currentPage);
	pageinfo_param['page_size'] = parseInt(pageSize);
	return pageinfo_param;
}

/**
* @Method: updatePageInfo
* @Description: 更新页面上分页的信息，ajax请求之后会调用================出现错误未使用
* @param: pageInfo（ajax请求获取的分页数据）; searchFunc（搜索函数）
* @author yhguo
* @date 2017年8月15
*/
function updatePageInfo (pageInfo, searchFunc) {
    $("#pageSize").val(pageInfo.page_size);
    $("#totalPage").text(pageInfo.total_page);
    $("#totalRecord").text(pageInfo.total_record);
    $("#currentPage").val(pageInfo.current_page);
    $("#firstPage").attr("onclick", "searchFunc(1);");
    $("#lastPage").attr("onclick", "searchFunc(" + pageInfo.total_page + ");");
    $("#nextPage").attr("onclick", "searchFunc(" + pageInfo.next_page+ ");");
    $("#previousPage").attr("onclick", "searchFunc(" + pageInfo.previous_page + ");");
}

/**
 * javascript中截取字符串的部分内容
 * @param sutStr 被截取的字符串
 * @param len  设置要截取的长度
 * @returns 返回处理后的字符串
 */
function cutString(sutStr,len){
	//判断是否存在字符串
	if (!sutStr) {
		return sutStr;
	}
	var curLength = 0;
	for (var i = 0; i < sutStr.length; i++) {
	    if (sutStr.charCodeAt(i)>0 && sutStr.charCodeAt(i)<128) {
	        curLength ++;
	    } else {
	        curLength +=2;
	    }
	    if (curLength >= len) {
	        sutStr = sutStr.substring(0,i-2) + "...";
	        return sutStr;
	    }
	}
	return sutStr;
}

/**
* @Method: hasAttr
* @Description: 判断元素是否具有某种属性
* @param el 元素dom对象
* @param name 属性名称
* @author pzhang
* @date 2017年1月18
*/
function hasAttr(el, name){
  var attr = el.getAttributeNode && el.getAttributeNode(name);
  return attr ? attr.specified : false
}

/**
* @Method: addEvent
* @Description: 为dom元素添加某种事件属性
* @param obj dom对象
* @param type 事件名称
* @param callback 回调，获取事件event
* @author pzhang
* @date 2017年1月18
*/
function addEvent(obj, type, callback){
  if (obj.addEventListener) {
    obj.addEventListener(type, callback, false);
  } else if (obj.attachEvent) {
    obj.attachEvent("on" + type, callback);
  }
}

/**
* @Method: addFocusEvent
* @Description: 为元素添加focus事件，包括非表单元素，非表单元素正常没有focus事件
* @param
* @author pzhang
* @date 2017年1月18
*/
function addFocusEvent(el, fn){
  // tabindex为-1的元素，不能通过tab键进行导航，但是可以获得焦点
  // tabindex在0-32767之间，可以根据tabindex用tab键进行导航
  // 当存在多个原色的tabindex为0时，按文档流的顺序进行导航
  if(!hasAttr(el,"tabindex")) {
    el.tabIndex = -1;
  }

  addEvent(el, "focus", function(e){
      fn.call(el, (e || window.event));
  });
}
