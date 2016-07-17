var App = angular.module("App", []);
App.factory('Project', ['Animate', function(Animate){
return function(){

//public fields
  this.animate = new Animate();
  this.loader = undefined;  

};
}]);

App.factory('comp1', [function(){
    return function(){

    };
}]);

App.factory('cont1', [function(){
    return function(){

    };
}]);

App.factory('Animate', ['Renderer', function(Renderer){
return function(settings){
  
  settings     = settings || {};
//public fields
  this.camFov  = settings.camFov  || 45;
  this.camNear = settings.camNear || 1;
  this.camFar  = settings.camFar  || 1000;

  this.renderer = new Renderer();
  this.camera   = makeCamera();
  this.controls = undefined;

  makeCamera.bind(this)();

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

App.factory('Renderer', [function(){
return function(settings){

  settings = settings || {};
//public fields
  this.container = getContainer(settings.containerID || 'WebGL');
  this.width = $(this.container).outerWidth();
  this.height = $(this.container).outerHeight();
  this.renderer = makeRenderer(this.width, this.height);

//private fields
  var frameID = undefined;

//public methods
//-----------------------------------------------------------------------------
  this.Render = function(){
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
    return renderer;
  }
//-----------------------------------------------------------------------------

};
}]);
