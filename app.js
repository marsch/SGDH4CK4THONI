var express = require('express');  
var fs = require('fs'); 
require('./lib/uuid.js');

console.log(Math.uuid());

var app = express.createServer(); 
app.set('view engine', 'ejs');  

//app.use(express.logger());
app.use(express.bodyDecoder());
app.use(express.cookieDecoder());
app.use(express.session());
app.use(express.staticProvider(__dirname + '/public'));
app.use(app.router);

app.dynamicHelpers({
    message: function(req){
        var err = req.session.error,
            msg = req.session.success;
        delete req.session.error;
        delete req.session.success; 
        if (err) return '<p class="msg error">' + err + '</p>';
        if (msg) return '<p class="msg success">' + msg + '</p>';
    }
});


// Example 500 page
app.error(function(err, req, res){
    console.dir(err);
    req.session.error = "500 internal Server-Error!";
    res.render('app/500',{'layout':'splash_layout'});
});

// Example 404 page via simple Connect middleware
app.use(function(req, res){
    req.session.error = "404 not found";
    res.render('app/404',{'layout':'splash_layout'});
}); 


//INIT CONTROLLERS
fs.readdir(__dirname + '/controllers', function(err, files){
    if (err) throw err;
    files.forEach(function(file){
        var name = file.replace('.js', '');
        require('./controllers/'+name).init(app);
    });
});



app.listen(80);
console.log('UMCC started on port 80');