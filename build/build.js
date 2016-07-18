var app = angular.module('App', ['ui.router'])

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
  //urls
  var partialsUrl   = '/partials'; 
  var templatesUrl  = partialsUrl + '/templates';
  var directivesUrl = partialsUrl + '/directives';

  //for any unmatched url, redirect to /main
  $urlRouterProvider.otherwise("/main");

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

angular.module('App').factory('Project', ['Animate', 'Loader', function(Animate, Loader){
return function(){

//public fields
  this.loader = new Loader();
  this.animate = new Animate({project: this});

  this.animate.Start();

};
}]);

angular.module('App').factory('comp1', [function(){
    return function(){  

    };
}]);

angular.module('App').controller('mainCtrl', ['$scope', 'Project', function($scope, Project){  

  new Project();
  
}]);
    
angular.module('App').factory('Prefab', [function(){
return function(){

  THREE.Object3D.call(this);

//public fields
  this.name  = '';
  this.id    = '';
  this.layer = '';
  this.models = [];
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



  

};
}]);

angular.module('App').factory('Animate', ['Renderer', function(Renderer){
return function(settings){
  settings     = settings || {};
//public fields
  this.project = settings.project;
  this.camFov  = settings.camFov  || 45;
  this.camNear = settings.camNear || 1;
  this.camFar  = settings.camFar  || 1000;

  this.renderer = new Renderer({project: this.project});
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

angular.module('App').factory('Loader', ['$q', 'paths', function($q, paths){
return function(settings){
  settings = settings || {};

//public fields
  this.scene = new THREE.Scene();

//private fields
  var jsonLoader = new THREE.JSONLoader();

//public methods
//-----------------------------------------------------------------------------
  this.Load = function(name){
    //returns a promise that is resolved on load
    var defer = $q.defer();

    jsonLoader.load( paths.models + '/' + name + '.js', function(geometry, materials){

      //on load
      var material = new THREE.MultiMaterial( materials );
      defer.resolve(new THREE.Mesh( geometry, material ));

    });

    return defer.promise;
  };
//-----------------------------------------------------------------------------
  this.Add = function(obj){

    this.scene.add(obj);

  };
//-----------------------------------------------------------------------------
  this.Remove = function(obj){

    this.scene.remove(obj);
    
  };
//-----------------------------------------------------------------------------

};
}]);

angular.module('App').factory('Renderer', [function(){
return function(settings){

  settings = settings || {};
//public fields
  this.project = settings.project;
  this.container = getContainer(settings.containerID || 'WebGL');
  this.width = $(this.container).outerWidth();
  this.height = $(this.container).outerHeight();
  this.renderer = makeRenderer.bind(this)(this.width, this.height);
 
//private fields
  var frameID = undefined;
  
//public methods
//-----------------------------------------------------------------------------
  this.Render = function(){

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

  this.assets = './assets';
  this.models = this.assets + '/models';
  
})();
}]);
