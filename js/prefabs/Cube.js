angular.module('App').factory('Cube', 
['Prefab', 'util', '$q',
function(Prefab, util, $q){
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

    createCubes.bind(this)(20).then(positionCubes.bind(this)); 

    //this.components.Rotate.velocity.x = util.Deg2Rad(1);
    this.components.Rotate.velocity.y = util.Deg2Rad(0.3);
    //this.components.Rotate.velocity.z = util.Deg2Rad(1);
  };

//private methods
//-----------------------------------------------------------------------------
  function createCubes(num){

    var createCubesPromise = $q.defer();  
    var cubes = [];
    var cubePromises = [];

    _.times(num, function(){
      var defer = $q.defer();  

      this.loader.LoadMesh('cube').then(function(cube){  
        
        //on load
        cube.material.materials[0].color.setHex(Math.random() * 0xffffff);

        cube.AddComponent('Rotate');
        cube.components.Rotate.velocity.x = util.Deg2Rad(Math.random());
        cube.components.Rotate.velocity.y = util.Deg2Rad(Math.random());
        cube.components.Rotate.velocity.z = util.Deg2Rad(Math.random()); 

        cubes.push(cube);
        defer.resolve();
        this.add(cube); 

      }.bind(this));//load

      cubePromises.push(defer);

    }.bind(this));//times 

    $q.all(cubePromises).then(function(){
      createCubesPromise.resolve(cubes);
    });

    return createCubesPromise.promise;

  } 
//----------------------------------------------------------------------------- 
  function positionCubes(cubesArray){
    _.each(cubesArray, function(cube, i){
        cube.position.x = this.position.x + 5 * Math.cos(util.Deg2Rad((360 / cubesArray.length) * i));
        cube.position.y = this.position.y + 5 * Math.sin(util.Deg2Rad((360 / cubesArray.length) * i));
    }.bind(this));
  }
//----------------------------------------------------------------------------- 

};
}]);
