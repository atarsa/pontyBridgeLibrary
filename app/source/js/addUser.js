// ==== addUser.js ====

function addUser(e){
  
  let queryUrl = base_url+users_url;
  
  let userData = {
    name: UI.userNameInput.value,
    barcode: UI.userBarcodeInput.value,
    memberType: UI.userMemberTypeInput.value
  }
  let status;

  // disable submit button to prevent double submission
  UI.addUserBtn.setAttribute('disabled', 'disabled');
  //show loading animation
  UI.loadingAnimation.style.display = "block";

  sendData(queryUrl, userData)
    .then( () => {
      
      status = true;
      
      //remove animation and clear input after 3sec, show message afterwards
      setTimeout(function(){
       
        // clear input
        UI.userNameInput.value = " ";
        UI.userBarcodeInput.value = " ";
        UI.userMemberTypeInput.value = " ";

        UI.loadingAnimation.style.display = "none";
        showMessage("User added successfully!", status);

        // "undisable add button"
        UI.addUserBtn.disabled = false;
     }, 3000);
      
    })
    .catch((err => {
      console.log(err);
      status = false;
      
      //remove message after 3sec
      setTimeout(function(){
        // clear input
        UI.userNameInput.value = " ";
        UI.userBarcodeInput.value = " ";
        UI.userMemberTypeInput.value = " ";

        UI.loadingAnimation.style.display = "none";
        
        showMessage("Oops, something went wrong!!", status);
     }, 3000);
      
    }
    ));
        
  e.preventDefault();
}

