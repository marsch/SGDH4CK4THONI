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
	    //console.log("loading user:"+key);
	    db.get('users',key, {keys:true},function(err,user) {
	        if(!err) { 
	           user.key = key; //just a nifty one
	        }
	       fn(err,user);
	    });
	}
}






exports.userModel =  new userModel();