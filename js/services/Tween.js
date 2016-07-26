angular.module('App').factory('Tween', ['updater', function(updater){
return function(obj){ 

//public fields

//private fields
var tweenTime;
var currentTime = 0;
var propertyNames;
var object = obj;
var tweenTo = {};
var onComplete = function(){};

//public methods
//-----------------------------------------------------------------------------
  this.To = function(properties, time){

    propertyNames = _.keys(properties);
    tweenTime = time;

    _.each(propertyNames, function(name){

      tweenTo[name] = {
        perSecond: getPerSecondValues(properties, name)
      };

    });

  };
//-----------------------------------------------------------------------------
  this.Update = function(deltaTime, passedTime){

    if(checkDone.bind(this)(passedTime))
      return;

    _.each(propertyNames, function(name){
      object[name] += tweenTo[name].perSecond * (passedTime / 1000);
    });
    
  };
//-----------------------------------------------------------------------------
  this.Start = function(onComp){
    onComplete = onComp || function(){};
    updater.Add(this);
  };
//private methods
//-----------------------------------------------------------------------------
  function getPerSecondValues(properties, name){

    var from = object[name];
    var to = properties[name];

    return (to - from) / tweenTime;

  }
//-----------------------------------------------------------------------------
  function checkDone(passedTime){


    if((currentTime += passedTime) > tweenTime * 1000){
      onComplete();
      updater.Remove(this);
      currentTime = 0;
      return true;
    }
    else 
      return false;      

  }
//-----------------------------------------------------------------------------
};
}]);
