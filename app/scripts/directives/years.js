/* jshint  quotmark: false, unused: false */

'use strict';

angular.module("checkoutApp").directive("years", function($timeout) {
    return {
        restrict: "AE",
        scope: {
        	tabIndex: "@"
        },
        templateUrl: "views/includes/years.tpl.html",

    };
});