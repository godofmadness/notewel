angular.module('notewel', ['ngRoute', 'compareTo'])
//
//
//   .config(['$sceDelegateProvider', function($sceDelegateProvider) {
//     $sceDelegateProvider.resourceUrlWhitelist([
//       'self',
//       '*://www.youtube.com/**'
//     ]);
//   }])
//
// .filter('spaceless', function() {
//   return function(input) {
//     if (input) {
//       return input.replace(/\s+/g, '-');
//     }
//   };
// })

.config(['$routeProvider', function($routeProvider) {

  $routeProvider

    // .when('/user', {
    //   templateUrl: '/templates/myNotewel.html',
    //   controller: 'myNotewelController'
    // })

    .when('/login', {
      templateUrl: '/templates/login.html',
      controller: 'loginController'
    })

    .when('/registration', {
      templateUrl: '/templates/registration.html',
      controller: 'registrationController'
    })

    .when('/feed', {
      templateUrl: '/templates/feed.html',
      controller: 'feedController'
    })

    .when('/:user', {
      templateUrl: '/templates/myNotewel.html',
      controller: 'myNotewelController'
    });


}]);
