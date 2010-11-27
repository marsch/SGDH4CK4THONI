var db = require('riak-js').getClient();

var badgeModel = function() {
};

badgeModel.prototype = {
      getBadge : function(key,fn) {
        db.get('badges',key,{keys:true},function(err,badge,meta) {
            fn(err,badge,meta);
        });
      },
      createBadge : function(badge,fn) {
          db.save('badges',badge.id,badge,function(err,res) {
              if (!err)
                console.log("error: "+badge.id);
              else
                console.log("success: "+badge.id);
              fn(err,res);
          });
      },
      getAllBadges : function(whereObj,fn) {
        db.getAll('badges',{where:whereObj},function(err,badges) {
            fn(err,badges);
        });          
      },
      deleteBadge : function(key, fn) {
        db.remove('badges',key,function(err, res) {
            fn(err,res);
        });
      },
      countBadges : function(fn) {
          db.count('badges',function(err,res) {
              if (err)
                fn(0);
              else
                fn(res);
          });
      },
      updateBadge : function(badge,meta,fn) {
          db.save('badges',badge.id,badge,meta,function(err,res) {
              fn(err,res);
          }); 
      }
};

exports.badgeModel = new badgeModel();