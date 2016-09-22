//数据库文件
var localFileName = "edgesellerapp.db", fgDB;
var rootScope;
var handler = {
	ionicPlatform : null,
	http : null,
	ionicPopup : null,
	timeout : null,
	state : null,
	ionicModal : null,
	ionicLoading : null
}
var winHeight=window.screen.availHeight;
var seller = {
	userName : null,
	password : null
};
function showOrHideDatePicker(isShow) {
	  if(typeof $dp == 'undefined' || !$dp) return;
	  if(isShow) { $dp.show(); return; }
	  $dp.hide();
}
function resetRootData() {
	if(typeof rootScope == 'undefined') return;
	rootScope.employeeList = [];
	rootScope.commodityTypeList = [];
	rootScope.supplierInfoList = [];
}

function initFGdb() {
	fgDB.transaction(function(tx) {
		// tx.executeSql('DROP TABLE IF EXISTS version');
		// tx.executeSql('DROP TABLE IF EXISTS seller');
		// tx.executeSql('DROP TABLE IF EXISTS subshops');
		tx.executeSql('CREATE TABLE IF NOT EXISTS [version] ([id] INTEGER PRIMARY KEY AUTOINCREMENT, [versionCode] VARCHAR2(10))');
		tx.executeSql('CREATE TABLE IF NOT EXISTS [seller] ([id] VARCHAR2(32),[isRemember] VARCHAR2(32), [mobile] VARCHAR2(16),[userName] VARCHAR2(20), [password] VARCHAR2(20), [ename] VARCHAR2(50), [phone] VARCHAR2(20), [tradeId] VARCHAR2(32),[parentSellerId] VARCHAR2(32), [isparent] BOOLEAN, [lastestlogtime] VARCHAR2(32))');
		tx.executeSql('CREATE TABLE IF NOT EXISTS [shop] ([id] VARCHAR2(32), [userName] VARCHAR2(32), [sellerId] VARCHAR2(32), [shopName] VARCHAR2(32), [isFollow] BOOLEAN, ');
	}, function() {
		//alert('初始化表成功');
	}, function(er) {
		if (er) {
			console.log('error with executeSql', er);
		}
	});
}

function initData() {
	if(!rootScope) return;
	rootScope.subShopps = [ {
		id : 's3776535914',
		name : '总店',
		isChecked : true
	},{
		id : 's3410935234',
		name : '东圃分店',
		isChecked : true
	}, {
		id : 's1910935255',
		name : '车陂分店',
		isChecked : true
	}, {
		id : 's3663135234',
		name : '岗顶分店',
		isChecked : true
	}, {
		id : 's3419381234',
		name : '机场分店',
		isChecked : true
	}];
	rootScope.followSubShopps = angular.copy(rootScope.subShopps);
	rootScope.curQueryShop = rootScope.followSubShopps[0];
	rootScope.isHasSubShop = true;
	// 数据库查询
}

