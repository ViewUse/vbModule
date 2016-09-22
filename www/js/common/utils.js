/*******************************************************************************
 * 获取随机数
 *
 * @param {}
 *            min
 * @param {}
 *            max
 * @return {}
 */
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

Date.prototype.format = function(format) {
	var o = {
		"M+" : this.getMonth() + 1, // month
		"d+" : this.getDate(), // day
		"h+" : this.getHours(), // hour
		"m+" : this.getMinutes(), // minute
		"s+" : this.getSeconds(), // second
		"q+" : Math.floor((this.getMonth() + 3) / 3), // quarter
		"S" : this.getMilliseconds()
		// millisecond
	}

	if (/(y+)/.test(format)) {
		format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}

	for (var k in o) {
		if (new RegExp("(" + k + ")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
		}
	}
	return format;
}
/*验证正数(最多两位小数)*/
function checkPositiveNumber(obj) {
	var re = /^(?:(?:(?:[1-9]\d{0,2}(?:,\d{3})*)|[1-9]\d*|0))(?:\.\d{1,2})?$/;
	if ( typeof obj == "object") {
		if (!re.test(obj.value)) {
			return false;
		} else {
			return true;
		}
	} else {
		if (!re.test(obj)) {
			return false;
		} else {
			return true;
		}
	}
}

/* 验证正数 */
function checkNumber(value) {
	var re = /^[0-9]\d*$/;
	if (!re.test(value)) {
		return false;
	} else {
		return true;
	}
}

/* 验证整数 */
function isInteger(str) {
	var regu = /^[-]{0,1}[0-9]{1,}$/;
	return regu.test(str);
}

/**
 * 验证是否手机号码
 */
function isMobile(mobile) {
	//定义手机号码正规表达式
	var reg = /^(130|131|132|133|134|135|136|137|138|139|140|141|142|143|144|145|146|147|148|149|150|151|152|153|155|156|157|158|159|180|181|182|183|185|186|187|188|189)\d{8}$/;
	if (mobile) {
		if (!reg.test(mobile)) {
			return false;
		}
	} else {
		return false;
	}
	return true;
}

/**
 * 验证用户名
 */
function isUserName(value) {
	var re = /^[a-zA-Z]+[a-zA-Z0-9_]*$/;
	if (!re.test(value)) {
		return false;
	} else {
		return true;
	}
}

/**
 * 创建销售单ID
 */
function creatId(date, prefix) {
	var random = "";
	for (var i = 0; i < 4; i++) {
		random += getRandomInt(0, 9);
	}
	var ms = date.getMilliseconds() + "";
	if (ms.length < 3) {
		for (var i = 0; i < 3; i++) {
			ms = '0' + ms;
		}
	}

	return prefix + date.format("yyyyMMddhhmmss") + ms + random;
}

/**
 * 销售明细类型
 * @param {Object} type0下单，1追加
 */
function getSellDetailType(type) {
	if (type == '1') {
		return "追加";
	} else {
		return "下单";
	}
}

/**
 * 校验数据，如果为空则设置成默认值
 * @param {Object} value
 * @param {Object} defaultValue
 */
function nvlValue(value, defaultValue) {
	if (!value || value == 'null') {
		value = defaultValue;
	}
	return value;
}

/**
 * 弹出确定
 * @param {Object} title
 * @param {Object} message
 * @param {Object} fn
 */
function showConfirm(title, message, fn) {
	handler.ionicPopup.confirm({
		title : title,
		content : message
	}).then(fn);
}

/**
 * 弹出确定
 * @param {Object} title
 * @param {Object} message
 * @param {Object} fn
 */
function showAlert(title, message, fn) {
	handler.ionicPopup.alert({
		title : title,
		content : message
	}).then(fn);
}

function showCloseAlert(title, message, ti, fn) {
	var id = creatId(new Date(), 'T');
	var p = Ext.Msg.show({
		title : title,
		id : id,
		message : message,
		buttons : [{
			text : '确定' + "",
			id : id + 'btn',
			itemId : 'yes'
		}],
		fn : fn
	});
	var k = ti - 1;
	var st = setInterval(function() {
		if (k < 1) {
			window.clearInterval(st);
			p.hide();
			return;
		}
		if (Ext.getCmp(id + 'btn')) {
			Ext.getCmp(id + 'btn').setText("确定" + "(" + k + "秒)");
		} else {
			window.clearInterval(st);
			p.destroy();
			return;
		}
		k--;
	}, 1000);
}

/**
 * 组装查询条件
 */
function mkWhere(data) {
	var arr = [];
	if ( typeof data === 'object') {
		for (var i in data) {
			if (isNaN(data[i])) {
				arr.push(i + "='" + data[i] + "'");
			} else {
				arr.push(i + "=" + data[i] + "");
			}
		}
	}
	return arr.join(' , ');
}

function toUtf8(str) {
	var out, i, len, c;
	out = "";
	len = str.length;
	for ( i = 0; i < len; i++) {
		c = str.charCodeAt(i);
		if ((c >= 0x0001) && (c <= 0x007F)) {
			out += str.charAt(i);
		} else if (c > 0x07FF) {
			out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
			out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
			out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
		} else {
			out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
			out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
		}
	}
	return out;
}

/**
 * 限制输入长度
 * @param {Object} content
 * @param {Object} len
 * @param {Object} type1左2右对齐
 */
function limitLen(content, len, type) {
	if (!content) {
		return "";
	}
	content = content + '';
	if (content.length > len) {
		return content.substring(0, len) + "... ";
	} else {
		for (var i = content.length; i < (len + 1); i++) {
			if (type == 2) {
				content = " " + content;
			} else {
				content += " ";
			}
		}
		return content
	}
}

/**
 * 判断版本是否更新
 * @param {Object} callBack
 */
function isVersionUpdate(httpUtil, callBack) {
	httpUtil.jsonp({
		url : webHost + '/version/checkPadVersion?time=' + new Date().getTime,
		useDefaultXhrHeader : false,
		params : {
			brand : brand
		},
		success : function(response) {
			var result = Ext.JSON.decode(response.responseText);
			if (result.state) {
				var versionCode = parseFloat(result.versionCode);
				if (versionCode > parseFloat(version)) {
					if (callBack) {
						callBack(true, null, result.versionCode, result.packgeName, result.content);
					}
				} else {
					if (callBack) {
						callBack(false, "当前已是最新版本!");
					}
				}
			} else {
				if (callBack) {
					callBack(false, result.msg);
				}
			}
		},
		failure : function(response, opts) {
			if (callBack) {
				callBack(false, "检查新版本出错，<br/>未连接到服务器，请检查网络状态！");
			}
		}
	});
}

/**
 * 打开升级提示
 */
function showUpgrade(versionCode, packgeName, content) {
	var upgradeView = Ext.Viewport.add({
		xtype : 'panel',
		id : 'upgradeView',
		centered : true,
		modal : true,
		hideOnMaskTap : false,
		hidden : true,
		width : 350,
		height : 250,
		scrollable : false,
		items : [{
			xtype : 'toolbar',
			title : '版本更新',
			docked : 'top'
		}, {
			xtype : 'formpanel',
			scrollable : false,
			cls : 'bggreen',
			width : '100%',
			height : 250,
			items : [{
				xtype : "panel",
				height : 30,
				html : '检测到新版本【' + versionCode + '】，立即更新吗?'
			}, {
				xtype : "fieldset",
				padding : '0 0 0 0',
				margin : '0 0 0 0',
				defaults : {
					labelWidth : 70
				},
				items : [{
					xtype : 'textareafield',
					name : 'content',
					height : 120,
					readOnly : true,
					value : content ? content : '未填写更新内容',
					label : '详情'
				}]
			}, {
				xtype : 'fieldset',
				layout : 'hbox',
				padding : '0 0 0 0',
				margin : '0 0 0 0',
				defaults : {
					height : 40,
					width : '50%'
				},
				items : [{
					xtype : 'button',
					ui : 'confirm',
					iconMask : true,
					text : '取消',
					handler : function() {
						Ext.getCmp('upgradeView').destroy();
					}
				}, {
					xtype : 'button',
					ui : 'decline',
					iconMask : true,
					margin : '0 0 0 1',
					text : '更新',
					handler : function() {
						var apkUrl = webHost + "/version/downPadPackge?brand=" + brand + "&fileName=" + packgeName;
						//alert(apkUrl);
						window.CommonPlugin.upgradeVersion(apkUrl, packgeName, function(successData) {
						}, function(msg) {
							showAlert('升级出错', msg);
						});
						Ext.getCmp('upgradeView').destroy();
					}
				}]
			}]
		}]
	});
	upgradeView.show();
}

/**
 * 判断激活码是否过期
 */
function isActivationOverdue() {
	return (parseInt(activationinfo.expirationDate) < new Date().getTime());
}

/**
 * 判断版本是否更新
 * @param {Object} callBack
 */
function isActivation($scope, callBack) {
	SellerDao.getActivationInfo(function(success, res) {
		if (!res) {
			$scope.openModal();
			if (callBack) {
				callBack(false);
			}
		} else {
			seller.activationCode = res.activationCode;
			activationinfo = {
				id : res.id,
				ecode : res.ecode,
				activationCode : res.activationCode,
				activationDate : res.activationDate,
				isRegister : res.isRegister,
				expirationDate : res.expirationDate
			}
			if (callBack) {
				callBack(true);
			}
		}
	});
}

function addViewport(xtype, id, width, height, left, top, modal) {
	return Ext.Viewport.add({
		xtype : 'panel',
		id : id,
		modal : modal ? modal : true,
		width : width,
		top : top,
		left : left,
		height : height,
		layout : {
			type : 'vbox',
			align : 'center'
		},
		items : [{
			xtype : xtype
		}]
	});
}

/**
 * 读取地址参数
 * @param {Object} strName
 */
function getRequestParam(paramName) {
	var strHref = location.href;
	var intPos = strHref.indexOf("?");
	if (!intPos == -1) {
		return "";
	}
	var strRight = strHref.substr(intPos + 1);
	var arrTmp = strRight.split("&");
	for (var i = 0; i < arrTmp.length; i++) {
		var arrTemp = arrTmp[i].split("=");
		if (arrTemp[0].toUpperCase() == paramName.toUpperCase()) {
			return arrTemp[1];
		}
	}
	return "";
}

function getQueryStr(data) {
	var queryStr = "";
	for (var key in data) {
		queryStr += key + "=" + data[key] + "&"
	}
	return queryStr;
}

function getLastDate(d) {
	var now = new Date();
	var date = new Date(now.getTime() - d * 24 * 3600 * 1000);
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	if (month < 10) {
		month = "0" + month;
	}
	if (day < 10) {
		day = "0" + day;
	}
	return (year + '-' + month + '-' + day);
}

//下一天
function getNextday(today) {
	var t = new Date(today);
	var tm = new Date(t.getFullYear(), t.getMonth(), t.getDate() + 1);
	var m = '0' + (tm.getMonth() + 1);
	var d = '0' + tm.getDate()
	return tm.getFullYear() + '-' + m.substr(m.length - 2) + '-' + d.substr(d.length - 2);

}

//前一天
function getYestoday(date) {
	var t = new Date(date);
	var yesterday_milliseconds = t.getTime() - 1000 * 60 * 60 * 24;
	var yesterday = new Date();
	yesterday.setTime(yesterday_milliseconds);
	var strYear = yesterday.getFullYear();
	var strDay = yesterday.getDate();
	var strMonth = yesterday.getMonth() + 1;
	if (strMonth < 10) {
		strMonth = "0" + strMonth;
	}
	if (strDay < 10) {
		strDay = "0" + strDay
	}
	return strYear + "-" + strMonth + "-" + strDay;
}



//前一月
function getPreMonth(date) {
  var t = new Date(date);
  var yesterday = new Date(t.getFullYear(), t.getMonth());
  var strYear = yesterday.getFullYear();
  var strMonth = yesterday.getMonth();
  if (strMonth < 10 && strMonth!=0) {
    strMonth = "0" + strMonth;
  }
  if (strMonth == 0) {
    strYear = strYear - 1;
    strMonth = 12;
  }
  return strYear + "-" + strMonth ;
}





//下一月
function getNextMonth(today) {
  var t = new Date(today);
  var tm = new Date(t.getFullYear(), t.getMonth());
  var strYear = tm.getFullYear();
  var strMonth = tm.getMonth()+1;
  if (strMonth == 12) {
    strYear = strYear + 1;
    strMonth = 0;
  }
  strMonth = strMonth+1;
  if (strMonth < 10 && strMonth!=0 ) {
    strMonth = "0" +strMonth;
  }
  return strYear + "-" + strMonth ;
}






//显示加载
function showLoading(template) {
	handler.ionicLoading.show({
		template : template
	});
}
//隐藏加载
function hideLoading() {
	handler.ionicLoading.hide();
}

//根据名称查询控制
function getCtrl(name){
	var appElement = document.querySelector('[ng-controller='+name+']');
	return angular.element(appElement).scope();
}
