let ws = new WebSocket("ws://localhost:1099");
let email_net = window.location.search;
let email_address_me = email_net.substring(email_net.indexOf("=") + 1, email_net.indexOf("/"));
let passed_email_address_me = window.atob(email_address_me);
let pass_email_address_me = window.btoa(passed_email_address_me);
let email_address_seller = email_net.substring(email_net.indexOf("/") + 1);
let passed_email_address_seller = window.atob(email_address_seller);
var timer = setInterval(function () {
    if (ws.readyState === 1) {
        ws.send(JSON.stringify({
            chat_message_me: passed_email_address_me,
            chat_message_seller: passed_email_address_seller,
            type: 'Chat message'
        }));
        clearInterval(timer);
    }
}, 50)
$(function top_bar() {
    $("#personal_box").click(function () {
        jump("Personal-information.html?="+pass_email_address_me);
    })
    $("#message_box").click(function () {
        jump("Chat.html?="+pass_email_address_me);
    })
    $("#collection_box").click(function () {
        jump("Collection.html?="+pass_email_address_me);
    })
})
$(function chat_message() {
    ws.onmessage = function (message) {
        let data = JSON.parse(message.data);
        if (data.type === 'chat_data') {
            change_word("seller_name", data.seller_name);
            change_word("seller_message_name", data.seller_name);
            change_word("user_name","Hello " +data.my_name);
            $("#seller_image").attr("src", data.seller_image);
            $("#my_image").attr("src", data.my_image);

        }
        else if(data.type === 'chat_history'){
            $(".message_box1").scrollTop($(".message_box1")[0].scrollHeight);
            if (data.sender_history === passed_email_address_me) {
                $(".message_box1").append(`<div class="message_box_block">
                <div class="message_box_block_text_right">
                    <div class="message_box_block_text_triangle_right"></div>
                    <div class="message_box_block_text_box_right">${data.send_message}
                    </div>
                </div>
                <div class="message_box_block_image_right"><img src=${data.sender_history_image} class="img_setting" id="my_image"></div>
            </div>`)
            } else if (data.sender_history !== passed_email_address_me) {
                $(".message_box1").append(`<div class="message_box_block">
                <div class="message_box_block_image_left"><img src=${data.receiver_history_image} class="img_setting" id="seller_image"></div>
                <div class="message_box_block_text_left">
                    <div class="message_box_block_text_name_left" id="seller_message_name">${data.receiver_history_name}</div>
                    <div class="message_box_block_text_triangle_left"></div>
                    <div class="message_box_block_text_box_left">${data.send_message}
                    </div>
                </div>
            </div>`)
            }
            $(".message_box1").scrollTop($(".message_box1")[0].scrollHeight);
        }
        else if (data.type === 'chat_message') {
            $(".message_box1").scrollTop($(".message_box1")[0].scrollHeight);
            if (data.sender_who === passed_email_address_me) {
                $(".message_box1").append(`<div class="message_box_block">
                <div class="message_box_block_text_right">
                    <div class="message_box_block_text_triangle_right"></div>
                    <div class="message_box_block_text_box_right">${data.send_message}
                    </div>
                </div>
                <div class="message_box_block_image_right"><img src=${data.sender_image} class="img_setting" id="my_image"></div>
            </div>`)
            } else if (data.sender_who !== passed_email_address_me &&data.sender_who === passed_email_address_seller) {
                $(".message_box1").append(`<div class="message_box_block">
                <div class="message_box_block_image_left"><img src=${data.sender_image} class="img_setting" id="seller_image"></div>
                <div class="message_box_block_text_left">
                    <div class="message_box_block_text_name_left" id="seller_message_name">${data.sender_name}</div>
                    <div class="message_box_block_text_triangle_left"></div>
                    <div class="message_box_block_text_box_left">${data.send_message}
                    </div>
                </div>
            </div>`)
            }
            $(".message_box1").scrollTop($(".message_box1")[0].scrollHeight);
        }
    }
})
$(function send_message_() {
    $("#send_button").click(function () {
        let date = new Date();
        let input_message = $("#input_message");
        let message = input_message.val();
        let text = word_clear(message);
        if (text === ""){

        }else {
            let time = date.getDate() + "." + date.getMonth() + "." + date.getFullYear() + "" + date.getHours() + ": " + date.getMinutes()
            ws.send(JSON.stringify({
                sender: passed_email_address_me,
                receiver: passed_email_address_seller,
                message: text,
                time: time,
                type: 'message_text'
            }))
            input_message.val("");
        }

        console.log(date.getDate() + "." + date.getMonth() + "." + date.getFullYear() + "   " + date.getHours() + ": " + date.getMinutes());
    })
})
$(function enter(){
    $(document).keyup(function (event) {
        if (event.keyCode == "13") {
            $("#send_button").click();
        }
    })
})