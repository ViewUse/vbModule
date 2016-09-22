function loginCtrl($scope, $state, $timeout, $http, $ionicModal, $ionicLoading) {
	$scope.data = {};
	//$scope.data.username = 'edgeman';
	//$scope.data.password = '1111';
	if (seller.userName) {
		$scope.data.isMd5 = 1;
	} else {
		$scope.data.isMd5 = 0;
	}
	 $timeout(function() {
			document.getElementById("a").style.marginTop = winHeight*0.175+"px";
		},200);
	 $timeout(function() {
			document.getElementById("b").style.marginTop = winHeight*0.125+"px";
		},200);
	$scope.data.oldPassword = seller.password;
	$scope.data.username = seller.userName;
	$scope.data.password = seller.password;
	$scope.loginDelay = function() {
		/*var userName = $scope.data.username;
		var pwd = $scope.data.password;
		if (!userName) {
			showAlert("提示", "请输入账号");
			return;
		}
		if (!pwd) {
			showAlert("提示", "请输入密码");
			return;
		}
		if (!$scope.data.oldPassword == pwd) {
			$scope.data.isMd5 = "0";
		}
		showLoading("正在登录，请稍后...");*/
		var userName = $scope.data.username;
		var pwd = $scope.data.password;
		$http.get(webHost + '/loginForApp?time=' + new Date().getTime(), {
			timeout : 8000,
			params : {
				userName : $scope.data.username,
				pwd : $scope.data.password,
				isMd5 : $scope.data.isMd5
			}
		}).success(function(result) {
			hideLoading();
			if (result.login) {
				seller.userName = $scope.data.username;
				if ($scope.data.oldPassword == $scope.data.password) {
					seller.password = $scope.data.password;
				} else {
					seller.password = hex_md5($scope.data.password);
					$scope.data.isMd5 = "1";
				}
				seller.lastestlogtime = new Date().format("yyyy-MM-dd hh:mm:ss");
				resetRootData();  // 重设数据
				SellerDao.deleteAllSeller();
				SellerDao.addSeller(seller)
				$state.go("app.main");
			} else {
				showAlert("提示", result.msg ? result.msg : '商家登录失败！');
			}
		}).error(function(result) {
			hideLoading();
			showAlert('提示', '商家登录失败，请确认网络服务是否连接！');
		});
	};
	$scope.login = function() {
		if(window.cordova && window.cordova.plugins.Keyboard) {
			if(window.cordova.plugins.Keyboard.isVisible)
				window.cordova.plugins.Keyboard.close();
		}
		var userName = $scope.data.username;
		var pwd = $scope.data.password;
		if (!userName) {
			showAlert("提示", "请输入账号");
			return;
		}
		if (!pwd) {
			showAlert("提示", "请输入密码");
			return;
		}
		if (!$scope.data.oldPassword == pwd) {
			$scope.data.isMd5 = "0";
		}
		showLoading("正在登录，请稍后...");
		$timeout(function() {
			$scope.loginDelay();
		}, 1500);
	};
}