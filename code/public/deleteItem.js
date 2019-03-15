function deleteItem(event_id, user_id, item_id){
    console.log('deleting item')
    $.ajax({
        url: '/event/' + event_id + '/item/'+ item_id + '?user_id=' + user_id,
        type: 'DELETE',
        success: function(result){
            if(result.responseText != undefined){
                alert(result.responseText)
            }
            else {
                window.location.reload(true)
            }
        }
    })
}

/*
function deleteItem(item_id) {
    console.log("deleting item")
    request.open("GET", "/delete?item_id=" + item_id, true);
    request.addEventListener("load", function(){
            if(request.status >= 200 && request.status< 400) {
                console.log("Delete success");
            }else{
                console.log("error deleting!");
            }
        });
    request.send(null);
    event.preventDefault();
}*/


/*function deleteItem(currentRow) {
    try {
        var table = document.getElementById("itemTable");
        var request = new XMLHttpRequest();
        var id = currentRow.parentNode.parentNode.cells[5].innerHTML;
        console.log("deleting")
        request.open("GET", "/delete?id=" + id, true);
        request.addEventListener("load", function(){
            if(request.status >= 200 && request.status< 400) {
                console.log("Delete success");
            }else{
                console.log("error deleting!");
            }
        });
        request.send(null);
        event.preventDefault();

        var rowCount = table.rows.length;
        for (var i = 0; i < rowCount; i++) {
            var row = table.rows[i];

            if (row==currentRow.parentNode.parentNode) {
                table.deleteRow(i);
                console.log('deleting row')
                rowCount--;
                i--;
            }
        }
    } catch (e) {
        alert(e);
    }
}*/