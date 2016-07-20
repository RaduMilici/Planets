angular.module('App').factory('paths', [function(){
return new (function(){

  this.assets = './assets';
  this.js = './js';
  this.models = this.assets + '/models';
  this.prefabs = this.js + '/prefabs';
  
})();
}]);
