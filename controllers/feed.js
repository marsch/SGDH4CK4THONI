var restrict = require('../lib/restrict.js').user;
var feedModel = require('../model/feed.js').feedModel;

exports.init = function(app) { 
    app.get("/feedPage",restrict.toLoggedInUser, showFeedPage);
    app.get("/feed",restrict.toLoggedInUser, getFeed);
    app.post("/feed",restrict.toLoggedInUser, createPost);
}
    
function showFeedPage(req,res,next) {
    console.log("User:"+req.user.name);      
    var options = options || {};
    options.locals = options.locals || {};
    options.locals['user'] = req.user;  
    res.render("feed/feedPage",{'locals':{'user':req.user}});
}
function getFeed(req,res,next) {
    feedModel.loadPosts({}, function(err,posts){
        if(!err) {
            var ret = [];
            for (var i in posts) {
                ret.push(posts[i].data);
            }
            res.send(ret);
        }
        else {
            req.session.error = err;
            new Error("something went wrong");
        }
    });
    console.log("GETTING....FEEEeeedd");
}
function createPost(req,res,next) {
    console.log("do post");
    console.log(req.body);
    var post = {};
    var data = new Date();
    var type = req.body.type || 'user_trigger';
    if (type == 'user_trigger') {
	    post.text = req.body.text;
	    post.data = {};
	    post.data.users = req.body.users.split(',');
	    post.data.triggers = req.body.triggers.split(',');
	    post.uid = req.user.key; //id
	    post.from = req.user.name;
	    post.id = Math.uuid();
	    post.created = new Date().getTime();
	    post.updated = new Date().getTime();
	    post.type = type; //secure this
	    
	    //get from database
	    post.xp = 55;
    }
    
    console.log(post);
    feedModel.createPost(post, function (err,data) {
        if(!err) {
            
        }
        else {
            req.session.error = err;
        }
        res.redirect("/feedPage");
    });
    
}
function addUserPage(req,res,next) {
    console.log("addUserPage"); 
}