function sent_login(user_email, user_password) {
    ws.send(JSON.stringify({email_login: user_email, password_login: user_password, type: 'User_Login'}));
}


function sent_register(name, password, email) {
    ws.send(JSON.stringify({
        name_register: name,
        password_register: password,
        email_register: email,
        type: 'User_Register'
    }));
}


function sent_forget(email) {
    ws.send(JSON.stringify({email_forget: email, type: 'User_Forget'}));
}


function sent_information(email) {
    ws.send(JSON.stringify({email_information: email, type: 'User_Information'}));
}


function sent_change(email, password) {
    ws.send(JSON.stringify({email_change: email, password_change: password, type: 'User_Password_change'}));
}


function sent_upload(name, phone, address, email, image) {
    ws.send(JSON.stringify({
        name_upload: name,
        phone_upload: phone,
        address_upload: address,
        email_upload: email,
        image_upload: image,
        type: 'User_Upload_change'
    }));
}


function get_word(id) {
    return $("#" + id).val();
}


function change_color(id, color) {
    $("#" + id).css("color", color);
}


function change_word(id, word) {
    $("#" + id).html(word);
}


function jump(url) {
    window.location.replace(url);
}


function word_clear(word) {
    return jQuery.trim(word);
}

