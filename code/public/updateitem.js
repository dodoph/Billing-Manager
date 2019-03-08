function updateItem(event_id, user_id, item_id){
	console.log(user_id);
	$.ajax({
        url: '/event/' + event_id + '/item/'+ item_id + '?user_id=' + user_id,
        type: 'PUT',
        data: $('#update-item').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};