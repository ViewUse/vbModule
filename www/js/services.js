angular.module('starter.services', []).factory('CommomService', ["$http", function($http) {
	var self = this;
	self.startTime=null;
	return {
		loadEmployees : function(workType) {
			if (rootScope.employeeList) {
				return rootScope.employeeList;
			}
			return $http.get(webHost + '/apploaddata/loadEmployees?time=' + new Date().getTime(), {
				timeout : 8000,
				params : {
					workType : workType,
					sellerUserName : seller.userName,
					sellerPassword : seller.password
				}
			}).success(function(result) {
				if (result.success) {
					rootScope.employeeList = result.employeeList;
					return rootScope.employeeList;
				} else {
					showAlert("提示", result.msg ? result.msg : '查询数据失败！');
				}
			}).error(function(result) {
				showAlert('提示', '查询失败，请确认网络服务是否连接！');
			});
		},
		loadCommodityTypes : function() {
			if (rootScope.commodityTypeList) {
				return rootScope.commodityTypeList;
			}
			return $http.get(webHost + '/apploaddata/loadCommodityTypes?time=' + new Date().getTime(), {
				timeout : 8000,
				params : {
					sellerUserName : seller.userName,
					sellerPassword : seller.password
				}
			}).success(function(result) {
				if (result.success) {
					rootScope.commodityTypeList = result.commodityTypeList;
					return rootScope.commodityTypeList;
				} else {
					showAlert("提示", result.msg ? result.msg : '查询数据失败！');
				}
			}).error(function(result) {
				showAlert('提示', '查询失败，请确认网络服务是否连接！');
			});
		},
		loadSupplierInfos : function() {
			if (rootScope.supplierInfoList) {
				return rootScope.supplierInfoList;
			}
			return $http.get(webHost + '/apploaddata/loadSupplierInfos?time=' + new Date().getTime(), {
				timeout : 8000,
				params : {
					sellerUserName : seller.userName,
					sellerPassword : seller.password
				}
			}).success(function(result) {
				if (result.success) {
					rootScope.supplierInfoList = result.supplierInfoList;
					return rootScope.supplierInfoList;
				} else {
					showAlert("提示", result.msg ? result.msg : '查询数据失败！');
				}
			}).error(function(result) {
				showAlert('提示', '查询失败，请确认网络服务是否连接！');
			});
		},
		login : function(userName, pwd, isMd5, callBack) {
			if (!isMd5) {
				pwd = hex_md5(pwd);
			}
			$http.get(webHost + '/loginForApp?time=' + new Date().getTime(), {
				timeout : 8000,
				params : {
					userName : userName,
					pwd : pwd,
					isMd5 : $scope.data.isMd5
				}
			}).success(function(result) {
				if (result.login) {
					if (callBack) {
						callBack(true);
					}
				} else {
					if (callBack) {
						callBack(false, result.msg ? result.msg : '商家登录失败！');
					}
				}
			}).error(function(result) {
				if (callBack) {
					callBack(false, '商家登录失败，请确认网络服务是否连接！');
				}
			});
		}
	}
}]);
