
// --- add User Page ---
// UI variables
const addUserBtn = document.getElementById('js-add-user');
const addForm = document.querySelector('.add-form') 
const messageDiv = document.querySelector('.message');

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
  sendData(queryUrl, userData)
    .then( () => {
      userNameInput.value = " ";
      userBarcodeInput.value = " ";
      userMemberTypeInput.value = " ";

      status = true;
      showMessage("User added successfully!", status);
    })
    .catch((err => {
      console.log(err);
      status = false;
      showMessage("Oops, something went wrong!!", status);
    }
    ));
        
  e.preventDefault();
}

