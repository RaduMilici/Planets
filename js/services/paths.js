angular.module('App').factory('paths', [function(){
return new (function(){

  this.js = './js';
  this.prefabs = this.js + '/prefabs';
//assets
//-----------------------------------------------------------------------------
  this.assets = './assets';
  this.models = this.assets + '/models';
  this.projects = this.assets + '/projects';
  
})();
}]);
