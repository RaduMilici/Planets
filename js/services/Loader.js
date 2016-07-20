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

    jsonLoader.load( paths.models + '/' + name + '.json', function(geometry, materials){

      //on load
      var material = new THREE.MultiMaterial( materials );
      var mesh = new THREE.Mesh( geometry, material );
      mesh.loader = this;
      mesh = _.extend(mesh, new Prefab());

      //TODO: store mesh so its only loaded once

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
//-----------------------------------------------------------------------------

};
}]);
