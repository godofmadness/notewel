angular.module('notewel').controller('layoutController',['$scope', '$http',"Scopes", function($scope, $http, Scopes) {/**
       * Created by mm on 4/1/17.
       */

        $http.get('/isLoggedIn').then(function(resposne){
          console.log(resposne.data)
          $scope.me = resposne.data;
        });


        document.addEventListener('loggedInUserData', function(event){
          console.log(event);
          $scope.me = event.detail.me;
        });



        $scope.logout = function() {
            $http.get('/logout').then(function(){
              $scope.me = null;
              window.location = "#/login";
            }).catch(function(err){
              console.log("IN LAYOUT CONTROLLER: ");
              console.log(err);
            })
        }



}]);
