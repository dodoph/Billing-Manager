function deleteItem(item_id, event_id, user_id){
	console.log("HELLO");
	$.ajax({
        url: '/event/' + event_id + '/item/' + item_id + '?user_id=' + user_id,
        type: 'DELETE',
        success: function(result){
        	console.log("deedddd");
          if(result.responseText != undefined){
            alert(result.responseText)
          }else {
            window.location.href = '/event/' + event_id + '?user_id=' + user_id;
          } 
      	},
      	error: function(error){
      		console.log(error);
      	}
    })
};

