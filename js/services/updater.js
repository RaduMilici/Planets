angular.module('App').factory("updater", ["$log", function($log){
  return {

    handlers: [],

    renderFunction: undefined,

    Add : function(h){

      this.handlers.push(h);

    },

    Remove: function(h){

      var index = this.handlers.indexOf(h);

      if (index > -1) 
        this.handlers.splice(index, 1);

    },

    ReturnIndex: function(h){

      var index = this.handlers.indexOf(h);

      if(index > -1)
        return index;
      else
        return false;
    },

    Update: function (deltaTime, passedTime) {

      _.each(this.handlers, function(h){
        h.Update(deltaTime, passedTime);
      });

    },

    ClearAll: function() {

      this.handlers = [];

    }
  };
}]);