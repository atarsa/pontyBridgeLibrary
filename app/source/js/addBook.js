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
              isbn: inputISBN.value};

  let authorData = {name: inputAuthor.value}
    
  //show loading animation
  UI.loadingAnimation.style.display = "block";

  sendData(queryUrl, bookData)
    .then(data => {
      
      const bookID = data.id;
      const authorPostUrl = `${queryUrl}/${bookID}${authors_url}`
      
      sendData(authorPostUrl, authorData)
        .then(() => {
            status = true;
             //remove animation and clear input after 3sec, show message afterwards
            setTimeout(function(){
            
              // reset form
              UI.addBookForm.reset();
           
              UI.loadingAnimation.style.display = "none";
              showMessage("Book added successfully");
              UI.addBookBtn.disabled = false;
          }, 3000);
      
        });
    })
    .catch(err => {
        // send message that unsuccessfull
        showMessage("Oops, something went wrong. Please try again.", false);
    })
  e.preventDefault();
}
