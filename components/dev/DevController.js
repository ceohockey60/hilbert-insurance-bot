'use strict';

kaiBotApp.controller('DevController', ['$scope', '$location', '$routeParams', '$resource', '$rootScope',
  function ($scope, $location, $routeParams, $resource, $rootScope) {
    if ($scope.main) {
      //$scope.main.dev_cred = '';
      //$scope.main.dev_permission_granted = '';
      //$scope.main.dev_permission_denied = '';
      //$scope.main.in_chatbot = false;
      //
      //$scope.main.toDevLogin = function() {
      //  var dev_login_endpoint = $resource('/dev-login');
      //  dev_login_endpoint.save({dev_cred: $scope.main.dev_cred},
      //    function () {
      //      $scope.main.dev_permission_granted = 'Access Granted! Hang on...';
      //      $scope.main.dev_permission_denied = '';
      //      var go_to_dev = function () {
      //        $scope.main.dev_permission_granted = '';
      //        $scope.main.in_chatbot = true;
      //        $location.path('/dev');
      //      };
      //      $timeout(go_to_dev, 3000);
      //    }, function (err) {
      //      $scope.main.dev_permission_denied = 'Access Denied. Please try again...';
      //      console.log(err);
      //    });
      //};

      $scope.main.dev_leave = function(){
        $scope.main.in_chatbot = false;
        $location.path('/');
      };

      console.log("I'm the DevController...");
    }
  }]);
