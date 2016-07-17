App.factory('Project', ['Animate', function(Animate){
return function(){

//public fields
  this.animate = new Animate();
  this.loader = undefined;  

};
}]);
