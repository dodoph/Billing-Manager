function filterByCategory() {

    var category  = document.getElementById('event_filter').value
    //construct the URL and redirect to it
    window.location = '/home/filter/' + id + '?categoryname=' + encodeURI(category)
}

