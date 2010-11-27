var restrict = require('../lib/restrict.js').user;
var appModel = require('../model/app.js').appModel;
var userModel = require('../model/user.js').appModel;
var crypto = require('crypto');
var db = require('riak-js').getClient();

function md5(str) {
    return crypto.createHash('md5').update(str).digest('hex');
}


exports.init = function(app) { 
    app.get("/admin",restrict.toLoggedInUser,restrict.toPermission('add_applications'), showAdminPage); 
    app.get("/admin/apps/search",restrict.toLoggedInUser,restrict.toPermission('add_applications'), getAppList);
    app.get("/admin/users/search",restrict.toLoggedInUser,restrict.toPermission('add_applications'), getUserList);
    app.get("/admin/status/search",restrict.toLoggedInUser,restrict.toPermission('add_applications'), getStatusList);
    
    app.get("/admin/apps/show/:id",restrict.toLoggedInUser,restrict.toPermission('add_applications'), getShowApp);
    
    app.get("/admin/apps/create", restrict.toLoggedInUser, restrict.toPermission('add_applications'), getCreateApp);
    app.post("/admin/apps/create", restrict.toLoggedInUser, restrict.toPermission('add_applications'), doCreateApp);
    app.get("/admin/apps/delete/:id", restrict.toLoggedInUser, restrict.toPermission('add_applications'), getDeleteApp);
    
    app.get("/admin/users/create",restrict.toLoggedInUser, /*restrict.toPermission('add_application'),*/ getCreateUser);
    app.post("/admin/users/create",restrict.toLoggedInUser, /*restrict.toPermission('add_application'),*/ doCreateUser);
    
    //PUT AND DELETE ARE NOT SUPPORTED BY ALL BROWSERS
    app.post("/admin/apps/delete/:id", restrict.toLoggedInUser, restrict.toPermission('add_applications'), doDeleteApp);
}

function showAdminPage(req,res,next) {
    res.render("admin/adminPage",{'locals':{'user':req.user,'badgeCounter':res}});
}      

function getAppList(req,res,next) {
    var apps={'results': [
      {
        'name':'Open XChange Connector',
        'key':'openxchange'
      },
      {
        'name': 'Cisco IP Phone Service App - Contacts',
        'key': 'ciscoips_contacts'
      },
      {
        'name': 'Facebook Stream Connector',
        'key': 'facebook_stream'
      }
    ]};
    appModel.loadApps({},function(err,data){
        var result = [];
        if(!err) {
            for(var i in data) {
                result.push(data[i].data);
            }
            console.log(result);
            res.send({'results':result});
        } else {
            //error
        }
        
    }); 
}
function getShowApp(req,res,next) {
    console.log("load the:"+req.params.id+" app");
    appModel.loadApp(req.params.id, function(err,data) {
        if(!err) {
            console.log(data);
            res.render("partials/admin/show_app",{'locals':{'user':req.user,'app':data},'layout':false});
        }
    });
}
function getCreateApp(req,res,next) {
    res.render("partials/admin/create_app",{'locals':{'user':req.user},'layout':false}); 
}
function doCreateApp(req,res,next) {
    //store new app
    //give app_id (not uuid of the item)
    //give application secret
    var date = new Date();
    var myApp = {};
    myApp.name = req.body.name;
    myApp.description = req.body.description;
    myApp.id = Math.uuid();
    //TODO: use uuid-algo instead
    var secretStr = myApp.name+myApp.id+(date.getTime().toString(36))+((Math.round(46656 * 46656 * 46656 * 36 * Math.random())).toString(36));
    myApp.application_secret = crypto.createHash('md5').update(secretStr).digest('hex');
    console.log(secretStr);
    
    console.log(myApp);
    appModel.saveApp(myApp,function(err,app) {
        if(!err) {
            req.session.success = "Successfully created the app";
        }
        else {
            req.session.error = "Something went wrong";
        }
        res.redirect('/admin'); 
    });
    //res.send("okay");    
}

function getDeleteApp(req,res,next) { 
    res.render("partials/admin/delete_app",{'locals':{'user':req.user,'commit_url':req.url,'object_id':req.params.id},'layout':false});
}
function doDeleteApp(req,res,next) {
    console.log("delete app:"+req.params.id);
    appModel.removeApp(req.params.id, function(err,data) { 
        res.send({'success':true}); 
    });    
}
function getUserList(req,res,next) {
    res.send({'results':[]});
}
function getCreateUser(req,res,next) {
    res.render("partials/admin/create_user",{'locals':{'user':req.user},'layout':false});
}
function doCreateUser(req,res,next) {
    // check if new username is already used in database
    console.log(req.body.name);
    var users = userModel.loadUsers({'name':req.body.name}, function(err, users) {
        if (users) {
            req.session.error = 'Sorry, this username is already in use';
            res.redirect('back');
            next('Sorry, this username is already in use', null);
        }
        else {
            //store new user
            //give user_id (not uuid of the item)
            //give user salt
            var date = new Date();
            var myUser = {};
            myUser.name = req.body.name;
            myUser.email = req.body.email;
            myUser.id = Math.uuid();
            
            //TODO: use uuid-algo instead
            var secretStr = myUser.name+myUser.id+(date.getTime().toString(36))+((Math.round(46656 * 46656 * 46656 * 36 * Math.random())).toString(36));
            myUser.salt = crypto.createHash('md5').update(secretStr).digest('hex');
            console.log(secretStr);
            myUser.pass = md5(req.body.password + myUser.salt);
            userModel.saveUser(myUser,function(err,app) {
                if(!err) {
                    req.session.success = "Successfully created the user";
                }
                else {
                    req.session.error = "Something went wrong";
                }
                res.redirect('/admin'); 
            });
            //res.send("okay");
        }
    });   
}

function getStatusList(req,res,next) {
    res.send({'results':[]});
}