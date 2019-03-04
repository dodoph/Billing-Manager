module.exports = function(){
    var express = require('express');
    var router = express.Router();


    function getMyEvent(res, mysql, context, id, complete){
        var sql = "SELECT * FROM Event e INNER JOIN User_Event ue ON ue.Event_ID = e.Event_ID WHERE ue.User_ID =?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.myEvent = results;
            context.user_id= id;
            complete(); 
        });
    }

    function getName(res, mysql, context, id, complete){
        var sql = "SELECT First_Name, Last_Name FROM User u WHERE u.User_ID =?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.username = results[0];
            complete(); 
        });
    }

    //find the event which name starts with a given string in the req
    function searchEvent(req, res, mysql, context, id, complete) {
        var sql = "SELECT * FROM Event e INNER JOIN User_Event ue ON ue.Event_ID = e.Event_ID WHERE ue.User_id = ? AND e.Name LIKE " + mysql.pool.escape('%' + req.query.eventname + '%');
        var inserts = [id]
        
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.myEvent = results;
            context.user_id= id;
            complete();
        });
    }

    function filterByCategory(req, res, mysql, context, id, categoryname, complete){
        var sql = "SELECT * FROM Event e INNER JOIN User_Event ue ON ue.Event_ID = e.Event_ID  WHERE ue.User_id = ? AND e.Category = ?";
        console.log()
        var inserts = [id, categoryname]
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.myEvent  = results;
            context.user_id= id;
            console.log(" ");
            console.log(context);
            complete();
        });
    }



    router.get('/:user_id', function(req, res){
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        context.jsscripts=["searchEvent.js", "filterByCategory.js"];
        getMyEvent(res, mysql, context, req.params.user_id, complete);
        getName(res, mysql, context, req.params.user_id, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                //console.log(context);
                res.render('home', context);
            }
        }
    });


    /*Display event with name similar to input */
    router.get('/search/:user_id', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["searchEvent.js", "filterByCategory.js"];
        var mysql = req.app.get('mysql');
        searchEvent(req, res, mysql, context, req.params.user_id, complete);
        getName(res, mysql, context, req.params.user_id, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('home', context);
            }
        }
    });


    router.get('/filter/:user_id', function(req, res){
        var callbackCount = 0;
        var context = {};
        console.log("categoryname is "+req.query.categoryname);

        context.jsscripts = ["searchEvent.js", "filterByCategory.js"];
        var mysql = req.app.get('mysql');
        
        filterByCategory(req, res, mysql, context, req.params.user_id, req.query.categoryname, complete);
      
        getName(res, mysql, context, req.params.user_id, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('home', context);
            }
        }
    });



    /* Adds a event, redirects to the home page after adding */
    router.post('/:user_id', function(req, res){
        console.log(req.params.user_id);
        var mysql = req.app.get('mysql');
        var result = {};
        var creatEventsql = "INSERT INTO Event (Name, Category, Location) VALUES (?,?,?)";
        var eventInserts = [req.body.eName, req.body.category, req.body.location];
        creatEventsql = mysql.pool.query(creatEventsql,eventInserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                console.log(results.insertId);       
                var creatUserEventsql = "INSERT INTO User_Event VALUES (?, ?)";
                var userEventInsert = [req.params.user_id, results.insertId];
                creatUserEventsql = mysql.pool.query(creatUserEventsql, userEventInsert,function(error, results, fields){
                    if(error){
                        console.log(JSON.stringify(error))
                        res.write(JSON.stringify(error));
                        res.end();
                    }else{
                        res.redirect('/home/' + req.params.user_id);
                    }                       
                })
                
            }
        });
    });
    return router;
}();