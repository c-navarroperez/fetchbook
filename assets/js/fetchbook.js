//addEventListeners
const search = document.querySelector("#fetchbook-search-input");
const searchBtn = document.querySelector("#fetchbook-search-button");
const nytCatSelectDropDMenu = $("#nytCatSelectDropDMenu");
const nytBookListSection = $("section");
const main = document.querySelector("main");
const nytSection = document.querySelector("#nytSection");
// const descriptionClick = document.querySelectorAll(".descriptionClick");
const cardBody = document.querySelectorAll(".card-body");

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
        <div class="modal fade" id="descriptionModal${i}" tabindex="-1" aria-labelledby="descriptionModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="descriptionModalLabel">${title}</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <p>Author: ${author}</p>
              ${description}
              <p class="pt-3">ISBN: ${isbn}</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
      <button type="button" class="btn modalBtn" data-toggle="modal" data-target="#descriptionModal${i}">
  Click for description
</button>
        <a href="#" class="btn btn-primary">Where to purchase</a>
      </div>
    </div>`
    );
  }
}

//bookSearch function, searches for book in openLibrary api using given book title
function bookSearch(userInput) {
  search.value = "";
  nytSection.classList.add("hide");
  fetch(`https://www.googleapis.com/books/v1/volumes?q=${userInput}`)
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

//bestSellers category list function, utilises NYTimes best seller api to fetch data on page load(not yet)
function bestSellersCatLists() {
  fetch(
    `https://api.nytimes.com/svc/books/v3/lists/overview.json?api-key=${nytAPIKey}`
  )
    .then((res) => res.json())
    .then((data) => data.results.lists)
    .then((list) => {
      list.forEach((li) => {
        // Grab the book list category name
        let listName = li.list_name;

        // Add the book list category names to the drop down menu item area
        nytCatSelectDropDMenu.append(
          `<a class="dropdown-item" href="#">${listName}</a>`
        );
      });
    });
}

//bestSellers function, utilises NYTimes best seller api to fetch data on page load(not yet)
function bestSellers(cat) {
  fetch(
    `https://api.nytimes.com/svc/books/v3/lists/overview.json?api-key=${nytAPIKey}`
  )
    .then((res) => res.json())
    .then((data) => data.results.lists)
    .then((list) => {
      //Clear book list cards to display new ones
      $("section div").remove();

      // For each item (li) in the list process them
      list.forEach((li) => {
        // Capture the book list category name e.g. Young Adult Paperback Monthly
        let catListName = li.list_name;
        // If current items list_name matches user selected category (cat), then print out the book details in cards
        if (catListName === cat) {
          li.books.forEach((book) => {
            let title = book.title;
            let author = book.author;
            let image = book.book_image;
            let description = book.description;
            if (description === "") {
              description = "N/A";
            }
            let amazonLink = book.amazon_product_url;
            // Add cards inside of section with 'nytBookList' id
            nytBookListSection.append(
              `<div class="card" id= "#nytBookListCard" style="width: 18rem">
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
        }
      });
    });
}

function Init() {
  //bestSellersCatLists called on page load to fetch via NYT's api, the best selling books categories to populated the drop down menu
  bestSellersCatLists();

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

  // Dropdown event listner for dynamic additions to the drop down menu items (a tags's)
  nytCatSelectDropDMenu.on("click", "a", function () {
    //Grab user selection from the list
    var selText = $(this).text();

    //Update the dropdown text to reflect the users selection
    $(this).parents(".dropdown").find(".dropdown-toggle").html(selText);

    //bestSellers called, passing users category selection value and display top book details
    bestSellers(selText);
  });
}

Init();

//short summary on code
//On page load, bestSellers function is called which fetches nyt API and creates HTML elements from them. Then once a book is searched for the bookSearch function is called. The search data is then used to fetch API data which is then passed into the parseBooks function. This then for loops (for limit set to 10) through information and and inserts HTML from it.
