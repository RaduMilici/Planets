angular.module('App').factory('Cube', 
['Prefab', 'util', '$q', 'Tween',
function(Prefab, util, $q, Tween){
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
    createCubes.bind(this)(1000).then(positionCubes.bind(this)); 
    this.components.Rotate.velocity.y = util.Deg2Rad(0.3);    
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
        cube.material.materials[0].color.setHex(Math.random() * 0x00003f);

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
        cube.position.x = 5 * Math.cos(util.Deg2Rad((360 / cubesArray.length) * i));
        cube.position.y = 5 * Math.sin(util.Deg2Rad((360 / cubesArray.length) * i));

        var tween = new Tween(cube.position); 

        function come(){
          tween.To({z: 0}, 2);
          tween.Start(go);
        }

        function go(){
          tween.To({z: util.Random(-5, 5)}, 2);
          tween.Start(come);
        }

        go();

    }.bind(this));
  }
//----------------------------------------------------------------------------- 

};
}]);
