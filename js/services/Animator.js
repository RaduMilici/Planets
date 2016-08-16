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
  this.camera.position.y = 20;
  this.camera.lookAt(new THREE.Vector3(0, 0, 0));
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
