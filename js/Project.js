angular.module('App').factory('Project', 
['Loader', 'Animator', 
function(Loader, Animator){
  
return function(name){

//public fields
  this.loader = new Loader(name);
  this.animate = new Animator({project: this});
  this.animate.Start(); 

};
}]);
