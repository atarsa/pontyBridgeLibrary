// ===== UI elements =====

const UI = {
  // --- "Global" ---
  showSearchResults: document.querySelector('.show-search-results'),
  messageDiv: document.querySelector('.message'),
  loadingAnimation: document.querySelector('.loading-animation'),
  
  // --- homePage ---
  booksCount: document.getElementById('books-count'),
  booksAvailable: document.getElementById('books-av-count'),
  usersCount: document.getElementById('users-count'),
  
  // --- Users Page ---
  userSearchInput: document.getElementById('js-user-search'),
  
  // --- Books Page ---
  bookSearchInput: document.getElementById('js-book-search'),
    
  // --- addBook Page ---
  addBookBtn: document.getElementById('js-add-book'),
  addBookForm: document.getElementById('js-add-book-form'),

  // --- addUser Page ---
  addUserBtn: document.getElementById('js-add-user'),
  addForm: document.querySelector('.add-form'),
  userNameInput: document.getElementById('js-full-name'),
  userBarcodeInput: document.getElementById('js-barcode'),
  userMemberTypeInput: document.getElementById('js-member-type'),
  
  // --- search Page---
  searchForm: document.querySelector('.search-form'),

  // --- loans Page ---
  welcomeUserDiv: document.querySelector('.welcome-user'),
  welcomeUserH2: document.querySelector('.welcome-user h2'),

  getBarcodeForm: document.querySelector('.get-barcode-form'),
  barcodeSearchInput: document.querySelector('.js-barcode-input'),
  barcodeSearchBtn: document.querySelector('.js-barcode-search'),
  
  showUserLoansDiv: document.querySelector('.show-user-loans'),
  userNameSpan: document.querySelector('.user-name'),
  loandedBooksCountSpan: document.querySelector('.loaned-books-count'),
  showLoansUl: document.querySelector('.loaned-books'),

  bookSearchForm: document.querySelector('.book-search-form'),
  bookInput: document.querySelector('.js-book-search-input'),
  bookSearchBtn: document.querySelector('.js-book-search'),

}
