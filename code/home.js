module.exports = function(){
	var express = require('express');
    var router = express.Router();

    router.get('/:id', function(req, res){
    	var context = {};
    	console.log(req.params.id);
    	context.user_id = req.params.id
    	res.render('home', context);
    });

  	return router;
}();