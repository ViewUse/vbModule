function qsfxCtrl($scope, $state, $timeout, $http, $ionicModal, $ionicLoading,$ionicPopup) {
	if (!rootScope.checkSession()) {
		return;
	}
	$scope.goBack = function() {
		$state.go("app.main");
	}
	$scope.data = {
		charType : 1,
		dateType : 1,
		sellAmountFlag : true,
		gainAmountFlag : false,
		barChart : false,
		lineChart : true,
		sellNumFlag : false,
		sellerUserName : seller.userName,
		sellerPassword : seller.password,
		startTime : getLastDate(10),
		endTime : new Date().format("yyyy-MM-dd")
	};

	$scope.selectChartType = function(index) {
		if (index == 1) {
			$scope.data.barChart = false;
			$scope.data.lineChart = true;
		} else {
			$scope.data.barChart = true;
			$scope.data.lineChart = false;
		}
	}

	$scope.loadData = function() {
		showLoading("正在加载数据，请稍后...");
		$http.get(webHost + '/apploaddata/trendanalysisList?time=' + new Date().getTime(), {
			timeout : 8000,
			params : $scope.data
		}).success(function(result) {
			hideLoading();
			if (result.success) {
				$scope.trendAnalysisList=result.trendAnalysisList;
				$scope.totalTrendAnalysis=result.totalTrendAnalysis;
				$scope.hideQuery();
			} else {
				showAlert("提示", result.msg ? result.msg : '查询数据失败！');
			}
		}).error(function(result) {
			hideLoading();
			showAlert('提示', '查询失败，请确认网络服务是否连接！');
		});
	}

	$scope.query = function() {
		$scope.data.startTime = $("#startTime").val();
		$scope.data.endTime = $("#endTime").val();
		if ($scope.data.lineChart) {
			$scope.data.charType = 1;
		} else {
			$scope.data.charType = 0;
		}
		$scope.imgsrc = webHost + "/apploaddata/qsfxChartStream?" + $scope.getQueryStr()+"t="+new Date().getTime();
		$scope.loadData();
		$scope.hideQuery();
	}
	$scope.getQueryStr = function() {
		var queryStr = "";
		for (var key in $scope.data) {
			queryStr += key + "=" + $scope.data[key] + "&"
		}
		return queryStr;
	}
	$timeout(function() {
		$scope.query();
		$scope.change(1);
	}, 200);

	$scope.showQuery = function() {
    $scope.isShow=!$scope.isShow;
    $scope.showQsfxPopup();
	}

	$scope.hideQuery = function() {
		$scope.isShow=false;
    if (qsfxPopup)
      qsfxPopup.close();
	}


  var qsfxPopup = null;
  $scope.showQsfxPopup = function() {
    qsfxPopup = $ionicPopup.show({
      title : '请选择',
      templateUrl : 'templates/popup_qsfx.html',
      scope : $scope
    });
    qsfxPopup.then(function(res) {
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
    var type="1";
	$scope.change = function(obj) {
		rootScope.scrollTop("qsMainScroll");
		if (obj == 1) {
			type="1";
			$scope.go();
			//document.getElementById("qs-title").innerHTML="七日销售数据";
			$("#day").css({"background-color":"#007fdb","color":"#ffffff"});
			$("#month").css({"background-color":"#dddddd","color":"#007fdb","border":"1px solid #007fdb"});
		} else {
			type="0";
			$scope.go();
			//document.getElementById("qs-title").innerHTML="一年销售数据";
			$("#day").css({"background-color":"#dddddd","color":"#007fdb","border":"1px solid #007fdb"});
			$("#month").css({"background-color":"#007fdb","color":"#ffffff"});
		}
	}
  $scope.go=function() {
	  var chart = echarts.init(document.getElementById('main'));
		var categories = [];
		var sellvalues = [];
		var gainvalues = [];
		var numvalues = [];
		$.ajax({
            type: "post",
            async: false,
            url: webHost + '/apploaddata/getSellDataLine',
            data:{
            	dateType:type,
            	sellerUserName : seller.userName,
				sellerPassword : seller.password
            },
            dataType: "json",
            success: function (json) {
                if(json.status = 200){
                	sellvalues = json.sellAmount;
			 		        gainvalues = json.gainAmount;
			 		        numvalues = json.commodityNum;
                 	categories = json.sellTime;
                 	  $scope.items = [];
                 	  var costAmount = 0.0;
                 	  var gainAmount = 0.0;
                 	  var sellNum = 0;
                 	  var countSell = 0;
                 	  var sellAmount = 0.0;
                 		for(var i = 0; i < json.trendAnalysis.length; i++){
                 			$scope.items.unshift(json.trendAnalysis[i]);
                 			costAmount = costAmount + json.trendAnalysis[i].costAmount;
                 			gainAmount = gainAmount + json.trendAnalysis[i].gainAmount;
                 			sellNum = sellNum + json.trendAnalysis[i].sellNum;
                 			countSell = countSell + json.trendAnalysis[i].countSell;
                 			sellAmount = sellAmount + json.trendAnalysis[i].sellAmount;
                 		}
                 		$scope.costAmount = costAmount;
                 		$scope.gainAmount = gainAmount;
                 		$scope.sellNum = sellNum;
                 		$scope.countSell = countSell;
                 		$scope.sellAmount = sellAmount;
                    var option = {
						tooltip:{
							tigger:'axis',
							//show:true
						},
						legend:{
							data:['销售总额','利润','商品总数']
						},
						grid:[
							 {x:'50', y:'7%',width:'80%',height:'38%'},
							 {x:'50', y2:'7%',width:'80%',height:'38%'}
						],
						grid: [
						       {x:'50', y:'7%',width:'80%',height:'38%'},
						       {x:'50', y2:'7%',width:'80%',height:'38%'}
						],
					    toolbox: {
					    	y:'bottom',
					        show : true,
					        itemSize:'25',
					        feature : {
					          //  dataView : {show: true, readOnly: false},
					            magicType : {show: true, type: ['line', 'bar']},
					           // restore : {show: true},
					           // saveAsImage : {show: true}
					        }
					    },
					    calculable : true,
						xAxis:[
						       {
						    	   type:'category',
						    	   gridIndex: 0,
						    	   boundaryGap:false,
						    	   data:categories
						       },
						       {
						    	   type:'category',
						    	   gridIndex: 1,
						    	   data: categories
						       }
						],
						yAxis:[
						       {
						    	   type:'value',
						    	   name:'东圃分店',
						    	   gridIndex: 0
						       },
						       {
						    	   type:'value',
						    	   name:'车陂分店',
						    	   gridIndex: 1
						       }
						],
						series:[
						       {
						        	"name":"销售总额",
						        	"type":"line",
						        	"data":sellvalues,
						        	xAxisIndex: 0,
			                        yAxisIndex: 0,
						        	markPoint:{
						        		data:[
						        			{type:'max',name:'最大值'},
						        			{type:'min',name:'最小值'}
						        		]
						        	}

						        },
						        {
						        	"name":"利润",
						        	"type":"line",
						        	"data":gainvalues,
						        	xAxisIndex: 0,
			                        yAxisIndex: 0,
						        	markPoint:{
						        		data:[
						        			{type:'max',name:'最大值'},
						        			{type:'min',name:'最小值'}
						        		]
						        	}

						        },
						        {
						        	"name":"商品总数",
						        	"type":"line",
						        	"data":numvalues,
						        	xAxisIndex: 0,
			                        yAxisIndex: 0,
						        	markPoint:{
						        		data:[
						        			{type:'max',name:'最大值'},
						        			{type:'min',name:'最小值'}
						        		]
						        	}

						        },
						        {
						        	"name":"销售总额",
						        	"type":"line",
						        	"data":sellvalues,
						        	xAxisIndex: 1,
			                        yAxisIndex: 1,
						        	markPoint:{
						        		data:[
						        			{type:'max',name:'最大值'},
						        			{type:'min',name:'最小值'}
						        		]
						        	}

						        },
						        {
						        	"name":"利润",
						        	"type":"line",
						        	"data":gainvalues,
						        	xAxisIndex: 1,
			                        yAxisIndex: 1,
						        	markPoint:{
						        		data:[
						        			{type:'max',name:'最大值'},
						        			{type:'min',name:'最小值'}
						        		]
						        	}

						        },
						        {
						        	"name":"商品总数",
						        	"type":"line",
						        	"data":numvalues,
						        	xAxisIndex: 1,
			                        yAxisIndex: 1,
						        	markPoint:{
						        		data:[
						        			{type:'max',name:'最大值'},
						        			{type:'min',name:'最小值'}
						        		]
						        	}

						        }
						]
				};
				chart.setOption(option);
                }
            },
            error: function (errorMsg) {
                alert("图表请求数据失败啦!");
            }
		});

	}
  $scope.go2=function() {
	  var chart = echarts.init(document.getElementById('main'));
	  console.log(echarts.version);
	  var dataAll = [
	                 [
	                     [10.0, 8.04],
	                     [8.0, 6.95],
	                     [13.0, 7.58],
	                     [9.0, 8.81],
	                     [11.0, 8.33],
	                     [14.0, 9.96],
	                     [6.0, 7.24],
	                     [4.0, 4.26],
	                     [12.0, 10.84],
	                     [7.0, 4.82],
	                     [5.0, 5.68]
	                 ],
	                 [
	                     [10.0, 9.14],
	                     [8.0, 8.14],
	                     [13.0, 8.74],
	                     [9.0, 8.77],
	                     [11.0, 9.26],
	                     [14.0, 8.10],
	                     [6.0, 6.13],
	                     [4.0, 3.10],
	                     [12.0, 9.13],
	                     [7.0, 7.26],
	                     [5.0, 4.74]
	                 ],
	                 [
	                     [10.0, 7.46],
	                     [8.0, 6.77],
	                     [13.0, 12.74],
	                     [9.0, 7.11],
	                     [11.0, 7.81],
	                     [14.0, 8.84],
	                     [6.0, 6.08],
	                     [4.0, 5.39],
	                     [12.0, 8.15],
	                     [7.0, 6.42],
	                     [5.0, 5.73]
	                 ],
	                 [
	                     [8.0, 6.58],
	                     [8.0, 5.76],
	                     [8.0, 7.71],
	                     [8.0, 8.84],
	                     [8.0, 8.47],
	                     [8.0, 7.04],
	                     [8.0, 5.25],
	                     [19.0, 12.50],
	                     [8.0, 5.56],
	                     [8.0, 7.91],
	                     [8.0, 6.89]
	                 ]
	             ];

	             var markLineOpt = {
	                 animation: false,
	                 label: {
	                     normal: {
	                         formatter: 'y = 0.5 * x + 3',
	                         textStyle: {
	                             align: 'right'
	                         }
	                     }
	                 },
	                 lineStyle: {
	                     normal: {
	                         type: 'solid'
	                     }
	                 },
	                 tooltip: {
	                     formatter: 'y = 0.5 * x + 3'
	                 },
	                 data: [[{
	                     coord: [0, 3],
	                     symbol: 'none'
	                 }, {
	                     coord: [20, 13],
	                     symbol: 'none'
	                 }]]
	             };

	             option = {
	                 title: {
	                     text: 'Anscombe\'s quartet',
	                     x: 'center',
	                     y: 0
	                 },
	                 grid: [
	                     {x: '7%', y: '7%', width: '38%', height: '38%'},
	                     {x2: '7%', y: '7%', width: '38%', height: '38%'},
	                     {x: '7%', y2: '7%', width: '38%', height: '38%'},
	                     {x2: '7%', y2: '7%', width: '38%', height: '38%'}
	                 ],
	                 tooltip: {
	                     formatter: 'Group {a}: ({c})'
	                 },
	                 xAxis: [
	                     {gridIndex: 0, min: 0, max: 20},
	                     {gridIndex: 1, min: 0, max: 20},
	                     {gridIndex: 2, min: 0, max: 20},
	                     {gridIndex: 3, min: 0, max: 20}
	                 ],
	                 yAxis: [
	                     {gridIndex: 0, min: 0, max: 15},
	                     {gridIndex: 1, min: 0, max: 15},
	                     {gridIndex: 2, min: 0, max: 15},
	                     {gridIndex: 3, min: 0, max: 15}
	                 ],
	                 series: [
	                     {
	                         name: 'I',
	                         type: 'scatter',
	                         xAxisIndex: 0,
	                         yAxisIndex: 0,
	                         data: dataAll[0],
	                         markLine: markLineOpt
	                     },
	                     {
	                         name: 'II',
	                         type: 'scatter',
	                         xAxisIndex: 1,
	                         yAxisIndex: 1,
	                         data: dataAll[1],
	                         markLine: markLineOpt
	                     },
	                     {
	                         name: 'III',
	                         type: 'scatter',
	                         xAxisIndex: 2,
	                         yAxisIndex: 2,
	                         data: dataAll[2],
	                         markLine: markLineOpt
	                     },
	                     {
	                         name: 'IV',
	                         type: 'scatter',
	                         xAxisIndex: 3,
	                         yAxisIndex: 3,
	                         data: dataAll[3],
	                         markLine: markLineOpt
	                     }
	                 ]
	             };
	  chart.setOption(option);
  }
  $scope.sh=true;
  $scope.showData=false;
  $scope.showDetail = function() {
    $scope.sh=false;
    $scope.showData=true;
  }
  $scope.hideDetail= function() {
    $scope.sh=true;
    $scope.showData=false;
  }
  
  $scope.cHeight = 94; //344;
  //$(document).ready(function(){
	  //setTimeout(function(){document.getElementById("qs").style.height=winHeight-44+"px"},30);	 
	  //setTimeout(function(){document.getElementById("s1").style.height=winHeight-344+"px"},30);
  //});
  $scope.data.subShopps = angular.copy(rootScope.subShopps);
  /**
	 * Filter sub shop
	 */
	$scope.dealFilter = function() {
		// var template = "<ion-list><list-item><ion-checkbox
		// ng-model='data.isChecked[0]'>东圃分店</ion-checkbox></list-item><list-item><ion-checkbox
		// ng-model='data.isChecked[1]'>车陂分店</ion-checkbox></list-item><list-item><ion-checkbox
		// ng-model='data.isChecked[2]'>岗顶分店</ion-checkbox></list-item><list-item><ion-checkbox
		// ng-model='data.isChecked[3]'>机场分店</ion-checkbox></list-item></ion-list>";
		var template = "<ion-list><list-item ng-repeat='item in data.subShopps'>"
				+ "<ion-checkbox ng-model='item.isChecked'>{{item.name}}</ion-checkbox>"
				+ "</list-item></ion-list>";
		$scope.tPopup = $ionicPopup.show({
			title : '连锁店',
			scope : $scope,
			template : template,
			buttons : [ {
				text : '取消',
				type : 'button-balanced'
			}, {
				text : '确认',
				type : 'button-positive',
				onTap : function() {
				}
			} ]
		});
	};
}
