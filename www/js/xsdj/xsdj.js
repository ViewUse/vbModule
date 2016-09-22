function xsdjCtrl($scope, $state, $timeout, $http, $ionicModal, $ionicLoading, $ionicPopup, $ionicHistory, CommomService, $filter) {
	if (!rootScope.checkSession()) {
		return;
	}
	$scope.data = {};
	$scope.totalCount = 0;
	$scope.totalPage = 1;
	$scope.currPage = 1;
	$scope.pageSize = 100;
	$scope.sellList = [];
	/*
	 *返回上一页
	 */
	$scope.goBack = function() {
		$state.go("app.main");
	};
	$scope.data.startTime = new Date().format("yyyy-MM-dd");
	$scope.data.endTime = new Date().format("yyyy-MM-dd");

	$scope.loadData = function() {
		//$("#startTime").val();
		//$("#endTime").val();
		//console.log("查询: " + startTime + "--" + endTime);
		var startTime = $scope.data.startTime;
		var endTime = $scope.data.endTime;
		showLoading("正在加载数据，请稍后...");
		$http.get(webHost + '/apploaddata/getSellInfo?time=' + new Date().getTime(), {
			timeout : 8000,
			params : {
				startTime : startTime,
				endTime : endTime,
				employeeId : $scope.data.employeeId,
				sellType : $scope.data.sellType,
				status : $scope.data.status,
				currPage : $scope.currPage,
				pageSize : $scope.pageSize,
				sellerUserName : seller.userName,
				sellerPassword : seller.password
			}
		}).success(function(result) {
			hideLoading();
			$scope.$broadcast('scroll.refreshComplete');
			if (result.success) {
				var g = result.totalCount % $scope.pageSize;
				$scope.totalPage = parseInt(result.totalCount / $scope.pageSize) + (g > 0 ? 1 : 0);
				for (var i = 0; i < result.sellList.length; i++) {
					$scope.sellList.unshift(result.sellList[i]);
				}
				var orderBy = $filter('orderBy');
				$scope.sellList = orderBy($scope.sellList, 'sellTime', false);
				console.log($scope.sellList);
				$scope.hideQuery();
			} else {
				showAlert("提示", result.msg ? result.msg : '查询数据失败!');
			}
		}).error(function(result) {
			hideLoading();
			$scope.$broadcast('scroll.refreshComplete');
			showAlert('提示', '查询失败，请确认网络服务是否连接！');
		});
	};
	
	$scope.loadSellDetail = function(sellId) {
		$http.get(webHost + '/apploaddata/loadSellDetail?time=' + new Date().getTime(), {
			timeout : 8000,
			params : {
				sellId : sellId,
				sellerUserName : seller.userName,
				sellerPassword : seller.password
			}
		}).success(function(result) {
			if (result.success) {
				$scope.sellDetailList = result.sellDetailList;
				$scope.hideQuery();
			} else {
				showAlert("提示", result.msg ? result.msg : '查询数据失败！');
			}
		}).error(function(result) {
			showAlert('提示', '查询失败，请确认网络服务是否连接！');
		});
	};
	$scope.query = function() {
		rootScope.scrollTop("xsMainScroll");
		$scope.currPage = 1;
		$scope.sellList = [];
		$scope.loadData();
	};
	$timeout(function() {
		$scope.query();
	}, 200);

	$scope.toSx = function() {
		$state.go("sx");
	};
	$ionicModal.fromTemplateUrl('templates/sellInfo.html', {
		scope : $scope,
		animation : 'slide-in-up'
	}).then(function(modal) {
		$scope.sellInfoModal = modal;
	});
	$scope.openSellInfoModal = function(item) {
		$scope.item = item;
		$scope.loadSellDetail(item.id);
		$scope.sellInfoModal.show();
	};
	$scope.closeSellInfoModal = function() {
		$scope.sellInfoModal.hide();
	};
	//Cleanup the modal when we're done with it!
	$scope.$on('$destroy', function() {
		$scope.sellInfoModal.remove();
	});

	$scope.doRefresh = function() {
		if ($scope.currPage >= $scope.totalPage) {
			$scope.$broadcast('scroll.refreshComplete');
			return;
		}
		$scope.currPage += 1;
		$scope.loadData();
	};
	$scope.showQuery = function() {
		CommomService.loadEmployees('1');

		if ($scope.isShow) {
			$scope.isShow = false;
			//$("#queryDiv")[0].style.display = 'none';
		} else {
			$scope.isShow = true;
			//$("#queryDiv")[0].style.display = 'block';
		}
		$scope.showXsdjPopup();
	};
	$scope.hideQuery = function() {
		$scope.isShow = false;
		//$("#queryDiv")[0].style.display = 'none';
		if (xsdjPopup)
			xsdjPopup.close();
	};
	var xsdjPopup = null;
	$scope.showXsdjPopup = function() {
		xsdjPopup = $ionicPopup.show({
			title : '查询条件',
			templateUrl : 'templates/xsdj_popup.html',
			scope : $scope
		});
		xsdjPopup.then(function(res) {
		});
	};
	function getElementOffTop(element) {
		var eleTop = element.offsetTop;
		var curParent = element.offsetParent;
		//console.log(curParent);
		for (var i = 0; i < 1; i++) {
			if (curParent == null)
				break;
			eleTop += curParent.offsetTop;
			curParent = curParent.offsetParent;
			//console.log(curParent);
		}
		//console.log(eleTop);
		return eleTop;
	}

	function getElementPosition(element) {
		var x = 0;
		var y = 0;
		var width = element.offsetWidth;
		var height = element.offsetHeight;

		if ( typeof element.offsetParent == 'undefined') {
			x = element.x + width;
			y = element.y + height;
			//console.log('x:' + element.x + '--y:' + element.y + '-right:' + x + '-bot:' + y);
		} else {
			var curParent = element.offsetParent;
			var posX = element.offsetLeft;
			var posY = element.offsetTop;
			while (curParent != null) {
				posX += curParent.offsetLeft;
				posY += curParent.offsetTop;
				curParent = curParent.offsetParent;
			}
			//console.log('x:' + posX + '-y:' + posY + '-right:' + (posX + width) + '-bot:' + (posY + height));
		}
		/*else {
			var box = (event.target || event.srcElement).getBoundingClientRect();
		}*/
	}


	$scope.data.isShowPicker = false;
	$scope.showDatePicker = function(type, event) {
		if ($scope.data.isShowPicker) {
			$scope.data.isShowPicker = false;
			return;
		}
		var elementTop = getElementOffTop(event.target || event.srcElement);
		//var box = (event.target || event.srcElement).getBoundingClientRect();
		//var offsetX = event.clientX - box.left;
		//var offsetY = event.clientY - box.top;
		$scope.data.isShowPicker = true;
		// 49 -- popuphead
		// 59 -- list item height
		//$("#dateQueryDiv")[0].style.top = elementTop + 49 + 59 - 9 + "px";
		angular.element("#dateQueryDiv")[0].style.top=elementTop + 49 + 59-9 + "px"; // 这个坐标有待修正
		WdatePicker({
			eCont : 'dateQueryDiv',
			maxDate : type==0?$scope.data.endTime:(new Date().format('yyyy-MM-dd HH:mm:ss')),
			minDate : type == 1 ? $scope.data.startTime : '1900-01-01 00:00:00',
			startDate: type==0 ? $scope.data.startTime:$scope.data.endTime,
			alwaysUseStartDate: true,
			onpicked : function(dp) {
				if (type == 0) {
					$scope.$apply(function() {
						$scope.data.startTime = dp.cal.getNewDateStr();
					});
				} else if (type == 1) {
					$scope.$apply(function() {
						$scope.data.endTime = dp.cal.getNewDateStr();
					});
				}
				$scope.$apply(function() {
					$scope.data.isShowPicker = false;
				});
			},
			isShowClear : true,
			isShowToday : true,
			isShowOK : true
		});
	};


	$scope.showPageContent = function() {
		return $scope.totalPage > 1;
	};

	$scope.data.isShowDJDetail = false;
	$scope.showDJDetail = function() {
		$scope.data.isShowDJDetail = !$scope.data.isShowDJDetail;
	};
}
