var db = require('riak-js').getClient();
var crypto = require('crypto');
var user = require('../model/user').userModel;
console.log(user);


var mariouser = {
    name: 'mario',
    salt: 'randomly-generated-salt',
    pass: md5('start' + 'randomly-generated-salt'),
    apps: [ 
        {
            id: 'someid',
            name: 'open xchange',
            permissions: {
                'umcc': ['user_info','offline_access'], 
                'cisco': ['callhistory','initcall','manage_call_routing'],
                'notifier': ['push_notification']
            }
        },
        {
            id: 'some other id',
            name: 'cisco',
            permissions: {
                'openxchange':['user_contacts','user_calendar','global_contacts'],
                'notifier':['push_notification'],
                'umcc':['user_info','offline_access']
            }
        }
    ],
    permissions: ['register_applications','add_applications','add_users','is_admin']
};
db.save('users','mario',mariouser);
/*db.save('airlines', 'KLM', {fleet: 111, country: 'NL'}, { links:
  [{ bucket: 'flights', key: 'KLM-8098', tag: 'cargo' },
   { bucket: 'flights', key: 'KLM-1196', tag: 'passenger' }]
});*/

  

exports.authenticate = authenticate; 



//Functions
function md5(str) {
    return crypto.createHash('md5').update(str).digest('hex');
}
// Authenticate using our plain-object database of doom!
function authenticate(name, pass, fn) { 
    user.loadUser(name,function(err,user) {  
        if (!user) return fn(new Error('cannot find user'));
        // apply the same algorithm to the POSTed password, applying
        // the md5 against the pass / salt, if there is a match we
        // found the user
        console.log(user);
        if (user.pass == md5(pass + user.salt)) return fn(null, user);
        fn(new Error('invalid password'));
    }); 
}