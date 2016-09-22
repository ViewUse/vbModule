function fjzdjDetailCtrl($scope, $state,$rootScope, $timeout, $http, $ionicModal, $ionicLoading, $ionicHistory, CommomService) {

  /*
   *返回上一页
   */
  $scope.goBack = function() {
    $state.go("fjzdj");
  };

  $(document).ready(function(){
    $("#showList").click(function(){
      $("#detailList").slideToggle("fast");
    });
  });

  //单据时间
  $scope.sellTimeStr = $rootScope.reverseListItem.sellTimeStr;

  //收银员
  $scope.workName = $rootScope.reverseListItem.sellerEmployee.workName;

  //流水号
  $scope.id = $rootScope.reverseListItem.sellerEmployee.id;

  //实收
  $scope.factAmount = $rootScope.reverseListItem.factAmount;

  //类型
  $scope.sellTypeName = $rootScope.reverseListItem.sellTypeName;

  //总价
  $scope.totalAmount = $rootScope.reverseListItem.totalAmount;

  //利润
  $scope.gainAmount = $rootScope.reverseListItem.gainAmount;

  //状态
  $scope.statusName = $rootScope.reverseListItem.statusName;

  //数量
  $scope.commodityNum = $rootScope.reverseListItem.commodityNum;

  //会员
  $scope.mobile = $rootScope.reverseListItem.sellerEmployee.mobile;

  //单据明细
  $scope.detailList = $rootScope.reverseListItem.detailList;


}

