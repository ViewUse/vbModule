function queryMain() {
	var appElement = document.querySelector('[ng-controller=MainCtrl]');
	var $scope = angular.element(appElement).scope();
	$scope.init();
	$scope.$apply();
}

function mainCtrl($scope, $state, $timeout, $http, $ionicModal, $ionicLoading,
		CommomService, $filter, $ionicPopup) {
	/*
	 * if (!rootScope.checkSession()) { return; }
	 */
	CommomService.startTime = null;
	var queryParams = {
		charType : 1,
		dateType : 1,
		sellAmountFlag : true,
		gainAmountFlag : false,
		sellNumFlag : false,
		startTime : getLastDate(7),
		endTime : new Date().format("yyyy-MM-dd")
	};

	$scope.doRefresh = function() {
		$scope.init();
		$scope.imgsrc = webHost + "/apploaddata/pieCharStream?"
				+ getQueryStr(queryParams) + "&time=" + new Date().getTime();
		$scope.$broadcast('scroll.refreshComplete');
	};

	$scope.init = function() {
		var startTime = $("#currentDate").val();
		if (typeof (startTime) == "undefined" || startTime == '') {
			startTime = new Date().format('yyyy-MM-dd');
		}
		$http.get(
				webHost + '/apploaddata/getMainInfo?d=' + new Date().getTime(),
				{
					timeout : 8000,
					params : {
						time : startTime,
						identify : "2",
						sellerUserName : seller.userName,
						sellerPassword : seller.password
					}
				}).success(function(result) {
			if (result.success) {
				// console.log('init---' + angular.toJson(result));
				$scope.total = result.total;
				$scope.maoli = result.maoli;
				$scope.sellNum = result.sellNum;
				$scope.counterSeting = result.counterSeting;
				$scope.discountAmount = result.discountAmount;
				$scope.cancelAmount = result.cancelAmount;
			} else {
				showAlert("提示", result.msg ? result.msg : '商家登录失败！');
			}
		}).error(function(result) {
			showAlert('提示', '商家登录失败，请确认网络服务是否连接！');
		});

	};

	$scope.$on("bc-login", function() {
		// console.log("bc-login");
		queryParams.sellerUserName = seller.userName;
		queryParams.sellerPassword = seller.password;
		$scope.time = seller.lastestlogtime;
		$scope.init();
		$scope.imgsrc = webHost + "/apploaddata/pieCharStream?"
				+ getQueryStr(queryParams) + "&time=" + new Date().getTime();
	});

	if (!seller.userName) {
		handler.ionicLoading = $ionicLoading;
		showLoading("正在加载数据，请稍后...");
		/*
		 * $timeout(function() { SellerDao.getLocalUser(function(success,
		 * sellerItem) { hideLoading(); if (success && sellerItem) {
		 * seller.userName = sellerItem.userName; seller.password =
		 * sellerItem.password; queryParams.sellerUserName =
		 * sellerItem.userName; queryParams.sellerPassword =
		 * sellerItem.password; $scope.init(); $scope.imgsrc = webHost +
		 * "/apploaddata/pieCharStream?" + getQueryStr(queryParams)+ "&time=" +
		 * new Date().getTime(); } else { $state.go("login"); } }); }, 1200);
		 */
	} else {
		queryParams.sellerUserName = seller.userName;
		queryParams.sellerPassword = seller.password;
		$scope.imgsrc = webHost + "/apploaddata/pieCharStream?"
				+ getQueryStr(queryParams) + "&time=" + new Date().getTime();
		$scope.init();
	}

	$scope.time = new Date().format("yyyy-MM-dd hh:mm:ss");
	$scope.date = new Date().format("yyyy-MM-dd");
	$scope.week = (new Date()).getDay();

	var dd = function() {
		if ($scope.week == 0) {
			return "日"
		} else if ($scope.week == 1) {
			return "一"
		} else if ($scope.week == 2) {
			return "二"
		} else if ($scope.week == 3) {
			return "三"
		} else if ($scope.week == 4) {
			return "四"
		} else if ($scope.week == 5) {
			return "五"
		} else if ($scope.week == 6) {
			return "六"
		}
	};
	// console.log(dd());

	$scope.day = $scope.date + " 星期" + dd();

	// $scope.day=$scope.date + " 星期" + $scope.week;

	$scope.currentDate = $filter("date")(Date.now(), 'yyyy-MM-dd');

	$scope.preDay = function() {
		var before = $("#currentDate").val();
		before = getYestoday(before);
		$scope.currentDate = before;
		$("#currentDate").val($scope.currentDate);
		$scope.init();
		$("#left-bt").css({
			"font-size" : "28px"
		});
		$("#right-bt").css({
			"font-size" : "22px"
		});
	};

	$scope.nextDay = function() {
		var aa = new Date().format('yyyy-MM-dd')
		var later = $("#currentDate").val();
		later = getNextday(later);
		if (later > aa) {
			showAlert("提示", "此日期不能选择!");
		} else {
			$scope.currentDate = later;
			$("#currentDate").val($scope.currentDate);
			$scope.init();
		}
		$("#left-bt").css({
			"font-size" : "22px"
		});
		$("#right-bt").css({
			"font-size" : "28px"
		});
	};

	function showOrHideDatePicker(isShow) {
		if (typeof $dp == 'undefined' || !$dp)
			return;
		if (isShow) {
			$dp.show();
			return;
		}
		$dp.hide();
	}
	/**
	 * 当 #currentDate 设置为 readonly 时 失去焦点事件失效,
	 * 请直接调用showOrHideDatePicker(显示或隐藏日期选择框)
	 */
	angular.element("#currentDate").bind("blur", function(e) {
		showOrHideDatePicker(false);
	});
	$scope.toRjbb = function() {
		$state.go("rjbb");
	};

	$scope.toXsdj = function() {
		$state.go("xsdj");
	};
	$scope.toHandover = function() {
		$state.go("handover");
	};
	$scope.toSpxs = function() {
		$state.go("spxs");
	};

	$scope.toFjzdj = function() {
		$state.go("fjzdj");
	};

	$scope.toQsfx = function() {
		$state.go("qsfx");
	};

	$scope.toZbtj = function() {
		$state.go("zbtj");
	};
	$scope.toYyhz = function() {
		showOrHideDatePicker(false);
		$state.go("yyhz");
	};
	/*
	 * $scope.$on("$ionicView.beforeLeave", function() {
	 * console.log("ionicView-...-beforeleave"); showOrHideDatePicker(false);
	 * });
	 */
	$scope.toFace = function(stateName) {
		showOrHideDatePicker(false);
		$state.go(stateName);
	};
	// $timeout(function() {document.getElementById("all").style.height =
	// winHeight-44+"px";},500);
	// $timeout(function() {document.getElementById("mh").style.height =
	// winHeight-182+"px";},200);

	$scope.data = {};
	$scope.data.currentShop = rootScope.curQueryShop;//"总店";
	
	/**
	 * Filter sub shop
	 */
	$scope.dealFilter = function() {
		$scope.data.currentShop = rootScope.curQueryShop;
		// var template = "<ion-list><list-item><ion-checkbox
		// ng-model='data.isChecked[0]'>东圃分店</ion-checkbox></list-item><list-item><ion-checkbox
		// ng-model='data.isChecked[1]'>车陂分店</ion-checkbox></list-item><list-item><ion-checkbox
		// ng-model='data.isChecked[2]'>岗顶分店</ion-checkbox></list-item><list-item><ion-checkbox
		// ng-model='data.isChecked[3]'>机场分店</ion-checkbox></list-item></ion-list>";
		var template = "<ion-list><list-item ng-repeat='item in subShopps'>"
				+ "<ion-checkbox ng-model='item.isChecked' ng-value='item'>{{item.name}}</ion-checkbox>"
				+ "</list-item></ion-list>";
		$scope.tPopup = $ionicPopup.show({
			title : '连锁店',
			scope : $scope,
			template : template,
			buttons : [ {
				text : '取消',
				type : 'button-balanced'
			}, {
				text : '确认',
				type : 'button-positive',
				onTap : function() {
					$scope.selectSubShop();
				}
			} ]
		});

	};
	$scope.selectSubShop = function() {
		/*var len = rootScope.subShopps.length;
		var selCount = 0;
		var selShopName = "多家分店";
		for (var si = 0; si < len; si++) {
			if (rootScope.subShopps[si].isChecked) {
				selCount++;
				selShopName = rootScope.subShopps[si].name;
				if (selCount > 1) {
					selShopName = "多家分店";
					break;
				}
			}
		}
		$scope.data.currentShop = selShopName;*/
		rootScope.curQueryShop = $scope.data.currentShop;
	};
	$scope.$on("$destroy", function() {
		$scope.tPopup && $scope.tPopup.close();
	});
	$scope.$on("modal.hidden", function() {
		console.log("modal.hidden");
	});
	$scope.$on("modal.removed", function() {
		console.log("modal.removed");
	});
}
