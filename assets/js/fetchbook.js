// create an empty javascript array for the user entries.

var recentSearches = [];

//this function is called using the search button "onclick"

function searchFunction(data) {
    recentSearches.push($('#fetchbook-search-input').val()); //This line puts the value from the text box in an array
    
    $('#fetchbook-search-input').val("") // clear the text box after search
    $('.search-list').text("") // clear the search history window then repopulate with the new array
    
    
    $.each(recentSearches, function (index, value) {
        $('.search-list').append("<li class='historyItem' onclick='addtotextbox("+index+")'>" + value + '</li>');
    });
}
 
function addtotextbox(id)
{
    $('#fetchbook-search-input').val(recentSearches[id])
}