// ===== UI elements =====

const UI = {
  // --- "Global" ---
  showSearchResults: document.querySelector('.show-search-results'),
  messageDiv: document.querySelector('.message'),
  loadingAnimation: document.querySelector('.loading-animation'),
  
  // --- homePage ---
  books_count: document.getElementById('books-count'),
  users_count: document.getElementById('users-count'),
  
  // --- Users Page ---
  userSearchInput: document.getElementById('js-user-search'),
  
  // --- Books Page ---
  bookSearchInput: document.getElementById('js-book-search'),
  
  // --- HomePage ---
  books_count: document.getElementById('books-count'),
  users_count: document.getElementById('users-count'),

  // --- addBook Page ---
  addBookBtn: document.getElementById('js-add-book'),
  addBookForm: document.getElementById('js-add-book-form'),

  // --- addUser Page ---
  addUserBtn: document.getElementById('js-add-user'),
  addForm: document.querySelector('.add-form'),
  userNameInput: document.getElementById('js-full-name'),
  userBarcodeInput: document.getElementById('js-barcode'),
  userMemberTypeInput: document.getElementById('js-member-type'),
  
  // --- search Page---
  searchForm: document.querySelector('.search-form'),

  // --- loans Page ---
  welcomeUserDiv: document.querySelector('.welcome-user'),
  welcomeUserH2: document.querySelector('.welcome-user h2'),

  getBarcodeForm: document.querySelector('.get-barcode-form'),
  barcodeSearchInput: document.querySelector('.js-barcode-input'),
  barcodeSearchBtn: document.querySelector('.js-barcode-search'),
  
  showUserLoansDiv: document.querySelector('.show-user-loans'),
  userNameSpan: document.querySelector('.user-name'),
  loandedBooksCountSpan: document.querySelector('.loaned-books-count'),
  showLoansUl: document.querySelector('.loaned-books'),

  bookSearchForm: document.querySelector('.book-search-form'),
  bookInput: document.querySelector('.js-book-search-input'),
  bookSearchBtn: document.querySelector('.js-book-search'),

}

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



// ======= addBook.js =========

// add book to db
function addBook(e){
  // define UI variables
  let inputTitle = document.getElementById('js-title-input');
  let inputISBN = document.getElementById('js-isbn-input');
  let inputAuthor = document.getElementById('js-author-input');

  // disable submit button to prevent double submission
  UI.addBookBtn.setAttribute('disabled', 'disabled');

  // Send POST request with book title and isbn, await response to get the book id
  let queryUrl = base_url+books_url;
  let bookData = {title: inputTitle.value,
              isbn: inputISBN.value}
  let authorData = {name: inputAuthor.value}
  console.log(queryUrl);
  
  let status;
   
  //show loading animation
  UI.loadingAnimation.style.display = "block";

  sendData(queryUrl, bookData)
    .then(data => {
      //console.log(data)
      const bookID = data.id;
      const authorPostUrl = `${queryUrl}/${bookID}${authors_url}`
      //console.log(authorPostUrl)
      sendData(authorPostUrl, authorData)
        .then(() => {
            status = true;
             //remove animation and clear input after 3sec, show message afterwards
            setTimeout(function(){
            
              // clear input
              inputTitle.value = "";
              inputISBN.value = "";
              inputAuthor.value = "";

              UI.loadingAnimation.style.display = "none";
              showMessage("Book added successfully", status);
              UI.addBookBtn.disabled = false;
          }, 3000);
      
        });
    })
    .catch(err => {
        // send message that unsuccessfull
        status = false;
        showMessage("Oopss, something went wrong. Please try again.", status);
      
    })
  
  e.preventDefault();
}


// ==== addUser.js ====

function addUser(e){
  
  let queryUrl = base_url+users_url;
  
  let userData = {
    name: UI.userNameInput.value,
    barcode: UI.userBarcodeInput.value,
    memberType: UI.userMemberTypeInput.value
  }
  let status;

  // disable submit button to prevent double submission
  UI.addUserBtn.setAttribute('disabled', 'disabled');
  //show loading animation
  UI.loadingAnimation.style.display = "block";

  sendData(queryUrl, userData)
    .then( () => {
      
      status = true;
      
      //remove animation and clear input after 3sec, show message afterwards
      setTimeout(function(){
       
        // clear input
        UI.userNameInput.value = " ";
        UI.userBarcodeInput.value = " ";
        UI.userMemberTypeInput.value = " ";

        UI.loadingAnimation.style.display = "none";
        showMessage("User added successfully!", status);

        // "undisable add button"
        UI.addUserBtn.disabled = false;
     }, 3000);
      
    })
    .catch((err => {
      console.log(err);
      status = false;
      
      //remove message after 3sec
      setTimeout(function(){
        // clear input
        UI.userNameInput.value = " ";
        UI.userBarcodeInput.value = " ";
        UI.userMemberTypeInput.value = " ";

        UI.loadingAnimation.style.display = "none";
        
        showMessage("Oops, something went wrong!!", status);
     }, 3000);
      
    }
    ));
        
  e.preventDefault();
}


