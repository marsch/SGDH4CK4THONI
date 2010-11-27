var db = require('riak-js').getClient();

var triggerModel = function() { 
    
}
triggerModel.prototype =  {
    loadTriggers: function(whereObj,fn) { 
        console.log(whereObj);
        db.getAll('triggers',{where:whereObj},function(err,apps) {
            fn(err,apps);
        });
    },
    loadTrigger: function (key,fn) {
	    console.log("loading trigger:"+key);
	    db.get('triggers',key, {keys:true},function(err,trigger) {
	        if(!err) {
	           console.log("load trigger:");
	           console.log(trigger.name); 
	        }
	       fn(err,trigger);
	    });
	},
	saveTrigger: function(trigger,fn) {
	   console.log('creating trigger'+trigger.name);
	   db.save('triggers',trigger.id, trigger, function(err,trigger) {
	       if(!err) {
	           console.log("successfully stored");
	       }
	       fn(err,trigger);
	   });
	},
	removeTrigger: function(key,fn) {
	   console.log("removing trigger:"+key);
	   db.remove('triggers',key, function(err,data) {
	       if(!err) {
	           console.log("trigger:"+key+" was removed successfully");
	       }
	       fn(err,data);
	   });
	}
}

exports.triggerModel = new triggerModel();