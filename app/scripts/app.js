"use strict";

angular.module("checkoutApp", [
	// 'ngResource',
	// 'ngSanitize',
	// 'ui.router',
	'ui.bootstrap',
	'credit-cards',
	'dialogs.main',
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

angular.module("checkoutApp").controller('customDialogCtrl2',function($scope,$uibModalInstance,data){
		
	$scope.data = data;
	
	//-- Methods --//
	
	$scope.done = function(){
		$uibModalInstance.close($scope.data);
	}; // end done
	
	$scope.hitEnter = function(evt){
		console.info("checking key");
		console.info(evt);
		if(angular.equals(evt.keyCode,13)){
			$uibModalInstance.close($scope.data);
		}
	};
});
	


angular.module("checkoutApp").controller("MainCtrl", function($scope){
	// nothing
}).controller('AccordionDemoCtrl', function ($scope, $location, $timeout, $rootScope, dialogs, creditcards) {
	var sequence = ['shipping', 'billing', 'creditcard', 'confirmation'];
	$scope.step = 0;
	$scope.oneAtATime = true;
	$scope.status = {};
	$scope.status.shipping = {};
	$scope.status.billing = {};
	$scope.status.creditcard = {};
	$scope.status.confirm = {};
	$scope.isUnderAge = false;
	$scope.foo = {};
	$scope.foo.sameAsShipping = false;
	$scope.account = false;

	$scope.status.shipping.isOpen = true;
	$scope.shipping = {};
	$scope.billing = {};
	$scope.creditcard = {};
	$scope.missingInformation = false;
	$scope.success = false;
	$scope.birthday = {};

	$timeout(function(){
		$scope.myform.creditcard.$setValidity("isValid", false);
	});
	
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
			expirationyear = w.document.getElementById('expirationyear').value,

			month = creditcards.expiration.month.parse(expirationmonth),
			year = creditcards.expiration.year.parse(expirationyear);

		console.info("validating credit card info");
		console.info(creditcardnumber);
		var month = creditcards.expiration.month.parse(expirationmonth),
			year = creditcards.expiration.year.parse(expirationyear);

		console.info(creditcards.card.luhn(creditcardnumber));
		console.info(creditcards.cvc.isValid(securitycode));
		console.info(month);
		console.info(year);
		console.info(creditcards.expiration.isPast(month, year));

		$scope.missingInformation = !(_validNumber(creditcardnumber) && _validCVV(securitycode) && _validDate(expirationyear, expirationmonth));

		if (!$scope.missingInformation){
			$scope.success = true;
		}
	}

	function _validNumber(creditcardnumber){
		return creditcards.card.luhn(creditcardnumber);
	}

	function _validCVV(securitycode){
		return creditcards.cvc.isValid(securitycode);
	}

	function _validDate(expirationyear, expirationmonth){
		if (!expirationyear || !expirationmonth){
			return false;
		}
		var month = creditcards.expiration.month.parse(expirationmonth),
			year = creditcards.expiration.year.parse(expirationyear);
		return !creditcards.expiration.isPast(month, year);
	}

	$scope.displayError = function(field){
		if ($scope.myform.confirm[field]){
			return !_.isEmpty($scope.myform.confirm[field].$error) && $scope.myform.confirm[field].$touched && $scope.myform.confirm[field].$dirty;
		}
		return false;
	};

	var _progress = 0;

	$timeout(function(){
		$scope.$watch("myform.shippingForm.$valid", function(n, o){
			if (n){
				dialogs.wait('Validating shipping address','Please wait while we attempt to validate your shipping address.', _progress, "md");
				_fakeWaitProgress();

				var $off = $scope.$on('dialogs.wait.complete', function(){
					console.info("here");
					var dlg = dialogs.create('views/includes/addess_validation.tpl.html','customDialogCtrl2',$scope.shipping,'md');
					dlg.result.then(function(data){
						_reset($scope.status)
						$scope.status.billing.isOpen = true;
						$off();
					});
				});

			}
		});
		$scope.$watch("myform.billingForm.$valid", function(n, o){
			if (n){
				console.info($scope);

				if($scope.foo.sameAsShipping){
					console.info("same as shipping");
					_reset($scope.status);
					$scope.status.creditcard.isOpen = true;
				} else {
					dialogs.wait('Validating billing address','Please wait while we attempt to validate your billing address.', _progress, "md");
					_fakeWaitProgress();

					var $off = $scope.$on('dialogs.wait.complete', function(){
						console.info("here");
						var dlg = dialogs.create('views/includes/addess_validation.tpl.html','customDialogCtrl2', $scope.billing,'md');
						dlg.result.then(function(data){
							_reset($scope.status)
							$scope.status.creditcard.isOpen = true;
							$off();
						});
					});

					console.info("validate billing");
				}
			}
		});
		
	}, 500);

	var _fakeWaitProgress = function(){
		$timeout(function(){
			if(_progress < 100){
				_progress += 25;
				$rootScope.$broadcast('dialogs.wait.progress',{'progress' : _progress});
				_fakeWaitProgress();
			}else{
				console.info("boradcasting complete");
				_progress = 0;
				$rootScope.$broadcast('dialogs.wait.complete');
			}
		},700);
	};

	function _reset(arr){
		_.each(arr, function(item){
			item.isOpen = false;
		});
	}

	$scope.isOpen = function(which){
		return which === $scope.status.isOpen;
	}

	$scope.$on("AGE-VERIFICATION", _setAgeVerification);

	function _setAgeVerification(evt, data){
		$scope.isUnderAge = data;

		$scope.myform.creditcard.$setValidity("isValid", !$scope.isUnderAge);

	}

	$scope.$watch("myform.confirm.$valid", function(n,o){

		if ($scope.myform.confirm.$valid && $scope.myform.confirm.$dirty){
			if (n){
				var d = new Date($scope.birthday.year, $scope.birthday.month, $scope.birthday.day);
				if(_isOfAge(d)){
					console.info("old enough");
					$scope.$emit("AGE-VERIFICATION", false);
				} else {
					console.info("too young");
					$scope.$emit("AGE-VERIFICATION", true);
				}
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

});