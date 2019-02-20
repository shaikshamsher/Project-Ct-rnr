
    function validation() {

        var name = document.getElementById('name').value;
        var email = document.getElementById('email').value;
        var phone = document.getElementById('phone').value;
        var subject = document.getElementById('subject').value;
        var textdata = document.getElementById('textdata').value;
        if (name === "") {
            document.getElementById('name_error').innerHTML = "Please enter name.";
            document.getElementById('name').style = "border-color: #d0021b";
           return false;
        }
        else {
            document.getElementById('name_error').innerHTML = "";
            document.getElementById('name').style = "border-color: #e4e5e5";
        }
        if (!isNaN(name)) {
            document.getElementById('name_error').innerHTML = "Only characters are allowed.";
            document.getElementById('name').style = "border-color: #d0021b";
           return false;
        }
        else {
            document.getElementById('name_error').innerHTML = "";
            document.getElementById('name').style = "border-color: #e4e5e5";
        }
        
        if (email == "") {
            document.getElementById('email_error').innerHTML = "Please enter valid email.";
            document.getElementById('email').style = "border-color: #d0021b";
           return false;
        }
        else {
            document.getElementById('email_error').innerHTML = "";
            document.getElementById('email').style = "border-color: #e4e5e5";
        }
        if (email.indexOf('@') <= 0) {
            document.getElementById('email_error').innerHTML = "@ Invalid Position.";
            document.getElementById('email').style = "border-color: #d0021b";
           return false;
        }
        else {
            document.getElementById('email_error').innerHTML = "";
            document.getElementById('email').style = "border-color: #e4e5e5";
        }
        if ((email.charAt(email.length - 4) != '.') && (email.charAt(email.length - 3) != '.')) {
            document.getElementById('email_error').innerHTML = ". Invalid Position.";
            document.getElementById('email').style = "border-color: #d0021b";
           return false;
        }
        else {
            document.getElementById('email_error').innerHTML = "";
            document.getElementById('email').style = "border-color: #e4e5e5";
        }
        if (phone == "") {
            document.getElementById('phone_error').innerHTML = "Please enter valid phone number.";
            document.getElementById('phone').style = "border-color: #d0021b";
           return false;
        }
        else {
            document.getElementById('phone_error').innerHTML = "";
            document.getElementById('phone').style = "border-color: #e4e5e5";
        }
        if (isNaN(phone)) {
            document.getElementById('phone_error').innerHTML = "Enter only numbers.";
            document.getElementById('phone').style = "border-color: #d0021b";
           return false;
        }
        else {
            document.getElementById('phone_error').innerHTML = "";
            document.getElementById('phone').style = "border-color: #e4e5e5";
        }
        if (subject == "") {
            document.getElementById('subject_error').innerHTML = "Please enter subject.";
            document.getElementById('subject').style = "border-color: #d0021b";
           return false;
        }
        else {
            document.getElementById('subject_error').innerHTML = "";
            document.getElementById('subject').style = "border-color: #e4e5e5";
        }
        if (textdata == "") {
            document.getElementById('textdata_error').innerHTML = "Please enter description.";
            document.getElementById('textdata').style = "border-color: #d0021b";
           return false;
        }
        else {
            document.getElementById('textdata_error').innerHTML = "";
            document.getElementById('textdata').style = "border-color: #e4e5e5";
        }
    }