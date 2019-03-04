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
        var sql = "SELECT Description, First_Name, Last_Name, Quantity, Invoice_Amount FROM Item i INNER JOIN User u ON u.User_ID = i.Payer_ID WHERE i.Event_ID= ?";
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
        var sql ="SELECT u.First_Name, u.Last_Name FROM User u INNER JOIN User_Event ue ON ue.User_ID = u.User_ID WHERE ue.Event_ID =?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.participats = results;
            console.log(context);
            complete();
        });
    }

    

    router.get('/', function(req, res){
        res.render('event');
    });

    router.get('/:event_id', function(req, res){
        console.log("req.query.user_id: " + req.query.user_id);
        console.log(req.params.event_id);
        callback =0;
        var context = {};
        context.user_id = req.query.user_id;
        var mysql = req.app.get('mysql');
        getEvent(res, mysql, context, req.params.event_id, complete);
        getItems(res, mysql, context, req.params.event_id, complete);
        getParticipates(res, mysql, context, req.params.event_id, complete);
        function complete(){
            callback++;
            if(callback >= 3){
                res.render('event', context);
            }
        }
    });



    router.post('/additem/:event_id', function(req, res){
        console.log(req)
        
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Item (`Description`, `Event_ID`, `Payer_ID`, `Quantity`, `Invoice_Amount`) VALUES (?, ?, ?, ?, ?)";
        var inserts = [req.body.Description, req.params.event_id, req.query.user_id, req.body.Quantity, req.body.Invoice_Amount];
        
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/event/' + req.params.event_id + '?user_id='+req.query.user_id);
            }
        });
    });


    router.post('/invitefriend/:event_id', function(req, res){
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO User_Event SELECT User_ID, ? FROM User u WHERE u.Email= ?;"
        var inserts = [req.params.event_id, req.body.Email];
        console.log(req.query.user_id);
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                console.log(results)
                if(results.affectedRows == 0){
                    
                }
                res.redirect('/event/' + req.params.event_id + '?user_id='+ req.query.user_id);
            }
        });
    });


    return router;
}();