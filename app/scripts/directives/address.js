"use strict";

angular.module("checkoutApp").directive("address", function(){
	return {
		templateUrl: "views/includes/address.tpl.html",
		restrict: "AE",
		replace: true,
		scope: {
			address: "=type",
			whichform: "="
		},
		link: function(scope, element, attrs){
			scope.tabstart = attrs.tabstart || 0;

			scope.hasError = function(field){
				if (scope.whichform[field]){
					return scope.whichform[field].$invalid && scope.whichform[field].$dirty;
				} 
				return false;
			};
			scope.hasSuccess = function(field){
				if (scope.whichform[field]){
					return scope.whichform[field].$valid && scope.whichform[field].$touched;
				}
				return true;
			};
			scope.displayError = function(field){
				if (scope.whichform[field]){
					return !_.isEmpty(scope.whichform[field].$error) && scope.whichform[field].$touched && scope.whichform[field].$dirty;
				}
				return false;
			};
		},
		controller: function($scope){
			$scope.getTabIndex = function(){
				return $scope.tabstart++;
			};
		}
	};
});