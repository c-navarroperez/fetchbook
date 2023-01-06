//addEventListeners
const search = document.querySelector("#searchInput");
const searchBtn = document.querySelector("#searchBtn");
const main = document.querySelector("main");
const nytAPIKey = "JGBNorym4yKMbGSVrRthJlg207eHEfsV";
const booksRunKey = "durnemjx4rdbc0m7r6ma";
//NYT link for reviews if needed
// `https://api.nytimes.com/svc/books/v3/reviews.json?title=${title}&api-key=${nytAPIKey}`

// getPrice function, uses ISBN to find average price of book. Works BUT, API price data is lacking
function getPrice(title) {
  const proxyURL = "https://api.allorigins.win/get?url=";
  const apiURL = encodeURIComponent(
    `https://booksrun.com/api/price/sell/${title}?key=${booksRunKey}`
  );
  fetch(proxyURL + apiURL)
    .then((res) => res.json())
    .then((data) => {
      return JSON.parse(data.contents);
    })
    .then((data) => {
      if (data.result.status === "success") {
        console.log(data.result.text?.Average);
      } else {
        throw new Error("Unable to find book in prices database");
      }
    })
    .catch((err) => console.log(err));
}

//parseBooksArray function, after being given an array of data it for loops through it to scrape relevant data. It then uses data to make a fetch request for an image and then uses data to insert HTML. (Future refactor/break into seperate functions?)
function parseBooksArray(arr) {
  for (let i = 0; i < 10; i++) {
    let title = arr[i].title;
    let author = arr[i].author_name[0];
    let publishYear = arr[i].first_publish_year;
    let isbn = arr[i].isbn[0];
    let editionCount = arr[i].edition_count;
    let coverKey = arr[i].cover_edition_key;
    getPrice(isbn);
    //alt imgLink, if issues arise with googleapis
    // let imgLink = `https://covers.openlibrary.org/b/olid/${coverKey}-S.jpg`;
    fetch(`https://www.googleapis.com/books/v1/volumes?q=title:${title}`)
      .then((res) => res.json())
      .then((data) => {
        return data.items[0].volumeInfo.imageLinks.smallThumbnail;
      })
      .then((link) => {
        main.insertAdjacentHTML(
          "beforeend",
          `<div class="bookCard"><h3>${title}</h3><p>${author}</p><p>${publishYear}</p><p>${isbn}</p><p>${editionCount}</p> <img src="${link}" alt="Book Cover">
          `
        );
      });
  }
}

//bookSearch function, searches for book in openLibrary api using given book title
function bookSearch(title) {
  search.value = "";
  fetch(`http://openlibrary.org/search.json?q=${title}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.numFound === 0) {
        throw new Error("No results found, please try searching again");
      }
      let dataArray = data.docs.slice();
      parseBooksArray(dataArray);
    })
    .catch((err) => console.log(err));
}

//bestSellers function, utilises NYTimes best seller api to fetch data on page load(not yet)
function bestSellers() {
  fetch(
    `https://api.nytimes.com/svc/books/v3/lists/overview.json?api-key=${nytAPIKey}`
  )
    .then((res) => res.json())
    .then((data) => data.results.lists)
    .then((list) => {
      console.log(list);
    });
}
bestSellers();

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
