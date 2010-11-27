var db = require('riak-js').getClient();



var feedModel = function() { 
    
}
feedModel.prototype =  {
    loadPosts: function(whereObj,fn) {  
        db.getAll('feed',{where:whereObj},function(err,myposts) {
            fn(err,myposts);
        });
    },
	createPost: function(post,fn) {
	   console.log('creating post'+post.name);
	   db.save('feed',post.id,post, function(err,mypost) {
	       if(!err) {
	           console.log("successfully stored");
	       }
	       fn(err,mypost);
	   });
	}
}






exports.feedModel =  new feedModel();