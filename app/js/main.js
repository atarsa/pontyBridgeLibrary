// server base_url (external link, needs to be changed before submission)
const base_url = "http://192.168.0.15:8000";

// urls variables
var users_url = "/users";
var books_url = "/books";
var search_url = "/search";
var authors_url = "/authors"

// get the current location
var currentLocation = window.location.pathname;


// UI elements
// --- HomePage ---
let books_count = document.getElementById('books-count');
let users_count = document.getElementById('users-count');


// // get Books and Users count for HomePage
// async function getHomePageData(){
  
//   try{
//     console.log("fetching data...")
//     const booksResponse = await fetch(base_url+books_url);
//     const usersResponse = await fetch(base_url+users_url);
  
//     const booksData = await booksResponse.json();
//     const usersData = await usersResponse.json();
    
//     console.log(booksData);
    
//     books_count.innerHTML= booksData.length;
//     users_count.innerHTML= usersData.length;
//   } catch(err){
//     console.log(err);
//   }
// }

function getHomePageData(){
  
    try{
      console.log("fetching data...")
     
        getData(books_url).then(books => {
          console.log(books)
          books_count.innerHTML= books.length;
        })
      
      
        getData(users_url).then(users =>{
          users_count.innerHTML= users.length;
        })
     }
       
    catch(err){
      console.log(err);
    }
  }
// if on homePage show all records counts
if (currentLocation == "/index.html" || currentLocation == "/" ){
  getHomePageData();
}


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
      //console.log(user);
      let li = document.createElement('li');
      li.innerHTML = `${user.name}, ${user.barcode}, ${user.memberType}`;
      showAllUsers.appendChild(li);
    }
  })



