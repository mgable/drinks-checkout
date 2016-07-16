"use strict";

angular.module("checkoutApp", [
	'ui.bootstrap',
	'credit-cards',
	'dialogs.main',
	'ngSanitize'
	]);

angular.module("checkoutApp").controller('customDialogCtrl2',function($scope,$uibModalInstance,data){
		
	$scope.data = data;
	
	//-- Methods --//
	
	$scope.done = function(){
		$uibModalInstance.close($scope.data);
	}; // end done
	
	$scope.hitEnter = function(evt){
		if(angular.equals(evt.keyCode,13)){
			$uibModalInstance.close($scope.data);
		}
	};
});
	


angular.module("checkoutApp").controller("MainCtrl", function($scope){
	// nothing
}).controller('AccordionDemoCtrl', function ($scope, $location, $timeout, $rootScope, dialogs, creditcards) {
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
	$scope.address = {"shipping": "", "billing": ""};
	$scope.creditcarddisplay = "";
	$scope.loginName = "John";

	var account = _makeAccountData("John", "Smith","123 Main Street",null,"Cooltown","CA","90401","test@test.com","123-123-1234","4929609396476895","123","02","2017"),
		account1 = _makeAccountData("John", "Smith", "7656 First Street NE", null, "Ventura", "CA", "90002", "jsmith@yahoo.com", "312-259-6582", null, null, null, null),
		account2 = _makeAccountData("Joann", "Smith", "205 Tenth Street", "Unit 1", "San Francisco", "CA", "91100", "j_smith09@gmail.com", "321-321-4321", null, null, null, null),
		_progress = 0;

	$scope.altAddresses = [{name: _makeDifferentAddress(account), account: account}, {name: _makeDifferentAddress(account1),  account: account1}, {name:_makeDifferentAddress(account2), account: account2}];

	console.info($scope.altAddresses);
	$scope.alternative = $scope.altAddresses[0];
	
	$scope.submitLogin = function(){
		$scope.billing = $scope.shipping = account;
		$scope.account = true;

		var w = document.getElementById('iframe1').contentWindow,
			creditcardnumber =  w.document.getElementById('creditcardnumber'),
			securitycode =  w.document.getElementById('securitycode'),
			expirationmonth = w.document.getElementById('expirationmonth'),
			expirationyear = w.document.getElementById('expirationyear');

		$(creditcardnumber).val(creditcards.card.format(account.creditcardnumber));
		$(securitycode).val(account.securitycode);
		$(expirationmonth).val(account.expirationmonth);
		$(expirationyear).val(account.expirationyear);
		$scope.status.creditcard.isOpen = true;
	};

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

		$scope.missingInformation = !(_validNumber(creditcards.card.parse(creditcardnumber)) && _validCVV(securitycode) && _validDate(expirationyear, expirationmonth));

		if (!$scope.missingInformation){
			$scope.success = true;
		}
	}

	$scope.repopulate = function (address){
		$scope.shipping = address.account;
		$scope.address.shipping = _makeAddress("shipping");
	}

	$scope.addNewAddress = function(){
		$scope.shipping = {};
		$scope.account = false;
	}

	function _makeAccountData(fname, lname ,street1, street2, city, state, zip, email, phone, cc, cvv, month, year){
		return {
			"firstname": fname,
			"lastname": lname,
			"street1": street1,
			"street2": street2,
			"city": city,
			"state": state,
			"zip": zip,
			"email": email,
			"phone": phone,
			"creditcardnumber": cc,
			"securitycode": cvv,
			"expirationmonth": month,
			"expirationyear": year
		};
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

	function _maskCreditCard(cc){
		return cc.replace(/\d{12}(\d*)/, "card ending in ************ $1");
	}

	$scope.displayError = function(field){
		if ($scope.myform.confirm[field]){
			return !_.isEmpty($scope.myform.confirm[field].$error) && $scope.myform.confirm[field].$touched && $scope.myform.confirm[field].$dirty;
		}
		return false;
	};

	function _fakeWaitProgress(){
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
	}

	function _reset(arr){
		_.each(arr, function(item){
			item.isOpen = false;
		});
	}

	$scope.isOpen = function(which){
		return which === $scope.status.isOpen;
	}


	function _setAgeVerification(evt, data){
		$scope.isUnderAge = data;
		$scope.myform.creditcard.$setValidity("isValid", !$scope.isUnderAge);
	}

	function _makeAddress(type){
		return $scope[type].firstname + "&nbsp;" + $scope[type].lastname + "&nbsp;...&nbsp;" + $scope[type].city + ",&nbsp;" + $scope[type].state + "&nbsp;" + $scope[type].zip;
	}

	function _makeDifferentAddress(addressObj){
		return addressObj.firstname + " " + addressObj.lastname  + " " + addressObj.street1  + " " +  addressObj.city  + " " + addressObj.state  + " " + addressObj.zip;
	}

	function _init(){
		$scope.$on("AGE-VERIFICATION", _setAgeVerification);
		$timeout(function(){
			$scope.$watch("myform.shippingForm.$valid", function(n, o){
				if (n && !$scope.account){
					dialogs.wait('Validating shipping address','Please wait while we attempt to validate your shipping address.', _progress, "md");
					_fakeWaitProgress();

					var $off = $scope.$on('dialogs.wait.complete', function(){
						var dlg = dialogs.create('views/includes/addess_validation.tpl.html','customDialogCtrl2',$scope.shipping,'md');
						dlg.result.then(function(data){
							_reset($scope.status);
							$scope.address.shipping = _makeAddress("shipping");
							$scope.status.billing.isOpen = true;
							$off();
						});
					});

				} else if (n && $scope.account){
					console.info("I am here!!!");
					// 
					$scope.status.creditcard.isOpen = true;
					$scope.address.shipping = _makeAddress("shipping");
				}
			});
			$scope.$watch("myform.billingForm.$valid", function(n, o){
				if (n && !$scope.account){
					if($scope.foo.sameAsShipping){
						_reset($scope.status);
						$scope.billing = $scope.shipping;
						$scope.address.billing = _makeAddress("billing");
						$scope.creditcarddisplay = $scope.account ? _maskCreditCard($scope.shipping.creditcardnumber) : false; 
						$scope.status.creditcard.isOpen = true;
					} else {
						dialogs.wait('Validating billing address','Please wait while we attempt to validate your billing address.', _progress, "md");
						_fakeWaitProgress();

						var $off = $scope.$on('dialogs.wait.complete', function(){
							var dlg = dialogs.create('views/includes/addess_validation.tpl.html','customDialogCtrl2', $scope.billing,'md');
							dlg.result.then(function(data){
								_reset($scope.status);
								$scope.address.billing = _makeAddress("billing");
								$scope.status.creditcard.isOpen = true;
								$scope.creditcarddisplay = $scope.account ? _maskCreditCard($scope.shipping.creditcardnumber) : false; 
								$off();
							});
						});
					}
				} else if (n && $scope.account) {
					$scope.address.billing = _makeAddress("billing");
					$scope.creditcarddisplay = _maskCreditCard($scope.shipping.creditcardnumber); 
				}
			});
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

			$scope.myform.creditcard.$setValidity("isValid", false);

		}, 350);
	}

	
	function _isOfAge(birthday) { // birthday is a date
	    var ageDifMs = Date.now() - birthday.getTime();
	    var ageDate = new Date(ageDifMs); // miliseconds from epoch
	    return Math.abs(ageDate.getUTCFullYear() - 1970) >= 21;
	}

	_init();

});