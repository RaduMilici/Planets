angular.module('App').factory('Loader', 
['$q', '$http', 'Injector', 'paths', 'Prefab', 
function($q, $http, Injector, paths, Prefab){
return function(name){

//public fields
  this.scene = new THREE.Scene();
  this.injector = new Injector(this);

//private fields
  var jsonLoader = new THREE.JSONLoader();
  var loadedMeshes = {};

  loadProject.bind(this)(name);


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
  this.LoadPrefab = function(name, position){

    var defer = $q.defer();

    this.injector.LoadPrefab(name).then(function(prefab){
      prefab.position.set(position.x, position.y, position.z);
      this.Add(prefab);
      prefab.Start(this);
      defer.resolve(prefab);
    }.bind(this));

    return defer.promise;
    
  };
//-----------------------------------------------------------------------------
  this.LoadPrefabs = function(prefabsArray){

    var defer = $q.defer();
    var promises = [];

    //request to load each mesh dependency
    _.each(prefabsArray, function(prefab){
      var promise = this.LoadPrefab(prefab.name, prefab.position);

      promise.then(function(loadedPrefab){
        
      });

      promises.push(promise);

    }.bind(this));//end each

    //all loaded
    $q.all(promises).then(function () { 
      defer.resolve();
    });

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
  function loadProject (name){
    $http.get(paths.projects + '/' + name + '.json')

      .success(function(data){
        this.LoadPrefabs(data.prefabs);
      }.bind(this))

      .error(function(){
        console.error('could not read project ' + name);
      })
    
  };
//-----------------------------------------------------------------------------
};
}]);