// ===== booksAndUsers.js ======

// Show All Users on users.html
function showUsers(){
  
  getData(users_url)
    .then(users => {
              
      for (let user of users){
        let li = document.createElement('li');
        // add data atribute to identify item in db
        li.setAttribute("data-userId", user.id); 
        
        li.setAttribute("class", "show-search-results__item show-search-results__item--user")
                      
        li.innerHTML = `<span>${user.name}</span>
                        <span>${user.barcode}</span>
                        <span> ${user.memberType}</span>`
                        
        const updateElm = document.createElement('a');
        updateElm.setAttribute("href", "#");
        updateElm.innerHTML = '<i class="fas fa-pen-square"></i>';
        updateElm.classList = "update-user";
                        
        const deleteElm = document.createElement('a');
        deleteElm.setAttribute("href", "#");
        deleteElm.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteElm.classList = "delete-user";
                
        const buttonsDiv = document.createElement('div');
        buttonsDiv.appendChild(updateElm)
        buttonsDiv.appendChild(deleteElm);
        li.appendChild(buttonsDiv);
        
        
        UI.showSearchResults.appendChild(li);
      }
  })
}

// Show all books on books.html
function showBooks(){
 
  getData(books_url)
    .then(books => {
              
      for (let book of books){
        let li = document.createElement('li');
        li.setAttribute("data-bookId", book.id);
        li.setAttribute("class", "show-search-results__item--book show-search-results__item")
               
        li.innerHTML = `<span>${book.title}</span>
                        <span>${book.isbn}</span>`;

        const deleteElm = document.createElement('a');
        deleteElm.setAttribute("href", "#");
        deleteElm.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteElm.classList = "delete-book";
                        
                
        // info icon, to show loan status of book on click
        const infoElm = document.createElement('a');
        infoElm.setAttribute("href", "#");
        infoElm.innerHTML = '<i class="fas fa-info"></i>';
        infoElm.classList = "loan-info";
                       
        const buttonsDiv = document.createElement('div');
        buttonsDiv.appendChild(infoElm);
        buttonsDiv.appendChild(deleteElm);
        li.appendChild(buttonsDiv);
                     
        UI.showSearchResults.appendChild(li);
      }
  })
}

// filter through results on books.html / users.html
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

// ======= Home Page  ======
// get Books and Users count for HomePage
function getHomePageData(){
  try{
    
    // get books count
    getData(books_url).then(books => {
      UI.books_count.innerHTML= books.length;
    })
    
    // get users count
    getData(users_url).then(users =>{
      UI.users_count.innerHTML= users.length;
    })
 } catch(err){
  console.log(err);}
}

// ===== loans.js =====

let userID;

// get user id
function barcodeSearch(e){
  
  let barcode = UI.barcodeSearchInput.value
  let query_url = search_url + `?type=user&barcode=${barcode}`;
  console.log(query_url);

  getData(query_url)
    .then(response => {
      // if no barcode found
      if(response.length === 0){
        UI.welcomeUserH2.innerText = `Sorry, no record found.`;
        UI.barcodeSearchInput.value = "";
      } else {
        
        // hide barcode search
        UI.welcomeUserDiv.style.display = "none";
        
        // show user loans
        UI.showUserLoansDiv.style.display = "block";
        UI.userNameSpan.innerText = response[0].name; 

        userID = response[0].id;

        // get loanded books
        getUserLoanedBooks();
              
      }
      })
  
  e.preventDefault();
}

