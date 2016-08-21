angular.module('App').factory('Map', 
['Prefab', 'util', '$q', 'Grid',
function(Prefab, util, $q, Grid){

return function(settings){
  this.project = settings.project;
  this.loader = this.project.loader;

  //load grid
  this.loader.LoadPrefab('Grid', settings.grid);

};
}]);
