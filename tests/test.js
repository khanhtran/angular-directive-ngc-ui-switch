/**
 * @author Diego
 */

(function (angular, undefined) {
    "use strict";

    var app = angular.module('TestApp', ['ngc.ui.switch']);

    app.controller("TestController", TestController);

    TestController.$inject = ['$scope'];

    function TestController($scope) {

        window.$s = $scope;
        $scope.window = window;

        $scope.master = {
            on : false,
            last: 'none',
            userEvent : function(event, eventName) {
                console.log(now() + 'user event: ' + eventName);
                $scope.master.last = eventName;
            }
        };
        $scope.slave = {
            on : true
        };

    }

})(angular);
