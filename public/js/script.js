var contactNavButton=document.getElementsByClassName("navButtons")[2];
var loginNavButton=document.getElementsByClassName("navButtons")[3];

var registerBtn=document.getElementById("register-btn");

var loginBtn=document.getElementById("login-btn");

contactNavButton.addEventListener('click',function(){
    // console.log('clicked');
    document.getElementById('contactUsBtn').click();
    document.getElementById('contact-us').scrollIntoView({behavior:'smooth',block:'end',inline:'nearest'});
});
loginNavButton.addEventListener('click',function(){
    document.getElementById("login-modal-toggle").click();
});

registerBtn.addEventListener("click",function( ){
    document.getElementById("login-modal-toggle1").click();
});

loginBtn.addEventListener("click",function( ){
    document.getElementById("login-modal-toggle").click();
});

//password check

var flag=1;
function validatePassword() {
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("cnfrmpassword").value;
    let message=document.getElementById("message");
    //console.log(password,confirmPassword);
    if(password.length!=0)
    {
        if (password == confirmPassword) {
            message.textContent="Password Match";
            // message.style.backgroundColor="#3ae374";
            message.style.color="#3ae374";
            flag=1;
        } else {
            message.textContent="Passwords do not match.";
            // message.style.backgroundColor="#ff4d4d";
            message.style.color="#ff4d4d";
            flag=0;
        }
    }
    else{
        message.textContent="Enter Confirm Password";
        // message.style.backgroundColor="#ff4d4d";
        message.style.color="#ff4d4d";
        flag=0;
    }
}

function validate()
{
    if(flag==1){return true;}
    else {return false;}
}


