angular.module('myApp',['starRating'])
.controller('MyCtrl', function MyCtrl($scope){
  $scope.rating = {
    firstrating: 4,
    secondrating: 2.5,
    fourthrating: 7.5,
    fifthrating: 5,
    sixthrating: 3.5
  };
});
