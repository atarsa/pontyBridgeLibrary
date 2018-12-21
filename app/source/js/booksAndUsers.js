// ===== booksAndUsers.js ======

// Show All Users on users.html
function showUsers(){
  
  getData(users_url)
    .then(users => {
              
      for (let user of users){
        let li = document.createElement('li');
        li.setAttribute("class", "show-search-results__item show-search-results__item--user")
               
        li.innerHTML = `<span>${user.name}</span>
                        <span>${user.barcode}</span>
                        <span> ${user.memberType}</span>
                        <span> icons </span>`;
        UI.showSearchResults.appendChild(li);
      }
  })
}

// Show all books on books.html
function showBooks(){
 
  getData(books_url)
    .then(books => {
              
      for (let book of books){
        let li = document.createElement('li');
        li.setAttribute("class", "show-search-results__item--book show-search-results__item")
               
        li.innerHTML = `<span>${book.title}</span>
                        <span>${book.isbn}</span>
                        <span> icons </span>`;
        UI.showSearchResults.appendChild(li);
      }
  })
}

// filter through results on books.html / users.html
function filterResults(e){
  let text = e.target.value.toLowerCase();
 
  document.querySelectorAll(".show-search-results__item").forEach(li => {
    const item = li.textContent;
    if ( item.toLowerCase().indexOf(text) != -1){
      li.style.display = "inline-grid";
    } else {
      li.style.display = "none";
    }
  })
}
