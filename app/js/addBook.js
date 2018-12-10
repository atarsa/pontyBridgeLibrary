// --- Add Book Page ---

// --- UI variables ---
const addBookBtn = document.getElementById('add-book');
const messageDiv = document.querySelector('.message-add-book');

// ADD book event listener
addBookBtn.addEventListener("click", addBook);

  

// add book to db
function addBook(e){
  // define UI variables
  let inputTitle = document.getElementById('title-input').value;
  let inputISBN = document.getElementById('isbn-input').value;
  let inputAuthor = document.getElementById('author-input').value;

   
  // Send POST request with book title and isbn, await response to get the book id
  let queryUrl = base_url+books_url;
  let bookData = {title: inputTitle,
              isbn: inputISBN}
  let authorData = {name: inputAuthor}
  console.log(queryUrl);
  
      
  sendData(queryUrl, bookData)
    .then(data => {
      //console.log(data)
      const bookID = data.id;
      const authorPostUrl = `${queryUrl}/${bookID}${authors_url}`
      //console.log(authorPostUrl)
      sendData(authorPostUrl, authorData)
        .then(() => {
            // clean input fields
            inputTitle = "";
            inputISBN = "";
            inputAuthor = "";

            // send message that successfull
            messageDiv.style.background = "green";
            messageDiv.innerText = "Book added successfully";
            // remove message after 3sec
             setTimeout(function(){
              messageDiv.innerHTML = "";}, 3000);
        });
    })
    .catch(err => {
        // send message that unsuccessfull
        messageDiv.style.background = "red";
        messageDiv.innerText = "Oopss, something went wrong. Please try again.";
        // remove message after 3sec
         setTimeout(function(){
          messageDiv.innerHTML = "";}, 3000);
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