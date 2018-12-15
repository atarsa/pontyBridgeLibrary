// --- Add Book Page ---

// --- UI variables ---
const addBookBtn = document.getElementById('js-add-book');
const messageDiv = document.querySelector('.message-add-book');

// ADD book event listener
addBookBtn.addEventListener("click", addBook);

  

// add book to db
function addBook(e){
  // define UI variables
  let inputTitle = document.getElementById('js-title-input');
  let inputISBN = document.getElementById('js-isbn-input');
  let inputAuthor = document.getElementById('js-author-input');

   
  // Send POST request with book title and isbn, await response to get the book id
  let queryUrl = base_url+books_url;
  let bookData = {title: inputTitle.value,
              isbn: inputISBN.value}
  let authorData = {name: inputAuthor.value}
  console.log(queryUrl);
  
  let status;
      
  sendData(queryUrl, bookData)
    .then(data => {
      //console.log(data)
      const bookID = data.id;
      const authorPostUrl = `${queryUrl}/${bookID}${authors_url}`
      //console.log(authorPostUrl)
      sendData(authorPostUrl, authorData)
        .then(() => {
            // clean input fields
            console.log(inputTitle)
            inputTitle.value = "";
            inputISBN.value = "";
            inputAuthor.value = "";

            // send message that successfull
            status = true;
            showMessage("Book added successfully", status);
            
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