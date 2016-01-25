angular.module('myApp',['starRating'])
.controller('MyCtrl',function($scope){
  $scope.rating = {
    fourthrating: 7.5,
    fifthrating: 5
  };
});
