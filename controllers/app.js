exports.init = function(app) { 
   app.get("/", home);
}
    
function home(req,res,next) {
    console.log("HOME");
    if(req.session.user_id) {
          res.redirect('/feedPage');
    }
    else
    {
        res.redirect('/login');
    }
   
}