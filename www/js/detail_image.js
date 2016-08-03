angular.module('starter.image', [])

// .controller('MyCtrl', function($scope) {
//   $scope.noMoreItemsAvailable = false;
  
//   $scope.loadMore = function() {
//     $scope.items.push({ id: $scope.items.length});
   
//     if ( $scope.items.length == 99 ) {
//       $scope.noMoreItemsAvailable = true;
//     }
//     $scope.$broadcast('scroll.infiniteScrollComplete');
//   };
  
//   $scope.items = [];
  
// });

.controller('AppCtrl', function($scope) {

$scope.filepathChooser = function() {
  window.plugins.mfilechooser.open([], function (uri) {
     //Here uri provides the selected file path.
 console.log('file path', uri);
 alert(uri);
}, function (error) {
   console.log('Error', error);
alert(error);
});
};
});