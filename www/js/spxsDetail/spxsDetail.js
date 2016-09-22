function spxsDetailCtrl($scope, $state, $rootScope,$timeout, $http, $ionicModal, $ionicLoading, $ionicHistory, CommomService) {

  /*
   *返回上一页
   */
  $scope.goBack = function() {
    $state.go("spxs");
  };
  //$scope.toSpxsDetail= function(item) {
	//   // $rootScope.spxsListItem = item;
	//    $state.go("spxsDetail");
  //};

  $scope.name =$rootScope.commoditySellListItem.productName;

  $scope.productType =$rootScope.commoditySellListItem.productType;

  $scope.sellNum =$rootScope.commoditySellListItem.sellNum;

  $scope.stock =$rootScope.commoditySellListItem.inventory;

  $scope.productCost=$rootScope.commoditySellListItem.productCost;

  $scope.realityMoney=$rootScope.commoditySellListItem.realityMoney;

  $scope.profit=$rootScope.commoditySellListItem.profit;


}
