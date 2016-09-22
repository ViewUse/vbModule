function queryRjbb(){
	var appElement = document.querySelector('[ng-controller=RjbbCtrl]');
	var $scope = angular.element(appElement).scope();
	$scope.query();
	$scope.$apply();
}
function rjbbCtrl($scope, $state, $timeout, $http, $ionicModal, $ionicLoading, $ionicHistory,CommomService) {
	if (!rootScope.checkSession()) {
		return;
	}
	/*
	 *返回上一页
	 */
	$scope.goBack = function() {
		//$ionicHistory.goBack();
		$state.go("app.main");
	};
	$scope.handover = function() {
		$state.go("handover");
	};
	$scope.startTime = new Date().format("yyyy-MM-dd");
	CommomService.startTime=$scope.startTime;
	//$scope.endTime = new Date().format("yyyy-MM-dd");
	//$scope.selectDate = function(index) {
	//	var startTime = $("#startTime").val();
    //var ab = new Date().format('yyyy-MM-dd')
    //if(startTime > ab) {
     // showAlert("提示", "此日期不能选择!");
     // return;
    //}
	//	if (index == 1) {
	//		startTime = getYestoday(startTime);
	//	} else {
	//		startTime = getNextday(startTime);
	//	}
	//	$scope.startTime = startTime;
	//	$("#startTime").val($scope.startTime);
	//	$scope.query();
	//}

  $scope.preDay = function() {
    var a = $("#startTime").val();
    a = getYestoday(a);
    $scope.startTime = a;
    $("#startTime").val($scope.startTime);
    $scope.query();
    $("#lfbt").css({"font-size": "28px"});
    $("#rgbt").css({"font-size": "22px"});
  }

  $scope.nextDay = function() {
    var bb = new Date().format('yyyy-MM-dd')
    var ab = $("#startTime").val();
    ab = getNextday(ab);
    if(ab > bb) {
      showAlert("提示", "此日期不能选择!");
    }else{
      $scope.startTime = ab;
      $("#startTime").val($scope.startTime);
      $scope.query();
    }
    $("#lfbt").css({"font-size": "22px"});
    $("#rgbt").css({"font-size": "28px"});
  }


	$scope.oldIndex = 0;
	$scope.detail1 = true;
	$scope.showDetail = function(index) {
		if (index == 1) {
			if ($scope.oldIndex == index) {
				//$scope.detail1 = !$scope.detail1;
				$scope.detail1 = true;
			} else {
				$scope.detail1 = true;
			}
			$scope.detail2 = false;
			$scope.detail3 = false;
			$scope.detail4 = false;

      document.getElementById("xssp").style.color="#007fdb";
      document.getElementById("fjz").style.color="#b2b2b2";
      document.getElementById("th").style.color="#b2b2b2";
      document.getElementById("hyk").style.color="#b2b2b2";

		} else if (index == 2) {
			if ($scope.oldIndex == index) {
				//$scope.detail2 = !$scope.detail2;
				$scope.detail2 = true;
			} else {
				$scope.detail2 = true;
			}
			$scope.detail1 = false;
			$scope.detail3 = false;
			$scope.detail4 = false;

      document.getElementById("xssp").style.color="#b2b2b2";
      document.getElementById("fjz").style.color="#007fdb";
      document.getElementById("th").style.color="#b2b2b2";
      document.getElementById("hyk").style.color="#b2b2b2";

		} else if (index == 3) {
			if ($scope.oldIndex == index && $scope.detail3) {
				//$scope.detail3 = !$scope.detail3;
				$scope.detail3 = true;
			} else {
				$scope.detail3 = true;
			}
			$scope.detail1 = false;
			$scope.detail2 = false;
			$scope.detail4 = false;


      document.getElementById("xssp").style.color="#b2b2b2";
      document.getElementById("fjz").style.color="#b2b2b2";
      document.getElementById("th").style.color="#007fdb";
      document.getElementById("hyk").style.color="#b2b2b2";

		} else if (index == 4) {
			if ($scope.oldIndex == index && $scope.detail4) {
				//$scope.detail4 = !$scope.detail4;
				$scope.detail4 = true;
			} else {
				$scope.detail4 = true;
			}
			$scope.detail1 = false;
			$scope.detail2 = false;
			$scope.detail3 = false;


      document.getElementById("xssp").style.color="#b2b2b2";
      document.getElementById("fjz").style.color="#b2b2b2";
      document.getElementById("th").style.color="#b2b2b2";
      document.getElementById("hyk").style.color="#007fdb";


		}
		if (index == 1) {
			//$scope.item = {
			//	cashAmount : $scope.productSaleCash,
			//	preCashAmount : $scope.productSaleDebitpay,
			//	unionpayAmount : $scope.productSaleUnionPay,
			//	alipayAmount : $scope.productSaleAlipay,
			//	wxPayAmount : $scope.productSaleWeChatpay
			//};
      $scope.cashAmount = $scope.productSaleCash;
      $scope.preCashAmount= $scope.productSaleDebitpay;
      $scope.unionpayAmount= $scope.productSaleUnionPay;
      $scope.alipayAmount =  $scope.productSaleAlipay;
      $scope.wxPayAmount =  $scope.productSaleWeChatpay;
		} else if (index == 2) {
			//$scope.item = {
			//	cashAmount : $scope.returnCashAmount,
			//	preCashAmount : $scope.returnPrepayAmount,
			//	unionpayAmount : 0.00,
			//	alipayAmount : 0.00,
			//	wxPayAmount : 0.00
			//};
	  $scope.cashAmount = $scope.reverseCashAmount;
      $scope.preCashAmount= $scope.reversePrepayAmount;
      $scope.unionpayAmount= 0.00;
      $scope.alipayAmount =  0.00;
      $scope.wxPayAmount =  0.00;
      
		} else if (index == 3) {
			//$scope.item = {
			//	cashAmount : $scope.reverseCashAmount,
			//	preCashAmount : $scope.reversePrepayAmount,
			//	unionpayAmount : 0.00,
			//	alipayAmount : 0.00,
			//	wxPayAmount : 0.00
			//};
	  $scope.cashAmount = $scope.returnCashAmount;
      $scope.preCashAmount= $scope.returnPrepayAmount;
      $scope.unionpayAmount= 0.00;
      $scope.alipayAmount =  0.00;
      $scope.wxPayAmount =  0.00;
		} else if (index == 4) {
			//$scope.item = {
			//	cashAmount : $scope.sellerRechargeCash,
			//	preCashAmount : 0.00,
			//	unionpayAmount : $scope.sellerRechargeUnionPay,
			//	alipayAmount : $scope.sellerRechargeAlipay,
			//	wxPayAmount : $scope.sellerRechargeWeChatpay
			//};
      $scope.cashAmount = $scope.sellerRechargeCash;
      $scope.preCashAmount= 0.00;
      $scope.unionpayAmount= $scope.sellerRechargeUnionPay;
      $scope.alipayAmount =  $scope.sellerRechargeAlipay;
      $scope.wxPayAmount =  $scope.sellerRechargeWeChatpay;
		}
		$scope.oldIndex = index;
	}
	$scope.query = function() {
		var startTime = $("#startTime").val();
		CommomService.startTime=startTime;
		showLoading("正在加载数据，请稍后...");
		$http.get(webHost + '/apploaddata/getRjbbInfo?time=' + new Date().getTime(), {
			timeout : 8000,
			params : {
				startTime : startTime,
				endTime : startTime,
				sellerUserName : seller.userName,
				sellerPassword : seller.password
			}
		}).success(function(result) {
			hideLoading();
			if (result.success) {
        //console.log('日结报表---' + angular.toJson(result));
				$scope.sellInfo = result.sellInfo;
				$scope.sellInfoReverse = result.sellInfoReverse;
				$scope.sellInfoReturnGoods = result.sellInfoReturnGoods;
				$scope.sellInfoRechargeReport = result.sellInfoRechargeReport;
				$scope.totalInfo = result.totalInfo;
				$scope.handoverServiceList = result.handoverServiceList;		
		        $scope.cashAmount = result.productSaleCash;
		        $scope.preCashAmount= result.productSaleDebitpay;
		        $scope.unionpayAmount= result.productSaleUnionPay;
		        $scope.alipayAmount =  result.productSaleAlipay;
		        $scope.wxPayAmount =  result.productSaleWeChatpay;
				$scope.productSaleCash = result.productSaleCash;
				$scope.productSaleDebitpay = result.productSaleDebitpay;
				$scope.productSaleUnionPay = result.productSaleUnionPay;
				$scope.productSaleAlipay = result.productSaleAlipay;
				$scope.productSaleWeChatpay = result.productSaleWeChatpay;
				$scope.sellerRechargeCash = result.sellerRechargeCash;
				$scope.sellerRechargeUnionPay = result.sellerRechargeUnionPay;
				$scope.sellerRechargeAlipay = result.sellerRechargeAlipay;
				$scope.sellerRechargeWeChatpay = result.sellerRechargeWeChatpay;
				$scope.reverseCashAmount = result.reverseCashAmount;
				$scope.reversePrepayAmount = result.reversePrepayAmount;
				$scope.returnCashAmount = result.returnCashAmount;
				$scope.returnPrepayAmount = result.returnPrepayAmount;
				$scope.total = result.total;
				$scope.change = result.change;



			} else {
				showAlert("提示", result.msg ? result.msg : '查询数据失败！');
			}
		}).error(function(result) {
			hideLoading();
			showAlert('提示', '查询失败，请确认网络服务是否连接！');
		});
	}
	$timeout(function() {
		$scope.query();
	}, 200);

//	 $(document).ready(function(){
//		  setTimeout(function(){document.getElementById("rj1").style.height=winHeight/7+"px"},30);
//		  setTimeout(function(){document.getElementById("rj2").style.height=winHeight/7+"px"},30);
//	 });
}
