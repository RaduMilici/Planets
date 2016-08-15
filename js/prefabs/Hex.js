angular.module('App').factory('Hex', 
['Prefab', 'util', '$q',
function(Prefab, util, $q){
  
return function(settings){
  Prefab.call(this);
  settings = settings || {};

//public fields
  this.name  = 'Hex';
  this.id    = '';
  this.layer = '';
  this.meshes = [];
  this.components = [];
  this.uid = _.uniqueId();

  this.x = settings.x || 0;
  this.y = settings.y || 0;
  this.size = settings.size || 1;

//public methods
//-----------------------------------------------------------------------------
  this.Start = function(loader){
    
    makeOutline.bind(this)();
    //console.log(this.children[0].material)

  };
//private methods
//-----------------------------------------------------------------------------
  function makeOutline(){
    var material = new THREE.LineBasicMaterial({color: 0x0000ff});
    var geometry = new THREE.Geometry();
    var center = new THREE.Vector2(this.x, this.y);
    
    _.times(6, function(i){
      var corner = getHexCorner(center, this.size, i);
      geometry.vertices.push(new THREE.Vector3(corner.x, 0, corner.y));
    }.bind(this));

    geometry.vertices.push(geometry.vertices[0]);

    this.add(new THREE.Line(geometry, material));
  }
//-----------------------------------------------------------------------------
  function getHexCorner(center, size, i){
    var angle_rad = util.Deg2Rad(60 * i + 30);
    return new THREE.Vector2(
      center.x + size * Math.cos(angle_rad), 
      center.y + size * Math.sin(angle_rad)); 
  } 
//-----------------------------------------------------------------------------
  return this;
};
}]);
