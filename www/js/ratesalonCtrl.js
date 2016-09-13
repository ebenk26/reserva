app.controller('ratesalonCtrl', function($scope, $rootScope, $ionicLoading, $window, $http, MYconfig, $log) {
  $ionicLoading.show({template: 'Load Merchant Info...'});
  $scope.salonData = {};
  var image_arr = [];
  var images = "";
  $scope.rating = {};
  $scope.rating.max = 5;
  // $scope.rateme = 0;
  console.log('masukratesalon');
  $scope.showQuest = false;
  $scope.data = {
    rating : 1,
    max: 5,
    grossOptions: 'time'
  };

  $scope.questlist = [
      { text: "Duration Hours", value: "Duration Hours" },
      { text: "Service Quality", value: "Service Quality" }
  ];

  $scope.questlist2 = [
      { text: "Application Usability", value: "Application Usability" },
      { text: "Ambience", value: "Ambience" }
  ];

  $scope.questlist3 = [
      { text: "Beautician/Theraphist", value: "Beautician/Theraphist" },
      { text: "Others", value: "Others" }
  ];
  $scope.updateQuestList = function(item) {
    $window.localStorage.setItem( 'timelist', item.value );
    console.log( 'Quest List: ' + item.value );
  };

  var apiMerchantList = 'reserva/merchants/list?p=1&psize=20&lat='+window.localStorage.getItem('latitude')+'&lon='+window.localStorage.getItem('latitude');
    $http.get(MYconfig.apiURL + apiMerchantList)
      .success(function(result) {
        $log.log(MYconfig.apiURL + apiMerchantList);
        $log.log(result.data);
        $scope.items = result.data;
        $ionicLoading.hide();
        $window.localStorage.setItem('merchantListrate', JSON.stringify(result.data));

        var merchantlistJSON = JSON.parse( $window.localStorage.getItem('merchantListrate') );
        angular.forEach(merchantlistJSON, function(value, key){
          if (value.id == $rootScope.idRateSalon) {
            $scope.nameSalon = value.name;
            $scope.salonData.name = value.name;
            $scope.salonData.address = value.address;
            $scope.rating.rate = value.total_rating;
            console.log(value);
            if (value.merchantImages[0]) {
              $scope.salonData.imgUrl = value.merchantImages[0].thumb_name;
            }else{
              $scope.images = "";
              $scope.salonData.imgUrl = "";
            }
            
            $ionicLoading.hide();
          }
        });         
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
  $scope.readOnly = true;
  $scope.$watch('data.rating', function() {
    if ($scope.data.rating < 4) {
      $scope.showQuest = true;
    }else{
      $scope.showQuest = false;
    }
    console.log('New value: '+$scope.data.rating);
  });

});

