function searchEvent() {

    var event_search_string  = document.getElementById('event_search_string').value
    //construct the URL and redirect to it
    window.location = '/home/search/' + encodeURI(event_search_string)
}
