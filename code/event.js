module.exports = function(){
	var express = require('express');
    var router = express.Router();

    function getEvent(res, mysql, context, id, complete){
    	var sql ="SELECT Name, Category, Location, Participants, Total_Expense, Event_Share, Status_Open FROM Event e WHERE e.Event_ID =?";
    	
    	var inserts = [id];
    	mysql.pool.query(sql, inserts, function(error, results, fields){
    		if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.events = results[0];
            context.event_id = id;
            // console.log(context);
            complete();
    	});
    }

    function getItems(res, mysql, context, id, complete){
    	var sql = "SELECT * FROM Item i INNER JOIN User u ON u.User_ID = i.Payer_ID WHERE i.Event_ID= ?";
    	var inserts = [id];
    	mysql.pool.query(sql, inserts, function(error, results, fields){
    		if(error){
    		   res.write(JSON.stringify(error));
                res.end();
            }
            context.items = results;
            // console.log(context);
            complete();	
    		
    	});

    }


    function getParticipates(res, mysql, context, id, complete){
    	var sql ="SELECT u.User_ID, u.First_Name, u.Last_Name, u.Email, u.Phone FROM User u INNER JOIN User_Event ue ON ue.User_ID = u.User_ID WHERE ue.Event_ID = ?";
    	var inserts = [id];
    	mysql.pool.query(sql, inserts, function(error, results, fields){
    		if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.participates = results;
            //console.log(context);
            complete();
    	});
    }

    function getEditEvent(res, mysql, context, id, complete){
        var sql="SELECT Name, Category, Location FROM Event e WHERE e.Event_ID = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.myevent = results[0];
            complete();
        })
    }

    function getEditItem(res, mysql, context, id, complete){
        var sql = "SELECT Description, Quantity, Invoice_Amount FROM Item i WHERE i.Item_ID =?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.myitem = results[0];
            complete();
        })

    }

    router.get('/', function(req, res){
    	res.render('event');
    });

    router.get('/:event_id', function(req, res){
    	// console.log("req.query.user_id: " + req.query.user_id);
    	// console.log(req.params.event_id);
    	var callback =0;
    	var context = {};
    	context.user_id = parseInt(req.query.user_id);
        context.jsscripts=["deleteItem.js"];
    	var mysql = req.app.get('mysql');
    	getEvent(res, mysql, context, req.params.event_id, complete);
    	getItems(res, mysql, context, req.params.event_id, complete);
    	getParticipates(res, mysql, context, req.params.event_id, complete);
    	function complete(){
    		callback++;
    		if(callback >= 3){
                //console.log("print the context");
                //console.log(context);
    			res.render('event', context);
    		}
    	}
    });

    /* Display one item for the specific purpose of updating item table */
    router.get('/:event_id/item/:item_id', function(req, res){
        callback = 0;
        var context ={};
        var mysql = req.app.get('mysql');
        context.event_id = req.params.event_id;
        context.user_id= req.query.user_id;
        context.item_id = req.params.item_id;
        context.jsscripts=["deleteItem.js"];
        getEditItem(res, mysql, context, req.params.item_id, complete);
        function complete(){
            callback++;
            if(callback>=1){
                res.render('updateitem', context);
            }
        }
    });

    /*Display update event page*/
    router.get('/:event_id/update/', function(req, res){
        callback = 0;
        var context ={};
        var mysql = req.app.get('mysql');
        context.event_id = req.params.event_id;
        context.user_id= req.query.user_id;
        context.jsscripts=["deleteItem.js"];
        getEditEvent(res, mysql, context, req.params.event_id, complete);
        function complete(){
            callback++;
            if(callback>=1){
                res.render('updateevent', context);
            }
        }
        
    });



    /*Add a new item into item table*/
    router.post('/additem/:event_id', function(req, res){
        //console.log(req)
    	
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Item (`Description`, `Event_ID`, `Payer_ID`, `Quantity`, `Invoice_Amount`) VALUES (?, ?, ?, ?, ?)";
        var inserts = [req.body.Description, req.params.event_id, req.query.user_id, req.body.Quantity, req.body.Invoice_Amount];
        
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                var totalExpenseSql = "UPDATE Event e SET e.Total_Expense = e.Total_Expense + ? WHERE e.Event_ID = ?";
                var totalExpenseInserts = [req.body.Invoice_Amount, req.params.event_id];
                totalExpenseSql = mysql.pool.query(totalExpenseSql,totalExpenseInserts,function(error, results, fields){
                    if(error){
                        console.log(JSON.stringify(error))
                        res.write(JSON.stringify(error));
                        res.end();
                    }else{

                        var eventShareSql = "UPDATE Event e SET e.Event_Share = e.Total_Expense / e.Participants WHERE e.Event_ID = ?";
                        var eventShareInserts = [req.params.event_id];
                        eventShareSql = mysql.pool.query(eventShareSql, eventShareInserts, function(error, results, fields){
                            if(error){
                                console.log(JSON.stringify(error))
                                res.write(JSON.stringify(error));
                                res.end();

                            }else{
                                res.redirect('/event/' + req.params.event_id + '?user_id='+req.query.user_id);

                            } 
                        });
                        
                    }
                });
            }
        });
    });

    /*Invite a friend which is to insert a new user-event relation into mapping table*/
    router.post('/invitefriend/:event_id', function(req, res){
        //console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO User_Event SELECT User_ID, ? FROM User u WHERE u.Email= ?;"
        var inserts = [req.params.event_id, req.body.Email];
        //console.log(req.query.user_id);
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(results.affectedRows == 0){
                res.redirect('/event/' + req.params.event_id + '?user_id='+ req.query.user_id);
            }else if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                var updateParticipateSql = "UPDATE Event e SET Participants = Participants + 1 WHERE e.Event_ID = ?";
                var participateInserts = [req.params.event_id];
                updateParticipateSql = mysql.pool.query(updateParticipateSql, participateInserts, function(error, results, fields){
                    if(error){
                        console.log(JSON.stringify(error))
                        res.write(JSON.stringify(error));
                        res.end();
                    }else{

                        var eventShareSql = "UPDATE Event e SET e.Event_Share = e.Total_Expense / e.Participants WHERE e.Event_ID = ?";
                        var eventShareInserts = [req.params.event_id];
                        eventShareSql = mysql.pool.query(eventShareSql, eventShareInserts, function(error, results, fields){
                            if(error){
                                console.log(JSON.stringify(error))
                                res.write(JSON.stringify(error));
                                res.end();

                            }else{
                                res.redirect('/event/' + req.params.event_id + '?user_id='+ req.query.user_id);

                            } 
                        });    
                    }
                });
                
            }
        });
    });

    /*Update item information*/
    router.post('/:event_id/item/:item_id', function(req, res){
        //console.log("DEDEDDD");
        var mysql = req.app.get('mysql');
        var context={};


        var sql = "UPDATE Item i SET Description =?, Quantity = ?, Invoice_Amount = ? WHERE i.Item_ID = ?";

        var inserts = [req.body.Description, req.body.Quantity, req.body.Invoice_Amount, req.params.item_id];

        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.end();

            }else{
                var totalExpenseSql = "UPDATE Event e INNER JOIN (SELECT Event_ID, SUM(Invoice_Amount) AS Total FROM Item GROUP BY Event_ID) i ON i.Event_ID =  e.Event_ID AND e.Event_ID = ? SET e.Total_Expense = i.Total";
                var totalExpenseInserts = [req.params.event_id];
                totalExpenseSql = mysql.pool.query(totalExpenseSql,totalExpenseInserts,function(error, results, fields){
                    if(error){
                        console.log(JSON.stringify(error))
                        res.write(JSON.stringify(error));
                        res.end();
                    }else{

                        var eventShareSql = "UPDATE Event e SET e.Event_Share = e.Total_Expense / e.Participants WHERE e.Event_ID = ?";
                        var eventShareInserts = [req.params.event_id];
                        eventShareSql = mysql.pool.query(eventShareSql, eventShareInserts, function(error, results, fields){
                            if(error){
                                console.log(JSON.stringify(error))
                                res.write(JSON.stringify(error));
                                res.end();

                            }else{
                            res.redirect('/event/' + req.params.event_id + '?user_id='+ req.query.user_id);
                            }
                        });
                    }
                });
            }
        });
    });


    /*update Event table information*/
    router.post('/:event_id/update', function(req, res){
        var mysql = req.app.get('mysql');
        var context = {};
        var sql = "UPDATE Event e SET Name =?, Category =?, Location = ? WHERE e.Event_ID = ?";
        var inserts = [req.body.Name, req.body.Category, req.body.Location, req.params.event_id];

        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.end();
            }else{
                //console.log("testing user_id "+req.query.user_id);
                res.redirect('/event/' + req.params.event_id + '?user_id='+ req.query.user_id);
            }
        })
    })

    /*delete item which is to set the foreign key(Event_ID) to NULL in one - many relationship*/
    router.delete('/:event_id/item/:item_id', function(req, res){
        // console.log("test!");
        // console.log("user id is " +req.query.user_id);
        // console.log("event id is " + req.params.event_id);
        var mysql = req.app.get('mysql');
        var context={};
        var deleteItemSql = "UPDATE Item i SET i.Event_ID = NULL WHERE i.Item_ID =?";
        var deleteItemInserts = [req.params.item_id];
        deleteItemSql = mysql.pool.query(deleteItemSql, deleteItemInserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                console.log(error);
                res.status(400); 
                res.end(); 
            }else{
                console.log("this user's items are set to NULL success!");
                var totalExpenseSql = "UPDATE Event e LEFT JOIN (SELECT Event_ID, IFNULL(SUM(Invoice_Amount), 0) AS Total FROM Item GROUP BY Event_ID) i ON i.Event_ID = e.Event_ID SET e.Total_Expense = IFNULL(i.Total, 0) WHERE e.Event_ID = ?";
                var totalExpenseInserts = [req.params.event_id];
                totalExpenseSql = mysql.pool.query(totalExpenseSql,totalExpenseInserts,function(error, results, fields){
                    if(error){
                        console.log(JSON.stringify(error))
                        res.write(JSON.stringify(error));
                        res.end();
                    }else{
                        console.log("update event total express success!");
                        var eventShareSql = "UPDATE Event e SET e.Event_Share = e.Total_Expense / e.Participants WHERE e.Event_ID = ?";
                        var eventShareInserts = [req.params.event_id];
                        eventShareSql = mysql.pool.query(eventShareSql, eventShareInserts, function(error, results, fields){
                            if(error){
                                console.log(JSON.stringify(error))
                                res.write(JSON.stringify(error));
                                res.end();

                            }else{
                                console.log("update event share success!");
                                res.status(202).end();
                            }
                        })
                    }
                })
            }
        });
    });

  	return router;
}();