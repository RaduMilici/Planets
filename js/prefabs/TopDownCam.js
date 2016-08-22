angular.module('App').factory('TopDownCam', 
['Prefab', 'util', '$q', 'input',
function(Prefab, util, $q, input){
  
return function(settings){
  Prefab.call(this);
  settings = settings || {};

  this.animator = settings.animator;
  this.camera = this.animator.camera;
  this.grid = settings.grid;

  this.speed = settings.speed || 15;
  //if mouse is within border on the sides of screen, move cam
  this.borderPixelSize = 20; 


  var enabled = true;
  //move direction limits
  var limits = {
    left: 0,
    right: this.grid.size.width * this.grid.hexWidth,
    top: 0,
    bottom: this.grid.size.height * this.grid.hexHeight
  };
  //move direction bools
  var move = {
    left: false,
    right: false,
    top: false,
    bottom: false
  };

//public methods
//-----------------------------------------------------------------------------
  this.Start = function(loader){ 
    input.AddEvent(document, 'mousemove', checkMouse.bind(this));
  }; 
//-----------------------------------------------------------------------------
  this.Update = function(deltaTime){
    if(enabled === false)
      return;

    var val = this.speed * deltaTime;

    if(checkLimits.bind(this)('right', val))
      this.camera.position.x += val;
    else if(checkLimits.bind(this)('left', val))
      this.camera.position.x -= val;

    if(checkLimits.bind(this)('top', val))
      this.camera.position.z -= val;
    else if(checkLimits.bind(this)('bottom', val))
      this.camera.position.z += val;
    
  };
//-----------------------------------------------------------------------------
  this.Toggle = function(bool){
    enabled = bool;
  };
//private methods
//-----------------------------------------------------------------------------
  function checkMouse(event){
    //left right
    if(event.pageX > this.animator.renderer.windowWidth - this.borderPixelSize){
      move.right = true;
      move.left = false;
    }      
    else if (event.pageX < this.borderPixelSize){
      move.right = false;
      move.left = true;
    }
    else 
      move.right = move.left = false;

    
    //top bottom
    if(event.pageY > this.animator.renderer.windowHeight - this.borderPixelSize){
      move.bottom = true;
      move.top = false;
    }      
    else if (event.pageY < this.borderPixelSize){
      move.bottom = false;
      move.top = true;
    }
    else 
      move.bottom = move.top = false;
    
  }
//-----------------------------------------------------------------------------
  function checkLimits(direction, val) {
    if(move[direction] === false) 
      return false;

    switch (direction){
      case 'right':
        return this.camera.position.x + val < limits.right;
      case 'left':
        return this.camera.position.x - val > limits.left;
      case 'top':
        return this.camera.position.z + val > limits.top;
      case 'bottom':
        return this.camera.position.z - val < limits.bottom;
      default:
        return false;
    }
  }
//-----------------------------------------------------------------------------

}
}]);