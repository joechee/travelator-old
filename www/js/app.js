// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    // setup an abstract state for the tabs directive
    .state('tab', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html"
    })

    // Each tab has its own nav history stack:

    .state('tab.home', {
      url: "/home",
      views: {
        'tab': {
          templateUrl: 'templates/home.html',
          controller: 'HomeCtrl'
        }
      }
    })

    .state('tab.flightSearch', {
      url: '/flightSearch',
      views: {
        'tab': {
          templateUrl: 'templates/flightSearch.html',
          controller: 'FlightSearchCtrl'
        }
      }
    })

    .state('tab.itinerary', {
      url: '/itinerary/:location/:days',
      views: {
        'tab': {
          templateUrl: 'templates/itinerary.html',
          controller: 'ItineraryCtrl'
        }
      }
    })

    .state('tab.context', {
      url: '/context/:place',
      views: {
        'tab': {
          templateUrl: 'templates/context.html',
          controller: 'ContextCtrl'
        }
      }
    })

    .state('tab.about', {
      url: '/about',
      views: {
        'tab': {
          templateUrl: 'templates/about.html',
          controller: 'AboutCtrl'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/home');
});

