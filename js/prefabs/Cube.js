angular.module('App').factory('Cube', ['Prefab', 'util', function(Prefab, util){
return function(){
  Prefab.call(this);

//public fields
  this.name  = 'Cube';
  this.id    = '';
  this.layer = '';
  this.meshes = ['cube'];
  this.components = ['Rotate'];
  this.uid = _.uniqueId();
  var scope = this;

//public methods
//-----------------------------------------------------------------------------
  this.Start = function(loader){
    this.position.z -= 15;

    loader.LoadMesh('cube').then(function(cube){
      cube.position.y += 5;
      cube.AddComponent('Rotate');
      cube.components.Rotate.velocity.x = util.Deg2Rad(1);
      cube.components.Rotate.velocity.y = util.Deg2Rad(1);
      cube.components.Rotate.velocity.z = util.Deg2Rad(1);
      this.add(cube);
    }.bind(this));

    this.components.Rotate.velocity.x = util.Deg2Rad(1);
    this.components.Rotate.velocity.y = util.Deg2Rad(1);
    this.components.Rotate.velocity.z = util.Deg2Rad(1);
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



  

};
}]);
