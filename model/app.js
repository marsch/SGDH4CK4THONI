var db = require('riak-js').getClient();



var appModel = function() { 
    
}
appModel.prototype =  {
    loadApps: function(whereObj,fn) { 
        db.getAll('apps',{where:whereObj},function(err,apps) {
            fn(err,apps);
        });
    },
	loadApp: function (key,fn) {
	    console.log("loading app:"+key);
	    db.get('apps',key, {keys:true},function(err,app) {
	        if(!err) {
	           console.log("load app:");
	           console.log(app.name); 
	        }
	       fn(err,app);
	    });
	},
	saveApp: function(app,fn) {
	   console.log('creating app'+app.name);
	   db.save('apps',app.id,app, function(err,app) {
	       if(!err) {
	           console.log("successfully stored");
	       }
	       fn(err,app);
	   });
	},
	removeApp: function(key,fn) {
	   console.log("removing app:"+key);
	   db.remove('apps',key, function(err,data) {
	       if(!err) {
	           console.log("app:"+key+" was removed successfully");
	       }
	       fn(err,data);
	   });
	}
}






exports.appModel =  new appModel();