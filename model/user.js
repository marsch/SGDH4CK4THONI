var db = require('riak-js').getClient();

var userModel = function() { 
    
}
userModel.prototype =  {
    loadUsers: function(whereObj,fn) { 
        db.getAll('users',{where:whereObj},function(err,users) {
            fn(err,users);
        });
	},
	loadUser: function (key,fn) {
	    console.log("loading user:"+key);
	    db.get('users',key, {keys:true},function(err,user) {
	        if(!err) { 
	           user.key = key; //just a nifty one
	        }
	       fn(err,user);
	    });
	},
	saveUser: function(user,fn) {
	   console.log('creating user'+user.name);
	   db.save('users',user.id,user, function(err,user) {
	       if(!err) {
	           console.log("successfully stored");
	       }
	       fn(err,user);
	   });
	},
	removeUser: function(key,fn) {
	   console.log("removing user:"+key);
	   db.remove('users',key, function(err,data) {
	       if(!err) {
	           console.log("user:"+key+" was removed successfully");
	       }
	       fn(err,data);
	   });
	}
}

exports.userModel =  new userModel();