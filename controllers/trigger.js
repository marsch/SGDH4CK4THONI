var restrict = require('../lib/restrict.js').user;
var triggerModel = require('../model/trigger.js').triggerModel;
exports.init = function(app) { 
    app.get("/admin/trigger/search",restrict.toLoggedInUser,restrict.toPermission('add_applications'),searchTrigger);
    app.get("/admin/trigger/create",restrict.toLoggedInUser,restrict.toPermission('add_applications'),createTrigger);
    app.post("/admin/trigger/create", restrict.toLoggedInUser,restrict.toPermission('add_applications'),doCreateTrigger);
    app.get("/admin/trigger/show/:id",restrict.toLoggedInUser,restrict.toPermission('add_applications'),showTrigger);
    app.get("/admin/trigger/delete/:id",restrict.toLoggedInUser,restrict.toPermission('add_applications'),deleteTrigger);
    app.post("/admin/trigger/delete/:id",restrict.toLoggedInUser,restrict.toPermission('add_applications'),doDeleteTrigger);
}

function searchTrigger(req,res,next) {
    console.log(req.query.keyword);
    if (req.query.keyword != '') {
        where = { 'name' : req.query.keyword };
    } else {
        where = {};
    }
    triggerModel.loadTriggers(where,function(err,data){
        var result = [];
        if(!err) {
            for(var i in data) {
                result.push(data[i].data);
            }
            res.send({'results':result});
        } else {
            req.session.error = "Error retrieving Triggers";
        } 
    });
}

function createTrigger(req, res, next) {
    res.render("partials/admin/create_trigger",{'locals':{'user':req.user},'layout':false}); 
}

function showTrigger(req, res, next) {
    triggerModel.loadTrigger(req.params.id, function(err,data) {
        if(!err) {
            res.render("partials/admin/show_trigger",{'locals':{'user':req.user,'trigger':data},'layout':false});
        }
    });
}

//TODO: Validate the content of experience
function doCreateTrigger(req, res, next) {
    
       
	    var date = new Date();
	    var myTrigger = {};
	    myTrigger.name = req.body.name;
	    myTrigger.description = req.body.description;
	    myTrigger.xp = req.body.experience;
	
	    myTrigger.id = Math.uuid();
	
	    triggerModel.saveTrigger(myTrigger,function(err,app) {
	        if(!err) {
	            req.session.success = "Successfully created the trigger";
	        }
	        else {
	            req.session.error = "Something went wrong";
	        }
	        res.redirect('/admin'); 
	    });
    
}

function deleteTrigger(req,res,next) { 
    res.render("partials/admin/delete_trigger",{'locals':{'user':req.user,'commit_url':req.url,'object_id':req.params.id},'layout':false});
}

function doDeleteTrigger(req,res,next) {
    triggerModel.removeTrigger(req.params.id, function(err,data) { 
        res.send({'success':true}); 
    });
}