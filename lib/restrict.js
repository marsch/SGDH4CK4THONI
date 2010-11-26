
var userModel = require('../model/user').userModel;

var userRestrictions = function() {

}
userRestrictions.prototype = {
    toLoggedInUser: function(req,res,next) {
        if(req.session.user_id) { 
            userModel.loadUser(req.session.user_id,function(err,user) { 
                req.user = user;
                next(err,user);
            });
        }
        else {
	        req.session.error = 'No active user session found. '
	            + ' Please login.'; 
	        res.redirect('/login');
        }
    },
    toPermission: function(perm) {
        return function (req, res, next) {
            console.log("checking for perm:"+perm);
            for (var i in req.user.permissions) {
                if(req.user.permissions[i] == perm) {
                    console.log("okay");
                    next();
                    return true;
                }
            }
            console.log("not found so access denied");
            req.session.error = "Access denied";
            res.redirect('/');
            //next(new Error('Unauthorized'));
        }
    
    }
}

exports.user = new userRestrictions();