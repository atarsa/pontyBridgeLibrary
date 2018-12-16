// --- Search Page ---
const searchForm = document.querySelector('.search-form');
const showSearchResults = document.querySelector('.show-search-results');
const messageDiv = document.querySelector('.message');
const loadingAnimation = document.querySelector('.loading-animation');

// SEARCH, UPDATE event listeneres 
searchForm.addEventListener("submit", search);
showSearchResults.addEventListener("click", editElement);  

// SEARCh, UPDATE functions
function search(e){
  showSearchResults.innerHTML = "";
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
  loadingAnimation.style.display = "block";
  // fetch results
  fetch(queryUrl)
    .then(resp => resp.json())
    .then(results => {
      //remove animation after 2s, show results afterwards
      setTimeout(function(){
        
        loadingAnimation.style.display = "none";
        showResults(results)
        
    }, 2000);
           
    }
      )
    .catch(err => console.log(err));

  e.preventDefault();
  }
  
function showResults(results) {
  
  showSearchResults.innerHTML = "";
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
        li.appendChild(deleteElm);
      }
      
      showSearchResults.appendChild(li);
      }
  } else {
    let li = document.createElement('li');
    li.innerText = "Sorry, no results found";
    showSearchResults.appendChild(li);
  }
  
}
function editElement(e){
  if(e.target.parentElement.matches('.update-user')){
    console.log(e.target.parentElement.parentElement.parentElement)
    updateUser(e.target.parentElement.parentElement.parentElement);
    
  } 
  else if(e.target.parentElement.matches('.delete-user')){
     deleteItem('user',e.target.parentElement.parentElement.parentElement);
    
  } else if(e.target.parentElement.matches('.delete-book')){

    deleteItem('book',e.target.parentElement.parentElement);
  } 
} 


function updateUser(target){
  // remove Event Listener to prevent creating new form with every click
  showSearchResults.removeEventListener("click", editElement);
  
  // Get element ID
  //console.log(target.attributes[0].value);
  let id = target.attributes[0].value;
  
  // create div with form to update user details
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
          showSearchResults. innerHTML = "";
          loadingAnimation.style.display = "block";

          //remove animation and clear input after 3sec, show message afterwards
           setTimeout(function(){
            loadingAnimation.style.display = "none";
            showMessage("User modified successfully", true);
          }, 1500);

          // add event listner back in case of more searches
          showSearchResults.addEventListener("click", editElement); 
         
        })
        .catch(error => console.error('Error:', error));
      
        
      } 
      else{
       // remove input form 
       updateUserForm.style.display = "none";
       showSearchResults.addEventListener("click", editElement);    
  
    }
    
    e.preventDefault();
  });
 
}


function deleteItem(itemType,target){
  console.log(target.attributes[0].value);
  const toDelete = confirm("Are you sure you want to delete this record?");
  if (toDelete){
    showSearchResults.innerHTML = "";
    // show loading animation
    loadingAnimation.style.display = "block";
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
      
      loadingAnimation.style.display = "none";
      // TODO: false to have red background color, refactor
      showMessage("Item deleted successfully", false);
      
  }, 3000);
    

  }
  
}