var restrict = require('../lib/restrict.js').user;

exports.init = function(app) { 
    app.get("/user",restrict.toLoggedInUser, profilePage);
    app.get("/user/add",restrict.toLoggedInUser,restrict.toPermission('add_user'),addUserPage);
}
    
function profilePage(req,res,next) {
   // console.log("User:"+req.user.name);  
    var options = options || {};
    options.locals = options.locals || {};
    options.locals['user'] = req.user; 
    res.render("user/index",options);
}
function addUserPage(req,res,next) {
    //console.log("addUserPage"); 
}