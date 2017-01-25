/**
 * Created by KX on 12/21/16.
 */
'use strict';

kaiBotApp.controller('RegisterController', ['$scope', '$location', '$routeParams', '$resource', '$rootScope', '$timeout',
  function ($scope, $location, $routeParams, $resource, $rootScope, $timeout) {
    console.log("I'm the RegisterController...");

    if ($scope.main) {
      $scope.main.registration = {};
      $scope.main.registration.user = {
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        state: '',
        insurance_plan: ''
      };

      //$scope.main.registration.states = ('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS ' +
      //'MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI ' +
      //'WY').split(' ').map(function (state) { return { abbrev: state }; });

      $scope.main.registration.states = [
        'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
        'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA',
        'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY',
        'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX',
        'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
      ];

      // User submits registration form
      $scope.main.registration.submit = function(){
        var new_user_info = {
          first_name: $scope.main.registration.user.first_name,
          last_name: $scope.main.registration.user.last_name,
          email: $scope.main.registration.user.email,
          password: $scope.main.registration.user.password,
          state_of_res: $scope.main.registration.user.state,
          insurance_plan_name: $scope.main.registration.user.insurance_plan
        };

        var reset_form = function(){
          $scope.main.registration.user.first_name = '';
          $scope.main.registration.user.last_name = '';
          $scope.main.registration.user.email = '';
          $scope.main.registration.user.password = '';
          $scope.main.registration.user.state = '';
          $scope.main.registration.user.insurance_plan ='';
        };

        var create_user = $resource('/user-registration');
        create_user.save(new_user_info, function(){
          console.log("State is: " + $scope.main.registration.user.state);

          $scope.main.registration.failed_msg = '';
          $scope.main.registration.success_msg = 'Success! We will take you to the login page now...';
          reset_form();
          //$scope.userForm.$setUntouched();
          $scope.userForm.$setPristine();
          //After new user registration successful, take user to Login Page to login with 3 sec delay...
          var go_to_login = function(){
            $scope.main.registration.success_msg = '';
            $location.path('/login');
          };
          $timeout(go_to_login, 3000);
        }, function(err){
          reset_form();
          $scope.userForm.$setUntouched();
          $scope.userForm.$setPristine();
          $scope.main.registration.failed_msg = "This email is already used by another user. Please use another one.";
          console.log(err);
        });
      };

       //User cancels registration process before submitting form, returns to homepage
      $scope.main.registration.cancel = function(){
        $location.path('/');
      };
    }
  }]);

// Does password compareTo in registration form
kaiBotApp.directive("compareTo", function() {
  return {
    require: "ngModel",
    scope: {
      otherModelValue: "=compareTo"
    },
    link: function(scope, element, attributes, ngModel) {

      ngModel.$validators.compareTo = function(modelValue) {
        return modelValue == scope.otherModelValue;
      };

      scope.$watch("otherModelValue", function() {
        ngModel.$validate();
      });
    }
  };
});
