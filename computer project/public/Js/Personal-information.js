let ws = new WebSocket("ws://localhost:1099");
let email_net = window.location.search;
let email_address = email_net.substring(email_net.indexOf("=") + 1);
let passed_email = window.atob(email_address);
console.log(passed_email);
let pass_email = window.btoa(passed_email);
$(function top_bar() {
    $("#home_box").click(function () {
        jump("Shop.html?=" + pass_email);
    })
})
$(function big_box() {
    var timer = setInterval(function () {
        if (ws.readyState === 1) {
            ws.send(JSON.stringify({email_information: passed_email, type: 'User_Information'}));
            clearInterval(timer);
        }
    }, 50)
    ws.onmessage = function (message) {
        let data = JSON.parse(message.data);
        if (data.type === 'User_information') {
            console.log("email_address")
            change_word("name_block", data.information_name);
            change_word("uid_block", "UID: " + data.information_id);
            if (data.information_phone == 0 || data.information_phone == "") {
                change_word("phone_number_block", "Phone number: null");
            } else {
                change_word("phone_number_block", "Phone number: " + data.information_phone);
            }
            change_word("email_block", "Email: " + data.information_email);
            $("#person_image").attr("src", data.information_image);
        }
    }
    $("#personal_information_change_block").click(function () {
        jump("upload.html?=" + pass_email);
    })
    $("#password_change_block").click(function () {
        jump("Change_password.html?=" + pass_email);
    })
    $("#sale_block").click(function () {
        jump("Sale_items.html?=" + pass_email);
    })
    $("#collection_block").click(function () {
        jump("Collection.html?=" + pass_email);
    })
    $("#merchandise_block").click(function () {
        jump("Product.html?=" + pass_email);
    })
    $("#my_purchase_block").click(function () {
        jump("My_Purchase.html?=" + pass_email)
    })
})