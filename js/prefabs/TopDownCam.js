angular.module('App').factory('TopDownCam', 
['Prefab', 'util', '$q', 'input',
function(Prefab, util, $q, input){
  
return function(settings){
  Prefab.call(this);
  settings = settings || {};

  this.animator = settings.animator;
  this.camera = this.animator.camera;

  this.speed = settings.speed || 5;
  //if mouse is within border on the sides of screen, move cam
  this.borderPixelSize = 20; 

  //move direction bools
  var moveLeft = moveRight = moveTop = moveBottom = false;  
  var enabled = true;

//public methods
//-----------------------------------------------------------------------------
  this.Start = function(loader){ 
    input.AddEvent(document, 'mousemove', moveCamera.bind(this));
  }; 
//-----------------------------------------------------------------------------
  this.Update = function(deltaTime){
    if(enabled === false)
      return;

    if(moveRight)
      this.camera.position.x += this.speed * deltaTime;
    else if(moveLeft)
      this.camera.position.x -= this.speed * deltaTime;

    if(moveTop)
      this.camera.position.z -= this.speed * deltaTime;
    else if(moveBottom)
      this.camera.position.z += this.speed * deltaTime;
    
  };
//-----------------------------------------------------------------------------
  this.Toggle = function(bool){
    enabled = bool;
  };
//private methods
//-----------------------------------------------------------------------------
  function moveCamera(event){
    //left right
    if(event.pageX > this.animator.renderer.windowWidth - this.borderPixelSize){
      moveRight = true;
      moveLeft = false;
    }      
    else if (event.pageX < this.borderPixelSize){
      moveRight = false;
      moveLeft = true;
    }
    else 
      moveRight = moveLeft = false;

    
    //top bottom
    if(event.pageY > this.animator.renderer.windowHeight - this.borderPixelSize){
      moveBottom = true;
      moveTop = false;
    }      
    else if (event.pageY < this.borderPixelSize){
      moveBottom = false;
      moveTop = true;
    }
    else 
      moveBottom = moveTop = false;
    
  }
//-----------------------------------------------------------------------------

}
}]);