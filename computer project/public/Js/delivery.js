let ws = new WebSocket("ws://localhost:1099");
let item_id_address = window.location.search;
let item_id = item_id_address.substring(item_id_address.indexOf("=") + 1);
console.log(item_id);
$(function () {
    var timer = setInterval(function () {
        if (ws.readyState === 1) {
            ws.send(JSON.stringify({delivery_id: item_id, type: 'delivery_type'}));
            clearInterval(timer);
        }
    })
    ws.onmessage = function (message) {
        let data = JSON.parse(message.data);
        if (data.type === 'delivery_data') {
            change_word("name", data.user_name);
            change_word("address", data.user_address);
            change_word("phone", data.user_phone);
        } else if (data.type === 'send_delivery_email') {
            change_word("advice","Sent successfully, about to jump");
            setTimeout(function (){
                let address = window.btoa(data.seller_address)
                jump("Personal-information.html?=" + address);
            },1000)
        }
        $("#button").click(function () {
            let number = get_word("Courier_Number");
            ws.send(JSON.stringify({
                item_id: item_id,
                email_address: data.user_email,
                delivery_number: number,
                type: 'sent_delivery'
            }))
        })
        if (data.type === 'jump_email'){
            let address = window.btoa(data.email_address);
            jump("Personal-information.html?=" + address);
        }
        $("#home_box").click(function (){
            ws.send(JSON.stringify({type:'email',item_id:item_id}))

        })
    }
})