function deleteParticipate(event_id, user_id){
	console.log("HELLO");
	$.ajax({
        url: '/home/user_event/' + event_id + '?user_id=' + user_id,
        type: 'DELETE',
        success: function(result){
        	console.log("deedddd");
          if(result.responseText != undefined){
            alert(result.responseText)
          }else {
            window.location.href = '/home/' + user_id;
          } 
      	},
      	error: function(error){
      		console.log(error);
      	}
    })
};

