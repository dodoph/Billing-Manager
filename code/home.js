module.exports = function(){
	var express = require('express');
    var router = express.Router();

    function getMyEvent(res, mysql, context, id, complete){
        var query = "SELECT * FROM Event e INNER JOIN User_Event ue ON ue.Event_ID = e.Event_ID WHERE ue.User_ID =?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.myEvent  = results;
            complete();
        });
    }

    function getStatement(res, mysql, context, id, complete){
        var query = "SELECT Event_ID, Event_Paid, Event_Balance FROM Statement WHERE User_ID =?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.myEvent  = results;
            complete();
        });
    }


    function searchEvent(req, res, mysql, context, id, complete) {
        var query = "SELECT * FROM Event e INNER JOIN User_Event ue ON ue.Event_ID = e.Event_ID WHERE ue.User_ID =? AND name LIKE "
			+ mysql.pool.escape('%' + req.params.s + '%');
        /*var query = "SELECT * FROM Event WHERE SOUNDEX(name) = " + SOUNDEX(mysql.pool.escape(req.params.s));*/
        var inserts = [id];
		mysql.pool.query(query, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.people = results;
            complete();
        });
    }

    function filterByCategory(res, mysql, context, id, complete){
        var query = "SELECT * FROM Event e INNER JOIN User_Event ue ON ue.Event_ID = e.Event_ID " +
			"WHERE ue.User_ID =? AND e.Category =?";

        var inserts = [id, req.body.category];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.myEvent  = results;
            complete();
        });
    }


    router.get('/:id', function(req, res){
        var context = {};
        console.log(req.params.id);
        context.user_id = req.params.id
        res.render('home', context);
    });


    /*Display all event associated to the user*/
    router.get('/home', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["filterByCategory.js","searchEvent.js"];
        var mysql = req.app.get('mysql');
        getMyEvent(res, mysql, context, req.params.id, complete);
        getStatement(res, mysql, context, req.params.id, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('home', context);
            }
        }
    });

    /*Filter the user's event by catogory*/
    router.get('/filter/:category', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["filterByCategory.js","searchEvent.js"];
        var mysql = req.app.get('mysql');
        filterByCategory(req,res, mysql, context, req.params.id, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('home', context);
            }
        }
    });

    /*Display event with name similar to input */
    router.get('/search/:s', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["filterByCategory.js","searchEvent.js"];
        var mysql = req.app.get('mysql');
        searchEvent(req, res, mysql, context, req.params.id, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('home', context);
            }
        }
    });


    /* Adds a event, redirects to the home page after adding */
    router.post('/home', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Event (Name, Category, Location) VALUES (?,?,?)";
        var inserts = [req.body.eName, req.category, req.body.location];
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

    return router;
}();