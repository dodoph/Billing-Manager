function filterByCategory(id) {

    var category  = document.getElementById('event_filter').value
    //construct the URL and redirect to it
    console.log(category);
    window.location = '/home/filter/' + id + '?categoryname=' + encodeURI(category)
};
 