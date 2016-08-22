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
  
  var hexSize = 1;
  
  this.size = settings.size || { width: 10, height: 10 };
  this.hexHeight = hexSize * 2;
  this.hexWidth = Math.sqrt(3) / 2 * this.hexHeight;
  //offsets vertical
  this.hexHeight -= this.hexHeight / 4;

//public methods
//-----------------------------------------------------------------------------
  this.Start = function(loader){
    generate.bind(this)();
    /*
    this.components.Rotate.velocity.x = 
    this.components.Rotate.velocity.y = util.Deg2Rad(0.5);
    this.components.Rotate.velocity.z = util.Deg2Rad(0.5);
    */
  };
//private methods
//-----------------------------------------------------------------------------
  function generate(){
    var geometry = new THREE.BufferGeometry();
    var points = new Float32Array( this.size.width * this.size.height * 36 );
    var hexesGenerated = 0;

    _.times(this.size.width, function(w){
      _.times(this.size.height, function(h){

        var hexCoords = getHexCoords.bind(this)(w, h);
        var settings = { x: hexCoords.x, y: hexCoords.y, size: hexSize };
        
        hex = new Hex(settings);
        hex.Start(this.loader);
        points.set(hex.points, hexesGenerated++ * 36);

      }.bind(this));//height  
    }.bind(this));//width  

    geometry.addAttribute( 'position', new THREE.BufferAttribute( points, 3 ).setDynamic( true ) );
    this.add(new THREE.LineSegments(geometry, new THREE.LineBasicMaterial({ color: 0x0000ff })));
  }
//-----------------------------------------------------------------------------
  function getHexCoords(x, y){
    //offsets horizontal
    x += (y % 2) * 0.5;
    return { x: x * this.hexWidth, y: y * this.hexHeight };
  }
//-----------------------------------------------------------------------------

};
}]);