// show user's loans if any
function showUserLoanedBooks(loans){
  //create "header" for results
  const headerLi = document.createElement('li');
  headerLi.setAttribute("class", "loaned-books__item loaned-books__item--header");
   headerLi.innerHTML = `<span>Title</span>
                        <span>Due Back</span>`
  UI.showLoansUl.appendChild(headerLi);
  
// show list of loaned books
  for (let loan of loans){
                    
    // get book title
    let getBookUrl = `${books_url}/${loan.BookId}`;
    getData(getBookUrl)
      .then(book => {
        // console.log(book.title);
        // console.log(loan)

        const li = document.createElement('li');
        li.setAttribute("class", "loaned-books__item")
        li.innerHTML = `<span>${book.title}</span>
                        <span>${new Date(loan.dueDate).toLocaleDateString()}</span>`;
        
        UI.showLoansUl.appendChild(li);
      })

  }
  // add event listener to Book Form
  UI.bookSearchForm.addEventListener("submit", getBooks);
}
// search for a book
function getBooks(e){

  // clean displayed results if any
  UI.showSearchResults.innerHTML = "";
  // show loading animation
  UI.loadingAnimation.style.display = "block";

  let query_url = search_url + `?type=book&title=${UI.bookInput.value}`;
  getData(query_url)
    .then(books => 
      { 
        //remove animation after 2s, show results afterwards
        setTimeout(function(){
          UI.loadingAnimation.style.display = "none";  
                
          showBooksResults(books)
        }, 2000);
      })
    .catch(err => console.log(err));
  e.preventDefault();
}

// list book results 
function showBooksResults(books){
  
  //get all books already on loan
  let booksOnLoan = [];
    
  //UI.showSearchResults.innerHTML = "";
  UI.bookInput.value = "";

  if (books.length !== 0){
    // GET request to all loans
    getData("/loans")
    .then(loans => {
        for (let loan of loans){
        booksOnLoan.push(loan.BookId);
      }
      
      for (const book of books){
        let id = book.id;
        let li = document.createElement('li');
        
        li.setAttribute("data-bookId", id);
        li.setAttribute("class", "show-search-results__item--book")
        li.innerHTML = `<span>${book.title}</span>
                        <span>${book.isbn}</span>`;
        
        const loanElm = document.createElement('a');
        loanElm.setAttribute("href", "#");
        
        // check if book loaned already
          if (booksOnLoan.includes(book.id) ){
            console.log(`loaned, ${book.id}`)
            loanElm.innerHTML = 'loaned';
            loanElm.classList = "loaned";
        } else {
            console.log(`available, ${book.id}`)
            loanElm.innerHTML = `<i class="fas fa-plus-circle"></i>`
            loanElm.classList = "loan-book";
        }
                
        li.appendChild(loanElm);
        
        UI.showSearchResults.appendChild(li);
        UI.showSearchResults.addEventListener("click", loanBook);
      } 
    });
  } 
  else {
    let li = document.createElement('li');
    li.setAttribute("class", "li--no-results");
    li.innerText = "Sorry, no results found";
    UI.showSearchResults.appendChild(li);
  }
  
}

function getUserLoanedBooks(){
  let query_url = users_url + `/${userID}/loans`;

  getData(query_url)  
    .then(loans => {
      //console.log(loans);
      // get loanded books count
      let bookCount = loans.length;
      if (bookCount === 0){
        UI.loandedBooksCountSpan.innerText = "no book";
        // add evennt listener to Book Form
        UI.bookSearchForm.addEventListener("submit", getBooks);
      } else {
          if (bookCount === 1){
            UI.loandedBooksCountSpan.innerText = "1 book";
          } else {
            UI.loandedBooksCountSpan.innerText = `${bookCount} books`;
          }

          showUserLoanedBooks(loans);
        
        }
      }
    )

}


function loanBook(e){
  let target = e.target.parentElement.parentElement 
  // get book id
  let bookID = target.attributes[0].value;
  let dueDate = generateDueDate();
  let dataToSend = {dueDate: dueDate};
  let query_url = base_url+users_url + `/${userID}/loans/${bookID}`; 
  
      // clear all results and "hide" them
      UI.showSearchResults.innerHTML = "";
      UI.showSearchResults.style.display = "none";
      
      UI.showLoansUl.innerHTML = "";
      UI.showUserLoansDiv.style.display = "none";
      
       // show loading animation
      UI.loadingAnimation.style.display = "block";
   sendData(query_url, dataToSend)
    .then(response => {
             
  
      // msg if loaned successfully
      setTimeout(function(){
        UI.loadingAnimation.style.display = "none";
        showMessage(`Book loaned. Due back on ${dueDate}.`);
        
      }, 2000);
      
      
      // update loaned books list and counts 
      setTimeout(function(){
        UI.showUserLoansDiv.style.display = "block";
        UI.showSearchResults.style.display = "block";
        getUserLoanedBooks();
        
      }, 5500);
      
    })
  
   e.preventDefault()
}

