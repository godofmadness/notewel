angular.module('notewel').controller('loginController',['$scope', '$http', function($scope, $http) {

  $scope.logIn = function() {

    $http.post('/login', {
      usernameOrEmail: $scope.usernameOfEmail,
      password: $scope.password
    })
      .then(function(response){

        console.log(response);
        document.dispatchEvent(new CustomEvent("loggedInUserData", {
          detail: {
            me: {
              username: response.data.username,
              email: response.data.email
            }
          },
          bubbles: true,
          cancelable: true
        }));

      window.location = "#/" + response.data.username;
    })
      .catch(function(err) {
      console.log(err);
    });

  }


}]);
