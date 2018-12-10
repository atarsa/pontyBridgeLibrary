// --- Add Book Page ---
const addBookBtn = document.getElementById('add-book');

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
  
  let params = `title=${inputTitle}&isbn=${inputISBN}`;
  const httpR = new XMLHttpRequest();
  httpR.open("POST", queryUrl, true);
  httpR.setRequestHeader('Content-type', 'application/json');
  
  
  httpR.send(JSON.stringify(bookData));
  httpR.onload = function() {
    // Do whatever with response
    let response = JSON.parse(httpR.response);
    
    const authorRequest = new XMLHttpRequest();
    let authorPostUrl = `${queryUrl}/${response.id}${authors_url}`;
    
    authorRequest.open("POST", authorPostUrl, true );
    authorRequest.setRequestHeader('Content-type', 'application/json');
    
    authorRequest.send(JSON.stringify(authorData));
    authorRequest.onload = function(){
      console.log(authorRequest.response);
    }
  
  }
  
   
  
  e.preventDefault();
}

