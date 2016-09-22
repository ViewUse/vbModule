angular.module('starter.controllers', []).controller('AppCtrl', ["$scope", "$state", "$ionicModal", "$timeout", function($scope, $state, $ionicModal, $timeout) {

	// With the new view caching in Ionic, Controllers are only called
	// when they are recreated or on app start, instead of every page change.
	// To listen for when this page is active (for example, to refresh data),
	// listen for the $ionicView.enter event:
	//$scope.$on('$ionicView.enter', function(e) {
	//});

	// Form data for the login modal
	$scope.loginData = {};

	// Open the login modal
	$scope.logoutSystem = function() {
		seller={};
		$state.go("login");
		SellerDao.deleteAllSeller();
	};
	$scope.$on("$ionicView.leave", function() {
		//console.log("parent - leave");
		showOrHideDatePicker(false);
	});
}])
  .controller('HandoverCtrl', ["$scope", "$state", "$timeout", "$http", "$ionicModal", "$ionicPopup","$ionicLoading", "$ionicHistory", "CommomService","$rootScope", handoverCtrl])
  .controller('XsdjCtrl', ["$scope", "$state", "$timeout", "$http", "$ionicModal", "$ionicLoading", "$ionicPopup", "$ionicHistory", "CommomService", "$filter", xsdjCtrl])
  .controller('QsfxCtrl', ["$scope", "$state", "$timeout", "$http", "$ionicModal", "$ionicLoading", "$ionicPopup", qsfxCtrl])
  .controller('ZbtjCtrl', ["$scope", "$state", "$timeout", "$http", "$ionicModal", "$ionicLoading", zbtjCtrl])
  .controller('FjzdjCtrl', ["$scope", "$state", "$timeout", "$http", "$ionicModal", "$ionicPopup", "$ionicLoading", "$ionicHistory", "CommomService", fjzdjCtrl])
  .controller('SpxsCtrl', ["$scope", "$state", "$timeout", "$http", "$ionicPopup", "$ionicModal", "$ionicLoading", "$ionicHistory", "CommomService", "$rootScope", spxsCtrl])
  .controller('RjbbCtrl', ["$scope", "$state", "$timeout", "$http", "$ionicModal", "$ionicLoading", "$ionicHistory","CommomService", rjbbCtrl])
  .controller('YyhzCtrl', ["$scope", "$state", "$timeout", "$http", "$ionicLoading", "CommomService", "$filter", "$ionicScrollDelegate", yyhzCtrl])
  .controller('MainCtrl', ["$scope", "$state", "$timeout", "$http", "$ionicModal", "$ionicLoading", "CommomService", "$filter", "$ionicPopup", mainCtrl])
  .controller('LoginCtrl', ["$scope", "$state", "$timeout", "$http", "$ionicModal", "$ionicLoading", loginCtrl])
  .controller('HandoverDetailCtrl', ["$scope", "$state", "$rootScope","$timeout", "$http", "$ionicModal", "$ionicLoading", "$ionicHistory", "CommomService", handoverDetailCtrl])
  .controller('FjzdjDetailCtrl', ["$scope", "$state", "$rootScope", "$timeout", "$http", "$ionicModal", "$ionicLoading", "$ionicHistory", "CommomService", fjzdjDetailCtrl])
  .controller('SpxsDetailCtrl', ["$scope", "$state", "$rootScope", "$timeout", "$http", "$ionicModal", "$ionicLoading", "$ionicHistory", "CommomService", spxsDetailCtrl])
  .controller('FollowCtrl', ["$scope", "$state", followCtrl]);