angular.module('notewel').controller('myNotewelController',['$scope', '$http',"CustomAnimations", function($scope, $http, CustomAnimations){



  $scope.me  = window.NOTEWEL_LOGIN;

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
  },

  $scope.structurizedNotewelCollection = [];

  $scope.badInput = null;


  function chunkCollection(targetArray, chunckSize) {
    return _.chunk(targetArray, chunckSize);
  }

  var urlToNotes = "/notewel/" + window.location.hash.slice(2, window.location.hash.length);
  var urlToUserInfo = "/user/" + window.location.hash.slice(2, window.location.hash.length);

  // get user notewels
  io.socket.get(urlToNotes, function (data, response) {
    console.log(response);
    if (response.statusCode < 400) {

      if (Array.isArray(response.body)) {
        $scope.structurizedNotewelCollection = chunkCollection(data, 2);
        $scope.$apply();
      }

    }
  });


  // get user info
  $http.get(urlToUserInfo).then(function(response){
    console.log("IN GETTING USER INFO");
    $scope.user = response.data;
  }).catch(function(err){
    console.log("IN GETTING USER INFO: (NOTEWEL CONTROLLER):")
    console.log(err);
  });


  //TODO create custom routes

  $scope.createNotewel = function() {

    if (_.isUndefined($scope.notewelMessage)) {
      console.log('bad input');
      $scope.badInput = "Bad Input";
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
      // HANDLE ERRORS;
      console.log(data);
      console.log(JWR.statusCode + " : At action create notewell (notewelcontroller)");


      if ($scope.structurizedNotewelCollection.length === 0)  {
        $scope.structurizedNotewelCollection = new Array(new Array(data));

      } else if ($scope.structurizedNotewelCollection[$scope.structurizedNotewelCollection.length - 1].length !== 2) {

        $scope.structurizedNotewelCollection[$scope.structurizedNotewelCollection.length - 1].push(data);

      } else {
        $scope.structurizedNotewelCollection.push(new Array(data));
      }

      $scope.$apply();
    });
  },


  $scope.deleteNotewel = function(id, rowIndex, index) {

    $http.get('/notewel/' + $scope.user.username + "/" + id).then(function (currentNotewel) {
      console.log(currentNotewel);
      url = "/notewel/" + currentNotewel.data.notewelId;

      $http.delete(url).then(function (response) {
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
            // $(currentElement).animateCss('animated fadeInRight');
            // $(currentElement).removeClass('animated fadeOutLeft');
            console.log($scope.structurizedNotewelCollection);
            _.forEach($scope.structurizedNotewelCollection, function (notewelRow) {

              _.remove(notewelRow, function (notewel) {
                return notewel.notewelId == response.data.notewelId;
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
      });
    });

  },



  $scope.like = function(currentNotewel) {

// TODO PREVENT DDOS BY LIKES


    if (!currentNotewel.notewelId) {
      // TODO SELF LIKE SCENARIO
    }


    currentNotewel.liked = !currentNotewel.liked;
    if (currentNotewel.liked) {

      $http.post('/like/notewel/' + currentNotewel.notewelId).then(function(response){
        //   console.log(response)
      });
    } else {
      $http.post('/removelike/notewel/' + currentNotewel.notewelId).then(function(response){
        //   console.log(response)
      });
    }

  }


    //TODO MAKE LIVE ADDING USING ON (SAILS 14 CHAPTER)
  // io.socket.on('notewel', function(event){
  //     console.log('on');
  //     // $scope.structurizedNotewelCollection.push(event);
  //
  // });


}]);
