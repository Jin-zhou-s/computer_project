let ws = new WebSocket("ws://localhost:1099");
let email_net = window.location.search;
let email_address = email_net.substring(email_net.indexOf("=") + 1);
let passed_email = window.atob(email_address);
let pass_email = window.btoa(passed_email);
$(function top_bar() {
    $("#personal_box").click(function () {
        jump("Personal-information.html?=" + pass_email);
    })
    $("#shop_box").click(function () {
        jump("Shop.html?=" + pass_email);
    })
    $("#collection_box").click(function () {
        jump("Collection.html?=" + pass_email);
    })
})
$(function list() {
    var timer = setInterval(function () {
        console.log(passed_email);
        if (ws.readyState === 1) {
            ws.send(JSON.stringify({chat_email: passed_email, type: 'chat_list'}));
            if (passed_email !== "") {
                ws.send(JSON.stringify({name_data: passed_email, type: 'name'}));
            }
            clearInterval(timer);
        }
    })
    ws.onmessage = function (message) {
        let data = JSON.parse(message.data);
        if (data.type === 'name_data') {
            change_word("name", "Hello " + data.user_name);
        } else if (data.type === 'chat_list') {
            $(".chat_list").append(`<div class="chat_list_box" id=${data.user_email}>
            <div class="chat_list_box_image"><img src=${data.user_image} class="img_setting"></div>
            <div class="chat_list_box_text">
                <div class="chat_list_box_text_name">${data.user_name}</div>
                <div class="chat_list_box_text_message" id=${data.user_name}>${data.user_message}
                </div>
            </div>
        </div>
        <script>
        $(".chat_list_box").click(function () {
            let seller_email = $(this).attr("id");
            let pass_seller_email = window.btoa(seller_email);
            console.log(seller_email);
        jump("Chat_message.html?=" + pass_email + "/" + pass_seller_email);
    })
</script>`)
        }
    }

})