function initRootScope() {
	if(!rootScope) return;
	rootScope.shopTouch = function(item) {
		rootScope.curQueryShop = item;
	};
	rootScope.$on("$ionicView.leave", function() {
		if(arguments.length <= 0) return;
		var targetScope = arguments[0].targetScope;
		if(targetScope && targetScope.leaveView) targetScope.leaveView();
	});
}
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'starter.directives', 'ngCordova']).run(["$ionicPlatform", "$state", "$http", "$q", "$ionicModal", "$ionicPopup", "$timeout", "$document", "$rootScope", "$ionicLoading", "$location", "$ionicHistory",  "$cordovaFile", "$cordovaFileTransfer", "$cordovaFileOpener2", "$ionicScrollDelegate", function($ionicPlatform, $state, $http, $q, $ionicModal, $ionicPopup, $timeout, $document, $rootScope, $ionicLoading,$location,$ionicHistory, $cordovaFile, $cordovaFileTransfer, $cordovaFileOpener2, $ionicScrollDelegate) {
	$ionicPlatform.ready(function() {
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		winHeight=window.screen.availHeight;
		if (window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
			cordova.plugins.Keyboard.disableScroll(true);

		}
		if (window.StatusBar) {
			// org.apache.cordova.statusbar required
			StatusBar.styleDefault();
		}
		fgDB = new sqliteDB(localFileName, 1024 * 1024 * 10);
		initFGdb();
		handler = {
			ionicPlatform : $ionicPlatform,
			http : $http,
			ionicPopup : $ionicPopup,
			timeout : $timeout,
			state : $state,
			ionicModal : $ionicModal,
			ionicLoading : $ionicLoading
		}
		rootScope = $rootScope;
    rootScope.handoverListItem=[];
    rootScope.reverseListItem=[];
    rootScope.commoditySellListItem=[];
    initData();
    initRootScope();
		rootScope.checkSession = function() {
			if (!seller.userName) {
				$state.go("login");
				return false;
			}
			return true;
		}
		rootScope.checkUpdate = checkUpdate;
		if (!seller.userName) {
			SellerDao.getLocalUser(function(success, sellerItem) {
				hideLoading();
				if (success && sellerItem) {
					seller.userName = sellerItem.userName;
					seller.password = sellerItem.password;
					seller.lastestlogtime = sellerItem.lastestlogtime;
					SellerDao.updateLoginTime(seller, new Date().format("yyyy-MM-dd hh:mm:ss"), function(res) {});
					//queryParams.sellerUserName = sellerItem.userName;
					//queryParams.sellerPassword = sellerItem.password;
					//$scope.init();
					//$scope.imgsrc = webHost + "/apploaddata/pieCharStream?" + getQueryStr(queryParams)+ "&time=" + new Date().getTime();
					rootScope.$broadcast("bc-login");
				} else {
					$state.go("login");
				}
			});
		}
		rootScope.scrollTop = function(scrollHandler) {
			if(typeof $ionicScrollDelegate == 'undefined') return;
			if($ionicScrollDelegate == null) return;			
			$ionicScrollDelegate.$getByHandle(scrollHandler).scrollTop();
		}
		// 先检测更新
		rootScope.checkUpdate(false).then(function(result) {
		});
	});
	
	function checkUpdate(isHint) {
		var deferred = $q.defer();
		if(!window.cordova) {
			deferred.resolve(false);
			return deferred.promise;
		}
		//synExecuteCmdDebug({msg:"checkUpdate"});
		//$cordovaAppVersion.getVersionNumber().then(function(versionCode) {
			//var versionCode = "0.0.2";
			checkLastestVersion(version, isHint).then(function(result) {
				deferred.resolve(result);
			});
		//});
		return deferred.promise;
	}
	function checkLastestVersion(versionCode, isHint) {
		var deferred = $q.defer();
		$http.get(webHost+"/cordovaUpdate/dboss/version", {
			timeout:8000,
			params: {
				cOptSystem: ionic.Platform.platform(),
				cOptSystemVersion: ionic.Platform.version(),
				cVersionCode: versionCode
			}
		}).success(function(result) {
			checkAndDownload(result, isHint).then(function(result) {
				deferred.resolve(result);
			});
		}).error(function(result) {
			deferred.resolve(false);
			if(!angular.isDefined(isHint)) return;
			if(!isHint) return;
			// 显示提示信息
			showAlert('提示', '检测版本失败...');
		});

		return deferred.promise;
	}

	function checkAndDownload(result, isHint) {
		var d = $q.defer();
		//synExecuteCmdDebug({msg: 'checkAndDownload'});
		if(!angular.isDefined(result)) {d.resolve(false); return d.promise;}
		if(!result.success)	{d.resolve(false); return d.promise;}
		if(!result.hasUpdate) {d.resolve(false); return d.promise;}
		//synExecuteCmdDebug({msg: 'checkAndDownload2'});
		showAlert('提示', '是否更新APP?', function(res) {
			if(typeof res == 'undefined' || !res) {
				d.resolve(false);
				return;
			}
			var targetPath = "/sdcard/download/vboss/vboss.apk";
			var options = {};
			var trustHosts = true;
			showLoading("正在下载文件, 请稍后...");
			$cordovaFileTransfer.download(webHost+"/cordovaUpdate/downLatestBossPackge"+"?operatorSystem="+ionic.Platform.platform(), targetPath, options, trustHosts).then(function(result) {
				hideLoading();
				d.resolve(true);
				// success
				$cordovaFileOpener2.open(targetPath,
						'application/vnd.android.package-archive').then(function() {
						}, function(err) {
							showAlert('提示', '打开文件失败, 文件可能不完整!');
						});
			},function(err) {
				// error
				d.resolve(false);
				hideLoading();
				showAlert('提示', '下载文件出错');
			}, function(progress) {
				if(typeof progress == 'undefined') return;
				//showProgress(progress);
			});
		});
		return d.promise;
	}

	function showProgress(progress) {
		// 显示进度条
		/*$timeout(function() {
			rootScope.$apply(function() {
				if(progress.lengthComputable) {
					var dProgress = (progress.loaded/progress.total) * 100;
					synExecuteCmdDebug({msg:"下载进度..." + JSON.stringify(progress)});
					showloading("已下载文件... " + dProgress + "%");
				} else {
					synExecuteCmdDebug({msg:"未获取到文件大小..."});
				}
			});
		});*/
	}

	//双击退出
	$ionicPlatform.registerBackButtonAction(function(e) {
		//判断处于哪个页面时双击退出
		if ($location.path() == '/app/main'||$location.path() == '/login') {
			if ($rootScope.backButtonPressedOnceToExit) {
				ionic.Platform.exitApp();
			} else {
				$rootScope.backButtonPressedOnceToExit = true;
				$cordovaToast.showShortTop('再按一次退出系统');
				setTimeout(function() {
					$rootScope.backButtonPressedOnceToExit = false;
				}, 2000);
			}
		} else{
			$rootScope.backButtonPressedOnceToExit = false;
			$ionicHistory.goBack();
		}
		e.preventDefault();
		return false;
	}, 101);
}]).config(["$stateProvider", "$urlRouterProvider", "$compileProvider", function($stateProvider, $urlRouterProvider, $compileProvider) {
	$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|ghttps?|ms-appx|x-wmapp0):/);
	$stateProvider.state('login', {
		url : "/login",
		cache : false,
		templateUrl : "js/login/login.html"
	}).state('rjbb', {
		url : '/rjbb',
		cache : false,
		templateUrl : 'js/rjbb/rjbb.html',
	}).state('xsdj', {
		url : '/xsdj',
		cache : false,
		templateUrl : 'js/xsdj/xsdj.html',
	}).state('spxs', {
		url : '/spxs',
		cache : false,
		templateUrl : 'js/spxs/spxs.html',
	}).state('spxsDetail', {
		url : '/spxsDetail',
		cache : false,
		templateUrl : 'js/spxsDetail/spxsDetail.html',
	}).state('fjzdj', {
		url : '/fjzdj',
		cache : false,
		templateUrl : 'js/fjzdj/fjzdj.html',
	}).state('fjzdjDetail', {
    url : '/fjzdjDetail',
    cache : false,
    templateUrl : 'js/fjzdjDetail/fjzdjDetail.html',
  }).state('qsfx', {
		url : '/qsfx',
		cache : false,
		templateUrl : 'js/qsfx/qsfx.html',
	}).state('zbtj', {
		url : '/zbtj',
		cache : false,
		templateUrl : 'js/zbtj/zbtj.html',
	}).state('sx', {
		url : '/sx',
		cache : false,
		templateUrl : 'js/sx/sx.html',
	}).state('handover', {
		url : '/handover',
		cache : false,
		templateUrl : 'js/handover/handover.html',
	}).state('handoverDetail', {
    url : '/handoverDetail',
    cache : false,
    templateUrl : 'js/handoverDetail/handoverDetail.html',
  }).state('yyhz', {
		url : '/yyhz',
		cache : false,
		templateUrl : 'js/yyhz/yyhz.html',
	}).state('app', {
		url : '/app',
		abstract : true,
		templateUrl : 'templates/menu.html',
		controller : 'AppCtrl'
	}).state('app.search', {
		url : '/search',
		views : {
			'menuContent' : {
				templateUrl : 'templates/search.html'
			}
		}
	}).state('app.browse', {
		url : '/browse',
		views : {
			'menuContent' : {
				templateUrl : 'templates/browse.html'
			}
		}
	}).state('app.main', {
		url : '/main',
		cache : false,
		views : {
			'menuContent' : {
				templateUrl : 'templates/main.html',
				controller : 'MainCtrl'
			}
		}
	}).state('app.follow', {
		url: '/follow',
		cache: false,
		views: {
			'menuContent' : {
				templateUrl: 'js/follow/follow.html',
				controller: 'FollowCtrl'
			}
		}
	});
	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('app/main');
}]);
