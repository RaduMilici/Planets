angular.module('App').factory('Loader', ['$q', 'paths', function($q, paths){
return function(settings){
  settings = settings || {};

//public fields
  this.scene = new THREE.Scene();

//private fields
  var jsonLoader = new THREE.JSONLoader();

//public methods
//-----------------------------------------------------------------------------
  this.Load = function(name){
    //returns a promise that is resolved on load
    var defer = $q.defer();

    jsonLoader.load( paths.models + '/' + name + '.js', function(geometry, materials){

      //on load
      var material = new THREE.MultiMaterial( materials );
      defer.resolve(new THREE.Mesh( geometry, material ));

    });

    return defer.promise;
  };
//-----------------------------------------------------------------------------
  this.Add = function(obj){

    this.scene.add(obj);

  };
//-----------------------------------------------------------------------------
  this.Remove = function(obj){

    this.scene.remove(obj);
    
  };
//-----------------------------------------------------------------------------

};
}]);
