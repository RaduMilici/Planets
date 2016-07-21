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
  var currentTime = 0;
  var fps = 60;
  var interval = 1000 / fps;  
  
//public methods
//-----------------------------------------------------------------------------
  this.Render = function(time){

    passedTime = time - currentTime;
    deltaTime = passedTime / interval;
    currentTime = time;

    updater.Update(deltaTime);
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
