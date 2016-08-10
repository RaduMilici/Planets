angular.module('App').factory('Injector', ['$q', '$injector', 'paths', 'updater',
function($q, $injector, paths, updater){
  
	return function(loader){

//public fields
  	this.loader = loader;

//private fields

//public methods
//-----------------------------------------------------------------------------
  	this.LoadPrefab = function(name, position){ 

    	var defer = $q.defer();
    //constructor
    	var InjectedPrefab = inject(name);
    //instantiated
    	var obj = new THREE.Object3D();
    	var prefab = new InjectedPrefab();
    //assign all THREE.Object3D properties
    	prefab = _.extend(new THREE.Object3D(), prefab);
    //load mesh dependencies
    	loadMeshes.bind(this)(prefab)
    //load component dependencies
      .then(loadComponents.bind(this))
    //add to scene and call Start()
      .then(function(){
        	prefab.loader = this.loader;
        	defer.resolve(prefab);
      }.bind(this));

    	return defer.promise;

  };
//-----------------------------------------------------------------------------
  	this.AddComponent = function(prefab, componentName){

    	var injectedComponent = inject(componentName);
    	prefab.components[componentName] = new injectedComponent();
    	prefab.components[componentName].prefab = prefab;
    	updater.Add(prefab.components[componentName]);

  };
//private methods
//-----------------------------------------------------------------------------
  function inject(name){

    	return $injector.get(name);

  }
//-----------------------------------------------------------------------------
  	function loadMeshes(prefab){  

    	var defer = $q.defer();
    	var meshPromises = [];
    	var loadedMeshes = {};

    //request to load each mesh dependency
    	_.each(prefab.meshes, function(meshName){

      	var promise = this.loader.LoadMesh(meshName);

      	promise.then(function(loadedMesh){

        	loadedMeshes[meshName] = loadedMesh;
        	prefab.add(loadedMesh);

      });

      	meshPromises.push(promise);

    }.bind(this));//end each

    //all loaded
    	$q.all(meshPromises).then(function () { 

      	prefab.meshes = loadedMeshes;
      	defer.resolve(prefab);

    });

    	return defer.promise;

  }
//-----------------------------------------------------------------------------
  	function loadComponents(prefab){

    	var defer = $q.defer();

    	_.each(prefab.components, function(componentName){

      	this.AddComponent(prefab, componentName);

    }.bind(this));//end each

    	defer.resolve();
    	return defer.promise;
  }
//-----------------------------------------------------------------------------

};
}]);
