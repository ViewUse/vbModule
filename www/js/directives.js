angular.module("starter.directives", [])
.directive("mainHeight", ["$window", function($window) {
	return {
		restrict: 'AE',
		link: function(scope, element, attr) {
			/**
			 * platform: 'Android','BlackBerry 10', 'iOS', 'WinCE', 'Tizen'
			 * browser: 'macintel' on MAC, 'win32' on windows
			 * */
			var platform = ionic.Platform.platform();
			if(platform.search(/ios/i) >= 0)
				element[0].style.height = ($window.screen.availHeight - 182) + "px";
			else if(platform.search(/win32/i) >= 0)
				element[0].style.height = ($window.innerHeight - 182) + "px";
			else
				element[0].style.height = ($window.innerHeight - 182) + "px";
		}
	}
}])
.directive("calcHeight", ["$window", function($window) {
	return {
		restrict: 'AE',
		link: function(scope, element, attr) {
			/* 请在使用calc-height的当前controller的scope中指定cHeight的值--通用版 */
			var cHeight = 0;
			if(scope.$parent && scope.$parent.cHeight) {
				if(angular.isNumber(scope.$parent.cHeight)) {
					cHeight = scope.$parent.cHeight;
				}
			}
			var platform = ionic.Platform.platform();
			if(platform.search(/ios/i) >= 0)
				element[0].style.height = ($window.screen.availHeight - cHeight) + "px";
			else if(platform.search(/win32/i) >= 0)
				element[0].style.height = ($window.innerHeight - cHeight) + "px";
			else
				element[0].style.height = ($window.innerHeight - cHeight) + "px";
		}
	}
}])
.directive("dateInputEle", [function() {
	return {
		restrict: 'AE',
		link: function(scope, element, attr) {
			element[0].onclick = function() {
				if(scope.$parent && typeof scope.$parent.choose != 'undefined') {
					WdatePicker({
						dateFmt: scope.$parent.choose?'yyyy-MM-dd':'yyyy-MM',
						maxDate: scope.$parent.choose?'%y-%M-%d':'%y-%M',
						onpicked: function() {
							if(scope.$parent.queryYyhz)
								scope.$parent.queryYyhz();
						}
					});
				}
			};
		}
	}
}]);