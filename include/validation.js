function CheckBlank(controlValue, message) {

    if (controlValue == '') {
        return false;
    }
}

function ContactValueCheck(controlValue, message) {

    var pattern = '';

    if (message == "Enter valid name" || message == "Enter valid city" || message == "Enter valid state") {
        pattern = /^[A-Za-z. ]*$/;
    }

    if (message == "Enter valid address" || message == "Enter valid comment") {
        pattern = /^[A-Za-z0-9- .\/, ()#]*$/;
    }

    if (message == "Enter valid zip code") {
        pattern = /^[0-9]*$/;
    }

    if (message == "Enter valid phone" || message == "Enter valid fax") {
        pattern = /^[0-9][0-9][0-9]-[0-9][0-9][0-9]-[0-9][0-9][0-9][0-9]$/;
    }

    if (message == "Enter valid username") {
        pattern = /^[A-Za-z0-9.]*$/;
    }

    if (message == "Enter valid secret answer") {
        pattern = /^[A-Za-z0-9.,]*$/;
    }

    if (pattern.test(controlValue) == false) {
        return false;
    }
}

function EmailChecking(controlValue, message) {

    var pattern = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

    if (pattern.test(controlValue) == false) {
        return false;
    }
}

function ContactUsValidation() {

    var messageSummary = '';

    if (CheckBlank(document.getElementById('name').value, "Enter name") == false) {
        messageSummary = messageSummary + " Enter name";
    }
    else if (ContactValueCheck(document.getElementById('name').value, "Enter valid name") == false) {
        messageSummary = messageSummary + "\n Enter valid name";
    }

    if (CheckBlank(document.getElementById('address').value, "Enter address") == false) {
        messageSummary = messageSummary + "\n Enter address";
    }
    else if (ContactValueCheck(document.getElementById('address').value, "Enter valid address") == false) {
        messageSummary = messageSummary + "\n Enter valid address";
    }

    if (CheckBlank(document.getElementById('city').value, "Enter city") == false) {
        messageSummary = messageSummary + "\n Enter city";
    }
    else if (ContactValueCheck(document.getElementById('city').value, "Enter valid city") == false) {
        messageSummary = messageSummary + "\n Enter valid city";
    }

    if (document.getElementById('zipcode').value != '') {
        if (ContactValueCheck(document.getElementById('zipcode').value, "Enter valid zip code") == false) {
            messageSummary = messageSummary + "\n Enter valid zip code";
        }
    }

    if (CheckBlank(document.getElementById('state').value, "Enter state") == false) {
        messageSummary = messageSummary + "\n Enter state";
    }
    else if (ContactValueCheck(document.getElementById('state').value, "Enter valid state") == false) {
        messageSummary = messageSummary + "\n Enter valid state";
    }

    if (CheckBlank(document.getElementById('phone').value, "Enter phone") == false) {
        messageSummary = messageSummary + "\n Enter phone";
    }
    else if (ContactValueCheck(document.getElementById('phone').value, "Enter valid phone") == false) {
        messageSummary = messageSummary + "\n Enter valid phone";
    }

    if (document.getElementById('fax').value != '') {
        if (ContactValueCheck(document.getElementById('fax').value, "Enter valid fax") == false) {
            messageSummary = messageSummary + "\n Enter valid fax";
        }
    }

    if (CheckBlank(document.getElementById('email').value, "Enter email") == false) {
        messageSummary = messageSummary + "\n Enter email";
    }
    else if (EmailChecking(document.getElementById('email').value, "Enter valid email") == false) {
        messageSummary = messageSummary + "\n Enter valid email";
    }

    if (CheckBlank(document.getElementById('comment').value, "Enter comment") == false) {
        messageSummary = messageSummary + "\n Enter comment";
    }
    else if (ContactValueCheck(document.getElementById('comment').value, "Enter valid comment") == false) {
        messageSummary = messageSummary + "\n Enter valid comment";
    }

    if (messageSummary != '') {
        alert(messageSummary);
        return false;
    }
}