function generateDueDate(){
  // credits: [2] 
  const date = new Date();
  const loanDuration = 14; // 2 weeks
  const nextDate = date.getDate() + loanDuration;

  date.setDate(nextDate)
  return date.toLocaleDateString()

}
// --- Search Page ---

function search(e){
  UI.showSearchResults.innerHTML = "";
  let queryUrl = base_url+search_url;
  
  // get values from search form
  let searchType = document.getElementById('search-type').value;
  let searchInput = document.getElementById('search').value.toLowerCase();
  
  if (searchType == 'user'){
    if (/\D+/.exec(searchInput)){
      queryUrl += `?type=${searchType}&name=${searchInput}`;
    } else if (/\d+/.exec(searchInput)){
      queryUrl += `?type=${searchType}&barcode=${searchInput}`;
    }
  } else if (searchType == 'book'){
    queryUrl += `?type=${searchType}&title=${searchInput}`;
  }
  
  console.log(queryUrl);
  UI.loadingAnimation.style.display = "block";
  // fetch results
  fetch(queryUrl)
    .then(resp => resp.json())
    .then(results => {
      //remove animation after 2s, show results afterwards
      setTimeout(function(){
        
        UI.loadingAnimation.style.display = "none";
        showResults(results)
        
    }, 2000);
           
    }
      )
    .catch(err => console.log(err));

  e.preventDefault();
  }
  
function showResults(results) {
  
  UI.showSearchResults.innerHTML = "";
  document.getElementById('search').value = "";
  if (results.length !== 0){
    for (let result of results){
      let id = result.id;
      console.log(result);
      let li = document.createElement('li');
      // show results for user
      if ('name' in result){
        // add data atribute to identify item in db
        li.setAttribute("data-userId", id);
        li.setAttribute("class", "show-search-results__item--user")
        li.innerHTML = `<span>${result.name}</span>
                        <span>${result.barcode}</span>
                        <span> ${result.memberType}</span>`;
        const updateElm = document.createElement('a');
        updateElm.setAttribute("href", "#");
        updateElm.innerHTML = '<i class="fas fa-pen-square"></i>';
        updateElm.classList = "update-user";
        
        const deleteElm = document.createElement('a');
        deleteElm.setAttribute("href", "#");
        deleteElm.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteElm.classList = "delete-user";

        const buttonsDiv = document.createElement('div');
        buttonsDiv.appendChild(updateElm)
        buttonsDiv.appendChild(deleteElm);
        li.appendChild(buttonsDiv);
      
      } else { 
        // show results for books
        li.setAttribute("data-bookId", id);
        li.setAttribute("class", "show-search-results__item--book")
        li.innerHTML = `<span>${result.title}</span>
                        <span>${result.isbn}</span>`;
        
        const deleteElm = document.createElement('a');
        deleteElm.setAttribute("href", "#");
        deleteElm.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteElm.classList = "delete-book";
        

        // info icon, to show loan status of book on click
        const infoElm = document.createElement('a');
        infoElm.setAttribute("href", "#");
        infoElm.innerHTML = '<i class="fas fa-info"></i>';
        infoElm.classList = "loan-info";
       
        const buttonsDiv = document.createElement('div');
        buttonsDiv.appendChild(infoElm);
        buttonsDiv.appendChild(deleteElm);
        li.appendChild(buttonsDiv);
      }
      
      UI.showSearchResults.appendChild(li);
     
    }
     
  } else {
    let li = document.createElement('li');
    li.innerText = "Sorry, no results found";
    UI.showSearchResults.appendChild(li);
  }
  
}



function editElement(e){
  if(e.target.parentElement.matches('.update-user')){
    console.log(e.target.parentElement.parentElement.parentElement)
    updateUser(e.target.parentElement.parentElement.parentElement);
    
  } 
  else if(e.target.parentElement.matches('.delete-user')){
     deleteItem('user',e.target.parentElement.parentElement.parentElement);
    
  } 
  else if(e.target.parentElement.matches('.delete-book')){

    deleteItem('book',e.target.parentElement.parentElement.parentElement);
  } 
  else if(e.target.parentElement.matches('.loan-info')){

    showLoanInfo(e.target.parentElement.parentElement.parentElement);
  }
} 


