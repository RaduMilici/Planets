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
  this.Random = function ( min, max ) {

    return Math.floor( Math.random() * (max - min + 1 ) + min );

  }
//-----------------------------------------------------------------------------
  
})();
}]);
