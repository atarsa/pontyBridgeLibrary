
// --- add User Page ---
// UI variables
const addUserBtn = document.getElementById('js-add-user');
const addForm = document.querySelector('.add-form') 
const messageDiv = document.querySelector('.message');
const loadingAnimation = document.querySelector('.loading-animation');

const userNameInput = document.getElementById('js-full-name');
const userBarcodeInput = document.getElementById('js-barcode');
const userMemberTypeInput = document.getElementById('js-member-type');


addForm.addEventListener("submit", addUser);

function addUser(e){
  
  let queryUrl = base_url+users_url;
  
  let userData = {
    name: userNameInput.value,
    barcode: userBarcodeInput.value,
    memberType: userMemberTypeInput.value
  }
  let status;
  //show loading animation
  loadingAnimation.style.display = "block";

  sendData(queryUrl, userData)
    .then( () => {
      
      status = true;
      
      //remove animation and clear input after 3sec, show message afterwards
      setTimeout(function(){
       
        // clear input
        userNameInput.value = " ";
        userBarcodeInput.value = " ";
        userMemberTypeInput.value = " ";

        loadingAnimation.style.display = "none";
        showMessage("User added successfully!", status);
     }, 3000);
      
    })
    .catch((err => {
      console.log(err);
      status = false;
      
      //remove message after 3sec
      setTimeout(function(){
        // clear input
        userNameInput.value = " ";
        userBarcodeInput.value = " ";
        userMemberTypeInput.value = " ";

        loadingAnimation.style.display = "none";
        
        showMessage("Oops, something went wrong!!", status);
     }, 3000);
      
    }
    ));
        
  e.preventDefault();
}

