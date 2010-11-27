var restrict = require('../lib/restrict.js').user;

exports.init = function(app) { 
    app.get("/user",restrict.toLoggedInUser, profilePage);
    
}
    
function profilePage(req,res,next) {
   // console.log("User:"+req.user.name);  
    var options = options || {};
    options.locals = options.locals || {};
    options.locals['user'] = req.user; 
    res.render("user/index",options);
}
function addUserPage(req,res,next) {
    console.log("addUserPage");
    var options = options || {};
    options.locals = options.locals || {};
    options.locals['user'] = req.user;
    res.render("user/add",options);
}