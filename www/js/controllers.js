angular.module('starter.controllers', ['ionic', 'ngCordova', 'ion-datetime-picker'])

.controller('AppCtrl', function($scope, $rootScope, $ionicModal, $cordovaFacebook, $cordovaGooglePlus, $timeout, MYconfig, $window, $http, $ionicPopup, $httpParamSerializerJQLike, $ionicHistory, $state, $ionicLoading, $log) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  //login to see detail
  $rootScope.loginPage = 0;

  if ('1' == $window.localStorage.getItem('sesLogin')){
    var userdata = $window.localStorage.getItem('userdata');
    userdata = JSON.parse(userdata);
    // console.log("TOLE");
    // console.log(JSON.parse(userdata));
    // console.log(userdata.profilePic);
    // if(userdata.profilePic){
    //   $rootScope.profilePic = userdata.profilePic;
    // }else{
    //   $rootScope.profilePic = "img/usernameicon.png";
    // }
    
    $rootScope.fullName   = userdata.fullName;
    $rootScope.emailUser  = userdata.emailUser;
    $rootScope.profilePic = userdata.profilePic;
  }else{
    $rootScope.fullName   = "";
    $rootScope.emailUser  = "";
    $rootScope.profilePic = "";
  }
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  $ionicModal.fromTemplateUrl('templates/details_voucher.html', {
    scope: $scope
  }).then(function(modal2) {
    $scope.modalvoucher = modal2;
  });

  // Triggered in the login modal to close it
  $scope.closeDetailVoucher = function() {
    $scope.modalvoucher.hide();
  };

  // Open the login modal
  $scope.detailVoucher = function() {
    $scope.modalvoucher.show();
  };

  $scope.detailSalon = function(res){
    if ($window.localStorage.getItem('sesLogin') == 1) {
      console.log(res);
      $rootScope.idDetailSalon = res;
      $ionicHistory.nextViewOptions({
        disableBack: false
      });
      $state.go('app.salon');
    }else{
      $scope.modal.show();
      $rootScope.loginPage = 1;
    }
  };

  // Perform the login action when the user submits the login form
  $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
  $scope.LoginForm = {};
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);
    var link = MYconfig.apiURL + 'login/';
    $ionicLoading.show({template: 'Logging in ...'});
    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system

    // $timeout(function() {
    //   $scope.closeLogin();
    // }, 1000);
     $http.post(link, $httpParamSerializerJQLike($scope.LoginForm), { timeout : 8000 } ).then(function (response){
      console.log(response);
      if (response.data.status == 1) {
        console.log('LOGGED IN');

        // helperService.updateLocation();

        $window.localStorage.setItem('sesLogin', '1');
        $ionicLoading.hide();

        $ionicHistory.nextViewOptions({
            disableBack: true
          });

        var link = MYconfig.apiURL + 'services/profiles';
        console.log('link :');
        console.log(link);
        $http.get(link).success(function(data){

          console.log('success get profile : ');
          console.log(data);
          var arr_data = Object.keys(data).map(function (key) {return data[key]});

          $rootScope.fullName     = arr_data[1].full_name;
          $rootScope.emailUser  = arr_data[1].users.email;
          if (arr_data[1].image_name == "") {
            $rootScope.profilePic   = "";
          }else{
            $rootScope.profilePic   = arr_data[1].image_name;
          }
          console.log(arr_data);

        }).error(function(data){
          console.log('error get profile');
          console.log(data);
        }).then(function(result){
          things = result.data;
        });
        $window.localStorage.setItem('userdata', JSON.stringify({profilePic: $rootScope.profilePic, fullName: $rootScope.fullName, emailUser: $rootScope.emailUser }));
        $scope.closeLogin();
        if ($rootScope.loginPage == 1) {
          $scope.modal.hide();
        }else{
          $state.go('app.home');
        }
      }
      else{
        $ionicLoading.hide();
        $ionicPopup.alert({
          title: 'Login',
          template: response.data.message,
          okType: 'button-assertive',
          cssClass: 'popupalert'
        })
      }
    }, function (response){
      console.log(response);
      $ionicLoading.hide();
      $ionicPopup.alert({
        title: 'Login failed',
        template: 'Timeout error, check your internet connection',
        okType: 'button-assertive',
        cssClass: 'popupalert'
      })
    });
  };

  $scope.registerPage = function(){
    $scope.closeLogin();
    $state.go('app.register');
  };

  $scope.title = function(res){
    console.log(res);
    $rootScope.title = res;
     // var merchant_list_arr = [];
     //  var merchant_list = "";
    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    $ionicLoading.show({template: 'Load Merchant List...'});
    var apiMerchantList = 'reserva/merchants/list?p=1&psize=20&srvcat[]='+res+'&lat='+window.localStorage.getItem('latitude')+'&lon='+window.localStorage.getItem('latitude');
    // var apiMerchantList = 'reserva/merchants/list?p=1&psize=20&srvcat[]='+res+'&lat=-6.2748694&lon=106.8139994';
    $http.get(MYconfig.apiURL + apiMerchantList)
      .success(function(result) {
        $log.log(MYconfig.apiURL + apiMerchantList);
        $log.log(result.data);
        $scope.items = result.data;
        $ionicLoading.hide();
        // angular.forEach($scope.items, function(value, key){
        //   merchant_list_arr.push({
        //     id : value.id,
        //     name : value.name,
        //     iconThumbnail : value.merchantImages[0].thumb_name,
        //   });
        // });
        $window.localStorage.setItem('merchantList', JSON.stringify(result.data)); //simpan data ke local storage
        $ionicHistory.nextViewOptions({
          disableBack: false
        });
        $state.go('app.hair');
      })
      .error(function(data, status, headers,config){
          $ionicLoading.hide();
          $ionicPopup.alert({
               title: '',
               template: 'Get Merchant List Failed',
               okType: 'button-assertive',
               cssClass: 'popupalert'
          });
      });
      // $scope.merchant_list = merchant_list_arr;
    };


  $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
  $scope.SignupForm = {};
  $scope.submitRegister = function(){
    var link = MYconfig.apiURL + 'signup';

    $http.post(link, $httpParamSerializerJQLike($scope.SignupForm) ).then(function (res){
      if (res.data.detailMessages.username) {
        var pop_up_data = JSON.stringify(res.data.message)+"<br>"+JSON.stringify(res.data.detailMessages.username);
      }else if (res.data.detailMessages.password) {
        var pop_up_data = JSON.stringify(res.data.message)+"<br>"+JSON.stringify(res.data.detailMessages.password);
      }else if (res.data.detailMessages.password_repeat) {
        var pop_up_data = JSON.stringify(res.data.message)+"<br>"+JSON.stringify(res.data.detailMessages.password_repeat);
      }else if (res.data.detailMessages.email) {
        var pop_up_data = JSON.stringify(res.data.message)+"<br>"+JSON.stringify(res.data.detailMessages.email);
      }else if (res.data.detailMessages.phone_number) {
        var pop_up_data = JSON.stringify(res.data.message)+"<br>"+JSON.stringify(res.data.detailMessages.phone_number);
      }else{
        var pop_up_data = JSON.stringify(res.data.message);
      }
      // $ionicPopup.alert({
      //      title: '',
      //      template: pop_up_data
      // });
    // An alert dialog
      var alertPopup = $ionicPopup.alert({
       title: '',
       template: pop_up_data,
       okType: 'button-assertive',
       cssClass: 'popupalert'
      });
      if (res.data.status == 1) {
        alertPopup.then(function(res) {
        console.log('masuk if');
        $scope.login();
        });
      }else{
        alertPopup.then(function(res) {
        console.log('masuk else');
        });
      }
      console.log(res.data);
    });
    // console.log("submitregister");
   };

  $rootScope.isLoggedIn = function() {
      //var loggedIn = AuthenticationService.isLoggedIn();
      var loggedIn = false;
      if ('1' == $window.localStorage.getItem('sesLogin')) {
        loggedIn = true;
      }
      else{
        loggedIn = false;
      }
      return loggedIn;
  };

  $scope.fbLogin = function(){

    // the user isn't logged in to Facebook.
    $cordovaFacebook.login(["public_profile", "email", "user_friends"]).then(function(success) {
      /*
       * Get user data here.
       * For more, explore the graph api explorer here: https://developers.facebook.com/tools/explorer/
       * "me" refers to the user who logged in. Dont confuse it as some hardcoded string variable.
       *
        */
        //To know more available fields go to https://developers.facebook.com/tools/explorer/
        $cordovaFacebook.api("me?fields=id,name,picture,email", []).then(function(result){
          /*
         * As an example, we are fetching the user id, user name, and the users profile picture
         * and assiging it to an object and then we are logging the response.
         */
          var userData = {
          id: result.id,
          name: result.name,
          email: result.email,
          pic: result.picture.data.url
          }

        $rootScope.profilePic   = result.picture.data.url; 
        $rootScope.fullName     = result.name;
        $rootScope.emailUser  = result.email;

        $window.localStorage.setItem('userdata', JSON.stringify({profilePic: $rootScope.profilePic, fullName: $rootScope.fullName, emailUser: $rootScope.emailUser }));

          var link = MYconfig.apiURL + 'login/social';
        var access_token = $cordovaFacebook.getAccessToken().then(function(success) {
          // success
          console.log('131');
          console.log(success);

          $scope.userdata = [];

          console.log('154');
          console.log($scope.userdata);
          $http.post(link, $httpParamSerializerJQLike({
            "SocialLoginForm":{
                "client" : "facebook",
                "uid" : userData.id,
                "email" : userData.email,
                "userAccessToken" : success
              }
          })
          ).then(function (response){
            console.log('178 : ');
            console.log(response);

          //update lokasi
          $http.get(MYconfig.apiURL + 'services/profiles/set-lat-lon?lat='+ window.localStorage.getItem('latitude')+'&lon='+window.localStorage.getItem('longitude'))
              .success(function(data, status, headers,config){
                console.log('set lang long success');
              })
              .error(function(data, status, headers,config){
                console.log('set lang long success');
           });

            /*
            Photo.convertImageToBase64(result.picture.data.url, function(base64Img){
              //update profil untuk login fb
              var linkUpdateProfile = MYconfig.apiURL + 'services/profiles/update';
              $http.post(linkUpdateProfile, $httpParamSerializerJQLike({
                "ProfilesMdl":{
                  "full_name" : result.name,
                  "image" : base64Img,
                  "lat" : window.localStorage.getItem('latitude'),
                  "lon" : window.localStorage.getItem('longitude')
                }
              }) ).then(function (response){
                console.log('response update : ');
                console.log(response);
                if (response.data.status == 1) {
                  console.log('update profile berhasil');
                }
                else{
                  console.log('update profile gagal');
                }
              });//end update profil login fb
            });//end convertImage
            */
          });

          return success;
        }, function (error) {
          return '';
        });

        //console.log(access_token);
          //Do what you wish to do with user data. Here we are just displaying it in the view
          $scope.fbData = JSON.stringify(result, null, 4);
          console.log($scope.fbData);
          $window.localStorage.setItem('userdate', $scope.fbData);
        $ionicHistory.nextViewOptions({
            disableBack: true
        });

        $window.localStorage.setItem('sesLogin', '1');
          $scope.closeLogin();
          $state.go('app.home');
        }, function(error){
        // Error message
        $window.localStorage.setItem('sesLogin', '0');
        var errorText = JSON.stringify(error, null, 4);
        $ionicPopup.alert({
          title: 'Alert',
          template: errorText,
          okType: 'button-assertive',
          cssClass: 'popupalert'
        })
        })

      }, function (error) {
      // Facebook returns error message due to which login was cancelled.
      // Depending on your platform show the message inside the appropriate UI widget
      // For example, show the error message inside a toast notification on Android
      var errorText = JSON.stringify(error, null, 4);
      $ionicPopup.alert({
        title: 'Alert',
        template: errorText,
        okType: 'button-assertive',
        cssClass: 'popupalert'
      })
    });//end $cordovaFacebook.login()

   };//end scope.fbLogin

   /*
  * Google login
  */

    $scope.googleLogin = function(){

    $ionicLoading.show({
        template: 'Logging in...'
      });

      window.plugins.googleplus.login(
      {
      'scopes': 'profile email', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
      'webClientId': '805011261342-55jpk1vg8kpn469aja5qevbm69o73jlg.apps.googleusercontent.com', // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
      'offline': true,
      },
      function (obj) {
          console.log('obj : ');
      console.log(obj)
      $scope.googleData = JSON.stringify(obj);
      console.log($scope.googleData);
      $window.localStorage.setItem('sesLogin', '1');
      $ionicHistory.nextViewOptions({
        disableBack: true
      });

      $rootScope.profilePic = obj.imageUrl;
      $rootScope.fullName   = obj.displayName;
      $rootScope.emailUser  = obj.email;
      // $window.localStorage.setItem('userdata', {profilePic: "test" });
      $window.localStorage.setItem('userdata', JSON.stringify({profilePic: $rootScope.profilePic, fullName: $rootScope.fullName, emailUser: $rootScope.emailUser }));


      var link = MYconfig.apiURL + 'login/social';
      $http.defaults.headers.post["Content-Type"] = 'application/x-www-form-urlencoded; charset=UTF-8';
        $http.post(link,$httpParamSerializerJQLike({
          "SocialLoginForm":{
              "client" : "google",
              "uid" : obj.userId,
              "email" : obj.email,
              "userAccessToken" : obj.oauthToken
          }
        })).then(function (response){

        //update lokasi
        $http.get(MYconfig.apiURL + 'services/profiles/set-lat-lon?lat='+ window.localStorage.getItem('latitude')+'&lon='+window.localStorage.getItem('longitude'))
            .success(function(data, status, headers,config){
              console.log('set lang long success');
            })
            .error(function(data, status, headers,config){
              console.log('set lang long success');
         });

          /*
          Photo.convertImageToBase64(obj.imageUrl, function(base64Img){
            //update profil untuk login google
            var linkUpdateProfile = MYconfig.apiURL + 'services/profiles/update';
            $http.post(linkUpdateProfile, $httpParamSerializerJQLike({
              "ProfilesMdl":{
                "full_name" : obj.displayName,
                "image" : base64Img,
                "lat" : window.localStorage.getItem('latitude'),
                "lon" : window.localStorage.getItem('longitude')
              }
            }) ).then(function (response){
              console.log('response update : ');
              console.log(response);
              if (response.data.status == 1) {
                console.log('update profile berhasil');
              }
              else{
                console.log('update profile gagal');
              }
            });//end update profil login fb
          });//end convertImage
          */
        console.log('response : ');
        console.log(response);
      });

      $ionicLoading.hide();
      $scope.closeLogin();
      $state.go('app.home');
      },
      function (msg) {
          $ionicLoading.hide();
          console.log(msg);
      });
    };//end google

   $scope.Logout = function(){
    $window.localStorage.clear();
    $ionicHistory.clearCache();
    $ionicHistory.clearHistory();
    $rootScope.fullName = "";
    $rootScope.emailUser = "";
    $rootScope.profilePic = "";
    delete $rootScope.fullName;
    delete $rootScope.emailUser;
    delete $rootScope.profilePic;
    var linkLogout = MYconfig.apiURL + 'logout';
    $http.post(linkLogout, '' ).then(function (response){
    });

    $window.localStorage.setItem('sesLogin', '');
    $cordovaFacebook.logout().then(function(success) {
        // success
      }, function (error) {
        // error
      });
    $cordovaGooglePlus.logout();
    // $state.go('app.login');
    $scope.login();
  };

  $scope.fbLogout = function(){
    $cordovaFacebook.logout().then(function(success) {
        // success
      }, function (error) {
        // error
      });
    $state.go('app.login');
  };
  
})

