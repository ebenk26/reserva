var app = angular.module('starter.services', ['ngCordova']);

app.factory('AuthenticationService', function($window){
	var loggedIn = false;
	var sesLogin = $window.localStorage.getItem('sesLogin');

	return {
		isLoggedIn : function() {
			if (sesLogin == '1') {
				return true;
			}
			else{
				return false;
			}
	   }
	}
});

app.factory('Menus', function($http) {
	return {
		all : function(){
			return $http.get('http://porto3.nadyne.com/ktmweb/frontend/web/index.php/services/category/list');
		},
		get : function(){
			return $http.get('http://porto3.nadyne.com/ktmweb/frontend/web/index.php/services/category/list', { params: { parent_id: $rootScope.parent_id } })
		}
	}
});

app.factory('ConnectivityMonitor', function($ionicPlatform, $rootScope, $cordovaNetwork){
	return {
		isOnline: function(){
			$ionicPlatform.ready(function() {
				if(ionic.Platform.isWebView()){
					return $cordovaNetwork.isOnline();
				} else {
					return navigator.onLine;
				}
			});

		},

		isOffline: function(){
			$ionicPlatform.ready(function() {
				if(ionic.Platform.isWebView()){
					return !$cordovaNetwork.isOnline();
				} else {
					return !navigator.onLine;
				}
			});
		},

    startWatching: function(){
        if(ionic.Platform.isWebView()){
        	$ionicPlatform.ready(function() {
	          $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
	            console.log("went online");
	          });

	          $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
	            console.log("went offline");
	          });
          });
        }
        else {

          window.addEventListener("online", function(e) {
            console.log("went online");
          }, false);

          window.addEventListener("offline", function(e) {
            console.log("went offline");
          }, false);
        }
    }//end startWatching
}//end return
});
