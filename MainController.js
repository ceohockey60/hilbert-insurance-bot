/**
 * Created by KX on 12/21/16.
 */
'use strict';

var kaiBotApp = angular.module('kaiBotApp', ['ngRoute', 'ngMaterial', 'ngResource']);

kaiBotApp.config(['$routeProvider',
    function($routeProvider){
        $routeProvider.
            when('/', {
              templateUrl: 'components/home/home_template.html',
              controller: 'HomeController'
            }).
            //when('/login', {
            //  templateUrl: 'components/login/login_template.html',
            //  controller: 'LoginController'
            //}).
            //when('/register', {
            //  templateUrl: 'components/register/register_template.html',
            //  controller: 'RegisterController'
            //}).
            //when('/user/:userId', {
            //  templateUrl: 'components/user-profile/user-profile_template.html',
            //  controller: 'UserProfileController'
            //}).
            when('/dev', {
              templateUrl: 'components/dev/dev_template.html',
              controller: 'DevController'
            }).
            otherwise({
              redirectTo: '/'
            });
    }]);

kaiBotApp.controller('MainController', ['$scope', '$location', '$resource', '$rootScope', '$http', '$mdDialog',
    function($scope, $location, $resource, $rootScope, $http, $mdDialog) {
        $scope.main = {};
        $scope.main.title = "Kai Insurance | Your 24/7 Helper for All Your Health Insurance Needs.";
        $scope.main.loggedIn = false; //boolean indicating it user is logged in; default value is false
        //$rootScope.$on('$routeChangeStart', function(event, next, current){
        //    if(!$scope.main.loggedIn){
        //        if ($location.path().search('/') === -1){
        //          $location.path('/');
        //        }
        //        if (next.templateUrl !== 'components/home/home_template.html'){
        //          $location.path('/');
        //        }
        //    }
        //});

    }]);
