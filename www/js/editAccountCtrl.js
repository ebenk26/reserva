var app = angular.module('editAccount.controllers', ['ionic', 'ngCordova', 'jrCrop', 'ngTagsInput', 'ion-datetime-picker']);

app.controller('editAccountCtrl', ['$scope', '$rootScope', '$timeout', '$state', '$cordovaCapture', '$cordovaImagePicker', '$ionicActionSheet', '$ionicPlatform', '$ionicLoading',
				'$jrCrop', 'MYconfig', '$http', '$httpParamSerializerJQLike','$ionicPopup', '$window', '$filter',
	function ($scope, $rootScope, $timeout, $state, $cordovaCapture, $cordovaImagePicker, $ionicActionSheet, $ionicPlatform, $ionicLoading, $jrCrop, MYconfig, $http, $httpParamSerializerJQLike, $ionicPopup, $window, $filter) {

	$scope.isLoggedIn = function() {
      return helperService.cekLogin();
   };
   $ionicLoading.show({template: 'Load Data Account'});
	var link = MYconfig.apiURL + 'services/profiles';

	function convertImageToBase64(url, callback, output) {
	    var img = new Image();
		img.crossOrigin = 'Anonymous';
		img.onload = function(){
		    var canvas = document.createElement('CANVAS'),
		        c = canvas.getContext('2d'), urlData;
				canvas.height = this.height;
				canvas.width = this.width;
				c.drawImage(this, 0, 0);
				urlData = canvas.toDataURL(output);
				callback(urlData);
				canvas = null;
		};
		img.src = url;
	}

	$http.get(link).success(function(data){

		console.log('success get profile : ');
		var arr_data = Object.keys(data).map(function (key) {return data[key]});

		//console.log(data);
		console.log(arr_data[1].users);
		console.log(arr_data[1].users.email);
		console.log(arr_data[1].interests);

		$scope.ProfilesMdl.full_name 	= arr_data[1].full_name;
		$scope.ProfilesMdl.email 		= arr_data[1].users.email;
		$scope.ProfilesMdl.bio 			= arr_data[1].bio;

		$scope.ProfilesMdl.birth_date = arr_data[1].birth_date;
		$scope.ProfilesMdl.image 		= arr_data[1].image;

		var arr_interests = [];
		angular.forEach(arr_data[1].interests, function(value, key) {
		  arr_interests.push({
		  		text : value.word
		  });
		}, arr_interests);

		$scope.ProfilesMdl.interests 	= arr_interests;
		//console.log('arr_interest');
		//console.log(arr_interest);

		var arr_hobbies = [];
		angular.forEach(arr_data[1].hobbies, function(value, key) {
		  arr_hobbies.push({
		  		text : value.word
		  });
		}, arr_hobbies);
		$scope.ProfilesMdl.hobbies 	= arr_hobbies;
		//console.log('arr_hobbies');
		//console.log(arr_hobbies);

		$scope.ProfilesMdl.gender		= arr_data[1].gender;

		$scope.$watch("ProfilesMdl.gender", function(newValue, oldValue) {
			var radioGenderMale = angular.element( document.querySelector( '#radioGenderMale' ) );
			var radioGenderFemale = angular.element( document.querySelector( '#radioGenderFemale' ) );
			console.log('radio gender changed');
			console.log(newValue);
			if (newValue == '1') {
				radioGenderFemale.removeClass('pinky-radio')
				radioGenderMale.addClass('button-positive');
			}
			else if (newValue == '0'){
				radioGenderFemale.addClass('button-positive');
				radioGenderFemale.addClass('pinky-radio');
			}
		});

		if (arr_data[1].image == '') {
			$scope.imageAddPhoto = 'img/add_photos.png';
		}
		else{

			if (arr_data[1].image_name != '') {
				console.log('base64 ImagePicker : ');
				convertImageToBase64(arr_data[1].image_name, function(base64Img){
               console.log('--');
               console.log(base64Img);
               $scope.imageAddPhoto = arr_data[1].image_name;
               $ionicLoading.hide();
            });
			}
			else{
				$scope.imageAddPhoto = 'img/add_photos.png';
				$ionicLoading.hide();
			}
		}

	}).error(function(data){
		console.log('error get profile');
		console.log(data);
	}).then(function(result){
		things = result.data;
	});

	$scope.toggleMenu = function() {
		if($ionicSideMenuDelegate.isOpenLeft()) {
			$ionicSideMenuDelegate.toggleLeft(false);
		} else {
			$ionicSideMenuDelegate.toggleLeft(true);
		}
	}

	$scope.lat = $window.localStorage.getItem('latitude');
	$scope.long = $window.localStorage.getItem('longitude');
	$scope.base64Img = '';

	function formatDate(date) {
	    var d = new Date(date || Date.now()),
	        month = '' + (d.getMonth() + 1),
	        day = '' + d.getDate(),
	        year = d.getFullYear();

	    if (month.length < 2) month = '0' + month;
	    if (day.length < 2) day = '0' + day;

	    return [year, month, day].join('-');
	}

	$scope.collection = {
		selectedImage : ''
	};

   $ionicPlatform.ready(function() {

      // action sheet
      $scope.showAction = function () {

            var hideSheet = $ionicActionSheet.show({
					buttons: [
						{ text: '<b>Capture</b>' },
					  	{ text: '<b>Pick</b>' }
					],
					title: 'Add Photo',
					cancelText: 'Cancel',
					cancel: function () {
					  //
					},
               buttonClicked: function (index) {
                  if (index == 0) {
                  	console.log("masuk if capture");
                     var options = {
                         limit: 1
                     };

                     // capture
                     $cordovaCapture.captureImage(options).then(function (imageData) {
                     			console.log("capture");
								var imgDataRaw = imageData[0].fullPath;

								window.imageResizer.getImageSize(function(data){
									console.log(data);
								}, function(error){
									console.log(error);
								}, imageData[0].fullPath);

								$jrCrop.crop({
								   url: imgDataRaw,
								   width: 200,
								   height: 200
								}).then(function(canvas) {
								   // success!
								   var imageCrop = canvas.toDataURL();
								   //console.log('result crop : ');
								   //console.log(imageCrop);

								   $scope.imageAddPhoto = imageCrop;
									$scope.fooImageHidden = imageCrop;
									$rootScope.newValfooImageHidden = imageCrop;
	                        //$window.sessionStorage.setItem('imageCrop', imageCrop);

								}, function() {
								    // User canceled or couldn't load image.
								    console.log('crop failed');
								});

							}, function (error) {
								$scope.photoError = error;
							});
                  } else if (index == 1) {
                  	console.log("masuk else pick");
                     var options = {
                        maximumImagesCount: 1,
                     };

                     // pick
                     $cordovaImagePicker.getPictures(options).then(function (results) {
                     	console.log("pick");
                        window.imageResizer.getImageSize(function(imageSize){
									console.log(imageSize);
									if (imageSize.width > 520) {
										console.log('--> image di resize');
										window.imageResizer.resizeImage(function(result){
											console.log(result);
										}, function(error){
											console.log(error);
										}, results[0], 300, 0, {
											resizeType : ImageResizer.RESIZE_TYPE_PIXEL,
											imageDataType : ImageResizer.IMAGE_DATA_TYPE_URL
										});
									}
									else{
										console.log('--> image tidak resize');
									}
								}, function(error){
									console.log(error);
								}, results[0]);

							window.imageResizer.getImageSize(function(imageSize){
									console.log('setelah di resize');
									console.log(imageSize);
								}, function(error){
									console.log(error);
								}, results[0]);

								var imgDataRaw = results[0];

								$jrCrop.crop({
								    url: imgDataRaw,
								    width: 200,
								    height: 200
								}).then(function(canvas) {
								    // success!

								   var imageCrop = canvas.toDataURL();
								   //console.log('result crop : ');
								   //console.log(imageCrop);12

								   $scope.imageAddPhoto = imageCrop;
									$scope.fooImageHidden = imageCrop;
									$rootScope.newValfooImageHidden = imageCrop;
                           //$window.sessionStorage.setItem('imageCrop', imageCrop);

								}, function() {
								    // User canceled or couldn't load image.
								    console.log('crop failed');
								});

                     });
                  }
                  return true;
               }//end buttonClicked
            })
        	};


		$scope.ProfilesMdl = {};
		$scope.submitEditAccount = function() {

			$ionicLoading.show({template: 'Send data ...'});
			var linkUpdate = MYconfig.apiURL + 'services/profiles/update';
			//$scope.imageAddPhoto
			//var imageCrop = $window.sessionStorage.getItem('imageCrop');
			var imageCrop = $scope.imageAddPhoto;

			//console.log($scope.ProfilesMdl.interests);
			var tag_interest = '';
			angular.forEach($scope.ProfilesMdl.interests, function(value, key) {
			  tag_interest = tag_interest.concat(value.text) + ',';
			}, tag_interest);
			//console.log('tag interest : ');
			tag_interest = tag_interest.replace(/,\s*$/, "");
			//console.log(tag_interest);

			//console.log($scope.ProfilesMdl.hobbies);
			var tag_hobbies = '';
			angular.forEach($scope.ProfilesMdl.hobbies, function(value, key) {
			  tag_hobbies = tag_hobbies.concat(value.text) + ',';
			}, tag_hobbies);
			console.log('tag hobbies : ');
			tag_hobbies = tag_hobbies.replace(/,\s*$/, "");
			console.log(tag_hobbies);

			var imageKirim;
			var imageCrop = $rootScope.newValfooImageHidden;

			if (typeof imageCrop !== 'undefined') {
					var imageCropArray = [];

					imageCropArray = imageCrop.split(",");
					imageKirim = imageCropArray[1];
					console.log('image crop array : ');
					//console.log(imageCropArray[1]);
			}
			else {
				imageKirim =  $scope.image;
			}

			$http.post(linkUpdate, $httpParamSerializerJQLike({
						"ProfilesMdl":{
							"interests"		: tag_interest,
							"gender" 		: $scope.ProfilesMdl.gender,
							"hobbies" 		: tag_hobbies,
							"email"			: $scope.ProfilesMdl.email,
							"image" 			: imageKirim,
							"lat" 			: $scope.lat,
							"lon" 			: $scope.long,
							"birth_date" 	: formatDate($scope.ProfilesMdl.birth_date),
							"full_name" 	: $scope.ProfilesMdl.full_name,
							"bio" 			: $scope.ProfilesMdl.bio
						}
					}) 
			, { timeout : 10000 }
			).then(function (response){

						console.log('response update : ');
						console.log(response);
						$ionicLoading.hide();

						if (response.data.status == 1) {

							$rootScope.fullName 		= $scope.ProfilesMdl.full_name;
							$rootScope.emailUser 	= $scope.ProfilesMdl.email;
							$rootScope.profilePic 	= imageCrop;

							$ionicPopup.alert({
									 title: '',
									 template: 'Update Success'
							});

							$state.go('app.edit_account');
				}
				else{
					$ionicLoading.hide();
					$ionicPopup.alert({
							 title: '',
							 template: 'Update Failed'
					});
				}
			});
		};//end scope.submitAccount

		// var link = MYconfig.apiURL + 'services/profiles';
		// console.log('link :');
		// console.log(link);
		// $http.get(link).success(function(data){
		// 	console.log('success get profile : ');
		// 	console.log(data); // for browser console
		// 	$scope.result = data; // for UI

		// 	$scope.imageAddPhoto = data.image_name;
		// }).error(function(data){
		// 	console.log('error get profile');
		// 	console.log(data);
		// }).then(function(result){
		// 	things = result.data;
		// });

   });//end platform ready
}]);//end controller editAccountCtrl