const base_url = "http://192.168.0.15:8000";

var users_url = "/users";
var books_url = '/books';

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



