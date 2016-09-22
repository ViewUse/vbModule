function fjzdjCtrl($scope, $state, $timeout, $http, $ionicModal, $ionicPopup,$ionicLoading, $ionicHistory, CommomService) {
	if (!rootScope.checkSession()) {
		return;
	}
	$scope.data = {};
	$scope.totalCount = 0;
	$scope.totalPage = 1;
	$scope.currPage = 1;
	$scope.pageSize = 50;
	$scope.reverseList = [];
	$scope.isShow=false;
	/*
	 *返回上一页
	 */
	$scope.goBack = function() {
		$state.go("app.main");
	};
	$scope.data.startTime = new Date().format("yyyy-MM-dd");
	$scope.data.endTime = new Date().format("yyyy-MM-dd");
	$scope.query = function() {
		rootScope.scrollTop("fjzMainScroll");
		$scope.currPage = 1;
		$scope.reverseList = [];
		$scope.loadData();
	}
	$timeout(function() {
		$scope.query();
	}, 200);



	$scope.loadData = function() {
		var startTime = $("#startTime").val();
		var endTime = $("#endTime").val();
    if(typeof(startTime) == "undefined"||typeof(endTime) == "undefined"){
      var startTime = new Date().format('yyyy-MM-dd');
      var endTime = new Date().format('yyyy-MM-dd');
    }
    //console.log('loadData----'+startTime + '-----'+endTime);
		showLoading("正在加载数据，请稍后...");
		$http.get(webHost + '/apploaddata/getReverse?time=' + new Date().getTime(), {
			timeout : 8000,
			params : {
				startTime : startTime,
				endTime : endTime,
				employeeId:$scope.data.employeeId,
				//commodityTypeId:$scope.data.commodityTypeId,
				//supplierId:$scope.data.supplierId,
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
				for (var i = 0; i < result.reverseList.length; i++) {
					$scope.reverseList.unshift(result.reverseList[i]);
				}
				$scope.hideQuery();
			} else {
				showAlert("提示", result.msg ? result.msg : '查询数据失败！');
			}
		}).error(function(result) {
			hideLoading();
			$scope.$broadcast('scroll.refreshComplete');
			showAlert('提示', '查询失败，请确认网络服务是否连接！');
		});
	}

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
	}

	$scope.doRefresh = function() {
		if ($scope.currPage >= $scope.totalPage) {
			$scope.$broadcast('scroll.refreshComplete');
			return;
		}
		$scope.currPage += 1;
		$scope.loadData();
	}

//	$scope.showQuery = function() {
//		CommomService.loadEmployees('1');
//		CommomService.loadCommodityTypes();
//		CommomService.loadSupplierInfos();
//        if($scope.isShow){
//        	$scope.isShow=false;
//        	$("#queryDiv")[0].style.display = 'none';
//        }else{
//        	$scope.isShow=true;
//        	$("#queryDiv")[0].style.display = 'block';
//        }
//	}
//	$scope.hideQuery = function() {
//		$scope.isShow=false;
//		$("#queryDiv")[0].style.display = 'none';
//	}

  $scope.showQuery = function() {
    CommomService.loadEmployees('1');
    CommomService.loadCommodityTypes();
    CommomService.loadSupplierInfos();
    $scope.isShow=!$scope.isShow;
    $scope.showFjzdjPopup();
  }

  $scope.hideQuery = function() {
    $scope.isShow=false;
    if (fjzdjPopup)
      fjzdjPopup.close();
  }

  var fjzdjPopup = null;
  $scope.showFjzdjPopup = function() {
    fjzdjPopup = $ionicPopup.show({
      title : '请选择',
      templateUrl : 'templates/popup_fjzdj.html',
      scope : $scope
    });
    fjzdjPopup.then(function(res) {
    });
  };

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

//  $ionicModal.fromTemplateUrl('sellInfo.html', {
//		scope : $scope,
//		animation : 'slide-in-up'
//	}).then(function(modal) {
//		$scope.sellInfoModal = modal;
//	});
//	$scope.openSellInfoModal = function(item) {
//		$scope.item = item;
//		$scope.loadSellDetail(item.id);
//		$scope.sellInfoModal.show();
//	};
//	$scope.closeSellInfoModal = function() {
//		$scope.sellInfoModal.hide();
//	};
//	//Cleanup the modal when we're done with it!
//	$scope.$on('$destroy', function() {
//		$scope.sellInfoModal.remove();
//	});

  $scope.toDetail = function(item) {
    rootScope.reverseListItem=item;
    //console.log('反结账单据---' + angular.toJson(item));
    $state.go("fjzdjDetail");
  };


}
