angular.module('App').factory('Project', 
['Loader', 'Animator', 'Map',
function(Loader, Animator, Map){
  
return function(name){

//public fields
  this.loader = new Loader(name);
  this.animator = new Animator({project: this});
  new Map({project: this});
  this.animator.Start(); 

};
}]);
