/**
 * Created by mm on 3/27/17.
 */
angular.module('notewel').service('sharedFunctions',['$http', function($http){
  storage = {};


  return {

    like: function(currentNotewel) {
      // TODO PREVENT DDOS BY LIKES (MAKING OBSERVER ON ARRAY OF LIKES); OBSERVER CHECKS EVERY MINUTE FOR CHANGE AND IF FOUND UPDATE;

      currentNotewel.liked = !currentNotewel.liked;
      var operation;
      currentNotewel.liked ? operation = "like" : operation = "removeLike";

      $http.post('/'+operation+'/notewel/' + currentNotewel.notewelId).then(function(response){
        currentNotewel.numberOfLikes = response.data.numberOfLikes;
      });
    }


  }
}]);
