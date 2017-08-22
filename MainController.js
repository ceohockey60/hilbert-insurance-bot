/**
 * Created by KX on 12/21/16.
 */
'use strict';

var hilbertBotApp = angular.module('hilbertBotApp', ['ngRoute', 'ngMaterial', 'ngResource']);

hilbertBotApp.config(['$routeProvider',
    function($routeProvider){
        $routeProvider.
            when('/', {
              templateUrl: 'components/home/home_template.html',
              controller: 'HomeController'
            }).
            when('/dev', {
              templateUrl: 'components/dev/dev_template.html',
              controller: 'DevController'
            }).
            otherwise({
              redirectTo: '/'
            });
    }]);

hilbertBotApp.controller('MainController', ['$scope', '$location', '$resource', '$rootScope', '$http', '$mdDialog',
    function($scope, $location, $resource, $rootScope, $http, $mdDialog) {
        $scope.main = {};
        $scope.main.title = "Hilbert Insurance | Your 24/7 Helper for All Your Health Insurance Needs.";
        $scope.main.loggedIn = false; //boolean indicating it user is logged in; default value is false

    }]);
