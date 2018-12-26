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
           
    })
    .catch(err => console.log(err));

  e.preventDefault();
  }
  
function showResults(results) {
  
  UI.showSearchResults.innerHTML = "";
  // reset form
  UI.searchForm.reset();

  if (results.length !== 0){
       
    for (let result of results){
      let id = result.id;
      
      let li = document.createElement('li');
      // show results for user
      if ('name' in result){

        // add data atribute to identify item in db
        li.setAttribute("data-userId", id);
        li.setAttribute("class", "show-search-results__item--4col")
        li.innerHTML = `<span>${result.name}</span>
                        <span>${result.barcode}</span>
                        <span> ${result.memberType}</span>`;
        // create update and delete buttons
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
        li.setAttribute("class", "show-search-results__item--3col")
        li.innerHTML = `<span>${result.title}</span>
                        <span>${result.isbn}</span>`;
        
        // create info and delete buttons
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
  let id = target.attributes[0].value;
  
  // get div with form to update user details
  const updateUserForm = document.querySelector('.form--update-user');
  const updateName = document.getElementById('js-update-name');
  const updateMemberType = document.getElementById('js-update-member-type');
  const updateUserBtn = document.getElementById('js-update-user');
  
  updateUserForm.style.display = "grid";
 // get user info
  updateName.value = target.children[0].innerText;
  
  // add event listener to cancel button
  document.querySelector('.btn-cancel').addEventListener("click", function(){
    updateUserForm.style.display = "none";
    UI.showSearchResults.addEventListener("click", editElement); 
  });

  // update user details on submit
  updateUserBtn.addEventListener("click", function(e){
    
    let toUpdate = confirm("Are you sure you want to update this record?")
    if (toUpdate){
      let queryUrl = `${base_url}${users_url}/${id}`;
      let updatedData = {name: updateName.value,
                        memberType: updateMemberType.value};
  
      // PUT request to update data on the server
      updateData(queryUrl, updatedData)
        .then(response => {
          updateUserForm.style.display = "none";
          UI.showSearchResults.innerHTML = "";
          UI.loadingAnimation.style.display = "block";

          //remove animation and clear input after 3sec, show message afterwards
           setTimeout(function(){
            UI.loadingAnimation.style.display = "none";
            showMessage("User modified successfully", true);
          }, 1500);

          // show list of updated users records if on users.html
          setTimeout(function(){
            if (currentLocation == "/users.html"){
              showUsers();
            }

            }, 6000);
          // add event listener back in case of more searches
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
  // get book title from target element
  const bookTitle = target.childNodes[0].innerText;
  const bookId = target.attributes[0].value;
  
  let loanedBooks = await getAllLoanedBooks();
  

  // check if book is among loanedBooks 
  let loaned = (loanedBooks.find(x => x.BookId == bookId)) // credits [1] 
  if (loaned){
        
    let user = await getUserName(loaned.UserId);
    UI.messageDiv.innerHTML = ` <i class="fas fa-times"></i>
    <p> <b>${bookTitle}</b> loaned by ${user.name} (${user.barcode}) </p> <p> <b>Due back</b> on: ${new Date(loaned.dueDate).toLocaleDateString()}</p>`; // format Date string

    UI.messageDiv.style.display = "block";

    
  } else {
    UI.messageDiv.innerHTML = `<i class="fas fa-times"></i>
                        <p> <b>${bookTitle}</b>: book available. </p>`;
    UI.messageDiv.style.display = "block";
   
  }
  // remove message on click
  document.querySelector('.fa-times').addEventListener("click", function(){
    UI.messageDiv.style.display = "none";
  })

}

async function getUserName(id){
  try{
    let queryUrl = users_url + `/${id}`; 
    return await getData(queryUrl)  
  }
   catch(e){
     console.log("Error!", e);
   }  
}

async function getAllLoanedBooks(){
  try{
    return await getData("/loans")  
  }
  catch(e){
    console.log("Error!", e);
  }  
}