

var userauth = require('../lib/userauth');
exports.init = function(app) { 
    app.get("/login", showLogin);
    app.get("/forgot", showForgot);
    app.get("/logout", doLogout);
    app.post("/login", doLogin);
}




function showLogin(req, res){ 
    res.render('auth/login',{'layout':'splash_layout'});
}
function showForgot(req,res) {
    res.render('auth/forgot',{'layout':'splash_layout'});
}
function doLogin(req,res) {
	userauth.authenticate(req.body.username, req.body.password, function(err, user){
	    if (user) {
	        console.log("user:"+user.name+" logged in");
	        // Regenerate session when signing in
	        // to prevent fixation 
	        req.session.regenerate(function(){
	            // Store the user's primary key 
	            // in the session store to be retrieved,
	            // or in this case the entire user object
	            req.user = user;
	            req.session.user_id = user.key; 
	            res.redirect('/');
	        });
	    } else {
	        req.session.error = 'Authentication failed, please check your '
	            + ' username and password.';
	        res.redirect('back');
	    }
	});
}
function doLogout(req,res) {
    // destroy the user's session to log them out
    // will be re-created next request
    req.session.destroy(function(){
        res.redirect('home');
    });
}