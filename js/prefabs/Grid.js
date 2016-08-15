angular.module('App').factory('Grid', 
['Prefab', 'util', '$q', 'Hex',
function(Prefab, util, $q, Hex){
  
return function(settings){
  Prefab.call(this);
  settings = settings || {};

//public fields
  this.name  = 'Grid';
  this.id    = '';
  this.layer = '';
  this.meshes = [];
  this.components = ['Rotate'];
  this.uid = _.uniqueId();
  this.x = settings.x || 0;
  this.y = settings.y || 0;
  this.size = settings.size || {width: 10, height: 10};

//private fields
  var hexSize = 0.5;

//public methods
//-----------------------------------------------------------------------------
  this.Start = function(loader){
    
    _.times(100, function(w){
      _.times(100, function(h){

        var hexCoords = getHexCoords(w, h);
        var settings = { 
          x: hexCoords.x,
          y: hexCoords.y, 
          size: hexSize 
        };

        loader.injector.LoadPrefab("Hex", settings)
        .then(function(hex){
          hex.Start(loader);
          this.add(hex);
        }.bind(this));

      }.bind(this));//height  
    }.bind(this));//width  

    this.components.Rotate.velocity.x = 
    this.components.Rotate.velocity.y = 
    this.components.Rotate.velocity.z = util.Deg2Rad(0.3);     

  };
//private methods
//-----------------------------------------------------------------------------
  function getHexCoords(x, y){
    var hexHeight = hexSize * 2;
    var hexWidth = Math.sqrt(3) / 2 * hexHeight;

    return { x: x * hexWidth, y: y * hexHeight };
  }
//-----------------------------------------------------------------------------

};
}]);
