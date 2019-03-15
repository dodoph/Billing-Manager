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
            //console.log(context);
            // console.log(results);
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
            //console.log(context);

            complete(); 
    	});
    }

    function getMyStatement(res, mysql, context, id, complete){
        var sql = "SELECT Name, Event_Paid, Event_Balance FROM Event e INNER JOIN Statement s ON e.Event_ID = s.Event_ID WHERE s.User_ID = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.statements = results;
            complete();
        })
    }



    //find the event which name starts with a given string in the req
    function searchEvent(req, res, mysql, context, id, complete) {
        var sql = "SELECT * FROM Event e INNER JOIN User_Event ue ON ue.Event_ID = e.Event_ID WHERE ue.User_id = ? AND e.Name LIKE " + mysql.pool.escape('%' + req.query.eventname + '%');
        /*var query = "SELECT * FROM Event WHERE SOUNDEX(name) = " + SOUNDEX(mysql.pool.escape(req.params.s));*/
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
        var inserts = [id, categoryname]
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.myEvent  = results;
            context.user_id= id;
            // console.log(" ");
            // console.log(context);
            complete();
        });
    }


    /*Diplay the content of home page*/
    router.get('/:user_id', function(req, res){
    	var callbackCount = 0;
    	var context = {};
    	var mysql = req.app.get('mysql');
        context.jsscripts=["searchEvent.js", "filterByCategory.js", "deleteparticipate.js", "closeevent.js"];
    	// context.user_id = req.query.user_id;
    	getMyEvent(res, mysql, context, req.params.user_id, complete);
    	getName(res, mysql, context, req.params.user_id, complete);
    	getMyStatement(res, mysql, context, req.params.user_id, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
            	//console.log(context);
                res.render('home', context);
            }
        }
    });


    /*Display event with name similar to input */
    router.get('/search/:user_id', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["searchEvent.js", "filterByCategory.js", "deleteparticipate.js", "closeevent.js"];
        var mysql = req.app.get('mysql');
        //console.log(req.query.eventNameSearch);
        searchEvent(req, res, mysql, context, req.params.user_id, complete);
        //getMyEvent(res, mysql, context, req.params.user_id, complete);
        getName(res, mysql, context, req.params.user_id, complete);
        getMyStatement(res, mysql, context, req.params.user_id, complete);

        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('home', context);
            }
        }
    });

    /*Display the result of Category filter */
    router.get('/filter/:user_id', function(req, res){
        var callbackCount = 0;
        var context = {};
        // console.log("categoryname is "+req.query.categoryname);

        context.jsscripts = ["searchEvent.js", "filterByCategory.js", "deleteparticipate.js", "closeevent.js"];
        var mysql = req.app.get('mysql');
        
        filterByCategory(req, res, mysql, context, req.params.user_id, req.query.categoryname, complete);
        // console.log("hudeu");
        // console.log(context);
        //getMyEvent(res, mysql, context, req.params.user_id, complete);
        getName(res, mysql, context, req.params.user_id, complete);
        getMyStatement(res, mysql, context, req.params.user_id, complete);

        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                // console.log("what"+context);
                res.render('home', context);
            }
        }
    });

    /*user creates an event. New event will insert into Event table and a new user-event relation will be built */
    router.post('/:user_id', function(req, res){
        // console.log(req.params.user_id);
        var mysql = req.app.get('mysql');
        var results = {};
        var creatEventsql = "INSERT INTO Event (Name, Category, Location) VALUES (?,?,?)";
        var eventInserts = [req.body.eName, req.body.category, req.body.location];
        creatEventsql = mysql.pool.query(creatEventsql,eventInserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                console.log(results.insertId);
                var event_id = results.insertId;       
                var creatUserEventsql = "INSERT INTO User_Event VALUES (?, ?)";
                var userEventInsert = [req.params.user_id, event_id];
                creatUserEventsql = mysql.pool.query(creatUserEventsql, userEventInsert,function(error, results, fields){
                    if(error){
                        console.log(JSON.stringify(error))
                        res.write(JSON.stringify(error));
                        res.end();
                    }else{
                        
                        res.redirect('/home/' + req.params.user_id);
                    }                       
                });
            }
        });
    });

    
    /*delete user from user-event many-many mapping table*/
    router.delete('/user_event/:event_id', function(req, res){
        // //console.log("test!");
        // console.log("user id is " +req.query.user_id);
        // console.log("event id is " + req.params.event_id);
        var mysql = req.app.get('mysql');
        var context={};
        var deleteUeSql = "DELETE FROM User_Event WHERE User_ID = ? AND Event_ID = ?";
        var deleteUeInserts = [req.query.user_id, req.params.event_id];
        deleteUeSql = mysql.pool.query(deleteUeSql, deleteUeInserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                console.log(error);
                res.status(400); 
                res.end(); 
            }else{
                console.log("delete user-event success!");
                var decreasePartiSql = "UPDATE Event e SET Participants = Participants - 1 WHERE e.Event_ID = ?";
                var decreasePartiInserts = [req.params.event_id];
                decreasePartiSql = mysql.pool.query(decreasePartiSql, decreasePartiInserts, function(error, results, fields){
                    if(error){
                        res.write(JSON.stringify(error));
                        console.log(error);
                        res.status(400); 
                        res.end(); 
                    }else{
                        //console.log("decrese event participate success!");
                        // var deleteItemSql = "DELETE FROM Item WHERE Payer_ID = ?";
                        var deleteItemSql = "UPDATE Item i SET i.Event_ID = NULL WHERE i.Payer_ID = ? AND i.Event_ID = ?";
                        var deleteItemInserts = [req.query.user_id, req.params.event_id];
                        deleteItemSql = mysql.pool.query(deleteItemSql, deleteItemInserts, function(error, results, fields){
                            if(error){
                                res.write(JSON.stringify(error));
                                console.log(error);
                                res.status(400); 
                                res.end(); 
                            }else{
                                //console.log("this user's items are set to NULL success!");
                                var totalExpenseSql = "UPDATE Event e INNER JOIN (SELECT Event_ID, SUM(Invoice_Amount) AS Total FROM Item GROUP BY Event_ID) i ON i.Event_ID =  e.Event_ID AND e.Event_ID = ? SET e.Total_Expense = i.Total";
                                var totalExpenseInserts = [req.params.event_id];
                                totalExpenseSql = mysql.pool.query(totalExpenseSql,totalExpenseInserts,function(error, results, fields){
                                    if(error){
                                        console.log(JSON.stringify(error))
                                        res.write(JSON.stringify(error));
                                        res.end();
                                    }else{
                                        //console.log("update event total express success!");
                                        var eventShareSql = "UPDATE Event e SET e.Event_Share = e.Total_Expense / e.Participants WHERE e.Event_ID = ?";
                                        var eventShareInserts = [req.params.event_id];
                                        eventShareSql = mysql.pool.query(eventShareSql, eventShareInserts, function(error, results, fields){
                                            if(error){
                                                console.log(JSON.stringify(error))
                                                res.write(JSON.stringify(error));
                                                res.end();

                                            }else{
                                                
                                                res.status(202).end();      
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }
        });
    });

    //close an event and insert event information into statement table and update event status 
    router.delete('/closeevent/:event_id', function(req, res){
        //console.log("checking user id: " + req.query.user_id);
        var mysql = req.app.get('mysql');
        var context={};
        var createStatementSql = "INSERT INTO Statement(User_ID, Event_ID, Event_Paid, Event_Balance) SELECT ue.User_ID, ue.Event_ID, IFNULL(SUM(Invoice_Amount), 0), Event_Share - IFNULL(SUM(Invoice_Amount), 0) FROM User_Event ue LEFT JOIN Item i ON ue.User_ID = i.Payer_ID  AND ue.Event_ID = i.Event_ID INNER JOIN Event e ON e.Event_ID = ue.Event_ID WHERE ue.Event_ID = ? GROUP BY ue.User_ID, ue.Event_ID";
        var statementInserts = [req.params.event_id];
        createStatementSql = mysql.pool.query(createStatementSql, statementInserts, function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                //console.log("create statements success!")
                var statusSql = "UPDATE Event e SET Status_Open = 0 WHERE e.Event_ID = ?";
                statusSql = mysql.pool.query(statusSql, req.params.event_id, function(error, results,fields){
                    if(error){
                        console.log(JSON.stringify(error))
                        res.write(JSON.stringify(error));
                        res.end();
                    }else{
                        //console.log("status is updated to 0");
                        res.status(202).end(); 
                    }

                });
            }
        });
    });

  	return router;
}();