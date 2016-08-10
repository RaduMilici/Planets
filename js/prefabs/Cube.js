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

//public methods
//-----------------------------------------------------------------------------
  this.Start = function(loader){

    createCubes.bind(this)(40).then(positionCubes.bind(this)); 

    this.components.Rotate.velocity.x = 
    this.components.Rotate.velocity.y = 
    this.components.Rotate.velocity.z = util.Deg2Rad(0.3); 
    
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
        cube.material.materials[0].color.setHex(Math.random() * 0x0000ff);

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

    //all cubes loaded
    $q.all(cubePromises).then(function(){
      createCubesPromise.resolve(cubes);
    });

    return createCubesPromise.promise;

  } 
//----------------------------------------------------------------------------- 
  function positionCubes(cubesArray){
    //positions bubes around parent in a circle
    _.each(cubesArray, function(cube, i){

        var radius = 10;
        cube.position.x = radius * Math.cos(util.Deg2Rad((360 / cubesArray.length) * i));
        cube.position.y = radius * Math.sin(util.Deg2Rad((360 / cubesArray.length) * i));

    }.bind(this));
  }
//----------------------------------------------------------------------------- 

};
}]);
