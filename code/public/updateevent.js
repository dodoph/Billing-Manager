function updateEvent(event_id, user_id){
	console.log(user_id);
	$.ajax({
        url: '/event/' + event_id +'/update/' + '?user_id=' + user_id,
        type: 'PUT',
        data: $('#update-event').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};