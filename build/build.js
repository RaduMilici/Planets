angular.module('App', ['ui.router'])

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
  //urls
  var partialsUrl   = '/partials'; 
  var templatesUrl  = partialsUrl + '/templates';
  var directivesUrl = partialsUrl + '/directives';

  //for any unmatched url, redirect to /main
  $urlRouterProvider.otherwise('/main');

  //states
  $stateProvider 
    //main
    .state('main', {
      url: '/main',
      templateUrl: templatesUrl + '/main.html',
      controller: 'mainCtrl' 
    })

  //$stateProvider.
}]);

angular.module('App').factory('Project', 
['Loader', 'Animator', 
function(Loader, Animator){
  
return function(name){

//public fields
  this.loader = new Loader(name);
  this.animate = new Animator({project: this});
  this.animate.Start(); 

};
}]);

angular.module('App').factory('Component', [function(){
return function(){

//public fields
  this.name  = '';
  this.meshes = [];

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

};
}]);

angular.module('App').factory('Rotate', ['Component', function(Component){
return function(){ 
  
  Component.call(this);

//public fields
  this.velocity = new THREE.Vector3();

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

angular.module('App').controller('mainCtrl', ['$scope', 'Project', function($scope, Project){  

  new Project('testProject');
   
}]);
    
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

    createCubes.bind(this)(100).then(positionCubes.bind(this)); 
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

angular.module('App').factory('Animator', ['Renderer', function(Renderer){
return function(settings){
  
  settings     = settings || {};
//public fields
  this.project = settings.project;
  this.camFov  = settings.camFov  || 45;
  this.camNear = settings.camNear || 1;
  this.camFar  = settings.camFar  || 1000;
 
  this.renderer = new Renderer({ project: this.project, containerID: 'WebGL' });
  this.camera   = makeCamera.bind(this)();
  this.controls = undefined;   

//public methods 
//-----------------------------------------------------------------------------
  this.Start = function(){  

    this.renderer.Render();

  }; 
//private methods
//-----------------------------------------------------------------------------
  function makeCamera(){  

    return new THREE.PerspectiveCamera(this.camFov, this.renderer.width / this.renderer.height, this.camNear, this.camFar);   
     
  }
//-----------------------------------------------------------------------------

};
}]);

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

angular.module('App').factory('Renderer', ['updater', function(updater){
return function(settings){

  settings = settings || {};
//public fields
  this.project = settings.project;
  this.container = getContainer(settings.containerID || 'WebGL');
  this.width = $(this.container).outerWidth();
  this.height = $(this.container).outerHeight();
  this.renderer = makeRenderer.bind(this)(this.width, this.height);
 
//private fields
  var frameID;
  var passedTime;
  var deltaTime;
  var now = _.now();
  var currentTime = now;
  var fps = 60;
  var interval = 1000 / fps;  
  
//public methods
//-----------------------------------------------------------------------------
  this.Render = function(time){ 

    now = _.now();
    passedTime = now - currentTime;
    deltaTime = passedTime / interval;
    currentTime = now;

    updater.Update(deltaTime, passedTime);
    this.renderer.render(this.project.loader.scene, this.project.animate.camera);
    frameID = requestAnimationFrame( this.Render.bind(this) );  

  };
//private methods
//-----------------------------------------------------------------------------
  function getContainer(containerID){

    try {
      var container = $("#" + containerID);

      if(container.length === 0)
        throw("could not find container with ID " + containerID);
      else
        return container;
    }
    catch(err) {
      console.error(err);
    }   
     
  }
//-----------------------------------------------------------------------------
  function makeRenderer(width, height){

    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    $(this.container).append(renderer.domElement);
    return renderer;
    
  }
//-----------------------------------------------------------------------------

};
}]);

angular.module('App').factory('paths', [function(){
return new (function(){

  this.js = './js';
  this.prefabs = this.js + '/prefabs';
//assets
//-----------------------------------------------------------------------------
  this.assets = './assets';
  this.models = this.assets + '/models';
  this.projects = this.assets + '/projects';
  
})();
}]);

angular.module('App').factory("updater", ["$log", function($log){
  return {

    handlers: [],

    renderFunction: undefined,

    Add : function(h){

      this.handlers.push(h);

    },

    Remove: function(h){

      var index = this.handlers.indexOf(h);

      if (index > -1) 
        this.handlers.splice(index, 1);

    },

    ReturnIndex: function(h){

      var index = this.handlers.indexOf(h);

      if(index > -1)
        return index;
      else
        return false;
    },

    Update: function (deltaTime, passedTime) {

      _.each(this.handlers, function(h){
        h.Update(deltaTime, passedTime);
      });

    },

    ClearAll: function() {

      this.handlers = [];

    }
  };
}]);
angular.module('App').factory('util', [function(){
return new (function(){

//public methods
//-----------------------------------------------------------------------------
  this.Deg2Rad = function(deg){

    return deg * ( Math.PI / 180 );

  };
//-----------------------------------------------------------------------------
  this.Rad2Deg = function(rad){

    return rad * ( 180 / Math.PI );

  };
//-----------------------------------------------------------------------------
  this.RandomNumber = function ( min, max ) {
 
    return Math.floor( Math.random() * (max - min + 1 ) + min );

  }
//-----------------------------------------------------------------------------
  
})();
}]);

angular.module('App').factory('Shader', [function(){
return function(){

  

};
}]);
