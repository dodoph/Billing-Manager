function searchEvent(id) {
    var event_search_string  = document.getElementById('eventNameSearch').value
    //construct the URL and redirect to it
    window.location = '/home/search/' + id  + '?eventname=' + encodeURI(event_search_string)

};