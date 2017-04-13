/**
 * Created by mm on 4/9/17.
 */
angular.module('notewel').controller('feedController',['$scope', '$http', "sharedFunctions",
  function($scope, $http, sharedFunctions) {


  // load feed
  $http.get("/feed").then(function(response){
    console.log(response);
    response.data.forEach(function (notewel) {
      if (notewel.message.length <= 60) {
        notewel.size = "small";
      } else if (notewel.message.length <= 200) {
        notewel.size = "medium";
      }
    });
    $scope.feed = response.data;
    console.log($scope.feed);

  }).catch(function(err){
    console.log(err)
  });


  $scope.like = function (notewel) {
    sharedFunctions.like(notewel)
  }






}]);
