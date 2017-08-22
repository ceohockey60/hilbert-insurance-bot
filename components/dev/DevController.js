'use strict';

hilbertBotApp.controller('DevController', ['$scope', '$location', '$routeParams', '$resource', '$rootScope',
  function ($scope, $location, $routeParams, $resource, $rootScope) {
    if ($scope.main) {
      $scope.main.dev_leave = function(){
        $scope.main.in_chatbot = false;
        $location.path('/');
      };
    }
  }]);
