function queryYyhz(){
  var appElement = document.querySelector('[ng-controller=YyhzCtrl]');
  var $scope = angular.element(appElement).scope();
  $scope.timeParams=$("#currentTime").val();
  $scope.init();
  $scope.$apply();
}

function yyhzCtrl($scope, $state, $timeout, $http ,$ionicLoading, CommomService ,$filter, $ionicScrollDelegate) {
  $scope.sy="今日收益";
  $scope.choose=true;
  $scope.timeParams=$filter("date")(Date.now(), 'yyyy-MM-dd');
  $scope.currentTime = $filter("date")(Date.now(), 'yyyy-MM-dd');

  $timeout(function() {
    $scope.init();
  }, 200);

  $scope.doRefresh = function() {
    $scope.init();
    $scope.$broadcast('scroll.refreshComplete');
  }
  $scope.init = function() {
    //var startTime = $("#currentTime").val();
    if($scope.choose){
      var id ="0";
    }else{
      var id ="1";
    }
    //console.log('timeParams---' +$scope.timeParams );
    $http.get(webHost + '/apploaddata/getMainInfo?d=' + new Date().getTime(), {
      timeout : 8000,
      params : {
        time : $scope.timeParams,
        identify : id,
        sellerUserName : seller.userName,
        sellerPassword : seller.password
      }
    }).success(function(result) {
      if (result.success) {
        //console.log('汇总---' + angular.toJson(result));
        $scope.total = result.total;
        $scope.maoli = result.maoli;
        $scope.sellNum = result.sellNum;
        $scope.counterSeting = result.counterSeting;
        $scope.discountAmount = result.discountAmount;
        $scope.cancelAmount = result.cancelAmount;
        if($scope.choose){
          $scope.sellInfos = result.sellInfos;
        }
      } else {
        showAlert("提示", result.msg ? result.msg : '商家登录失败！');
      }
    }).error(function(result) {
      showAlert('提示', '商家登录失败，请确认网络服务是否连接！');
    });
  }

  	$scope.cHeight=404;

	$scope.toYyhz = function() {
		$state.go("yyhz");
	}
	$scope.goBack = function() {
		$state.go("app.main");
	};
	$scope.$on("$ionicView.leave", function() {
		showOrHideDatePicker(false);
	});
  $(document).ready(function(){
	  //setTimeout(function(){document.getElementById("yyhz").style.height=winHeight/3.5+"px"},30);
	  //setTimeout(function(){document.getElementById("yyhg").style.height=winHeight - 404+"px"},30);
    $("#currentTime").click(function(){
      if($scope.choose){
        WdatePicker(
          { dateFmt:'yyyy-MM-dd' ,
            maxDate:'%y-%M-%d',
            onpicked:function(){queryYyhz()}
          }
        )
      }else {
        WdatePicker(
          { dateFmt:'yyyy-MM',
            maxDate:'%y-%M',
            onpicked:function(){queryYyhz()}
          }
        )
      }
    });

  });



  //本月
	$scope.showyyls = function() {
		showOrHideDatePicker(false);
    $("#yyls").hide();
    $("#today").css({"background-color":"#dddddd","color":"#007fdb","border":"1px solid #007fdb"});
    $("#thisMonth").css({"background-color":"#007fdb","color":"#ffffff"});
    $scope.currentTime = $filter("date")(Date.now(), 'yyyy-MM');
    $scope.sy="当月收益";
    $scope.choose=false;
    $scope.timeParams= $scope.currentTime;
    $scope.init();
    //console.log('本月---' + $scope.timeParams);

	};

  //今日
	$scope.showyyls2 = function(){
		showOrHideDatePicker(false);
    $("#yyls").show();
    $("#today").css({"background-color":"#007fdb","color":"#ffffff"});
    $("#thisMonth").css({"background-color":"#dddddd","color":"#007fdb","border":"1px solid #007fdb"});
    $scope.currentTime = $filter("date")(Date.now(), 'yyyy-MM-dd');
    $scope.sy="今日收益";
    $scope.choose=true;
    $scope.timeParams= $scope.currentTime;
    $scope.init();
    //console.log('今日---' + $scope.timeParams);
	};
  

	$scope.preDay = function() {
		$ionicScrollDelegate.$getByHandle('infoMainScroll').scrollTop();
    if($scope.choose){
      var before = $("#currentTime").val();
      before = getYestoday(before);
    }else {
      var before = $("#currentTime").val();
      before = getPreMonth(before);
    }
    $scope.currentTime = before;
    $("#currentTime").val($scope.currentTime);
    $scope.timeParams= $scope.currentTime;
    $scope.init();
    $("#yy-left").css({"font-size": "28px"});
    $("#yy-right").css({"font-size": "22px"});
	 }

	$scope.nextDay = function() {
		$ionicScrollDelegate.$getByHandle('infoMainScroll').scrollTop();
    if($scope.choose){
      var aa = new Date().format('yyyy-MM-dd');
      var later = $("#currentTime").val();
      later = getNextday(later);
    }else {
      var aa = new Date().format('yyyy-MM');
      var later = $("#currentTime").val();
      later = getNextMonth(later);
    }
    if(later > aa) {
      showAlert("提示", "此日期不能选择!");
    }else{
	    $scope.currentTime = later;
	    $("#currentTime").val($scope.currentTime);
      $scope.timeParams= $scope.currentTime;
      $scope.init();
    }
    $("#yy-left").css({"font-size": "22px"});
    $("#yy-right").css({"font-size": "28px"});
	}

}
