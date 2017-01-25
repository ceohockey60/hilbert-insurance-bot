'use strict';

kaiBotApp.controller('UserProfileController', ['$scope', '$location', '$routeParams', '$resource', '$mdDialog', '$rootScope', '$timeout',
  function ($scope, $location, $routeParams, $resource, $mdDialog, $rootScope, $timeout) {
    console.log("I'm the UserProfileController...");
    /*
     * Since the route is specified as '/user-profile/:userId' in $routeProvider config the
     * $routeParams  should have the userId property set with the path from the URL.
     */
    var userId = $routeParams.userId;
    console.log("Current Id: " + userId);
    if ($scope.main) {
      $scope.main.logging_out_msg = "";
      $scope.UserProfile = $resource('/user/:userId', {userId: '@_id'});
      $scope.main.cur_user_details = $scope.UserProfile.get({userId: userId});

      $scope.main.to_logout = function(){
        $scope.main.logging_out_msg = "Logging out now...";
        var to_logout = $resource('/admin/logout');
        to_logout.save({}, function(){
          var go_home = function(){
            $scope.main.cur_user_details = {};
            $location.path('/');
          };
          $timeout(go_home, 3000);
        }, function(){
          console.log("Logging out failed...");
        });
      };
    }
  }]);
