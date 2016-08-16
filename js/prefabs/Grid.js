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
  
  this.size = settings.size || { width: 50, height: 50 };

//private fields
  var hexSize = 1;

//public methods
//-----------------------------------------------------------------------------
  this.Start = function(loader){
    var geometry = new THREE.BufferGeometry();
    var points = new Float32Array( this.size.width * this.size.height * 36 );
    var hexes = 0;

    _.times(this.size.width, function(w){
      _.times(this.size.height, function(h){

        var hexCoords = getHexCoords(w, h);
        var settings = { x: hexCoords.x, y: hexCoords.y, size: hexSize };

        loader.injector.LoadPrefab('Hex', settings)
        .then(function(hex){
          hex.Start(loader);
          points.set(hex.points, hexes++ * 36);
        }.bind(this));

      }.bind(this));//height  
    }.bind(this));//width  

    geometry.addAttribute( 'position', new THREE.BufferAttribute( points, 3 ).setDynamic( true ) );
    this.add(new THREE.LineSegments(geometry, new THREE.LineBasicMaterial({color: 0x0000ff})));

    /*this.components.Rotate.velocity.x = 
    this.components.Rotate.velocity.y = util.Deg2Rad(0.5);
    this.components.Rotate.velocity.z = util.Deg2Rad(0.5);*/
  };
//private methods
//-----------------------------------------------------------------------------
  function getHexCoords(x, y){
    var hexHeight = hexSize * 2;
    var hexWidth = Math.sqrt(3) / 2 * hexHeight;

    //offsets
    x += (y % 2) * 0.5;
    hexHeight -= hexHeight / 4;

    return { x: x * hexWidth, y: y * hexHeight };
  }
//-----------------------------------------------------------------------------

};
}]);
