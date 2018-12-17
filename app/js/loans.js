// --- Loans Page ---

// UI variables
const welcomeUserDiv = document.querySelector('.welcome-user');
const welcomeUserH2 = document.querySelector('.welcome-user h2');

const getBarcodeForm = document.querySelector('.get-barcode-form');
const barcodeSearchInput = document.querySelector('.js-barcode-input');
const barcodeSearchBtn = document.querySelector('.js-barcode-search');

const showUserLoansDiv = document.querySelector('.show-user-loans');
const userNameSpan = document.querySelector('.user-name');
const loandedBooksCountSpan = document.querySelector('.loaned-books-count');

const showLoansUl = document.querySelector('.loaned-books');

const bookSearch = document.querySelector('.js-book-search-input');
const bookSearchBtn = document.querySelector('.js-book-search');


// event listeners
getBarcodeForm.addEventListener("submit", barcodeSearch);

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

        // get loanded books
        let query_url = users_url + `/${response[0].id}/loans`;

        getData(query_url)  
          .then(response => {
            console.log(response);
            
            // get loanded books count
            let bookCount = response.length;
            if (bookCount === 0){
              loandedBooksCountSpan.innerText = "no book";
            } else {
                if (bookCount === 1){
                  loandedBooksCountSpan.innerText = "1 book";
                } else {
                  loandedBooksCountSpan.innerText = `${bookCount} books`;
                }
                



            }
             
          })
      }
      
      console.log(response);
    })

  e.preventDefault();
}

// show user's loans if any


// search for a book

// list book results 

// get book id

// add date

// POST request

// check if book loaned already??