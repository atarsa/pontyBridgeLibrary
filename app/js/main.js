// server base_url (external link, needs to be changed before submission)
const base_url = "http://192.168.0.15:8000";

// urls variables
var users_url = "/users";
var books_url = "/books";
var search_url = "/search";
var authors_url = "/authors"

// get the current location
var currentLocation = window.location.pathname;
console.log(`location: ${currentLocation}`);


// UI elements
// --- HomePage ---
let books_count = document.getElementById('books-count');
let users_count = document.getElementById('users-count');

// --- Users Page ---
let userSearchInput = document.getElementById('js-user-search');
let showResultsUl = document.querySelector('.show-search-results');

// --- Books Page ---
let bookSearchInput = document.getElementById('js-book-search');



// if on homePage show all records counts
if (currentLocation == "/index.html" || currentLocation == "/" ){
  getHomePageData();
}
// if on User Page show all user records
if (currentLocation == "/users.html"){
  showUsers();
  userSearchInput.addEventListener('keyup', filterResults);
}
// if on Books Page show all books records
if (currentLocation == "/books.html"){
  showBooks();
  bookSearchInput.addEventListener('keyup', filterResults);
}


async function getData(query){
  const response = await fetch(base_url+query);
  const data = response.json()

  return data
}

// get Books and Users count for HomePage
function getHomePageData(){
  try{
    
    // get books count
    getData(books_url).then(books => {
      books_count.innerHTML= books.length;
    })
    
    // get users count
    getData(users_url).then(users =>{
      users_count.innerHTML= users.length;
    })
 } catch(err){
  console.log(err);}
}

// Show All Users
function showUsers(){
  
  getData(users_url)
    .then(users => {
              
      for (let user of users){
        let li = document.createElement('li');
        li.setAttribute("class", "show-search-results__item show-search-results__item--user")
               
        li.innerHTML = `<span>${user.name}</span>
                        <span>${user.barcode}</span>
                        <span> ${user.memberType}</span>
                        <span> icons </span>`;
        showResultsUl.appendChild(li);
      }
  })
}

// Show All Books
function showBooks(){
  
  getData(books_url)
    .then(books => {
              
      for (let book of books){
        let li = document.createElement('li');
        li.setAttribute("class", "show-search-results__item--book show-search-results__item")
               
        li.innerHTML = `<span>${book.title}</span>
                        <span>${book.isbn}</span>
                        <span> icons </span>`;
        showResultsUl.appendChild(li);
      }
  })
}

// filter results
function filterResults(e){
  let text = e.target.value.toLowerCase();
 
  document.querySelectorAll(".show-search-results__item").forEach(li => {
    const item = li.textContent;
    if ( item.toLowerCase().indexOf(text) != -1){
      li.style.display = "inline-grid";
    } else {
      li.style.display = "none";
    }
  })
}

