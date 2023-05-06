let ws = new WebSocket("ws://localhost:1099");
let email_net = window.location.search;
let email_address = email_net.substring(email_net.indexOf("=") + 1);
let passed_email = window.atob(email_address);
let pass_email = window.btoa(passed_email);
$(function top_bar() {
    $("#personal_box").click(function () {
        jump("Personal-information.html?=" + pass_email);
    })
    $("#message_box").click(function () {
        jump("Chat.html?=" + pass_email);
    })
    $("#collection_box").click(function () {
        jump("Collection.html?=" + pass_email);
    })
})
$(function product() {
    var timer = setInterval(function (){
        if (ws.readyState === 1){
            ws.send(JSON.stringify({product_email:passed_email,type:'product'}));
            ws.send(JSON.stringify({name_data: passed_email, type: 'name'}));
            clearInterval(timer);
        }
    },50)

    ws.onmessage = function (message){
        let data = JSON.parse(message.data);
        if (data.type === 'product_data'){
            $(".product_box").append(`<div class="product_box_item" id=${data.product_id}>
            <div class="product_box_item_image"><img src=${data.product_image} class="img_setting"></div>
            <div class="product_box_item_price">￡ ${data.product_price}</div>
            <div class="product_box_item_profile">${data.product_description}</div>
            <div class="product_box_item_sale_status">${data.product_sale_status}....</div>
        </div>
        <script>
        $(".product_box_item").off("click");
        $(".product_box_item").click(function (){
            let id = $(this).attr("id");
            jump("Item_detail.html?="+pass_email+"/"+id);
        })
</script>`)
        }else if (data.type === 'name_data'){
            change_word("name","Hello "+ data.user_name);
        }
    }
})