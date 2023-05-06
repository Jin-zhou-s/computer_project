let ws = new WebSocket("ws://localhost:1099");
let email_net = window.location.search;
let email_address = email_net.substring(email_net.indexOf("=") + 1);
let passed_email_address = window.atob(email_address);
let pass_email_address = window.btoa(passed_email_address);
$(function top_bar() {
    $("#personal_box").click(function () {
        jump("Personal-information.html?=" + pass_email_address);
    })
    $("#message_box").click(function () {
        jump("Chat.html?=" + pass_email_address);
    })
})
$(function collection_box() {
    var timer = setInterval(function () {
        if (ws.readyState === 1) {
            ws.send(JSON.stringify({collection_email: passed_email_address, type: 'collection_data'}));
            ws.send(JSON.stringify({name_data: passed_email_address, type: 'name'}));
            clearInterval(timer);
        }
    }, 50);
    ws.onmessage = function (message) {
        let data = JSON.parse(message.data);
        if (data.type === 'collection_data') {
            $(".collection_bar").append(`<div class="collection_box"id=${data.collection_id}>
        <div class="collection_image"><img src=${data.collection_i_image} class="img_setting"></div>
        <div class="collection_text_box">
            <div class="collection_top">
                <div class="collection_profile">
                    ${data.collection_description}
                </div>
                <div class="collection_price">
                    <div class="collection_price_set">￡ ${data.collection_price}</div>
                </div>
            </div>
            <div class="collection_seller">
                <div class="collection_seller_image"><img src=${data.collection_u_image} class="img_setting"></div>
                <div class="collection_seller_name"> ${data.collection_u_name}</div>
                <div class="collection_seller_collection_delete" id=d${data.collection_id}>
                    <div class="collection_seller_collection_delete_image"><img src="/img/rubbish_bin.png" class="img_setting"></div>
                    <div class="collection_seller_collection_delete_word">Delete a collection</div>
                </div>
            </div>
            <div class="collection_transaction">
                <div class="collection_transaction_word"> Number of successful merchant transactions: ${data.collection_number}</div>
            </div>
        </div>
    </div>
<script>
$(".collection_box").off("click");
$(".collection_seller_collection_delete").off("click");
$(".collection_box").click(function (){
    let id_shop = $(this).attr("id");
    jump("Item_detail.html?="+pass_email_address+"/"+id_shop);
})
$(".collection_seller_collection_delete").click(function (event){
    event.stopPropagation();
    let  id_delete = $(this).attr("id");
    let collection_id = id_delete.substring(id_delete.indexOf("d")+1);
    ws.send(JSON.stringify({delete_collection:collection_id,delete_user:passed_email_address,type:'delete_collection'}));
})
</script>`)
        } else if (data.type === 'delete_collection') {
            alert("Deleted successfully, about to be refreshed");
            var timer = setInterval(function () {
                if (ws.readyState === 1) {
                    ws.send(JSON.stringify({collection_email: passed_email_address, type: 'collection_data'}));
                    $(".collection_box").remove();
                    clearInterval(timer);
                }
            }, 50);
        }else if (data.type === 'name_data') {
            change_word("name","Hello "+ data.user_name);
        }
    }
})
