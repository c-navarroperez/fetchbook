//addEventListeners
const search = document.querySelector("#fetchbook-search-input");
const searchBtn = document.querySelector("#fetchbook-search-button");
const nytCatSelectDrop = $("#nytCatSelectDropD");
const nytCatSelectDropD = $("#nytCatSelectDropD a");
const nytCatSelectDropDMItems = document.querySelector("#nytCatSelectDropD");
const main = document.querySelector("main");
const nytSection = document.querySelector("#nytSection");
const nytCatSelect = document.querySelector("#nytCatSelect")

//Api Keys
const nytAPIKey = "JGBNorym4yKMbGSVrRthJlg207eHEfsV";
const booksRunKey = "durnemjx4rdbc0m7r6ma";

//alt imgLink, if issues arise with googleapis
// let imgLink = `https://covers.openlibrary.org/b/olid/${coverKey}-S.jpg`;

//toCorrectCase Function, Takes string, converts to Lower case, makes first character uppercase and returns
function toCorrectCase(str) {
  let string = [...str.toLowerCase()];
  let firstLetter = string.splice(0, 1).toString().toUpperCase();
  let newString = firstLetter + string.join("").toString();
  return newString;
}

//Google API version
//parseBooks function, after being given an array of data it for loops through it to scrape relevant data and then uses the data to insert to DOM.
function parseBooks(arr) {
  main.innerHTML = "";
  for (let i = 0; i < 10; i++) {
    console.log(arr[i]);
    let title = arr[i].volumeInfo.title;
    let author = arr[i].volumeInfo.authors?.join(", ") || "Author not found";
    let publishDate =
      arr[i].volumeInfo.publishedDate?.slice(0, 4) || "No publish date found";
    let isbn;
    if (arr[i].volumeInfo.industryIdentifiers) {
      isbn = arr[i].volumeInfo.industryIdentifiers[0].identifier;
    } else {
      isbn = "No ISBN found";
    }
    let description =
      arr[i].volumeInfo.description || "No description available";
    let coverImage = arr[i].volumeInfo?.imageLinks?.thumbnail;
    let coverImageHTML = `<img src="${coverImage}" class="card-img-top" alt="Book Cover">`;
    if (coverImage === undefined) {
      coverImageHTML = "<p>No image available</p>";
    }
    main.insertAdjacentHTML(
      "beforeend",
      `<div class="card" style="width: 18rem">
      ${coverImageHTML}
      <div class="card-body">
        <h5 class="card-title">${title}</h5>
        <p class="card-text">${description}</p>
        <a href="#" class="btn btn-primary">Where to purchase</a>
      </div>
    </div>`
    );
  }
}

//bookSearch function, searches for book in openLibrary api using given book title
function bookSearch(title) {
  search.value = "";
  nytSection.classList.add("hide");
  fetch(`https://www.googleapis.com/books/v1/volumes?q=title:${title}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.totalItems === 0) {
        main.innerHTML = "";

        throw new Error("No results found, please try searching again");
      }
      let dataArray = data.items.slice();
      // Sent list of books returned in array format to parseBooks func to process and add html + data to webpage
      parseBooks(dataArray);
    })
    .catch((err) => {
      main.insertAdjacentHTML(
        "beforeend",
        `<div class="bookCard item"><h3>${err}</h3>`
      );
      console.log(err);
    });
}

//bestSellers function, utilises NYTimes best seller api to fetch data on page load(not yet)
function bestSellersCatLists() {
  fetch(
    `https://api.nytimes.com/svc/books/v3/lists/overview.json?api-key=${nytAPIKey}`
  )
    .then((res) => res.json())
    .then((data) => data.results.lists)
    .then((list) => {
      list.forEach((li) => {
        let title = li.list_name;
        // let author = li.books[0].author;
        // let image = li.books[0].book_image;
        // let description = li.books[0].description;
        // if (description === "") {
        //   description = "N/A";
        // }
        // let amazonLink = li.books[0].amazon_product_url;
        // console.log(`bestSellersCatLists Func - ${title}`)
        nytCatSelectDropDMItems.insertAdjacentHTML(
          "beforeend",
          `<a class="dropdown-item" href="#">${title}</a>`
        );
      });
    });
}

//bestSellers function, utilises NYTimes best seller api to fetch data on page load(not yet)
function bestSellers() {
  fetch(
    `https://api.nytimes.com/svc/books/v3/lists/overview.json?api-key=${nytAPIKey}`
  )
    .then((res) => res.json())
    .then((data) => data.results.lists)
    .then((list) => {
      list.forEach((li) => {
        let title = li.books[0].title;
        let author = li.books[0].author;
        let image = li.books[0].book_image;
        let description = li.books[0].description;
        if (description === "") {
          description = "N/A";
        }
        let amazonLink = li.books[0].amazon_product_url;
        nytSection.insertAdjacentHTML(
          "beforeend",
          `<div class="card" style="width: 18rem">
          <img
            src="${image}"
            class="card-img-top"
            alt="Book image"
          />
          <div class="card-body">
            <h5 class="card-title">${toCorrectCase(title)}</h5>
            <p class="card-text">${description}</p>
            <a href="${amazonLink}" class="btn btn-primary">Where to purchase</a>
          </div>
        </div>`
        );
      });
    });
}

//searchInput addEventListener
search.addEventListener("keydown", function (e) {
  if (e.key !== "Enter" || search.value === "") {
    return;
  }
  e.preventDefault();
  let input = search.value;
  bookSearch(input);
});
//searchBtn addEventListener
searchBtn.addEventListener("click", function (e) {
  if (searchInput.value === "") {
    return;
  }
  e.preventDefault();
  let input = searchInput.value;
  bookSearch(input);
});

$('.dropdown-menu').on('click', 'a', function(){
  //Grab user selection from the list
  var selText = $(this).text();

  console.log(selText);
  $(this).parents('.dropdown').find('.dropdown-toggle').html(selText);

  //bestSellers called on page load to load/fetch NYT section
  // bestSellers();

});


bestSellersCatLists()

//
//bestSellers called on page load to load/fetch NYT section
// bestSellers();

//short summary on code
//On page load, bestSellers function is called which fetches nyt API and creates HTML elements from them. Then once a book is searched for the bookSearch function is called. The search data is then used to fetch API data which is then passed into the parseBooks function. This then for loops (for limit set to 10) through information and and inserts HTML from it.
