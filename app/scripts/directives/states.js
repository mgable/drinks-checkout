/* jshint  quotmark: false, unused: false */

'use strict';

angular.module("checkoutApp").directive("states", function($timeout) {
    return {
        restrict: "AE",
        // scope: {
        // 	tabIndex: "@"
        // },
        templateUrl: "views/includes/states.tpl.html",
        link: function(scope, element, attrs){
        	scope.tabIndex = attrs.tabIndex;
        }
    };
});