function followCtrl($scope, $state) {
	$scope.data = {};
	$scope.data.isChecked = true;
	$scope.isChanged = false;
	
	$scope.subShopChange = function() {
		$scope.isChanged = true;
	};
	
	$scope.leaveView = function() {
		if(!$scope.isChanged) return;
		var slen = rootScope.subShopps.length;
		rootScope.followSubShopps = [];
		for(var si=0;si<slen;si++) {
			if(rootScope.subShopps[si].isChecked) {				
				rootScope.followSubShopps.push(angular.copy(rootScope.subShopps[si]));
			}
		}
		if(rootScope.followSubShopps && rootScope.followSubShopps.length > 0) {
			rootScope.curQueryShop = rootScope.followSubShopps[0];
		}
	};
}