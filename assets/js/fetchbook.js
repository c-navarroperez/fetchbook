// Global Vars Start
var nytimes_Apikey = '79eRVjmnBdIiOurCNn7FVbjnz8UrVfHq';
// Global Vars End


function getNYTimesData() {
    var nytimeBsellersUrl='https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?api-key=';
    var completeUrl = `${nytimeBsellersUrl} + ${nytimes_Apikey}`;

    $.get(`${completeUrl}`)
    .then(function(data){
        console.log(data.results);
    });
};

getNYTimesData();