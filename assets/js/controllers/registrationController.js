
angular.module('notewel').controller('registrationController',['$scope', '$http',
  'Scopes', function($scope, $http, Scopes) {

  toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": true,
    "progressBar": false,
    "positionClass": "toast-bottom-left",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "100",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
  },

  $scope.createUser = function(){
    $http.post('/createUser',{
      email: $scope.email,
      username: $scope.username,
      password: $scope.password

    }).then(function(response) {
      console.log(response.data);

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

    }).catch(function(err){
      console.log(err);
      if (err.status === 400 && err.status <= 404) {
        console.log('BAD REQUEST');
        toastr.error(err.data)
      }

      if (err.status > 500) {

      }

    });
  }

}]);
