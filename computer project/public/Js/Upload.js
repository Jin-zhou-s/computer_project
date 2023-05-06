let ws = new WebSocket("ws://localhost:1099");
let email_net = window.location.search;
let email_address = email_net.substring(email_net.indexOf("=") + 1);
let passed_email = window.atob(email_address);
let pass_email = window.btoa(passed_email);
$(function () {
    var timer = setInterval(function () {
        if (ws.readyState === 1) {
            ws.send(JSON.stringify({email_upload: passed_email, type: 'User_Upload'}));
            clearInterval(timer);
        }
    }, 50)
    ws.onmessage = function (message) {
        let data = JSON.parse(message.data);
        if (data.type === 'User_upload') {
            $("#upload_name").attr("value", data.upload_name);
            if (data.upload_phone === "0" || data.upload_phone === "") {
                $("#upload_phone").attr("value", "please enter your phone number");
            } else {
                $("#upload_phone").attr("value", data.upload_phone);
            }
            if (data.upload_address === "0" || data.upload_address === "") {
                $("#upload_address1").attr("value", "please enter your address line 1");
                $("#upload_address2").attr("value", "please enter your address line 2");
            } else {
                let address = data.upload_address
                $("#upload_address1").attr("value", address);
            }
            $("#user_head").attr("src",data.upload_image);
            console.log(data.upload_name, data.upload_email, data.upload_address, data.upload_phone)
        }
    }
    $("#personal_box").click(function () {
        if (email_address === "") {
            jump("Login.html")
        } else {
            jump("Personal-information.html?=" + pass_email);
        }
    })
    $("#message_box").click(function () {
        if (email_address === "") {
            jump("Login.html")
        } else {
            jump("Chat.html?=" + pass_email);
        }
    })
    $("#collection_box").click(function () {
        if (email_address === "") {
            jump("Login.html");
        } else {
            jump("Collection.html?=" + pass_email);
        }
    })
})
$(function upload() {
    let avatar_upload = $("#image_upload");
    avatar_upload.on("change", () => {
        let reader = new FileReader();
        reader.readAsDataURL(avatar_upload[0].files[0]);
        reader.onloadend = (e) => {
            $("#user_head").attr("src", e.target.result);
        }
    });

    $("#upload_button").click(function () {
        let upload_name = word_clear(get_word("upload_name"));
        let upload_phone = word_clear(get_word("upload_phone"));
        let upload_address1 = word_clear(get_word("upload_address1"));
        let upload_address2 = word_clear(get_word("upload_address2"));
        let user_head = undefined;
        if (upload_name.length >= 1) {
            try {
                user_head = $("#user_head").attr("src").toString();
            } catch (err) {
                user_head = $("#user_head").attr("src");
            }
            sent_upload(upload_name, upload_phone, upload_address1 + upload_address2, passed_email, user_head);
            ws.onmessage = function (message) {
                let data = JSON.parse(message.data);
                if (data.type === 'upload_data') {
                    if (data.update_type === 'successful,jump') {
                        jump("Personal-information.html?=" + pass_email);
                    }
                }
            }
        } else {
            change_color("upload_advice", "red");
            change_word("upload_advice", "name cannot empty");
        }
    })
})