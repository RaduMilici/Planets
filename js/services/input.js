angular.module('App').factory('input', [function(){
return new (function(){
//-----------------------------------------------------------------------------
  this.AddEvent = function(selector, type, callback){
    $(selector)[type](callback);
  };
//-----------------------------------------------------------------------------
  
})();
}]);
