// server base_url (external link, needs to be changed before submission)
const base_url = "http://192.168.0.15:8000";
// urls variables
var users_url = "/users";
var books_url = "/books";
var search_url = "/search";

// UI elements
// --- HomePage ---


// --- Search Page ---
const searchForm = document.querySelector('.search-form');
const searchResults = document.querySelector('.search-results');
const messageDiv = document.querySelector('.message');



// // get Books and Users count for HomePage
// async function getHomePageData(){
  
//   try{
//     const booksResponse = await fetch(base_url+books_url);
//     const usersResponse = await fetch(base_url+users_url);
  
//     const booksData = await booksResponse.json();
//     const usersData = await usersResponse.json();
  
//     let books_count = document.getElementById('books-count');
//       books_count.innerHTML= booksData.length;
  
//     let users_count = document.getElementById('users-count');
//     users_count.innerHTML= usersData.length;
//   } catch(err){
//     console.log(err);
//   }
// }
// getHomePageData();

// All users
async function getData(query){
  const response = await fetch(base_url+query);
  const data = response.json()

  return data
}

// Get Users
getData(users_url)
  .then(users => {
    
    const showAllUsers = document.querySelector('.show-all-users');
    
    for (let user of users){
      console.log(user);
      let li = document.createElement('li');
      li.innerHTML = `${user.name}, ${user.barcode}, ${user.memberType}`;
      showAllUsers.appendChild(li);
    }
  })

// SEARCH, UPDATE event listeneres 
searchForm.addEventListener("submit", search);
searchResults.addEventListener("click", editElement);    


// SEARCh, UPDATE functions
function search(e){
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
 
  // fetch results
  fetch(queryUrl)
    .then(resp => resp.json())
    .then(results => showResults(results))
    .catch(err => console.log(err));

  e.preventDefault();
  }
  
function showResults(results) {
  
  searchResults.innerHTML = "";
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
        li.appendChild(updateElm);
        li.appendChild(deleteElm);
      
      } else { // show results for books
        li.setAttribute("data-bookId", id);
        li.innerHTML = `${result.title}, ${result.isbn}`;
        
        const deleteElm = document.createElement('a');
        deleteElm.setAttribute("href", "#");
        deleteElm.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteElm.classList = "delete-book";
        li.appendChild(deleteElm);
      }
      
      searchResults.appendChild(li);
      }
  } else {
    let li = document.createElement('li');
    li.innerText = "Sorry, no results found";
    searchResults.appendChild(li);
  }
  
}
function editElement(e){
  if(e.target.parentElement.matches('.update-user')){
    //console.log(e.target.parentElement.parentElement)
    updateUser(e.target.parentElement.parentElement);
  } 
  else if(e.target.parentElement.matches('.delete-user')){
    //console.log(`delete: ${e.target.parentElement.parentElement}`);
    deleteUser(e.target.parentElement.parentElement);
    
  } else if(e.target.parentElement.matches('.delete-book')){
    console.log("delete book");
    console.log(e.target.parentElement.parentElement)
  } 
} 



function updateUser(target){
  // remove Event Listener to prevent creating new form with every click
  searchResults.removeEventListener("click", editElement);
  console.log(target);
  // Get element ID
  console.log(target.attributes[0].value);
  let id = target.attributes[0].value;
  
  // create div with form to update user details
  const div = document.createElement('div');
  div.setAttribute("class", "update-user");
  
  //console.log(target.children[0].innerText);
  //console.log(target.children[2].innerText);
  const inputName = document.createElement("input");
  inputName.setAttribute("type", "text");
  inputName.value = target.children[0].innerText;
  
  const inputMemberType = document.createElement("select");
  const inputMemberTypeStudent = document.createElement("option");
  inputMemberTypeStudent.setAttribute("value","student");
  inputMemberTypeStudent.innerText = "Student";

  const inputMemberTypeStaff = document.createElement("option");
  inputMemberTypeStaff.setAttribute("value","staff");
  inputMemberTypeStaff. innerText = "Staff";
  inputMemberType.appendChild(inputMemberTypeStudent);
  inputMemberType.appendChild(inputMemberTypeStaff);
  
  const submitBtn = document.createElement('input');
  submitBtn.setAttribute("type", "submit");
  submitBtn.setAttribute("value", "Submit");

  div.appendChild(inputName);
  div.appendChild(inputMemberType);
  div.appendChild(submitBtn);

  target.appendChild(div);

  submitBtn.addEventListener("click", function(){
    //confirm("Are you sure you want to update this user?")
    let queryUrl = `${base_url}${users_url}/${id}`;
    let updatedData = {name: inputName.value,
                      memberType: inputMemberType.value}

    console.log("updating...");
    console.log(queryUrl);
    // PUT request to update data on the server
    fetch(queryUrl, {
      method: "PUT",
      body: JSON.stringify(updatedData),
      headers:{
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
    .then(response => console.log('Success:', JSON.stringify(response)))
    .catch(error => console.error('Error:', error));

    // Message if successfull
    searchResults.innerHTML = "";
    messageDiv.style.background = "green";
    messageDiv.innerText = "User modified successfully";
    // remove message after 3sec
    setTimeout(function(){
      messageDiv.innerHTML = "";}, 3000);
    
  });
 
}


function deleteUser(target){
  console.log(target.attributes[0].value);
  confirm("Are you sure you want to delete this item?");
  // Get element ID
  
  let id = target.attributes[0].value;

  let queryUrl = `${base_url}${users_url}/${id}`;
    

  console.log("deleting...");
    
  // DELETE request to update data on the server
    fetch(queryUrl, {method: "DELETE"})
      .catch(error => console.error('Error:', error));

    // Message if successfull
    searchResults.innerHTML = "";
    messageDiv.style.background = "red";
    messageDiv.innerText = "User deleted successfully";
    // remove message after 3sec
    setTimeout(function(){
      messageDiv.innerHTML = "";}, 3000);
}