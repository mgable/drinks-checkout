"use strict";

angular.module("checkoutApp", [
	// 'ngResource',
	// 'ngSanitize',
	// 'ui.router',
	'ui.bootstrap',
	// 'credit-cards'
	'ngRoute'
	]);

angular.module("checkoutApp").config(function($routeProvider, $locationProvider){
	$routeProvider
		.when('/:userid/:foo', {controller:'AccordionDemoCtrl'});
	$locationProvider.html5Mode(true);
});

angular.module("template/accordion/accordion-group.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/accordion/accordion-group.html",
    "<div class=\"panel {{panelClass || 'panel-default'}}\">\n" +
    "  <div class=\"panel-heading\" ng-keypress=\"toggleOpen($event)\">\n" +
    "    <h4 class=\"panel-title\">\n" +
    "      <a href tabindex=\"{{tab || -1}}\" class=\"accordion-toggle\" ng-click=\"toggleOpen()\" uib-accordion-transclude=\"heading\"><span ng-class=\"{'text-muted': isDisabled}\">{{heading}}</span></a>\n" +
    "    </h4>\n" +
    "  </div>\n" +
    "  <div class=\"panel-collapse collapse\" uib-collapse=\"!isOpen\">\n" +
    "	  <div class=\"panel-body\" ng-transclude></div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);


angular.module("checkoutApp").controller("MainCtrl", function($scope){
	// nothing
}).controller('AccordionDemoCtrl', function ($scope, $location, $timeout) {
	var sequence = ['shipping', 'billing', 'creditcard', 'confirmation'];
	$scope.step = 0;
	$scope.oneAtATime = true;
	$scope.status = {};
	$scope.status.shipping = {};
	$scope.status.billing = {};
	$scope.status.creditcard = {};
	$scope.status.confirm = {};
	$scope.isUnderAge = false;

	$scope.status.shipping.isOpen = true;
	$scope.shipping = {};
	$scope.billing = {};
	$scope.creditcard = {};
	$scope.missingInformation = false;
	$scope.success = false;

	if ($location.path() !== "/"){
		console.info("have user");
	}

	$scope.submit = function(){
		console.info("The form was submitted!");
		console.info($scope.shipping);
		console.info(!_.isEmpty($scope.billing) ? $scope.billing : $scope.shipping);
		console.info($scope.isUnderAge);

		var w = document.getElementById('iframe1').contentWindow,
			creditcardnumber =  w.document.getElementById('creditcardnumber').value,
			securitycode =  w.document.getElementById('securitycode').value,
			expirationmonth = w.document.getElementById('expirationmonth').value,
			expirationyear = w.document.getElementById('expirationyear').value;

		console.info(!!(creditcardnumber, securitycode, expirationmonth, expirationyear));

		$scope.missingInformation = !(creditcardnumber && securitycode && expirationmonth && expirationyear);

		if (!$scope.missingInformation){
			$scope.success = true;
		}
	}


	// $scope.hasSelection = function(value){
	// 	console.info("the values is");
	// 	console.info(value);
	// 	return value;
	// }

	$timeout(function(){
		$scope.$watch("myform.shippingForm.$valid", function(n, o){
			if (n){
				_reset($scope.status)
				$scope.status.billing.isOpen = true;
			}
		});
		$scope.$watch("myform.billingForm.$valid", function(n, o){
			if (n){
				_reset($scope.status);
				$scope.status.creditcard.isOpen = true;
			}
		});
		// $scope.$watch("myform.creditcard.$valid", function(n, o){
		// 	if (n){
		// 		_reset($scope.status);
		// 		$scope.status.confirm.isOpen = true;
		// 	}
		// });
	}, 500);

	function _reset(arr){
		_.each(arr, function(item){
			item.isOpen = false;
		});
	}

	$scope.isOpen = function(which){
		return which === $scope.status.isOpen;
	}

	$scope.hasError = function(form, field){
		if ($scope.myform[form][field]){
			return $scope.myform[form][field].$invalid && $scope.myform[form][field].$dirty;
		} 
		return false;
	}

	$scope.hasSuccess = function(form, field){
		if ($scope.myform[form][field]){
			return $scope.myform[form][field].$valid && $scope.myform[form][field].$touched;
		}
		return true;
	}

	$scope.$on("AGE-VERIFICATION", _setAgeVerification);

	function _setAgeVerification(evt, data){
		$scope.isUnderAge = data;
		var w = document.getElementById('iframe1').contentWindow;
		var creditcardnumber =  w.document.getElementById('creditcardnumber').value,
			securitycode =  w.document.getElementById('securitycode').value,
			expirationmonth = w.document.getElementById('expirationmonth').value,
			expirationyear = w.document.getElementById('expirationyear').value;

		//$scope.myform.creditcard.$setValidity("isValid",!!(creditcardnumber && securitycode && expirationmonth && expirationyear));

	}

}).controller('DatepickerDemoCtrl', function ($scope) {
	$scope.today = function() {
		$scope.dt = new Date();
	};
	$scope.today();

	$scope.clear = function() {
		$scope.dt = null;
	};

	$scope.options = {
		customClass: getDayClass,
		minDate: new Date(),
		showWeeks: true
	};

	// Disable weekend selection
	function disabled(data) {
		var date = data.date,
		mode = data.mode;
		return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
	}

	$scope.toggleMin = function() {
		$scope.options.minDate = $scope.options.minDate ? null : new Date();
	};

	$scope.toggleMin();

	$scope.setDate = function(year, month, day) {
		$scope.dt = new Date(year, month, day);
	};

	var tomorrow = new Date();
	tomorrow.setDate(tomorrow.getDate() + 1);
	var afterTomorrow = new Date(tomorrow);
	afterTomorrow.setDate(tomorrow.getDate() + 1);
	$scope.events = [
	{
		date: tomorrow,
		status: 'full'
	},
	{
		date: afterTomorrow,
		status: 'partially'
	}
	];

	function getDayClass(data) {
		var date = data.date,
		mode = data.mode;
		if (mode === 'day') {
			var dayToCheck = new Date(date).setHours(0,0,0,0);

			for (var i = 0; i < $scope.events.length; i++) {
				var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

				if (dayToCheck === currentDay) {
					return $scope.events[i].status;
				}
			}
		}

		return '';
	}
}).controller('DatepickerPopupDemoCtrl', function ($scope) {

	$scope.$watch("dt", function(n,o){
		if (n){
			if(_isOfAge(n)){
				console.info("old enough");
				$scope.$emit("AGE-VERIFICATION", false);
			} else {
				console.info("too young");
				$scope.$emit("AGE-VERIFICATION", true);
			}
		}
	});

	function _isOfAge(birthday) { // birthday is a date
		console.info("the date");
		console.info(birthday);
	    var ageDifMs = Date.now() - birthday.getTime();
	    var ageDate = new Date(ageDifMs); // miliseconds from epoch
	    return Math.abs(ageDate.getUTCFullYear() - 1970) >= 21;
	}

	$scope.clear = function() {
		$scope.dt = null;
	};

	$scope.inlineOptions = {
		customClass: getDayClass,
		minDate: new Date(),
		showWeeks: true
	};

	$scope.dateOptions = {
		dateDisabled: disabled,
		formatYear: 'yy',
		// maxDate: new Date(),
		// minDate: new Date(1901, 0, 1),
		startingDay: 1
	};

	// Disable weekend selection
	function disabled(data) {
		var date = data.date,
		mode = data.mode;
		return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
	}

	$scope.toggleMin = function() {
		$scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
		$scope.dateOptions.minDate = $scope.inlineOptions.minDate;
	};

	$scope.toggleMin();

	$scope.open1 = function() {
		$scope.popup1.opened = true;
	};

	$scope.open2 = function() {
		$scope.popup2.opened = true;
	};

	$scope.setDate = function(year, month, day) {
		$scope.dt = new Date(year, month, day);
		console.info("I set the data to ");
		console.info(year, month, day);
	};

	$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate', 'MM/dd/yyyy'];
	$scope.format = $scope.formats[4];
	$scope.altInputFormats = ['M!/d!/yyyy'];

	$scope.popup1 = {
		opened: false
	};

	$scope.popup2 = {
		opened: false
	};

	var tomorrow = new Date();
	tomorrow.setDate(tomorrow.getDate() + 1);
	var afterTomorrow = new Date();
	afterTomorrow.setDate(tomorrow.getDate() + 1);
	$scope.events = [
	{
		date: tomorrow,
		status: 'full'
	},
	{
		date: afterTomorrow,
		status: 'partially'
	}
	];

	function getDayClass(data) {
		var date = data.date,
		mode = data.mode;
		if (mode === 'day') {
			var dayToCheck = new Date(date).setHours(0,0,0,0);

			for (var i = 0; i < $scope.events.length; i++) {
				var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

				if (dayToCheck === currentDay) {
					return $scope.events[i].status;
				}
			}
		}

		return '';
	}
});