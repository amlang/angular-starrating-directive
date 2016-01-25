'use strict';
describe('Directive: star-rating', function(){
  var $compile, $rootScope,scope;
  beforeEach(function(){
      module('starRating');

      inject(function(_$compile_, _$rootScope_){
        $compile = _$compile_;

        $rootScope = _$rootScope_;
        scope = $rootScope.$new()
      });
  });

  afterEach(inject(function($rootScope){
    $rootScope.$apply();
  }));

  it('should throw an exception, cause ngModel dependency is missing',function(){
    var element = angular.element('<star-rating></star-rating>');
    expect(function () {$compile(element)(scope);}).toThrow("star-rating dependency failure: ngModel is not defined!");
  });

  it('should throw an exception, cause Controller "form" dependency is missing',function(){
    var element = angular.element('<star-rating ng-model="rating.qwertyuiop"></star-rating>');
    expect(function () {$compile(element)(scope);}).toThrow();
  });

  it("shouldn't throw an exception",function(){
    var element = angular.element('<form name="myForm"><star-rating ng-model="rating.qwertyuiop"></star-rating></form>');
    expect(function () {$compile(element)(scope);}).not.toThrow();
    scope.$digest();
  });

  describe('something',function(){
    var element;
    beforeEach(function(){
      element = angular.element('<form name="myForm"><star-rating ng-model="rating.qwertyuiop"></star-rating><pre>{{rating.qwertyuiop}}</pre></form>');
      $compile(element)(scope);
      scope.$digest();
    });
    it("should have 10 radio-Buttons including 5 .half by default",function(){
      expect(element.find('input').length).toEqual(10);
      expect(element[0].querySelectorAll('.half').length).toEqual(5);
    });

    it("should have 5 radio-Buttons and no .half if nohalfs attr is set",function(){
      var element = angular.element('<form name="myForm"><star-rating ng-model="rating.qwertyuiop"></star-rating></form>');
      element.find('star-rating').attr('nohalfs',"true");
      expect(function () {$compile(element)(scope);}).not.toThrow();
      scope.$digest();
      expect(element.find('input').length).toEqual(5);
      expect(element[0].querySelectorAll('.half').length).toEqual(0);
    });
  });
});
