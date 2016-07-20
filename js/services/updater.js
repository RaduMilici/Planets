angular.module('App').factory("updater", ["$log", function($log){
  return {

    handlers: [],

    renderFunction: undefined,

    Add : function(h){

      this.handlers.push(h);

    },

    Remove: function(h){

      var index = this.handlers.indexOf(h);

      if(index > -1) this.handlers.splice(index, 1);

    },

    ReturnIndex: function(h){

      var index = this.handlers.indexOf(h);

      if(index > -1)
        return index;
      else
        return false;
    },

    Update: function (frame) {

      for (var i = 0; i < this.handlers.length; i++) 
        this.handlers[i].Update(frame);
      
      //this.renderFunction();

    },

    ClearAll: function() {

      this.handlers = [];

    }
  };
}]);