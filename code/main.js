/*  
    Uses express, dbcon for database connection, body parser to parse form data 
    handlebars for HTML templates  
*/

var express = require('express');
var mysql = require('./dbcon.js');
var bodyParser = require('body-parser');
var path = require('path');

/*Express server*/
var app = express();
var handlebars = require('express-handlebars').create({
	defaultLayout:'main',
	helpers:{
		ifeq: function(a, b, opts){
			if(a==b){
				return opts.fn(this)
			}else{
				return opts.inverse(this)
			}
		}
		// ifnoteq: function (a, b, options) {
  //  		if (a != b) { 
  //  			return options.fn(this); 
  //  		}else{
  //  			return options.inverse(this);
  //  		}
  //   }
	}

});

app.engine('handlebars', handlebars.engine);

app.use(bodyParser.urlencoded({extended:true}));
app.use('/static', express.static('public'));
app.set('view engine', 'handlebars');
// var hbs = require('handlebars');
// hbs.registerHelper('ifeq', function (a, b, options) {
//     if (a == b) { return options.fn(this); }
//     return options.inverse(this);
// });

// hbs.registerHelper('ifnoteq', function (a, b, options) {
//     if (a != b) { return options.fn(this); }
//     return options.inverse(this);
// });

app.set('port', process.argv[2]);
app.set('mysql', mysql);

app.use(express.static(path.join(__dirname, 'public')));


app.use('/login', require('./login.js'));
app.use('/home', require('./home.js'));
app.use('/event', require('./event.js'));
// app.use('/', express.static('public'));

app.get('/', function(req, res){
  res.render('login', {layout: 'loginpage'});
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
