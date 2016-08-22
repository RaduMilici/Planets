angular.module('App').factory('Map', 
['Prefab', 'util', '$q', 'Grid',
function(Prefab, util, $q, Grid){

return function(settings){
  this.project = settings.project;
  this.loader = this.project.loader;
  this.grid = undefined;

//-----------------------------------------------------------------------------
  (function Start() {

    loadGrid.bind(this)()
    .then(function(grid){
      this.grid = grid;
      loadTopDownCam.bind(this)();
    }.bind(this));

  }.bind(this)());
//private methods
//-----------------------------------------------------------------------------
  function loadGrid() {
    return this.loader.LoadPrefab('Grid', settings.grid);
  }
//-----------------------------------------------------------------------------
  function loadTopDownCam() {
    return this.loader.LoadPrefab('TopDownCam', {
      animator: this.project.animator,
      grid: this.grid
    });
  }
//-----------------------------------------------------------------------------
};
}]);
