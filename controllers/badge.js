var restrict = require('../lib/restrict.js').user;
var badgeModel = require('../model/badge.js').badgeModel;
var crypto = require('crypto');

exports.init = function(app) {
    app.get('/admin/badges/search',restrict.toLoggedInUser,restrict.toPermission('add_applications'),showBadges);
    app.get('/admin/badges/create',restrict.toLoggedInUser,restrict.toPermission('add_applications'),showCreateBadge);
    app.post('/admin/badges/create',restrict.toLoggedInUser,restrict.toPermission('add_applications'),doCreateBadge);
    app.get("/admin/badges/show/:id",restrict.toLoggedInUser,restrict.toPermission('add_applications'), getShowBadge);
    app.get("/admin/badges/delete/:id",restrict.toLoggedInUser,restrict.toPermission('add_applications'), getDeleteBadge);
    app.post("/admin/badges/delete/:id",restrict.toLoggedInUser,restrict.toPermission('add_applications'), doDeleteBadge);
};

function doDeleteBadge (req, res) {
    badgeModel.deleteBadge(req.params.id, function(err,data) { 
	   res.send({'success':true}); 
	});    
}

function getDeleteBadge (req, res) {
    res.render("partials/admin/delete_app",{'locals':{'user':req.user,'commit_url':req.url,'object_id':req.params.id},'layout':false});    
}

function doCreateBadge (req, res) {
    var myBadge = {
        id : Math.uuid(),
        name : req.body.name,
        description : req.body.description,
        XP : isNaN(parseInt(req.body.XP))? 0 : parseInt(req.body.XP),
        depBadges:[],
        trigger:[],
        time:0,
        maxUserXP:0
    };
    console.log(myBadge);
	badgeModel.createBadge(myBadge,function(err,badge) {
		if(!err) {
		    req.session.success = "Successfully created the badge";
		}
		else {
		    req.session.error = "Something went wrong";
		}
		res.redirect('/admin'); 
	});   
    
};

function getShowBadge (req, res) {
    badgeModel.loadBadge(req.params.id, function(err,data) {
	   if(!err) {
	       res.render("partials/admin/show_badge",{'locals':{'user':req.user,'badge':data},'layout':false});
	   }
    });
       
}

function showCreateBadge (req, res) {
    res.render("partials/admin/create_badge",{"layout":false});
};

function showBadges (req, res) {
    badgeModel.getAllBadges({},function(err,badges) {
        if (!err) {
            var result = [];
            for (var i in badges)
                result.push(badges[i].data);
            res.send({"results":result});
        }
    });   
};
    
    
