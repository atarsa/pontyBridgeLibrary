// ======== main.js ================ //

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


// if on homePage show all records counts
if (currentLocation == "/index.html" || currentLocation == "/" ){

  getHomePageData();
}

// if on User Page show all user records
if (currentLocation == "/users.html"){
  showUsers();
  UI.userSearchInput.addEventListener('keyup', filterResults);
  UI.showSearchResults.addEventListener("click", editElement);
}

// if on Books Page show all books records
if (currentLocation == "/books.html"){
  showBooks();
  UI.bookSearchInput.addEventListener('keyup', filterResults);
  UI.showSearchResults.addEventListener("click", editElement);
}

// if on add_book Page 
if (currentLocation == "/add_book.html"){
  UI.addBookForm.addEventListener("submit", addBook);
}

// if on add_user Page 
if (currentLocation == "/add_user.html"){
  UI.addForm.addEventListener("submit", addUser);
}

// if on search Page 
if (currentLocation == "/search.html"){
  UI.searchForm.addEventListener("submit", search);
  UI.showSearchResults.addEventListener("click", editElement); 
}

// if on laons Page 
if (currentLocation == "/loans.html"){
  UI.getBarcodeForm.addEventListener("submit", barcodeSearch);
}

// ===== requests =========

// GET request
async function getData(query){
  const response = await fetch(base_url+query);
  const data = response.json()

  return data
}
// POST request
async function sendData(url, inputData){
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(inputData),
    headers:{
      'Content-Type': 'application/json'
      }
    });
  
  const data = await response.json()
  return data
}

// PUT request
async function updateData(url, inputData){
  const response = await fetch(url, {
    method: "PUT",
    body: JSON.stringify(inputData),
    headers:{
      'Content-Type': 'application/json'
      }
    });
  
  const data = await response.json()
  return data
}

// ======= message and animation ============

function showMessage(msg, status = true){
    UI.messageDiv.style.display = "block";
    
    if (status){
      UI.messageDiv.classList.toggle("message--success");
    } else {
      UI.messageDiv.classList.toggle("message--alert");
    }
    
    UI.messageDiv.innerText = msg;
     
    //remove message after 3sec
      setTimeout(function(){
         UI.messageDiv.style.display = "none";
      }, 3000);
  }


