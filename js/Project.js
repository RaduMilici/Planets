angular.module('App').factory('Project', ['Animate', 'Loader', function(Animate, Loader){
return function(){

//public fields
  this.loader = new Loader();
  this.animate = new Animate({project: this});

  this.animate.Start();

};
}]);
