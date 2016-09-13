app.controller('socialshareCtrl', function($scope, $cordovaSocialSharing, $rootScope) {
  $scope.voucher = "n8yuj9";
  $rootScope.voucherz = "n8yuj9";
  var message = "Get free voucher now with join Reserva by the code n8yuj9";
  var messageEmail = "Get free voucher now with join Reserva by the code n8yuj9 http://porto3.nadyne.com/reserva_fweb/";
  var subject = "Get free voucher";
  var file = "";
  var link = "http://porto3.nadyne.com/reserva_fweb/";
  var image = "img/user1.png";
  var number = 123456789;
  var toArr = "";
  var ccArr = "";
  var bccArr = "";
  $scope.socialshareNative = function(message, subject, file, link) {
    console.log(message);
    $cordovaSocialSharing
      .share(message, subject, file, link) // Share via native share sheet
      .then(function(result) {
        // Success!
        console.log(result);
      }, function(err) {
        // An error occured. Show a message to the user
        console.log(err);
      });

    // $cordovaSocialSharing
    //   .shareViaTwitter(message, image, link)
    //   .then(function(result) {
    //     // Success!
    //   }, function(err) {
    //     // An error occurred. Show a message to the user
    //   });

  //   $cordovaSocialSharing
  //     .shareViaWhatsApp(message, image, link)
  //     .then(function(result) {
  //       // Success!
  //     }, function(err) {
  //       // An error occurred. Show a message to the user
  //     });

  //   $cordovaSocialSharing
  //     .shareViaFacebook(message, image, link)
  //     .then(function(result) {
  //       // Success!
  //     }, function(err) {
  //       // An error occurred. Show a message to the user
  //     });

  //   // access multiple numbers in a string like: '0612345678,0687654321'
  //   $cordovaSocialSharing
  //     .shareViaSMS(message, number)
  //     .then(function(result) {
  //       // Success!
  //     }, function(err) {
  //       // An error occurred. Show a message to the user
  //     });

  // // toArr, ccArr and bccArr must be an array, file can be either null, string or array
  //   $cordovaSocialSharing
  //     .shareViaEmail(message, subject, toArr, ccArr, bccArr, file)
  //     .then(function(result) {
  //       // Success!
  //     }, function(err) {
  //       // An error occurred. Show a message to the user
  //     });

  //   $cordovaSocialSharing
  //     .canShareVia(socialType, message, image, link)
  //     .then(function(result) {
  //       // Success!
  //     }, function(err) {
  //       // An error occurred. Show a message to the user
  //     });

  //   $cordovaSocialSharing
  //     .canShareViaEmail()
  //     .then(function(result) {
  //       // Yes we can
  //     }, function(err) {
  //       // Nope
  //     });

  };

  $scope.socialshareTwitter = function () {
    $cordovaSocialSharing
      .shareViaTwitter(message, image, link)
      .then(function(result) {
        console.log(result);
      }, function(err) {
        console.log(err);
      });
  };

  $scope.socialshareFb = function () {
    $cordovaSocialSharing
      .shareViaFacebook(message, image, link)
      .then(function(result) {
        // Success!
        console.log(result);
      }, function(err) {
        // An error occurred. Show a message to the user
        console.log(err);
      });
  };

  $scope.socialshareEmail = function () {
    $cordovaSocialSharing
      .shareViaEmail(messageEmail, subject, toArr, ccArr, bccArr, file)
      .then(function(result) {
        console.log(result);
      }, function(err) {
        console.log(err);
      });
  };

  $scope.socialshareMessage = function () {
    $cordovaSocialSharing
      .shareViaSMS(message, number)
      .then(function(result) {
        // Success!
      }, function(err) {
        // An error occurred. Show a message to the user
      });
  };

  $scope.socialshareWa = function () {
    $cordovaSocialSharing
      .shareViaWhatsApp(message, image, link)
      .then(function(result) {
        // Success!
      }, function(err) {
        // An error occurred. Show a message to the user
      });
  };
});

