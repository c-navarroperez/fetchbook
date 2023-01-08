//addEventListeners
const search = document.querySelector("#searchInput");
const searchBtn = document.querySelector("#searchBtn");
const main = document.querySelector("main");
const nytSection = document.querySelector("#nytSection");
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
//parseBooksArray function, after being given an array of data it for loops through it to scrape relevant data and then uses the data to insert to DOM.
function parseBooksArray(arr) {
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
    let coverImage = arr[i].volumeInfo?.imageLinks?.smallThumbnail;
    let coverImageHTML = `<img src="${coverImage}" alt="Book Cover">`;
    if (coverImage === undefined) {
      coverImageHTML = "<p>No image available</p>";
    }
    main.insertAdjacentHTML(
      "beforeend",
      `<div class="bookCard item"><h3>Title: ${title}</h3><p>Author: ${author}</p><p>Publish Year: ${publishDate}</p><p>ISBN: ${isbn}</p><p>Description: ${description}</p> ${coverImageHTML}
      `
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
      parseBooksArray(dataArray);
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
          `<div class="item"><h2>${li.list_name}</h2><p>Title: ${toCorrectCase(
            title
          )}</p><p>Author: ${author}</p><p>Description: ${description}</p><a href="${amazonLink}" target="_blank">
          <img src="${image}" alt="Best Seller image"></a></div>`
        );
      });
    });
}

//searchInput addEventListener
search.addEventListener("keydown", function (e) {
  if (e.key !== "Enter" || search.value === "") {
    return;
  }
  let input = search.value;
  bookSearch(input);
});
//searchBtn addEventListener
searchBtn.addEventListener("click", function (e) {
  if (searchInput.value === "") {
    return;
  }
  let input = searchInput.value;
  bookSearch(input);
});

//bestSellers called on page load to load/fetch NYT section
bestSellers();
