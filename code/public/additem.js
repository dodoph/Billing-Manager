function addItem(Event_ID, Player_ID){
	$.ajax({
		type: "post",
		data: {
			Event_ID: Event_ID,
			Play_ID: Play_ID
		}
		url:'/event/'+ Event_ID + Player_ID,
		success: function(result){
            window.location.replace("./");
        }
	})
}