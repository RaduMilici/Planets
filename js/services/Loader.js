angular.module('App').factory('Loader', 
['$q', 'Injector', 'paths', 'Prefab', 
function($q, Injector, paths, Prefab){
return function(settings){
  settings = settings || {};

//public fields
  this.scene = new THREE.Scene();
  this.injector = new Injector(this);

//private fields
  var jsonLoader = new THREE.JSONLoader();
  var loadedMeshes = {};

//public methods
//-----------------------------------------------------------------------------
  this.LoadMesh = function(name){  

    //returns a promise that is resolved on load
    var defer = $q.defer();
 
    //check if mesh already loaded once
    if(loadedMeshes[name] !== undefined){

      var clone = new THREE.Mesh(loadedMeshes[name].geometry.clone(), loadedMeshes[name].material.clone());
      defer.resolve(extendMeshToPrefab.bind(this)(clone));

    }
    else   
    //mesh not already loaded
    jsonLoader.load( paths.models + '/' + name + '.json', function(geometry, materials){

      //on load
      var material = new THREE.MultiMaterial( materials );
      var mesh = new THREE.Mesh( geometry, material );

      defer.resolve(extendMeshToPrefab.bind(this)(mesh));

      //store mesh so its only loaded once
      loadedMeshes[name] = mesh;

      defer.resolve(mesh);

    }.bind(this));

    return defer.promise;
  };
//-----------------------------------------------------------------------------
  this.LoadPrefab = function(name){

    var defer = $q.defer();

    this.injector.LoadPrefab(name).then(function(prefab){
      this.Add(prefab);
      defer.resolve(prefab);
    }.bind(this));

    return defer.promise;
    
  };
//-----------------------------------------------------------------------------
  this.Add = function(obj, parent){
    
    parent = parent || this.scene;

    parent.add(obj);

  };
//-----------------------------------------------------------------------------
  this.Remove = function(obj){

    this.scene.remove(obj);
    
  };
//private methods
//-----------------------------------------------------------------------------
  function extendMeshToPrefab(mesh){
    mesh.loader = this;
    return _.extend(mesh, new Prefab());
  }
//-----------------------------------------------------------------------------

};
}]);
