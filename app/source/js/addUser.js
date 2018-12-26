// ==== addUser.js ====

function addUser(e){
  
  let queryUrl = base_url+users_url;
  
  let userData = {
    name: UI.userNameInput.value,
    barcode: UI.userBarcodeInput.value,
    memberType: UI.userMemberTypeInput.value
  }
 
  // disable submit button to prevent double submission
  UI.addUserBtn.setAttribute('disabled', 'disabled');
  //show loading animation
  UI.loadingAnimation.style.display = "block";

  sendData(queryUrl, userData)
    .then( () => {
      //remove animation and clear input after 3sec, show message afterwards
      setTimeout(function(){
        // reset form
        UI.addForm.reset();
        UI.loadingAnimation.style.display = "none";
        showMessage("User added successfully!");

        // "undisable add button"
        UI.addUserBtn.disabled = false;
     }, 3000);
      
    })
    .catch((err => {
      console.log(err);
            
      //remove message after 3sec
      setTimeout(function(){
        // reset form
        UI.addForm.reset();
        UI.loadingAnimation.style.display = "none";
        showMessage("Oops, something went wrong!!", false);
     }, 3000);
    }
    ));
  e.preventDefault();
}

