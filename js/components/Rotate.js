angular.module('App').factory('Rotate', ['Component', function(Component){
return function(prefab){ 
  
  Component.call(this);

//public fields
  this.velocity = new THREE.Vector3();
  this.prefab = prefab;

//private fields

//public methods
//-----------------------------------------------------------------------------
  this.Start = function(velocity){

    this.velocity = velocity || this.velocity;

  };
//-----------------------------------------------------------------------------
  this.Update = function(deltaTime){
    this.prefab.rotation.x += this.velocity.x * deltaTime;
    this.prefab.rotation.y += this.velocity.y * deltaTime;
    this.prefab.rotation.z += this.velocity.z * deltaTime;
  };
//private methods
//-----------------------------------------------------------------------------

};
}]);
