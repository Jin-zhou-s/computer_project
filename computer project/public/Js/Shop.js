let ws = new WebSocket("ws://localhost:1099");
let email_net = window.location.search;
let email_address = email_net.substring(email_net.indexOf("=") + 1);
let passed_email_address = window.atob(email_address);
let pass_email_address = window.btoa(passed_email_address);

$(function top_bar() {
    $("#name_box").css("display", "none");
    var timer = setInterval(function () {
        if (ws.readyState === 1) {
            ws.send(JSON.stringify({shop_type: "include", type: 'shop'}))
            if (passed_email_address !== "") {
                ws.send(JSON.stringify({name_data: passed_email_address, type: 'name'}));
            }
            clearInterval(timer);
        }
    }, 50)
    $("#login_box").click(function () {
        jump("Login.html");
    })
    $("#register_box").click(function () {
        jump("Register.html");
    })
    $("#personal_box").click(function () {
        if (email_address === "") {
            jump("Login.html")
        } else {
            jump("Personal-information.html?=" + pass_email_address);
        }
    })
    $("#message_box").click(function () {
        if (email_address === "") {
            jump("Login.html")
        } else {
            jump("Chat.html?=" + pass_email_address);
        }
    })
    $("#collection_box").click(function () {
        if (email_address === "") {
            jump("Login.html")
        } else {
            jump("Collection.html?=" + pass_email_address);
        }
    })
})
$(function search_item(){
    $("#search_button").click(function (){
        let search_word = word_clear(get_word("search_input"));
        if (search_word.length <=0){
            alert("Cannot be empty");
        }
        else {
            let timer = setInterval(function (){
                if (ws.readyState === 1){
                    ws.send(JSON.stringify({search_word:search_word,type:'item_search'}));
                    clearInterval(timer);
                }
            },50)
            console.log(search_word);
            $(".item_box").remove();
        }
    })
})
$(function item() {
    ws.onmessage = function (message) {
        let data = JSON.parse(message.data);
        if (data.type === 'shop_data') {
            $(".bottom_item_box").append(`<div class="item_box" id=${data.shop_id}>
        <div class="item_box_image"><img src=${data.shop_i_image} class="img_setting"> </div>
        <div class="item_box_text">
            <div class="item_box_text_word">${data.shop_description}</div>
        </div>
        <div class="item_box_price">
            <div class="item_box_price_word">￡ ${data.shop_price}</div>
        </div>
        <div class="item_box_seller">
            <div class="item_box_seller_image"><img src=${data.shop_u_image} class="img_setting"></div>
            <div class="item_box_seller_word">${data.shop_seller}</div>
        </div>
    </div>
    <script> 
    $(".item_box").off("click");
    $(".item_box").click(function () {
        let id = $(this).attr("id");
        console.log(id);
        jump("Item_detail.html?="+pass_email_address+"/"+id);
    })</script>`)
        } else if (data.type === 'name_data') {
            $("#name_box").css("display", "flex");
            change_word("name","Hello "+ data.user_name);
            $("#login_box").css("display", "none");
            $("#register_box").css("display", "none");
        }else if (data.type ==='search_item'){
            $(".bottom_item_box").append(`<div class="item_box" id=${data.res_id}>
        <div class="item_box_image"><img src=${data.res_item_image} class="img_setting"> </div>
        <div class="item_box_text">
            <div class="item_box_text_word">${data.res_description}</div>
        </div>
        <div class="item_box_price">
            <div class="item_box_price_word">￡ ${data.res_price}</div>
        </div>
        <div class="item_box_seller">
            <div class="item_box_seller_image"><img src=${data.res_user_image} class="img_setting"></div>
            <div class="item_box_seller_word">${data.res_seller}</div>
        </div>
    </div>
    <script> 
    $(".item_box").off("click");
    $(".item_box").click(function () {
        let id = $(this).attr("id");
        console.log(id);
        jump("Item_detail.html?="+pass_email_address+"/"+id);
    })</script>`)
        }
    }
})

$(function enter(){
    $(document).keyup(function (event) {
        if (event.keyCode == "13") {
            $("#search_button").click();
        }
    })
})