"use strict";
angular.module('starRating',[])
.factory('starRatingData',function(){
  var guid;
  var create_new_guid = function(){
    function digit() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    //guid = digit() + digit() + '-' + digit() + '-' + digit() + '-' + digit() + '-' + digit() + digit() + digit();
    guid = digit() + digit() + digit();
    return this;
  }

  var get_guid = function(){return guid;}
  return {
    create_new_guid: create_new_guid,
    get_guid: get_guid
  };
})
.directive('starRating',['starRatingData','$rootScope',function(starRatingData,$rootScope){
  var guid = starRatingData.create_new_guid().get_guid();
  var template = function(element, attrs){
    if(!angular.isDefined(attrs.ngModel)){
      throw "star-rating dependency failure: ngModel is not defined!";
      // element.attr('ng-model','rating.'+guid);
      // var $injector = element.injector();
      // $injector.invoke(function($compile){
      //   $compile(element)($rootScope);
      // });
    }
    var starTemplateWithVars ='\
    <input id="##id##" type="radio" value="##value##" name="fieldName" ng-model="fieldModelName"/>\
    <label for="##id##" class="##class##"></label>';

    var templateWithVars = '<div class="row starrating">\
    <div class="col-md-6">ratingsubject</div>\
    <div class="col-md-6 text-right">\
    <div class="star-rating">\
    ##stars##\
    </div>\
    </div>\
    </div>\
    ';
    var fieldModelName = get_modelname(attrs);
    var stars = "";
    var staramount = attrs.staramount || 5;
    var nohalfs = angular.isDefined(attrs.nohalfs);
    var step = (nohalfs)?1:0.5;

    for (var i = staramount, turn = 1; i > 0; i = i-step, turn++) {
      var even = turn % 2;
      var newStarTemplate = "";
      if(!nohalfs){
        newStarTemplate = starTemplateWithVars.replace(/##class##/,(even)?'full':'half');
      }else {
        newStarTemplate = starTemplateWithVars.replace(/class="##class##"/,'');
      }
      var id =  fieldModelName.replace('.','_');
      id+= "_star_";
      id+= !even ? (''+i).replace('.','_') : i;
      stars += newStarTemplate.replace(/##value##/,i).replace(/##id##/g,id);
    }
    var template = templateWithVars
    .replace(/ratingsubject/g, attrs.ratingsubject || "")
    .replace(/##stars##/,stars)
    .replace(/fieldName/g, get_fieldname(attrs))
    .replace(/fieldModelName/g, get_modelname(attrs));
    return template;
  }

  var get_name = function(attrs){
    var modelAndField = angular.isDefined(attrs.ngModel)?attrs.ngModel:'starrating.'+guid;
    var names = modelAndField.split('.');
    names.shift();
    return names;
  }

  var get_fieldname = function(attrs){
    var names = get_name(attrs);
    var model;
    if(angular.isArray(names)){
      model = names.shift();
      var fieldname = "";
      angular.forEach(names, function(value, key) {
        fieldname += "["+value+"]";
      });
      fieldname = model+fieldname;
    }
    else if(angular.isString(names)){
      fieldname = names;
    }

    return fieldname;
  }
  var get_modelname = function(attrs){
    var names = get_name(attrs);
    var fieldname = angular.isArray(names)? names[names.length -1] : names;
    return fieldname;
  };
  return {
    restrict: 'E',
    replace: false,
    controller: function($scope) {},
    require: ['^form', 'ngModel'],
    scope: {},
    template: template,
    link: function($scope, elem, attrs, ctrls){
      //console.log(ctrls);
      $scope.form = ctrls[0];
      var ngModel = ctrls[1];
      var fieldModelName = get_modelname(attrs);

      $scope.$watch(fieldModelName, function() {
        ngModel.$setViewValue($scope[fieldModelName]);
        ngModel.$commit
      });
    }
  };
}]);
