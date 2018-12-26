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
                
          showBooksResults(books);
        }, 2000);
      })
    .catch(err => console.log(err));
  e.preventDefault();
}

// list book results 
function showBooksResults(books){
  
  //get all books already on loan
  let booksOnLoan = [];
    
  // reset form
  UI.bookSearchForm.reset();

  if (books.length !== 0){
    // GET request to all loans
    getData("/loans")
    .then(loans => {
        for (let loan of loans){
        booksOnLoan.push(loan.BookId);
      }
        const li = document.createElement('li');
        li.setAttribute("class", " show-search-results__item--book li--results-header");
        li.innerHTML = `<span> Title </span>
                        <span> ISBN </span>
                        <span> Loan </span>`;
        UI.showSearchResults.appendChild(li);

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
              loanElm.innerHTML = 'loaned';
              loanElm.classList = "loaned btn";
          } else {
              // book available
              loanElm.innerHTML = `<i class="fas fa-plus-circle"></i>`
              loanElm.classList = "loan-book btn";
              loanElm.addEventListener("click", loanBook); 

          }
              
          li.appendChild(loanElm);
          UI.showSearchResults.appendChild(li);
        } 
    });
  } 
  else {
    const li = document.createElement('li');
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
  console.log(target.attributes)
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
        UI.showUserLoansDiv.style.display = "grid";
        UI.showSearchResults.style.display = "grid";
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