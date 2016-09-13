// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ionic.rating', 'jett.ionic.filter.bar', 'editAccount.controllers'])

.constant('MYconfig', {
  'appName': 'Reserva',
  'appVersion': '0.0.9',
  'apiURL': 'http://reserva-front.nadyne.com/'
})


.run(function($ionicPlatform, $rootScope, $http, MYconfig, $window, $cordovaGeolocation, $cordovaNetwork, $ionicPopup) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    document.addEventListener("deviceready", function () {
         var type = $cordovaNetwork.getNetwork()
         var isOnline = $cordovaNetwork.isOnline()
         var isOffline = $cordovaNetwork.isOffline()

         if (isOffline == true) {
          $ionicPopup.confirm({
             title: "No Internet Connection",
             content: "Your device appears to be offline."
          })
          .then(function(result) {
             if(!result) {
                 ionic.Platform.exitApp();
             }
          });
         }


        }, false);

         if(window.Connection) {
             console.log(navigator.connection.type);
             if(navigator.connection.type == 'none') {

                 $ionicPopup.confirm({
                     title: "No Internet Connection",
                     content: "Your device appears to be offline."
                 })
                 .then(function(result) {
                     if(!result) {
                         ionic.Platform.exitApp();
                     }
                 });
             }
         }
    var posOptions = { enableHighAccuracy: true, timeout: 5000, maximumAge: 0};
    $cordovaGeolocation
      .getCurrentPosition(posOptions)
      .then(function (position) {
        var lat  = position.coords.latitude
        var long = position.coords.longitude
        $window.localStorage.setItem('latitude', lat);
        $window.localStorage.setItem('longitude', long);

        console.log('lat : ' + lat + ' long : ' + long );
      }, function(err) {
        console.log(err);
      });

     $rootScope.appVersion = MYconfig.appVersion;
     $window.localStorage.setItem('sesLogin', '');
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    cache: false,
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })

  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html'
        }
      }
    })
    .state('app.playlists', {
      url: '/playlists',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlists.html',
          controller: 'PlaylistsCtrl'
        }
      }
    })

  .state('app.hair', {
    cache: false,
    url: '/hair',
    views: {
      'menuContent': {
        templateUrl: 'templates/hair.html',
        controller: 'HairCtrl'
      }
    }
  })
  .state('app.home', {
    url: '/home',
    views: {
      'menuContent': {
        templateUrl: 'templates/home.html',
        controller: 'HomeCtrl'
      }
    }
  })
  .state('app.salon', {
    url: '/salon',
    views: {
      'menuContent': {
        templateUrl: 'templates/salon.html',
        controller: 'SalonCtrl'
      }
    }
  })
  .state('app.register', {
    url: '/register',
    views: {
      'menuContent': {
        templateUrl: 'templates/register.html',
        // controller: 'RegisterCtrl'
      }
    }
  })
  .state('app.service', {
    url: '/service',
    views: {
      'menuContent': {
        templateUrl: 'templates/service.html',
        controller: 'ServiceCtrl'
      }
    }
  })
  .state('app.gallery', {
    url: '/gallery',
    views: {
      'menuContent': {
        templateUrl: 'templates/gallery.html',
        controller: 'GalleryCtrl'
      }
    }
  })
  .state('app.promotion', {
    url: '/promotion',
    views: {
      'menuContent': {
        templateUrl: 'templates/promotion.html',
        controller: 'PromotionCtrl'
      }
    }
  })
  .state('app.review', {
    url: '/review',
    views: {
      'menuContent': {
        templateUrl: 'templates/review.html',
        controller: 'ReviewCtrl'
      }
    }
  })
  .state('app.support', {
    url: '/support',
    views: {
      'menuContent': {
        templateUrl: 'templates/support.html',
        controller: 'SupportCtrl'
      }
    }
  })
  .state('app.free_voucher', {
    url: '/free_voucher',
    views: {
      'menuContent': {
        templateUrl: 'templates/free_voucher.html',
        controller: 'FreeVoucherCtrl'
      }
    }
  })
  .state('app.book_datetime', {
    url: '/book_datetime',
    views: {
      'menuContent': {
        templateUrl: 'templates/book_datetime.html',
        controller: 'BookDatetime'
      }
    }
  })
  .state('app.checkout', {
    url: '/checkout',
    views: {
      'menuContent': {
        templateUrl: 'templates/checkout.html',
        controller: 'Checkout'
      }
    }
  })
  .state('app.mybooking', {
    cache: false,
    url: '/mybooking',
    views: {
      'menuContent': {
        templateUrl: 'templates/mybooking.html',
        controller: 'Mybooking'
      }
    }
  })
 .state('app.edit_account', {
      cache: false,
      url: '/edit_account',
      views: {
        'menuContent': {
          templateUrl: 'templates/edit_account.html',
          controller: 'editAccountCtrl'
        }
      }
  })
  .state('app.activation_register', {
      cache: false,
      url: '/activation_register',
      views: {
        'menuContent': {
          templateUrl: 'templates/activation_register.html',
          controller: 'activationRegister'
        }
      }
  })
  .state('app.filter_home', {
      cache: false,
      url: '/filter_home',
      views: {
        'menuContent': {
          templateUrl: 'templates/filter_home.html'
        }
      }
  })
  .state('app.forgot_password', {
      cache: false,
      url: '/forgot_password',
      views: {
        'menuContent': {
          templateUrl: 'templates/forgot_password.html'
        }
      }
  })
  .state('app.rate_salon', {
      cache: false,
      url: '/rate_salon',
      views: {
        'menuContent': {
          templateUrl: 'templates/rate_salon.html',
          controller: 'ratesalonCtrl'
        }
      }
  })
  .state('app.favourite', {
    url: '/favourite',
    views: {
      'menuContent': {
        templateUrl: 'templates/favourite.html',
        controller: 'FavouriteCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});
