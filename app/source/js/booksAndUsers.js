// ===== booksAndUsers.js ======

// Show All Users on users.html
function showUsers(){
  
  getData(users_url)
    .then(users => {
              
      for (let user of users){
        let li = document.createElement('li');
        // add data atribute to identify item in db
        li.setAttribute("data-userId", user.id); 
        
        li.setAttribute("class", "show-search-results__item show-search-results__item--user")
                      
        li.innerHTML = `<span>${user.name}</span>
                        <span>${user.barcode}</span>
                        <span> ${user.memberType}</span>`
                        
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
        
        
        UI.showSearchResults.appendChild(li);
      }
  })
}

// Show all books on books.html
function showBooks(){
 let url = books_url + '?allEntities=true'
  getData(url)
    .then(books => {
              
      for (let book of books){
        let li = document.createElement('li');
        li.setAttribute("data-bookId", book.id);
        li.setAttribute("class", "show-search-results__item--user show-search-results__item")
         
        
        li.innerHTML = `<span>${book.title}</span>
                        <span>${book.Authors[0] ? book.Authors[0].name : "no author"}</span>
                        <span>${book.isbn}</span>`;

        const deleteElm = document.createElement('a');
        deleteElm.setAttribute("href", "#");
        deleteElm.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteElm.classList = "delete-book";
                        
                
        // info icon, to show loan status of book on click
        const infoElm = document.createElement('a');
        infoElm.setAttribute("href", "#");
        infoElm.innerHTML = '<i class="fas fa-info"></i>';
        infoElm.classList = "loan-info";
                       
        const buttonsDiv = document.createElement('div');
        buttonsDiv.appendChild(infoElm);
        buttonsDiv.appendChild(deleteElm);
        li.appendChild(buttonsDiv);
                     
        UI.showSearchResults.appendChild(li);
      }
  })
  .catch(err => {console.log(err)}

  )
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
