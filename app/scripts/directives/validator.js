'use strict';

angular.module('checkoutApp')
	.directive('validator', function () {
	return {
		require: 'ngModel',
		restrict: 'A',
		// scope: {
		// 	comparisonModel: "&validator",
		// 	errorType: "="
		// },
		link: function postLink(scope, element, attrs, ctrl) {

			scope.errorType = attrs.errorType
			scope.comparisonModel = _isOfAge

			var validate = function(viewValue) {

					if(!viewValue || !scope.comparisonModel){

						// It's valid because we have nothing to compare against
						ctrl.$setValidity(scope.errorType, true);
						return;
					}

					ctrl.$setValidity(scope.errorType, scope.comparisonModel(viewValue));
					return viewValue;
				};

			scope.errorType = scope.errorType || "validationError";

			ctrl.$parsers.unshift(validate);
			ctrl.$formatters.push(validate);

			attrs.$observe(scope.errorType, function(){
				// Whenever the comparison model changes we'll re-validate
				return validate(ctrl.$viewValue);
			});

			function _isOfAge(birthday) { // birthday is a date
			    var ageDifMs = Date.now() - birthday.getTime();
			    var ageDate = new Date(ageDifMs); // miliseconds from epoch
			    return Math.abs(ageDate.getUTCFullYear() - 1970) >= 21;
			}

		}
	};
});