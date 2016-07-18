angular.module('App').factory('paths', [function(){
return new (function(){

  this.assets = './assets';
  this.models = this.assets + '/models';
  
})();
}]);
