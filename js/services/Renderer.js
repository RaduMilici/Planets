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
