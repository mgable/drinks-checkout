/* jshint  quotmark: false, unused: false */

'use strict';

angular.module("checkoutApp").directive("focus", function($timeout) {
    return {
        restrict: "A",
        link: function(scope, element, attrs) {
            $timeout(function() {
                element[0].focus();
            }, 200);
        }
    };
});