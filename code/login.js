module.exports = function(){
	var express = require('express');
    var router = express.Router();

    function getEmail(req,res, mysql, context, complete){
		var query = "SELECT User_ID, First_Name, Last_Name FROM User u WHERE u.Email=?";
		console.log(req.query.Email);
		var inserts = [req.query.Email]
		mysql.pool.query(query, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.username = results[0];
            complete();
		});
  }


    router.get('/', function(req, res){
    	res.render('login');
    });


	
	/*Create a user insert data into database*/
	router.post('/', function(req, res){
		var mysql = req.app.get('mysql');
		var sql = "INSERT INTO User(First_Name, Last_Name, Email, Phone) VALUES (?,?,?,?)";
		var inserts = [req.body.First_Name, req.body.Last_Name, req.body.Email, req.body.Phone];
		sql = mysql.pool.query(sql,inserts,function(error, results, fields){
			if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/home');
            }
		});
	});

	 /*Login */


	router.get('/email/', function(req, res){
		callback = 0;
		var context = {};
		var mysql = req.app.get('mysql');

		// console.log(req);
		getEmail(req, res, mysql, context, complete);
		function complete(){
			callback++;
			if(callback>=1){
				res.redirect('/home/' + context.username.User_ID);
			}
			
		}
		
	});

/**https://stackoverflow.com/questions/53797147/sending-query-params-forth-to-another-page-with-post-in-node-js-and-express*/

	return router;
}();