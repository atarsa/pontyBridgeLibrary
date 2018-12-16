// --- Add Book Page ---

// --- UI variables ---
const addBookBtn = document.getElementById('js-add-book');
const addBookForm = document.getElementById('js-add-book-form');
const messageDiv = document.querySelector('.message-add-book');

const loadingAnimation = document.querySelector('.loading-animation');

// ADD book event listener
addBookForm.addEventListener("submit", addBook);

  

// add book to db
function addBook(e){
  // define UI variables
  let inputTitle = document.getElementById('js-title-input');
  let inputISBN = document.getElementById('js-isbn-input');
  let inputAuthor = document.getElementById('js-author-input');

  // disable submit button to prevent double submission
  addBookBtn.setAttribute('disabled', 'disabled');

  // Send POST request with book title and isbn, await response to get the book id
  let queryUrl = base_url+books_url;
  let bookData = {title: inputTitle.value,
              isbn: inputISBN.value}
  let authorData = {name: inputAuthor.value}
  console.log(queryUrl);
  
  let status;
   
  //show loading animation
  loadingAnimation.style.display = "block";

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

              loadingAnimation.style.display = "none";
              showMessage("Book added successfully", status);
              addBookBtn.disabled = false;
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