angular.module('notewel').controller('myNotewelController',['$scope', '$http',"notewelTabs", "sharedFunctions",
  function($scope, $http, notewelTabs, sharedFunctions) {


  // onload initialize tabs
  notewelTabs.initializeTabs();

  // memStorage.set("like", $scope.like);



  // $scope.me  = window.NOTEWEL_LOGIN;

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
    "timeOut": "1000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
  }

  $scope.structurizedNotewelCollection = [];

  $scope.badInput = null;

  //
  // function chunkCollection(targetArray, chunckSize) {
  //   return _.chunk(targetArray, chunckSize);
  // }



  var currentUser = window.location.hash.slice(2, window.location.hash.length)


  var urlToNotes = "/notewel/" + currentUser;
  var urlToUserInfo = "/user/" + currentUser;

  var urlToGetFollowers = '/user/' + currentUser + '/followers';
  var urlToGetFollowing = '/user/' + currentUser + '/following';
  var urlToFollowAction = '/user/' + currentUser + '/follow';




    // get user notewels
  io.socket.get(urlToNotes, function (data, response) {

    if (response.statusCode < 400) {

      _.forEach(response.body, function(notewel) {
          if(notewel.message.length <= 60) {
            notewel.size = "small";
          } else if (notewel.message.length <= 200) {
            notewel.size = "medium";
          }
      });


      $scope.structurizedNotewelCollection = response.body.reverse();
      $scope.$apply();
      console.log($scope.structurizedNotewelCollection)

      /*if (Array.isArray(response.body)) {
        $scope.structurizedNotewelCollection = chunkCollection(data, 2);
        $scope.$apply();
      */

    }
  });


  // get user info
  $http.get(urlToUserInfo).then(function(response){
    // console.log("IN GETTING USER INFO");
    console.log(response);
    $scope.user = response.data;
  }).catch(function(err){
    // console.log("IN GETTING USER INFO: (NOTEWEL CONTROLLER):")
    console.log(err);
  });


  // get followers
  $http.get(urlToGetFollowers).then(function(response){
    $scope.followers = response.data;
    console.log($scope.followers)
  }).catch(function(err){
    console.log(err);
  });



  // // get following

  $http.get(urlToGetFollowing).then(function(response){
    $scope.followings = response.data;
    console.log($scope.followings);
  }).catch(function(err){
    console.log(err);
  });


  $scope.createNotewel = function() {
    if (_.isUndefined($scope.notewelMessage)) {
      console.log('bad input');
      toastr.error('You need to write something');
      return;
    }

    var createNoteUrl = '/notewel/' + $scope.user.userId;
    console.log(createNoteUrl);
    io.socket.post(createNoteUrl, {
      message: $scope.notewelMessage,
      private: 0,
      // TODO LET CHOOSE STYLES
      style: "yellow"
    }, function (data, JWR) {

      if(data.message.length <= 80) {
        data.size = "small";
      } else if (data.message.length <= 200) {
        data.size = "medium";
      }
      // HANDLE ERRORS;

      console.log(data);

      console.log(JWR.statusCode + " : At action create notewell (notewelcontroller)");

      // ADD TO COLLECTION

      $scope.structurizedNotewelCollection.unshift(data);
      $scope.$apply();
    });
  },



  $scope.deleteNotewel = function(id, rowIndex, index) {

    url = "/notewel/" + id;
    console.log(url);

    $http.delete(url).then(function (response) {
      console.log(response);
      if (response.status > 400 && response.statusCode < 404) {
        // Handle 400 - 404 response
      }

      if (response.status > 500) {
        // Handle 500
      }

      if (response.status < 350) {

        console.log("HERE");
        //soft delete animation;
        var currentElement = "#nt" + rowIndex + index;
        var promise = new Promise(function (res, rej) {
          $(currentElement).fadeOut('slow', function () {
            res();
          });
        });

        promise.then(function () {

          console.log($scope.structurizedNotewelCollection);
          _.forEach($scope.structurizedNotewelCollection, function (notewelRow) {

            _.remove(notewelRow, function (notewel) {
              return notewel.notewelId == id;
            });

          });
          console.log(id + " " + rowIndex + " " + index);

          console.log($scope.structurizedNotewelCollection[rowIndex].length);
          if ($scope.structurizedNotewelCollection[rowIndex].length === 0) {
            console.log("DELETING: " + $scope.structurizedNotewelCollection[rowIndex]);
            $scope.structurizedNotewelCollection.splice(rowIndex, 1);
          }

          $scope.$apply();
        });
      }
    })
      .catch(function(err) {
        console.log(err);
      });

  },

  $scope.follow = function() {
    console.log('fired');
    $http.post(urlToFollowAction,{
      followingId: $scope.user.userId
    })
    .then(function(response){
      console.log(response);
      $scope.user.isFollowing = true;
    })
    .catch(function(err){
      console.log(err);
    })
  },

  //
  // $scope.like = function(currentNotewel) {
  // // TODO PREVENT DDOS BY LIKES (MAKING OBSERVER ON ARRAY OF LIKES); OBSERVER CHECKS EVERY MINUTE FOR CHANGE AND IF FOUND UPDATE;
  //
  //   currentNotewel.liked = !currentNotewel.liked;
  //   var operation;
  //   currentNotewel.liked ? operation = "like" : operation = "removeLike";
  //
  //   $http.post('/'+operation+'/notewel/' + currentNotewel.notewelId).then(function(response){
  //     currentNotewel.numberOfLikes = response.data.numberOfLikes;
  //   });
  // }


    $scope.like = function (notewel) {
      sharedFunctions.like(notewel)
    }



    //TODO MAKE LIVE ADDING USING ON (SAILS 14 CHAPTER)
  // io.socket.on('notewel', function(event){
  //     console.log('on');
  //     // $scope.structurizedNotewelCollection.push(event);
  //
  // });


}]);
