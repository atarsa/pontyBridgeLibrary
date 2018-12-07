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

// SEARCH functions
searchForm.addEventListener("submit", search);
    
 
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
      console.log(result);
      let li = document.createElement('li');
      // show results for user
      if ('name' in result){
        li.innerHTML = `${result.name}, ${result.barcode}, ${result.memberType}`;
        const updateElm = document.createElement('a');
        updateElm.innerHTML = '<i class="fas fa-pen-square"></i>';
        updateElm.classList = "update-user";
        
        const deleteElm = document.createElement('a');
        deleteElm.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteElm.classList = "delete-user";
        li.appendChild(updateElm);
        li.appendChild(deleteElm);
      
      } else { // show results for books
        li.innerHTML = `${result.title}, ${result.isbn}`;
        
        const deleteElm = document.createElement('a');
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
  
function updateUser(e){
  console.log();
}

function deleteUser(e){
  alert("Do you realy want me go?");
}