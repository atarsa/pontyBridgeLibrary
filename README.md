Course Work for Web Application module.
The goal was to create a front-end application to given simple REST API library server.  

Application is fully responsive , with mobile first approach.
I used Nunjucks, mainly for HTML templating and SCSS to work with styles. 
I used Gulp as a task runner. 

### Functionality:

- [x] U1 - Add a new User to the Library system with the fields Name, Barcode and Member Type:

Functionality available in librarian zone on "/add_user.html".


- [x] U2 - Get a User’s details from the Library system by searching on Name or Barcode.

Functionality available in librarian zone on "/search.html" and also on "/users.html" where all students records are listed.


- [x] U3 - Update a User’s Name or Member Type.

Functionality available in librarian zone on "/search.html" and on "/users.html". To modify a user pen icon should be clicked. Update Form will be populated with appropriate values.  

![user loans login](../screenshots/modifyuser.png)


- [x] U4 - Remove a User

Functionality available in librarian zone on "/search.html" and on "/users.html". To remove a user bin icon should be clicked. 


- [x] B1 - Add a new Book to the Library system with the fields Title, ISBN, Authors. 

Functionality available in librarian zone on "/add_book.html".


- [x] B2 - Get a Book’s details by searching on Title

Functionality available in librarian zone on "/search.html" and also on "/books.html" where all books records are listed.
 

- [x] B3 - Remove a Book

Functionality available in librarian zone on "/search.html" and on "/books.html". To remove a book bin icon should be clicked. 


- [x] L1 - Loan a Book to a User (if it is not already out on Loan), specifying the Due Date
- [x] L2 - Get a list of a User’s current Loans

Functionalities available in user zone on "/loans.html". User must first "login" with barcode. After "logging" in list of user loaned books is showed.
User then can search for a book (by title) and loan it if the book is available by clicking on plus icon. If book is unavailable clicking is disabled. Due Date is generated for next 14 days. 


![user loans screenshot](../screenshots/loans3.png)

- [x] L3 - Get the User currently borrowing a Book

Functionality available in librarian zone on "/search.html" and also on "/books.html" where all books records are listed. To check if book is available info icon should be clicked.
 

![user loans login](../screenshots/loaned1.png)

Extra functionality:
On Home Page ("/index.html") library records count are shown. 
I added index route to server code to minify requests to get this data. 
![homePageScreenShot](../screenshots/homepage2.png)

On "users.html" and "books.html" where all records are listed to search through results instead of making another request to server, filter function has been implemented.