.controller('HomeCtrl', function($log, $scope, $state, $http, MYconfig, $ionicLoading, $ionicPopup, $window) {
  
      var menu_utama_arr = [];
      var menu_utama = "";
  $http.get(MYconfig.apiURL + 'reserva/category/list')
    .success(function(result) {
      $log.log(MYconfig.apiURL + 'reserva/category/list');
      $log.log(result.data);
      $scope.items = result.data;
      $ionicLoading.hide();
      angular.forEach($scope.items, function(value, key){
        menu_utama_arr.push({
          id : value.id,
          name : value.name,
          iconImage : value.icon_image,
          iconThumbnail : value.icon_thumbnail,
          idSubMenu1 : '0',
          idSubMenu2 : '0',
          idSubMenu3 : '0'
        });
      });
      $window.localStorage.setItem('menuJSON', JSON.stringify(result.data)); //simpan data ke local storage
    })
    .error(function(data, status, headers,config){
        $ionicLoading.hide();
        $ionicPopup.alert({
             title: '',
             template: 'Get Category Failed',
             okType: 'button-assertive',
             cssClass: 'popupalert'
        });
    });
    $scope.menu_utama = menu_utama_arr;
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('HairCtrl', function($scope,$rootScope,$http,MYconfig,$log,$ionicLoading,$window,$state,$ionicHistory,$ionicFilterBar) {
  var lat = window.localStorage.getItem('latitude');
  var lng = window.localStorage.getItem('longitude');
  // var to = new google.maps.LatLng(lat, lng);
  var menuJSON = JSON.parse( $window.localStorage.getItem('menuJSON') );
  // console.log(JSON.parse( $window.localStorage.getItem('menuJSON') ));
  angular.forEach(menuJSON, function(value, key){
    if (value.id == $scope.idtitle) {
      $scope.title = value.name;
      console.log(value.id);
    }
  }); 
  $scope.rating = {};
  $scope.rating.rate = 3;
  $scope.rating.max = 5;
  $scope.readOnly = true;
  $scope.idtitle = $rootScope.title;

    var clickTab = '';
   var vm = this,
        items = [],
        ratings = [],
        items2 = [],
        items3 = [],
        ratings2 = [],
        filterBarInstance;

  var merchantlistJSON = JSON.parse( $window.localStorage.getItem('merchantList') );
  angular.forEach(merchantlistJSON, function(value, key){
    var href = 'salon';
    var range = '1 km';
    var rating = value.total_rating;
    var src = value.merchantImages[0].thumb_name;
    var lat = value.lat;
    var lng = value.lon;
    // var from = new google.maps.LatLng(lat, lng);
    // var dist = google.maps.geometry.spherical.computeDistanceBetween(from, to);
    // var km = (dist/1000).toFixed(1);
     var km = (value.distance/1).toFixed(1);
    // console.log(km);
    var item = {
        // description: 'Description for item ' + i,
        title: value.name,
        title2: value.address,
        src: src,
        href: href,
        range: km+' km',
        rating: rating,
        id: value.id,
    };
    var rating = {
        rate: value.total_rating,
        max: 5,
    };
    items.push(item);
    ratings.push(rating);
  });

  angular.forEach(merchantlistJSON, function(value, key){
    var href = 'salon';
    var range = '1 km';
    var rating2 = value.total_rating;
    var src = value.merchantImages[0].thumb_name;
    var lat = value.lat;
    var lng = value.lon;
    // var from = new google.maps.LatLng(lat, lng);
    // var dist = google.maps.geometry.spherical.computeDistanceBetween(from, to);
    // var km = (dist/1000).toFixed(1);
    var km = (value.distance/1).toFixed(1);
    var item2 = {
        // description: 'Description for item ' + i,
        title: value.name,
        title2: value.address,
        src: src,
        href: href,
        range: km+' km',
        rating: rating2,
        id: value.id,
    };
    var rating = {
        rate: value.total_rating,
        max: 5,
    };
    items2.push(item2);
    ratings.push(rating2);
  });

    vm.items = items;

    vm.items2 = items2;

    vm.nearmeTab = function () {
      console.log('nearmetab');
      $rootScope.clickTab = 'nearmetab';
    }
    vm.ratingTab = function () {
      console.log('ratingtab');
      $rootScope.clickTab = 'ratingtab';
    }
    vm.promotionTab = function () {
      console.log('promotab');
      $rootScope.clickTab = 'promotab';
    }

    vm.showFilterBar = function () {
      if ($rootScope.clickTab == 'nearmetab') {
        filterBarInstance = $ionicFilterBar.show({
          items: vm.items,
          ratings: vm.rating,
          update: function (filteredItems) {
            vm.items = filteredItems
          },
          filterProperties: 'title'
        });
        console.log($rootScope.clickTab);
      }else if ($rootScope.clickTab == 'ratingtab') {
        filterBarInstance = $ionicFilterBar.show({
          items: vm.items2,
          ratings: vm.rating,
          update: function (filteredItems) {
            vm.items2 = filteredItems
          },
          filterProperties: 'title'
        });
        console.log($rootScope.clickTab);
      }else {
        filterBarInstance = $ionicFilterBar.show({
          items: vm.items,
          ratings: vm.rating,
          update: function (filteredItems) {
            vm.items = filteredItems
          },
          filterProperties: 'title'
        });
        console.log($rootScope.clickTab);
      }
      console.log('search click');
    };

  vm.detailSalon = function(res){
    if ($window.localStorage.getItem('sesLogin') == 1) {
      console.log(res);
      $rootScope.idDetailSalon = res;
      $ionicHistory.nextViewOptions({
        disableBack: false
      });
      $state.go('app.salon');
    }else{
      $scope.modal.show();
      $rootScope.loginPage = 1;
    }
  };
    return vm;


})

.controller('SalonCtrl', function($scope,$window,$rootScope,$ionicLoading) {
  $ionicLoading.show({template: 'Load Detail Merchant...'});
  $scope.salonData = {};
  // $scope.salonData.imgUrl = "img/salon1.png";
  $scope.rating = {};
  // $scope.rating.rate = 1;
  $scope.rating.max = 5;
  var merchantlistJSON = JSON.parse( $window.localStorage.getItem('merchantList') );
  angular.forEach(merchantlistJSON, function(value, key){
    if (value.id == $rootScope.idDetailSalon) {
      $scope.nameSalon = value.name;
      console.log(value);
      $scope.salonData.imgUrl = value.merchantImages[0].thumb_name;
      $scope.salonData.name = value.name;
      $scope.salonData.rate = value.total_rating;
      $scope.salonData.address = value.address;
      $rootScope.salonName = value.name;
      $rootScope.salonAddress = value.address;
      $rootScope.salonRating = value.total_rating;
      $rootScope.salonImage = value.merchantImages[0].thumb_name;
      $rootScope.salonId = value.id;
      $ionicLoading.hide();
    }
  }); 

  $scope.readOnly = true;
 /* $scope.bgImage = {
      background: 'url(img/salon1.png)',
  };*/

})

.controller('ServiceCtrl', function($scope,$rootScope,$http, MYconfig, $ionicLoading, $ionicPopup, $window,$log,$ionicHistory,$httpParamSerializerJQLike,$state) {
  $scope.salonData = {};
  // $scope.salonData.imgUrl = "img/salon1.png";
  var service_arr = [];
  $scope.BookingTransaction = [];
  $scope.rating = {};
  // $scope.rating.rate = 3;
  $scope.rating.max = 5;
  console.log('masukservice');
  $scope.salonData.name = $rootScope.salonName;
  $scope.salonData.address = $rootScope.salonAddress;
  $scope.rating.rate = $rootScope.salonRating;
  $scope.salonData.imgUrl = $rootScope.salonImage;

  $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    $ionicLoading.show({template: 'Load Merchant Service...'});
    var apiMerchantService = '/reserva/merchants/servicebymerchantid/?mrchid='+$rootScope.salonId;
    $http.get(MYconfig.apiURL + apiMerchantService)
      .success(function(result) {
        $log.log(MYconfig.apiURL + apiMerchantService);
        $log.log(result.data);
        $scope.items = result.data;
        $window.localStorage.setItem('merchantService', JSON.stringify(result.data)); //simpan data ke local storage
        $ionicHistory.nextViewOptions({
          disableBack: false
        });
        var merchantServiceList = JSON.parse( $window.localStorage.getItem('merchantService') );
        // console.log(merchantServiceList);
        // console.log(merchantServiceList.merchant[0].merchantsServices);
        var groupservice = {};
        var groupparent = {};
        var n = 1;
        angular.forEach(merchantServiceList.merchant[0].merchantsServices, function(value, key){
          
          // console.log(value);
          // var grp_id = "group_" + value.srvServices.srv_groups_id;
          var grp_id = "group_" + value.srvServices.srvGroups.id;
          // var grp_id = "group_" + value.srvServices.srvGroups.name;
          var cat_id = "cat_" + value.srvServices.srvCategories.id;
          var group_parent = "groupparent_" + value.srvServices.srv_groups_id;
          // var cat_id = "cat_" + value.srvServices.srvCategories.name;

          if (typeof groupservice[cat_id] == "undefined"){
            groupservice[cat_id]=[];
            groupservice[cat_id]["id"] = value.srvServices.srvCategories.id;
            groupservice[cat_id]["cat_name"] = value.srvServices.srvCategories.name;
          }
          if (typeof groupparent[group_parent] == "undefined"){
            groupparent[group_parent]=[];
            groupparent[group_parent].push(value);
          }

          if ( typeof groupservice[cat_id][grp_id] == "undefined"){
            groupservice[cat_id][grp_id] = [];
            groupservice[cat_id][grp_id]["group_name"] = value.srvServices.srvGroups.name;
            groupservice[cat_id][grp_id].push(value);
          } else {
            groupservice[cat_id][grp_id].push(value);
          }
          n++;
        }); 

        // console.log(groupservice);
        // console.log(groupparent);


        angular.forEach(merchantServiceList, function(value, key){
            // console.log(value[0].merchantsServices);
            $window.localStorage.setItem('merchantServiceArr', JSON.stringify(value[0].merchantsServices));
            $ionicLoading.hide();
        }); 


        var merchantServiceListArr = JSON.parse( $window.localStorage.getItem('merchantServiceArr') );
        var i = 1;
        var value4 = [];
        $scope.servicesGroupName = [];
        angular.forEach(groupservice, function(value2, key2){
            // console.log(value2.group_1.length);
            // console.log(value2);

            // $scope.servicesPrice = value2["group_" + i].price;
            $scope.servicesPrice = "10000";
            // $scope.servicesName = value2.group_1[0].name;
            $scope.servicesName = "test";
            $scope.catName = value2.cat_name;
            var value5 = [];
            var value6 = [];
            var x = 1;
            angular.forEach(groupparent, function(value3, key3){
              // console.log("masuk"+x);
              if ( typeof value2["group_" + x] != "undefined"){

              // console.log(value2["group_" + x]);
              value5.push(value2["group_" + x]);
              }
              x ++;
            });
            angular.forEach(value5, function(value3, key3){
              // console.log(value3);
              // console.log(value3[0].srvGroups.name);
              value6.push(value3);
            });
            service_arr.push({
              // price : value2.group_1.price,
              price : $scope.servicesPrice,
              service_name : $scope.servicesName,
              category_name : $scope.catName,
              group_name : value6,
            });
            i ++;
        }); 
        console.log(service_arr);
        $scope.service = service_arr;
      })
      .error(function(data, status, headers,config){
          $ionicLoading.hide();
          $ionicPopup.alert({
               title: '',
               template: 'Get Merchant Service Failed',
               okType: 'button-assertive',
               cssClass: 'popupalert'
          });
      });

    $scope.readOnly = true;
    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    var link = 'http://reserva-front.nadyne.com/reserva/booking/submit';
    $scope.number = 0;
    $scope.book = {};
    $scope.bookService = function() {
    $ionicLoading.show({template: 'Load Service Detail...'});
    $rootScope.bookservice = $scope.book;
        // // Posting data to php file
        // $http({
        //   method  : 'POST',
        //   url     : link,
        //   // data    : $scope.book, //forms user object
        //   data    : $httpParamSerializerJQLike($scope.book), //forms user object
        //   headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'} 
        //  })
        //   .success(function(data) {
        //     // if (data.errors) {
        //     //   // Showing errors.
        //     //   $scope.errorName = data.errors.name;
        //     //   $scope.errorUserName = data.errors.username;
        //     //   $scope.errorEmail = data.errors.email;
        //     // } else {
        //     //   $scope.message = data.message;
        //     // }
        //   });
        $state.go('app.book_datetime');
        };
})

.controller('GalleryCtrl', function($scope,$rootScope,$http, MYconfig, $ionicLoading, $ionicPopup, $window,$log,$ionicHistory) {
  $scope.salonData = {};
  var image_arr = [];
  // $scope.salonData.imgUrl = "img/salon1.png";
  var images = "";
  $scope.rating = {};
  // $scope.rating.rate = 3;
  $scope.rating.max = 5;
  console.log('masukgallery');
  $scope.salonData.name = $rootScope.salonName;
  $scope.salonData.address = $rootScope.salonAddress;
  $scope.rating.rate = $rootScope.salonRating;
  $scope.salonData.imgUrl = $rootScope.salonImage;

   var merchantlistJSON = JSON.parse( $window.localStorage.getItem('merchantList') );
    $ionicLoading.show({template: 'Load Merchant Gallery...'});
  angular.forEach(merchantlistJSON, function(value, key){
    if (value.id == $rootScope.idDetailSalon) {
      $scope.nameSalon = value.name;
      console.log(value);
      $scope.salonData.imgUrl = value.merchantImages[0].thumb_name;
      angular.forEach(value.merchantImages, function(value, key){
          image_arr.push({
            src : value.thumb_name,
          });
          console.log(value);
      });
      
      $ionicLoading.hide();
    }
  }); 
  $scope.images = image_arr;
  // console.log($scope.images);
  // console.log($scope.salonData.imgUrl);
 /* $scope.bgImage = {
      background: 'url(img/salon1.png)',
  };*/
  $scope.readOnly = true;
})

.controller('PromotionCtrl', function($scope,$rootScope,$http, MYconfig, $ionicLoading, $ionicPopup, $window,$log,$ionicHistory) {
  $scope.salonData = {};
  var image_arr = [];
  // $scope.salonData.imgUrl = "img/salon1.png";
  var images = "";
  $scope.rating = {};
  // $scope.rating.rate = 3;
  $scope.rating.max = 5;
  console.log('masukpromotion');
  $scope.salonData.name = $rootScope.salonName;
  $scope.salonData.address = $rootScope.salonAddress;
  $scope.rating.rate = $rootScope.salonRating;
  $scope.salonData.imgUrl = $rootScope.salonImage;

   var merchantlistJSON = JSON.parse( $window.localStorage.getItem('merchantList') );
    $ionicLoading.show({template: 'Load Merchant Gallery...'});
  angular.forEach(merchantlistJSON, function(value, key){
    if (value.id == $rootScope.idDetailSalon) {
      $scope.nameSalon = value.name;
      console.log(value);
      $scope.salonData.imgUrl = value.merchantImages[0].thumb_name;
      angular.forEach(value.merchantImages, function(value, key){
          image_arr.push({
            src : value.thumb_name,
          });
          console.log(value);
      });
      
      $ionicLoading.hide();
    }
  }); 
  $scope.images = image_arr;
  $scope.readOnly = true;

})

.controller('ReviewCtrl', function($scope,$rootScope,$http, MYconfig, $ionicLoading, $ionicPopup, $window,$log,$ionicHistory) {
  $scope.salonData = {};
  var image_arr = [];
  // $scope.salonData.imgUrl = "img/salon1.png";
  var images = "";
  $scope.rating = {};
  // $scope.rating.rate = 3;
  $scope.rating.max = 5;
  console.log('masukpromotion');
  $scope.salonData.name = $rootScope.salonName;
  $scope.salonData.address = $rootScope.salonAddress;
  $scope.rating.rate = $rootScope.salonRating;
  $scope.salonData.imgUrl = $rootScope.salonImage;
  $scope.salonData.review = "img/user1.png";

   var merchantlistJSON = JSON.parse( $window.localStorage.getItem('merchantList') );
    // $ionicLoading.show({template: 'Load Merchant Gallery...'});
  angular.forEach(merchantlistJSON, function(value, key){
    if (value.id == $rootScope.idDetailSalon) {
      $scope.nameSalon = value.name;
      console.log(value);
      $scope.salonData.imgUrl = value.merchantImages[0].thumb_name;
      angular.forEach(value.merchantImages, function(value, key){
          image_arr.push({
            src : value.thumb_name,
          });
          console.log(value);
      });
      
      $ionicLoading.hide();
    }
  }); 
  $scope.images = image_arr;
  $scope.readOnly = true;

})

.controller('SupportCtrl', function($scope, $stateParams) {
})
.controller('FreeVoucherCtrl', function($scope, $stateParams) {
})
.controller('FavouriteCtrl', function($scope, $stateParams, $window) {
  $scope.rating = {};
  $scope.rating.rate = 4;
  $scope.rating.max = 5;
})
.controller('BookDatetime', function($scope, $stateParams, $rootScope, $window, $ionicLoading, $http, $httpParamSerializerJQLike, $ionicPopup, $state) {
  console.log($rootScope.bookservice);
  $window.localStorage.setItem( 'timelist', 0 );
  $scope.salonData = {};
  $scope.rating = {};
  $scope.salonData.name = $rootScope.salonName;
  $scope.salonData.address = $rootScope.salonAddress;
  $scope.rating.max = 5;
  $scope.rating.rate = $rootScope.salonRating;
  $scope.salonData.imgUrl = $rootScope.salonImage;
  $scope.book = {};
  var bookServArr = [];
  $scope.bookService = $rootScope.bookservice;
  var book = [];
  book = $scope.bookService;
  var i = 1;
  var service_id = [];
  var quantity = {};
  angular.forEach(book, function(value, key){
    console.log(value);
    // service_id = value['service_id'];

    angular.forEach(value['service_id'], function(value, key){
      console.log(value);
      quantity[value] = 1;
      service_id.push(value);
      
      var valueService = value;
      var merchantServiceList = JSON.parse( $window.localStorage.getItem('merchantService') );
      angular.forEach(merchantServiceList.merchant[0].merchantsServices, function(value, key){
        if (value.id == valueService) {
          console.log(value.srvServices.name);
          bookServArr.push({
            service_name : value.srvServices.name,
            service_price : value.price,
          });
          $scope.hours = i;
          i++;

        }
      });
    });
  }); 
  console.log(service_id);

  console.log(quantity);

  function formatDate(date) {
    var dates = new Date();
    var day = ("0" + dates.getDate()).slice(-2);
    var month = ("0" + (dates.getMonth() + 1)).slice(-2);
    var year = dates.getFullYear();
    console.log(date);
    if (date != day+"-"+month+"-"+year) {
      var d = new Date(date || Date.now()),
          month = '' + (d.getMonth() + 1),
          day = '' + d.getDate(),
          year = d.getFullYear();

      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;

      return [year, month, day].join('-');
    }else{
      var arrdate = date.split('-');
      var day = arrdate[0];
      var month = arrdate[1];
      var year = arrdate[2];
      var curdate = year+"-"+month+"-"+day;
      return curdate;
    }
      
  }

  $scope.servName = bookServArr;
  var date = new Date();
  var day = ("0" + date.getDate()).slice(-2);
  var month = ("0" + (date.getMonth() + 1)).slice(-2);
  var year = date.getFullYear();
  $scope.book.dateValue = day+"-"+month+"-"+year;
  $rootScope.timeValue = new Date();
  $ionicLoading.hide();

  $scope.data = {};
  $scope.data.grossOptions = 'time';
  $scope.timeList = [
      { text: "08:00", value: "08:00" },
      { text: "09:00", value: "09:00" },
      { text: "10:00", value: "10:00" },
      { text: "13:00", value: "13:00" },
      { text: "14:00", value: "14:00" }
  ];
  $scope.timeList2 = [
      { text: "15:00", value: "15:00" },
      { text: "16:00", value: "16:00" },
      { text: "17:00", value: "17:00" }
  ];
  $scope.updateTimeList = function(item) {
    $window.localStorage.setItem( 'timelist', item.value );
    console.log( 'Time List: ' + item.value );
  }

  $scope.checkout = function() {
    if ($window.localStorage.getItem('timelist') && $window.localStorage.getItem('timelist') != 0) {
      console.log("ada time");
      $rootScope.date = $scope.book.dateValue;
      $rootScope.time = $window.localStorage.getItem('timelist');
      $rootScope.promocodes = $scope.book.promoCode;
      console.log($scope.book.promoCode);
      console.log($scope.book.note);
      $rootScope.note = $scope.book.note;
      var date_time = {};
      angular.forEach(service_id, function(value, key){
        console.log(value);
        date_time[value] = formatDate($scope.book.dateValue)+" "+$window.localStorage.getItem('timelist');
      });
      $rootScope.dataConfirm = $httpParamSerializerJQLike({
              "BookingTransaction":{
                date_time   : date_time,
                "date"   : formatDate($scope.book.dateValue),
                "booking_type_id"    : 1,
                service_id:service_id,
                quantity:quantity,
                "note" : $scope.book.note
              }});
      $state.go('app.checkout');
    }else{
      console.log("kosong");
      $ionicPopup.alert({
           title: '',
           template: 'Please Choose Time',
           okType: 'button-assertive',
           cssClass: 'popupalert'
      });
    }
    
  };
})

.controller('Checkout', function($scope, $stateParams, $rootScope, $window, $ionicLoading, $http, $httpParamSerializerJQLike, $ionicPopup, $ionicHistory, $state) {
  // console.log($rootScope.bookservice);
  // console.log($rootScope.promocodes);
  // console.log($rootScope.note);
  $scope.book = {};
  $scope.salonData = {};
  $scope.rating = {};
  $scope.salonData.name = $rootScope.salonName;
  $scope.salonData.address = $rootScope.salonAddress;
  $scope.rating.max = 5;
  $scope.rating.rate = $rootScope.salonRating;
  $scope.salonData.imgUrl = $rootScope.salonImage;
  $scope.book.promocode = $rootScope.promocodes;
  $scope.book.note = $rootScope.note;
  $scope.book.date = $rootScope.date;
  $scope.book.time = $rootScope.time;
  var sum = 0;

  var bookServArr = [];
  $scope.bookService = $rootScope.bookservice;
  var book = [];
  book = $scope.bookService;
  var i = 1;
  var service_id = [];
  var quantity = {};

  function formatDate(date) {
    var dates = new Date();
    var day = ("0" + dates.getDate()).slice(-2);
    var month = ("0" + (dates.getMonth() + 1)).slice(-2);
    var year = dates.getFullYear();
    console.log(date);
    if (date != day+"-"+month+"-"+year) {
      var d = new Date(date || Date.now()),
          month = '' + (d.getMonth() + 1),
          day = '' + d.getDate(),
          year = d.getFullYear();

      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;

      return [year, month, day].join('-');
    }else{
      var arrdate = date.split('-');
      var day = arrdate[0];
      var month = arrdate[1];
      var year = arrdate[2];
      var curdate = year+"-"+month+"-"+day;
      return curdate;
    }
  }

  angular.forEach(book, function(value, key){
    console.log(value);
    // service_id = value['service_id'];

    angular.forEach(value['service_id'], function(value, key){
      console.log(value);
      quantity[value] = 1;
      service_id.push(value);
      
      var valueService = value;
      var merchantServiceList = JSON.parse( $window.localStorage.getItem('merchantService') );
      angular.forEach(merchantServiceList.merchant[0].merchantsServices, function(value, key){
        if (value.id == valueService) {
          console.log(value.srvServices.name);
          bookServArr.push({
            service_name : value.srvServices.name,
            service_price : value.price,
          });
          $scope.hours = i;
          if(value.price != null){
            sum += value.price;
          }
          i++;

        }
      });
    });
  }); 
  $scope.servName = bookServArr;
  $scope.sumPrice = sum;
  console.log(sum);
  console.log(service_id);

  $scope.checkout = function() {
    if ($window.localStorage.getItem('timelist')) {
      console.log("ada time");
      $rootScope.date = $scope.book.dateValue;
      $rootScope.time = $window.localStorage.getItem('timelist');
      var date_time = {};
      angular.forEach(service_id, function(value, key){
        console.log(value);
        date_time[value] = formatDate($scope.book.dateValue)+" "+$window.localStorage.getItem('timelist');
      });
      $ionicLoading.show({template: 'Submit Booking...'});
      var link = 'http://reserva-front.nadyne.com/reserva/booking/submit';
      // Posting data to php file
      $http({
        method  : 'POST',
        url     : link,
        data    : $rootScope.dataConfirm, //forms user object
        headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'} 
       })
        .success(function(data) {
          console.log(data);
          if (data.status == 0) {
            $ionicLoading.hide();
            $ionicPopup.alert({
                 title: '',
                 template: 'Submit Booking Failed',
                 okType: 'button-assertive',
                 cssClass: 'popupalert'
            });
          }else{
            $ionicLoading.hide();
            $ionicHistory.nextViewOptions({
              disableBack: true
            });
            $state.go('app.home');
            $ionicPopup.alert({
                 title: '',
                 template: 'Submit Booking Succed',
                 okType: 'button-balanced',
                 cssClass: 'popupalert'
            });
          }
        })
        .error(function(data, status, headers,config){
            $ionicLoading.hide();
            $ionicPopup.alert({
                 title: '',
                 template: 'Submit Booking Failed',
                 okType: 'button-assertive',
                 cssClass: 'popupalert'
            });
        });
    }else{
      console.log("kosong");
      $ionicPopup.alert({
           title: '',
           template: 'Please Choose Time',
           okType: 'button-assertive',
           cssClass: 'popupalert'
      });
    }
    
  };
})

.controller('Mybooking', function($scope, $stateParams, MYconfig, $http, $rootScope,$ionicLoading,$httpParamSerializerJQLike,$ionicModal,$window,$ionicPopup) {
  // $ionicModal.fromTemplateUrl('templates/reschedule.html', {
  //   scope: $scope
  // }).then(function(modal) {
  //   $scope.rescheduleform = modal;
  // });
  $ionicModal.fromTemplateUrl('templates/reschedule.html', function($ionicModal) {
    $scope.modalreschedule = $ionicModal;
  }, {
      // Use our scope for the scope of the modal to keep it simple
      scope: $scope,
      // The animation we want to use for the modal entrance
      animation: 'slide-in-up'
  });
  var service_arr = [];
  var date_time = {};
  $ionicLoading.show({template: 'Load My Booking Data...'});
  $scope.readOnly = true;
  function formatDate(date) {
    var dates = new Date();
    var day = ("0" + dates.getDate()).slice(-2);
    var month = ("0" + (dates.getMonth() + 1)).slice(-2);
    var year = dates.getFullYear();
    // console.log(date);
    if (date != day+"-"+month+"-"+year) {
      var d = new Date(date || Date.now()),
          month = '' + (d.getMonth() + 1),
          day = '' + d.getDate(),
          year = d.getFullYear();

      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;

      return [year, month, day].join('-');
    }else{
      var arrdate = date.split('-');
      var day = arrdate[0];
      var month = arrdate[1];
      var year = arrdate[2];
      var curdate = year+"-"+month+"-"+day;
      return curdate;
    }
  }
  $scope.listSalon = [
      { src: "img/salon1.png", bookStatus:"Done", rating: "4", time: "09:00", date: "2016-07-30", title: "SALON KENCANA", title2: "JL MERDEKA", status: "Need Acceptance", services: ["Fashion Color","Acid Color","Partial Highlight","Bleaching"]},
      { src: "img/salon2.png", bookStatus:"Done",rating: "3", time: "09:00", date: "2016-07-30", title: "SALON INDAH", title2: "JL MERDEKA", status: "Need Acceptance", services: ["Fashion Color","Acid Color","Partial Highlight"]},
      { src: "img/salon3.png", bookStatus:"Canceled",rating: "1", time: "09:00", date: "2016-07-30", title: "SALON CANTIK", title2: "JL MERDEKA", status: "Need Acceptance", services: ["Fashion Color","Acid Color","Partial Highlight"]}
  ];
  $scope.listSalon2 = [
      { src: "img/salon1.png", bookStatus:"Done", rating: "4", time: "09:00", date: "2016-07-30", title: "SALON KENCANA", title2: "JL MERDEKA", status: "Need Acceptance", services: ["Fashion Color","Acid Color","Partial Highlight","Bleaching"]},
      { src: "img/salon2.png", bookStatus:"Done",rating: "3", time: "09:00", date: "2016-07-30", title: "SALON INDAH", title2: "JL MERDEKA", status: "Need Acceptance", services: ["Fashion Color","Acid Color","Partial Highlight"]},
      { src: "img/salon3.png", bookStatus:"Canceled",rating: "1", time: "09:00", date: "2016-07-30", title: "SALON CANTIK", title2: "JL MERDEKA", status: "Need Acceptance", services: ["Fashion Color","Acid Color","Partial Highlight"]}
  ];
  console.log($scope.listSalon);
  var link = MYconfig.apiURL + 'reserva/booking/mybooking';
  $http.get(link).success(function(data){
    $ionicLoading.hide();
    console.log('success get my booking : ');
    console.log(data.data);
    if (data.status != 0) {
      angular.forEach(data.data, function(value, key){
        if (value.is_confirm == 0) {
          $scope.confirm = "Need Acceptance";
        }else{
          $scope.confirm = "Confirmed";
        }
        service_arr.push({
              title : value.merchants.name,
              title2 : value.merchants.address,
              bookStatus: value.booking_status_id, 
              rating: Math.round(value.merchants.total_rating), 
              time: formatDate(value.trxItems[0].time_sch), 
              date: value.trx_date,
              src: value.merchants.firstMerchantImages.image_name,
              status: $scope.confirm,
              id: value.id,
              services: value.trxItems
            });
      });
      $scope.bookservice = service_arr;
      $rootScope.reschedule = service_arr;
      console.log($scope.bookservice);
    }

  }).error(function(data){
    console.log('error get profile');
    console.log(data);
  }).then(function(result){
    things = result.data;
  });
  $scope.updateTimeList = function(item) {
    $window.localStorage.setItem( 'timelist', item.value );
    console.log( 'Time List: ' + item.value );
  }

  $scope.reschedule = function(id) {
    $scope.data = {};
    $scope.data.grossOptions = 'time';
    $rootScope.idMybook = id;
    var service_id = [];
    var date_time = {};
    console.log(id);
    angular.forEach($rootScope.reschedule, function(value, key){
      console.log(value);
      if (value.id == id) {
        $scope.timeList = [
          { text: "08:00", value: "08:00" },
          { text: "09:00", value: "09:00" },
          { text: "10:00", value: "10:00" },
          { text: "13:00", value: "13:00" },
          { text: "14:00", value: "14:00" }
        ];
        $scope.timeList2 = [
            { text: "15:00", value: "15:00" },
            { text: "16:00", value: "16:00" },
            { text: "17:00", value: "17:00" }
        ];
        console.log("sama id");
        // console.log(value.services);
        var str = value.services[0].time_sch;
        var res = str.split(" ");
        var res_new = res[0];
        // console.log(res_new);
        var str2 = res_new;
        var res2 = str2.split("-");
        var day = res2[2];
        var month = res2[1];
        var year = res2[0];
        $scope.dateValue = day+"-"+month+"-"+year;
        $scope.dateValue2 = year+"-"+month+"-"+day;
        // console.log($scope.dateValue);
        $scope.modalreschedule.show();
        angular.forEach(value.services, function(value, key){
          // console.log(value.time_sch + value.srvItems.name);
          service_id.push(value.srv_items_id);
          // date_time[value.srv_items_id] = value.time_sch;
          date_time[value.srv_items_id] = $scope.dateValue2 +" "+$window.localStorage.getItem('timelist')+":00";
        });
      }else{
        console.log("ga sama id"+value.id);
      }
    });
    
    // var date = new Date();
    // var day = ("0" + date.getDate()).slice(-2);
    // var month = ("0" + (date.getMonth() + 1)).slice(-2);
    // var year = date.getFullYear();
    
    
    $rootScope.resubmit = $httpParamSerializerJQLike({
            "BookingTransaction":{
              date_time   : date_time,
              service_id:service_id
            }
          });
    
  };
  $scope.SubmitReschedule = function() {
    var link = MYconfig.apiURL + 'reserva/booking/resubmit?id='+$rootScope.idMybook;
    $http({
    method  : 'POST',
    url     : link,
    data    : $rootScope.resubmit, //forms user object
    headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'} 
    })
    .success(function(data) {
      console.log(data);
      if (data.status == 0) {
        $ionicLoading.hide();
        $ionicPopup.alert({
             title: '',
             template: 'Submit Reschedule Failed',
             okType: 'button-assertive',
             cssClass: 'popupalert'
        });
      }else{
        $scope.modalreschedule.hide();
        $ionicLoading.hide();
        $ionicPopup.alert({
             title: '',
             template: 'Submit Reschedule Failed',
             okType: 'button-assertive',
             cssClass: 'popupalert'
        });
      }
      $scope.modalreschedule.hide();
    })
    .error(function(data, status, headers,config){
        $scope.modalreschedule.hide();
        $ionicLoading.hide();
        $ionicPopup.alert({
             title: '',
             template: 'Submit Reschedule Failed',
             okType: 'button-assertive',
             cssClass: 'popupalert'
        });
    });
    
  };
  $scope.CloseReschedule = function() {
    $scope.modalreschedule.hide();
  };
})