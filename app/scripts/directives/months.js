/* jshint  quotmark: false, unused: false */

'use strict';

angular.module("checkoutApp").directive("months", function($timeout) {
    return {
        restrict: "AE",
        scope: {
        	tabIndex: "@"
        },
        templateUrl: "views/includes/months.tpl.html",

    };
});