// server base_url (external link, needs to be changed before submission)
const base_url = "http://192.168.0.15:8000";

// urls variables
var users_url = "/users";
var books_url = "/books";
var search_url = "/search";
var authors_url = "/authors"

// get the current location
var currentLocation = window.location.pathname;
console.log(`location: ${currentLocation}`);


// UI elements
// --- HomePage ---
let books_count = document.getElementById('books-count');
let users_count = document.getElementById('users-count');

// --- User Page ---
let showAllUsers = document.querySelector('.show-all-users');
let userSearchInput = document.getElementById('js-user-search');

// get Books and Users count for HomePage
function getHomePageData(){
      try{
        
        // get books count
        getData(books_url).then(books => {
          books_count.innerHTML= books.length;
        })
        
        // get users count
        getData(users_url).then(users =>{
          users_count.innerHTML= users.length;
        })
     } catch(err){
      console.log(err);
    }
}

// if on homePage show all records counts
if (currentLocation == "/index.html" || currentLocation == "/" ){
  getHomePageData();
}
// if on User Page show all user records
if (currentLocation == "/users.html"){
  showUsers();
  userSearchInput.addEventListener('keyup', filterResults);
}


async function getData(query){
  const response = await fetch(base_url+query);
  const data = response.json()

  return data
}

// Get Users
function showUsers(){
  console.log("fetching users")
  getData(users_url)
    .then(users => {
      
        
      for (let user of users){
        
        let li = document.createElement('li');
        li.setAttribute("class", "show-search-results__item--user")
               
        li.innerHTML = `<span>${user.name}</span>
                        <span>${user.barcode}</span>
                        <span> ${user.memberType}</span>
                        <span> icons </span>`;
        showAllUsers.appendChild(li);
      }
  })
}

// filter results
function filterResults(e){
  
  let text = e.target.value.toLowerCase();
  
  document.querySelectorAll(".show-search-results__item--user").forEach(user => {
    const item = user.textContent;
    if ( item.toLowerCase().indexOf(text) != -1){
      user.style.display = "inline-grid";
    } else {
      user.style.display = "none";
    }
  })

}

