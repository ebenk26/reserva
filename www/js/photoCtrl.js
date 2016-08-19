app.controller('photoCtrl', ['$scope', '$cordovaCapture', '$cordovaImagePicker', '$ionicActionSheet', '$ionicPlatform', 'Photo', '$jrCrop',
	function ($scope, $cordovaCapture, $cordovaImagePicker, $ionicActionSheet, $ionicPlatform, Photo, $jrCrop) {

   $ionicPlatform.ready(function() {
   	$scope.imageAddPhoto = 'img/add_photos.png';
   	$scope.formData = {};

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
                     var options = {
                         limit: 1
                     };

                     // capture
                     $cordovaCapture.captureImage(options).then(function (imageData) {
								var imgDataRaw = imageData[0].fullPath;

								$jrCrop.crop({
								    url: imgDataRaw,
								    width: 200,
								    height: 200
								}).then(function(canvas) {
								    // success!
								    var imageCrop = canvas.toDataURL();
								    console.log('result crop : ');
								    console.log(imageCrop);

								    $scope.imageAddPhoto = imageCrop;
	                         $scope.formData.photo = imageCrop;
								}, function() {
								    // User canceled or couldn't load image.
								    console.log('crop failed');
								});

								// convert image to base64 string
								Photo.convertImageToBase64(imgData, function(base64ImgCapture){
								console.log('base64 ImageCapture : ');
								console.log(base64ImgCapture);
								$scope.imageAddPhoto = base64ImgCapture;
								$scope.formData.photo = base64ImgCapture;
								});

							}, function (error) {
								$scope.photoError = error;
							});
                  } else if (index == 1) {
                        var options = {
                            maximumImagesCount: 1,
                        };

                        // pick
                        $cordovaImagePicker.getPictures(options).then(function (results) {
                           var imgDataRaw = results[0];

									$jrCrop.crop({
									    url: imgDataRaw,
									    width: 200,
									    height: 200
									}).then(function(canvas) {
									    // success!
									    var imageCrop = canvas.toDataURL();
									    console.log('result crop : ');
									    console.log(imageCrop);

									   $scope.imageAddPhoto = imageCrop;
	                           $scope.formData.photo = imageCrop;

	                            // convert image to base64 string
	                            /*
	                            Photo.convertImageToBase64(imgData, function(base64ImgPicker){
	                            	console.log('base64 ImagePicker : ');
	                            	console.log(base64ImgPicker);
	                            });
	                            */

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

    });

	$scope.sendData = function() {
	  $http.post('url', $scope.formData)
			.success(function(successData){
			    // ...
			})
			.error(function (errorData) {
			    // ...
			})
	};

}]);//end photoCtrl