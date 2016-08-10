angular.module('App').factory('Planet', 
['Prefab', 'util', '$q', 
function(Prefab, util, $q){
  
return function(){
  Prefab.call(this);
  
  this.components = ['Rotate'];

//public fields
  var scope = this; 
  this.size = 2;


//public methods
//-----------------------------------------------------------------------------
  this.Start = function(loader){     
    this.add( makeMesh() );

    this.components.Rotate.velocity.x = 
    this.components.Rotate.velocity.y = 
    this.components.Rotate.velocity.z = util.Deg2Rad(0.3);    
  };
//-----------------------------------------------------------------------------
  function makeMesh(){
    var segments = 10;
    var geometry = spheriphyCube(new THREE.BoxGeometry( scope.size, scope.size, scope.size, segments, segments, segments ));
    var material = new THREE.MeshBasicMaterial( {color: 0x00ff00, wireframe: true} );
    return new THREE.Mesh( geometry, material );
  }
//-----------------------------------------------------------------------------
  function spheriphyCube(cube){
    _.each(cube.vertices, function(vert){
      vert.normalize().multiplyScalar(scope.size);
    });

    return cube;
  }
//-----------------------------------------------------------------------------
};
}]);
