function closeEvent(event_id, user_id){
	console.log("TESSS!");
	$.ajax({
        url: '/home/closeevent/' + event_id + '?user_id=' + user_id,
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

}