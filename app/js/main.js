// server nase_url (external link, needs to be changed before submission)
const base_url = "http://192.168.0.15:8000";

var users_url = "/users";
var books_url = "/books";
var search_url = "/search";

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
document.querySelector('.search-form').addEventListener("submit", search);
  
  
  

//});


function search(e){
  let queryUrl = base_url+search_url;
  // get values from search form
  
  let searchType = document.getElementById('search-type').value;
 
  let searchInput = document.getElementById('search').value.toLowerCase()
  
  if (searchType == 'user'){
    if (/\D+/.exec(searchInput)){
      queryUrl += `?type=${searchType}&name=${searchInput}`;
    } else if (/\d+/.exec(searchInput)){
      queryUrl += `?type=${searchType}&barcode=${searchInput}`;
    }
  } else if (searchType == 'book'){
    queryUrl += `?type=${searchType}&title=${searchInput}`;
  }


  e.preventDefault();
  console.log(queryUrl);

  async function getResults(){
    const response = await fetch(queryUrl);
    const data = await response.json();
    return data
  }
  
  getResults().then( results => {
    console.log(results)
    const showResults = document.querySelector('.search-results');
    
    for (let result of results){
      
      console.log(result);
      let li = document.createElement('li');

      // show results for user
      if ('name' in result){
        li.innerHTML = `${result.name}, ${result.barcode}, ${result.memberType}`;
      } else { // show results for books
        li.innerHTML = `${result.title}, ${result.isbn}`;
      }
      
      showResults.appendChild(li);
    }
  })
  
}
