// ======= Home Page  ======
// get Books and Users count for HomePage
function getHomePageData(){
  try{
    
    // get books count
    getData(books_url).then(books => {
      UI.books_count.innerHTML= books.length;
    })
    
    // get users count
    getData(users_url).then(users =>{
      UI.users_count.innerHTML= users.length;
    })
 } catch(err){
  console.log(err);}
}
