angular.module('App').factory('Hex', 
['Prefab', 'util', '$q',
function(Prefab, util, $q){
  
return function(settings){
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
  this.points = new Float32Array( 36 );

//public methods
//-----------------------------------------------------------------------------
  this.Start = function(loader){    
    makeOutline.bind(this)();
  };
//private methods
//-----------------------------------------------------------------------------
  function makeOutline(){
    var center = new THREE.Vector2(this.x, this.y);
    var corners = [];

    _.times(6, function(i){
      corners[i] = getHexCorner(center, this.size, i);
    }.bind(this));

    for(var i = 6; i < 36; i += 6){
      var prevCorner = corners[i / 6 - 1];
      var curCorner = corners[i / 6];

      this.points[i - 6] = curCorner.x;
      this.points[i - 5] = 0;
      this.points[i - 4] = curCorner.y;

      this.points[i - 3] = prevCorner.x;
      this.points[i - 2] = 0;
      this.points[i - 1] = prevCorner.y;
    } 

    this.points[30] = corners[0].x;
    this.points[31] = 0;
    this.points[32] = corners[0].y;

    this.points[33] = corners[5].x;
    this.points[34] = 0;
    this.points[35] = corners[5].y;
  }
//-----------------------------------------------------------------------------
  function getHexCorner(center, size, i){
    var angle_rad = util.Deg2Rad(60 * i + 30);
    return new THREE.Vector2(
      center.x + size * Math.cos(angle_rad), 
      center.y + size * Math.sin(angle_rad)); 
  } 
//-----------------------------------------------------------------------------  
};
}]);