function updateUser(target){
  // remove Event Listener to prevent creating new form with every click
  UI.showSearchResults.removeEventListener("click", editElement);
  
  // Get element ID
  //console.log(target.attributes[0].value);
  let id = target.attributes[0].value;
  
  // get div with form to update user details
  const updateUserForm = document.querySelector('.form--update-user');
  const updateName = document.getElementById('js-update-name');
  const updateMemberType = document.getElementById('js-update-member-type');
  const updateUserBtn = document.getElementById('js-update-user');
  
  updateUserForm.style.display = "grid";
 
  
  
  //updateUserForm.classList.toggle('.form--update-user--show');
  updateName.value = target.children[0].innerText;
  
  
  updateUserBtn.addEventListener("click", function(e){
    
    let toUpdate = confirm("Are you sure you want to update this record?")
    if (toUpdate){
      let queryUrl = `${base_url}${users_url}/${id}`;
      let updatedData = {name: updateName.value,
                        memberType: updateMemberType.value}
  
      console.log("updating...");
      console.log(queryUrl);
      // PUT request to update data on the server
      updateData(queryUrl, updatedData)
        .then(response => {
          console.log('Success:', JSON.stringify(response));
          updateUserForm.style.display = "none";
          UI.showSearchResults. innerHTML = "";
          UI.loadingAnimation.style.display = "block";

          //remove animation and clear input after 3sec, show message afterwards
           setTimeout(function(){
            UI.loadingAnimation.style.display = "none";
            showMessage("User modified successfully", true);
          }, 1500);

          // show list of updated books records if on books.html or users.html
          setTimeout(function(){
            if (currentLocation == "/users.html"){
              showUsers();
            }

            }, 6000);
          // add event listner back in case of more searches
          UI.showSearchResults.addEventListener("click", editElement); 
         
        })
        .catch(error => console.error('Error:', error));
      
        
      } 
      else{
       // remove input form 
       updateUserForm.style.display = "none";
       UI.showSearchResults.addEventListener("click", editElement);    
  
    }
    
    e.preventDefault();
  });
 
}


function deleteItem(itemType,target){
  console.log(target.attributes[0].value);
  const toDelete = confirm("Are you sure you want to delete this record?");
  if (toDelete){
    UI.showSearchResults.innerHTML = "";
    // show loading animation
    UI.loadingAnimation.style.display = "block";
      // Get element ID
    let id = target.attributes[0].value;

    // Get query Url depending on type of item
    let queryUrl;
    if (itemType === "user"){
    queryUrl = `${base_url}${users_url}/${id}`;
    } else if (itemType === "book"){
      queryUrl = `${base_url}${books_url}/${id}`;
    }
    
  console.log("deleting...");
    
  // DELETE request to update data on the server
    fetch(queryUrl, {method: "DELETE"})
      .catch(error => console.error('Error:', error));
    //remove animation and clear input after 3sec, show message afterwards
    setTimeout(function(){
            
      // clear input
      
      UI.loadingAnimation.style.display = "none";
      // TODO: false to have red background color, refactor
      showMessage("Record deleted successfully");
         
      
  }, 3000);
    
  // show list of updated books records if on books.html or users.html
  setTimeout(function(){
    if (currentLocation == "/books.html"){
      showBooks();
    }
    if (currentLocation == "/users.html"){
      showUsers();
      }

  }, 6000);
  

  }
  
}

async function showLoanInfo(target){
  
  const bookId = target.attributes[0].value;
  
  let loanedBooks = await getAllLoanedBooks();
  

  // check if book is among loanedBooks 
  let loaned = (loanedBooks.find(x => x.BookId == bookId)) // credits [1] 
  if (loaned){
        
    let user = await getUserName(loaned.UserId);
    UI.messageDiv.innerHTML = `<p> Book loaned by ${user.name} (${user.barcode}) </p> <p> Due back on: ${loaned.dueDate}</p>`;

    UI.messageDiv.style.display = "block";
          
    
  } else {
    UI.messageDiv.innerHTML = `<p> Book available </p>`;
    UI.messageDiv.style.display = "block";
   
  }
  

}

async function getUserName(id){
    let queryUrl = users_url + `/${id}`; 
    return await getData(queryUrl)   
}

async function getAllLoanedBooks(){
    return await getData("/loans")   
}