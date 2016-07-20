angular.module('App').factory('Project', 
['Loader', 'Animator', 
function(Loader, Animator){
return function(){

//public fields
  this.loader = new Loader();
  this.animate = new Animator({project: this});

  this.loader.LoadPrefab('Cube');

  /*this.loader.Load('cube').then(function(obj){
    console.log(obj)
    obj.material = new THREE.MeshBasicMaterial({side: 2, color: 0xff0000});
    obj.position.z -= 5;
    this.loader.Add(obj);
  }.bind(this));*/

  this.animate.Start();

};
}]);
