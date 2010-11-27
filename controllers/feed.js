var restrict = require('../lib/restrict.js').user;

exports.init = function(app) { 
    app.get("/feed",restrict.toLoggedInUser, showFeedPage);
    app.post("/feed",restrict.toLoggedInUser, createPost);
}
    
function showFeedPage(req,res,next) {
    console.log("User:"+req.user.name);      
    var options = options || {};
    options.locals = options.locals || {};
    options.locals['user'] = req.user;  
    res.render("feed/feed",{'locals':{'user':req.user}});
}
function createPost(req,res,next) {
    console.log("do post");
    console.log(req.body);
    res.redirect("/feed");
}
function addUserPage(req,res,next) {
    console.log("addUserPage"); 
}