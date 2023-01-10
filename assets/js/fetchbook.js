
$(document).ready(function() {
    var item, title, publisher, bookLink, bookImg
    var outputList = document.getElementById("list-output");
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    var bookUrl = "https://www.gogleapis.com/books/v1/volumns?q=";
    var placeHldr = '<img src="https://viaplaceholder.com/150">';
    var searchData;

    //listener for search button

    $('#search').click(function() {
        outputList.innerHTML = "";
        searchData = $('#search-box').val();
        //handle empty search input field
        if (searchData === "" || searchData === null) {
            displayError();
        }
        else {
            $.ajax({
                url: proxyurl + bookUrl + searchData,
                dataType: "json",
                success: function(res) {
                    console.log(res)
                    if(responce.totalItem === 0) {
                        alert('no results!... try again');
                    } else {
                        $("title").anitem('{margin-top: 10px}');
                        $(".book-list").css('visibility: visible');
                        // displayResults(res);
                    }
                },
                error: function() {
                    alert('Something went wrong!...');
                }
            })
        }
        $('#search-box').val('');
    })
});