/**
 * Created by KX on 12/21/16.
 */
'use strict';

kaiBotApp.controller('LoginController', ['$scope', '$location', '$routeParams', '$resource', '$rootScope',
  function ($scope, $location, $routeParams, $resource, $rootScope) {
    if ($scope.main) {
      $scope.main.login = {
        email:'',
        password: ''
      };

      $scope.main.login.loggingIn = function(){
        var login_endpoint = $resource('/admin/login');
        $scope.main.login.user_info = login_endpoint.save({email: $scope.main.login.email,
            password: $scope.main.login.password},
            function(){
            $scope.main.login.failure_msg = '';
            // After logging in is successful...
            $location.path('/user/' + $scope.main.login.user_info._id);
        }, function(err){
            $scope.main.login.failure_msg = 'Login Attempt Failed. Please try again...';
            console.log(err);
        });
      };

      $scope.main.login.cancel = function(){
        $location.path('/');
      };

      console.log("I'm the LoginController...");
    }
  }]);
