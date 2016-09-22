function handoverDetailCtrl($scope, $state, $rootScope,$timeout, $http, $ionicModal, $ionicLoading, $ionicHistory, CommomService) {

  /*
   *返回上一页
   */
  $scope.goBack = function() {
    $state.go("handover");
  };

  $scope.workName=$rootScope.handoverListItem.workName;

  $scope.workId= $rootScope.handoverListItem.workId;

  $scope.startTime = $rootScope.handoverListItem.startTime;

  $scope.endTime = $rootScope.handoverListItem.endTime;
  
  $scope.inputAmount = $rootScope.handoverListItem.inputAmount;//手动输入金额
  //alert("inputAmount"+"=="+$scope.inputAmount);
  
  //银联卡
  $scope.unionpayAmount= $rootScope.handoverListItem.unionpayAmount;

  //反结账
  $scope.reverseSellAmount= $rootScope.handoverListItem.reverseSellAmount;

  //反结账现金
  $scope.reverseCashAmount= $rootScope.handoverListItem.reverseCashAmount;

  //支付宝
  $scope.alipayAmount= $rootScope.handoverListItem.alipayAmount;

  //微信
  $scope.wxpayAmount= $rootScope.handoverListItem.wxpayAmount;

  //现金
  $scope.cashAmount= $rootScope.handoverListItem.cashAmount;

  //单数
  $scope.sellNum= $rootScope.handoverListItem.sellNum;

  //销售总额
  $scope.sellAmount= $rootScope.handoverListItem.sellAmount;

  //退款
  $scope.returnAmount= $rootScope.handoverListItem.returnAmount;

  //退款现金
  $scope.returnCashAmount= $rootScope.handoverListItem.returnCashAmount;

  //备用金
  $scope.pettyCash= $rootScope.handoverListItem.pettyCash;

  //储值卡
  $scope.prepayAmount= $rootScope.handoverListItem.prepayAmount;

  $scope.cHeight= 404;
  //$timeout(function() {document.getElementById("hig").style.height = winHeight-140+"px";},100);
  
  $scope.oldIndex = 0;
  $scope.hDetail1 = true;
  $scope.showHdetail = function(index) {
		if (index == 1) {
			if ($scope.oldIndex == index) {
				$scope.hDetail1 = true;
			} else {
				$scope.hDetail1 = true;
			}
			$scope.hDetail2 = false;
			
		    //document.getElementById("payType").style.color="#007fdb";		
			//document.getElementById("bill").style.color="#b2b2b2";
		    $("#payType").css({"color":"#007fdb","border-bottom": "2px solid #007fdb"});
		    $("#bill").css({"color":"#b2b2b2","border-bottom": "none"});

		} else if (index == 2) {
			if ($scope.oldIndex == index) {
				$scope.hDetail2 = true;
			} else {
				$scope.hDetail2 = true;
			}
			$scope.hDetail1 = false;

			 //document.getElementById("payType").style.color="#b2b2b2";
			//document.getElementById("bill").style.color="#007fdb";
			 $("#payType").css({"color":"#b2b2b2","border-bottom": "none"});
			 $("#bill").css({"color":"#007fdb","border-bottom": "2px solid #007fdb"});

		}
	}
//  $scope.showHdetail=function(){
//	  $scope.hDetail1 = true;
//	  document.getElementById("payType").style.color="#007fdb";
//	  document.getElementById("bill").style.color="#b2b2b2";
//  }
//  $scope.showHdetai2=function(){
//	  $scope.hDetail2 = true;
//	  document.getElementById("payType").style.color="#007fdb";
//	  document.getElementById("bill").style.color="#b2b2b2";
//  }
}
