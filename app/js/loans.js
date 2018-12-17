// --- Loans Page ---

// UI variables
// showResultsUl from main.js
const welcomeUserDiv = document.querySelector('.welcome-user');
const welcomeUserH2 = document.querySelector('.welcome-user h2');

const getBarcodeForm = document.querySelector('.get-barcode-form');
const barcodeSearchInput = document.querySelector('.js-barcode-input');
const barcodeSearchBtn = document.querySelector('.js-barcode-search');

const showUserLoansDiv = document.querySelector('.show-user-loans');
const userNameSpan = document.querySelector('.user-name');
const loandedBooksCountSpan = document.querySelector('.loaned-books-count');

const showLoansUl = document.querySelector('.loaned-books');

const bookSearchForm = document.querySelector('.book-search-form');
const bookInput = document.querySelector('.js-book-search-input');
const bookSearchBtn = document.querySelector('.js-book-search');

// also declared on search.js
const messageDiv = document.querySelector('.message');

// event listeners
getBarcodeForm.addEventListener("submit", barcodeSearch);

let userID;
// get user id
function barcodeSearch(e){
  
  let barcode = barcodeSearchInput.value
  let query_url = search_url + `?type=user&barcode=${barcode}`;
  console.log(query_url);

  getData(query_url)
    .then(response => {
      // if no barcode found
      if(response.length === 0){
        welcomeUserH2.innerText = `Sorry, no record found.`;
        barcodeSearchInput.value = "";
      } else {
        
        // hide barcode search
        welcomeUserDiv.style.display = "none";
        
        // show user loans
        showUserLoansDiv.style.display = "block";
        userNameSpan.innerText = response[0].name; 

        userID = response[0].id;

        // get loanded books
        getLoanedBooks();
              
      }
      })
  
  e.preventDefault();
}

// show user's loans if any
function showLoanedBooks(loans){
  //create "header" for results
  const headerLi = document.createElement('li');
  headerLi.setAttribute("class", "loaned-books__item");
  headerLi.style.fontSize = "1.2em";
  headerLi.style.fontWeight = "bold";
  headerLi.innerHTML = `<span>Title</span>
                        <span>Due Back</span>`
  showLoansUl.appendChild(headerLi);
  
// show list of loaned books
  for (let loan of loans){
                    
    // get book title
    let getBookUrl = `${books_url}/${loan.BookId}`;
    getData(getBookUrl)
      .then(book => {
        console.log(book.title);
        console.log(loan)

        const li = document.createElement('li');
        li.setAttribute("class", "loaned-books__item")
        li.innerHTML = `<span>${book.title}</span>
                        <span>${loan.dueDate}</span>`;
        
        showLoansUl.appendChild(li);
      })

  }
  // add evennt listener to Book Form
  bookSearchForm.addEventListener("submit", getBooks);
}
// search for a book
function getBooks(e){
  //console.log(bookInput.value);
  let query_url = search_url + `?type=book&title=${bookInput.value}`;
  getData(query_url)
    .then(books => 
      { 
        showBooksResults(books)
      })
    .catch(err => console.log(err));
  e.preventDefault();
}

// list book results 
function showBooksResults(books){

  showResultsUl.innerHTML = "";
  bookInput.value = "";
  if (books.length !== 0){
    for (let book of books){
      let id = book.id;
      let li = document.createElement('li');
      
      li.setAttribute("data-bookId", id);
      li.setAttribute("class", "show-search-results__item--book")
      li.innerHTML = `<span>${book.title}</span>
                      <span>${book.isbn}</span>`;
        
      const loanElm = document.createElement('a');
      loanElm.setAttribute("href", "#");
      loanElm.innerHTML = '<i class="fas fa-plus-circle"></i>';
      loanElm.classList = "loan-book";
      li.appendChild(loanElm);
      
      showResultsUl.appendChild(li);
      showResultsUl.addEventListener("click", loanBook);
    } 
    
  }  else {
    let li = document.createElement('li');
    li.innerText = "Sorry, no results found";
    showResultsUl.appendChild(li);
  }
  
}

function getLoanedBooks(){
  let query_url = users_url + `/${userID}/loans`;

  getData(query_url)  
    .then(loans => {
      //console.log(loans);
      // get loanded books count
      let bookCount = loans.length;
      if (bookCount === 0){
        loandedBooksCountSpan.innerText = "no book";
        // add evennt listener to Book Form
        bookSearchForm.addEventListener("submit", getBooks);
      } else {
          if (bookCount === 1){
            loandedBooksCountSpan.innerText = "1 book";
          } else {
            loandedBooksCountSpan.innerText = `${bookCount} books`;
          }

          showLoanedBooks(loans);
        
        }
      }
    )

}


function loanBook(e){
  let target = e.target.parentElement.parentElement 
  // get book id
  let bookID = target.attributes[0].value;
  let dueDate = "2018-12-30"
  let dataToSend = {dueDate: dueDate};
  console.log(`user: ${userID}`);
  let query_url = base_url+users_url + `/${userID}/loans/${bookID}`; 
  console.log(query_url);


  sendData(query_url, dataToSend)
    .then(response => {
      console.log(response);
      // msg if loanded successfully 
      showResultsUl.style.display = "none";
      showLoansUl.innerHTML = "";
      showLoansUl.style.display = "none";
      showMessage(`Book loaned. Due back on ${dueDate}.`, true);

      
      // update loaned books list and counts 
      setTimeout(function(){
        showLoansUl.style.display = "block";
        getLoanedBooks();
      }, 3000);
      
    })
  
  
  e.preventDefault()
}
// add date



// check if book loaned already??

// POST request