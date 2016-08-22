angular.module('App').factory('TopDownCam', 
['Prefab', 'util', '$q', 'input',
function(Prefab, util, $q, input){
  
return function(settings){
  Prefab.call(this);
  settings = settings || {};

  this.animator = settings.animator;
  this.camera = this.animator.camera;
  this.target = new THREE.Object3D();
  this.grid = settings.grid;

  var speed = settings.speed || 15;
  var height = 15;
  var angle = 70;
  //if mouse is within border on the sides of screen, move cam
  var borderPixelSize = 20; 


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
    this.add(this.target);  
    setPositions.bind(this)(); 
    input.AddEvent(document, 'mousemove', checkMouse.bind(this));
  }; 
//-----------------------------------------------------------------------------
  this.Update = function(deltaTime){
    if(enabled === false)
      return;

    var val = speed * deltaTime;

    if(checkLimits.bind(this)('right', val))
      moveCamera.bind(this)('x', val);
    else if(checkLimits.bind(this)('left', val))
      moveCamera.bind(this)('x', -val);

    if(checkLimits.bind(this)('top', val))
      moveCamera.bind(this)('z', -val);
    else if(checkLimits.bind(this)('bottom', val))
      moveCamera.bind(this)('z', val);
    
  };
//-----------------------------------------------------------------------------
  this.Toggle = function(bool){
    enabled = bool;
  };
//private methods
//-----------------------------------------------------------------------------
  function checkMouse(event){
    //left right
    if(event.pageX > this.animator.renderer.windowWidth - borderPixelSize){
      move.right = true;
      move.left = false;
    }      
    else if (event.pageX < borderPixelSize){
      move.right = false;
      move.left = true;
    }
    else 
      move.right = move.left = false;

    
    //top bottom
    if(event.pageY > this.animator.renderer.windowHeight - borderPixelSize){
      move.bottom = true;
      move.top = false;
    }      
    else if (event.pageY < borderPixelSize){
      move.bottom = false;
      move.top = true;
    }
    else 
      move.bottom = move.top = false;
    
  }
//-----------------------------------------------------------------------------
  function checkLimits(dir, val) {
    if(move[dir] === false) 
      return false;

    switch (dir){
      case 'right':
        return this.target.position.x + val < limits.right;
      case 'left':
        return this.target.position.x - val > limits.left;
      case 'top':
        return this.target.position.z + val > limits.top;
      case 'bottom':
        return this.target.position.z - val < limits.bottom;
      default:
        return false;
    }
  }
//-----------------------------------------------------------------------------
  function setPositions(pos){
    pos = pos || new THREE.Vector3();

    this.target.position.set(pos.x, 0, pos.z);
    this.camera.position.copy(pos);

    this.camera.position.z = height * Math.cos(util.Deg2Rad(angle));
    this.camera.position.y = height * Math.sin(util.Deg2Rad(angle));
    
    this.camera.lookAt(this.target.position);
  }
//-----------------------------------------------------------------------------
  function moveCamera(axis, val){
    this.target.position[axis] += val;
    this.camera.position[axis] += val;
    this.camera.lookAt(this.target.position);
  }
//-----------------------------------------------------------------------------
}
}]);