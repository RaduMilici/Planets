angular.module('App').factory('Prefab', [function(){
return function(){

  THREE.Object3D.call(this);

//public fields
  this.name  = '';
  this.id    = '';
  this.layer = ''; 
  this.meshes = [];
  this.components = [];
  this.uid = _.uniqueId();

//public methods
//-----------------------------------------------------------------------------
  this.Start = function(){

  };
//-----------------------------------------------------------------------------
  this.Stop = function(){

  };
//-----------------------------------------------------------------------------
  this.Destroy = function(){

  };
//-----------------------------------------------------------------------------
  this.Update = function(){

  };
//-----------------------------------------------------------------------------
  this.AddComponent = function(componentName){

    this.loader.injector.AddComponent(this, componentName);

  }; 
//-----------------------------------------------------------------------------

};
}]);
