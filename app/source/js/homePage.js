// ======= Home Page  ======
// get Books and Users count for HomePage
function getHomePageData(){
  try{
      
      getData("/").then(info => {
        UI.booksCount.innerHTML = info.books;
        UI.booksAvailable.innerHTML = info.books - info.loans;
        UI.usersCount.innerHTML = info.users;
    })
 } catch(err){
  console.log(err);}
}
