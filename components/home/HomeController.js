/**
 * Created by KX on 12/21/16.
 */
'use strict';

kaiBotApp.controller('HomeController', ['$scope', '$location', '$routeParams', '$resource', '$timeout', '$rootScope',
  function ($scope, $location, $routeParams, $resource, $timeout, $rootScope) {
    if ($scope.main) {
      $scope.main.dev_cred = '';
      $scope.main.dev_permission_granted = '';
      $scope.main.dev_permission_denied = '';
      $scope.main.in_chatbot = false;

      $scope.main.toDevLogin = function() {
        var dev_login_endpoint = $resource('/dev-login');
        dev_login_endpoint.save({dev_cred: $scope.main.dev_cred},
          function () {
            $scope.main.dev_permission_granted = 'Access Granted! Hang on...';
            $scope.main.dev_permission_denied = '';
            var go_to_dev = function () {
              $scope.main.dev_permission_granted = '';
              $scope.main.in_chatbot = true;
              $location.path('/dev');
            };
            $timeout(go_to_dev, 3000);
          }, function (err) {
            $scope.main.dev_permission_denied = 'Access Denied. Please try again...';
            console.log(err);
          });
      };

      console.log("I'm the HomeController...");
    }
  }]);
//
//kaiBotApp.controller('HomeController', ['$scope', '$location', '$routeParams', '$resource', '$rootScope',
//  function ($scope, $location, $resource) {
//    if ($scope.main) {
//      //
//      $scope.main.toRegister = function(){
//        console.log("clicking Register...");
//        $location.path('/register');
//      };
//
//      $scope.main.toLogIn = function(){
//        console.log("clicking Login...");
//        $location.path('/login');
//      };
//
//
//      console.log("I'm the HomeController...");
//    }
//  }]);
