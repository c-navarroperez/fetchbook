//addEventListeners
const search = document.querySelector("#searchInput");
const searchBtn = document.querySelector("#searchBtn");

//getPrice function, uses ISBN to find average price of book
function getPrice(isbn) {
  const proxyURL = "https://api.allorigins.win/get?url=";
  const apiURL = encodeURIComponent(
    `https://booksrun.com/api/price/sell/${isbn}?key=durnemjx4rdbc0m7r6ma`
  );

  fetch(proxyURL + apiURL)
    .then((res) => res.json())
    .then((data) => {
      return JSON.parse(data.contents);
    })
    .then((data) => {
      if (data.result.status === "success") {
        console.log(data.result.text);
      } else {
        throw new Error("Unable to find book in prices database");
      }
    })
    .catch((err) => console.log(err));
}

//bookSearch function, searches for book in openLibrary api using given book title
function bookSearch(title) {
  search.value = "";
  fetch(`http://openlibrary.org/search.json?q=${title}`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.numFound === 0) {
        throw new Error("No results found, please try searching again");
      }
      console.log(
        `${data.docs[0].title}
    ${data.docs[0].isbn.splice(0, 5)}
    ${data.docs[0].author_name}
    `
      );
      console.log(data.docs[0].isbn[0]);
      getPrice(data.docs[0].isbn[1]);
    })
    .catch((err) => console.log(err));
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
