function zbtjCtrl($scope, $state, $timeout, $http, $ionicModal, $ionicLoading) {
	if (!rootScope.checkSession()) {
		return;
	}
	$scope.goBack = function() {
		$state.go("app.main");
	};
	$scope.data = {
		sellAmountFlag : true,
		gainAmountFlag : false,
		barChart : false,
		lineChart : true,
		sellNumFlag : false,
		pieType : 0,
		category:true,
		pieOrBar : true,
		selectedGroupBy : 'payMethod',
		sellerUserName : seller.userName,
		sellerPassword : seller.password,
		startTime : new Date().format("yyyy-MM-dd"),
		endTime : new Date().format("yyyy-MM-dd")
	};

	$scope.selectChartType = function(index) {
		if (index == 1) {
			$scope.data.barChart = false;
			$scope.data.lineChart = true;
		} else {
			$scope.data.barChart = true;
			$scope.data.lineChart = false;
		}
	}
	$scope.selectedGroupBy = function(group) {
		$scope.data.category = false;
		$scope.data.guider = false;
		$scope.data.cashier = false;
		$scope.data.payMethod = false;
		$scope.data.customer = false;
		if ("category" == group) {
			$scope.data.category = true;
		} else if ("guider" == group) {
			$scope.data.guider = true;
		} else if ("cashier" == group) {
			$scope.data.cashier = true;
		} else if ("payMethod" == group) {
			$scope.data.payMethod = true;
		} else if ("customer" == group) {
			$scope.data.customer = true;
		}
	}
	$scope.selectAmount= function(index) {
		$scope.data.sellAmountFlag=false;
		$scope.data.gainAmountFlag=false;
		$scope.data.sellNumFlag=false;
		if (index == 1) {
			$scope.data.sellAmountFlag=true;
		} else if (index == 2){
			$scope.data.gainAmountFlag=true;
		} else if (index == 3){
			$scope.data.sellNumFlag=true;
		}
	}

	$scope.loadData = function() {
		showLoading("正在加载数据，请稍后...");
		$http.get(webHost + '/apploaddata/proportionList?time=' + new Date().getTime(), {
			timeout : 8000,
			params : $scope.data
		}).success(function(result) {
			hideLoading();
			if (result.success) {
				$scope.trendAnalysisList = result.trendAnalysisList;
				$scope.totalTrendAnalysis = result.totalTrendAnalysis;
				$scope.hideQuery();
			} else {
				showAlert("提示", result.msg ? result.msg : '查询数据失败！');
			}
		}).error(function(result) {
			hideLoading();
			showAlert('提示', '查询失败，请确认网络服务是否连接！');
		});
	}

	$scope.query = function() {
		$scope.data.startTime = $("#startTime").val();
		$scope.data.endTime = $("#endTime").val();
		if ($scope.data.lineChart) {
			$scope.data.pieOrBar = 'pie';
		} else {
			$scope.data.pieOrBar = '';
		}
		if ($scope.data.category) {
			$scope.data.selectedGroupBy = "category";
		} else if ($scope.data.guider) {
			$scope.data.selectedGroupBy = "guider";
		} else if ($scope.data.cashier) {
			$scope.data.selectedGroupBy = "cashier";
		} else if ($scope.data.payMethod) {
			$scope.data.selectedGroupBy = "payMethod";
		} else if ($scope.data.customer) {
			$scope.data.selectedGroupBy = "customer";
		}
		$scope.imgsrc = webHost + "/apploaddata/zbtjCharStream?" + $scope.getQueryStr() + "t=" + new Date().getTime();
		$scope.loadData();
		$scope.hideQuery();
	}
	$scope.getQueryStr = function() {
		var queryStr = "";
		for (var key in $scope.data) {
			queryStr += key + "=" + $scope.data[key] + "&"
		}
		return queryStr;
	}
	$timeout(function() {
		$scope.query();
	}, 200);
	$scope.showQuery = function() {
		if($scope.isShow){
        	$scope.isShow=false;
        	$("#queryDiv")[0].style.display = 'none';
        }else{
        	$scope.isShow=true;
        	$("#queryDiv")[0].style.display = 'block';
        }
	}
	$scope.hideQuery = function() {
		$scope.isShow=false;
		$("#queryDiv")[0].style.display = 'none';
	}
}