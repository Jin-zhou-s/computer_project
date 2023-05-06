let ws = new WebSocket("ws://localhost:1099");
let email_net = window.location.search;
let email_address = email_net.substring(email_net.indexOf("=") + 1, email_net.indexOf("/"));
let passed_email_address = window.atob(email_address);
let pass_email_address = window.btoa(passed_email_address);
let item_id_address = window.location.search;
let item_id = item_id_address.substring(item_id_address.indexOf("/") + 1);
$(function top_bar() {
    if (passed_email_address === "") {
        $("#name_box").css("display", "none");
    }
    $("#login_box").click(function () {
        jump("Login.html");
    })
    $("#register_box").click(function () {
        jump("Register.html");
    })
    $("#personal_box").click(function () {
        if (passed_email_address === "") {
            jump("Login.html");
        }
        else {
            jump("Personal-information.html?=" + pass_email_address);
        }
    })
    $("#message_box").click(function () {
        if (passed_email_address === "") {
            jump("Login.html");
        }else{
            jump("Chat.html?=" + pass_email_address);
        }
    })
    $("#shop_box").click(function (){
        if (passed_email_address === "") {
            jump("Shop.html");
        }else{
            jump("Shop.html?=" + pass_email_address);
        }
    })

    $("#collection_box").click(function () {
        if (passed_email_address === "") {
            jump("Login.html");
        }else{
            jump("Collection.html?=" + pass_email_address);
        }
    })
})
$(function box() {
    var timer = setInterval(function () {
        if (ws.readyState === 1) {
            ws.send(JSON.stringify({item_id: item_id, type: 'item_detail'}));
            if (passed_email_address !== "") {
                ws.send(JSON.stringify({name_data: passed_email_address, type: 'name'}));
            }

            clearInterval(timer);
        }
    })
    ws.onmessage = function (message) {
        let data = JSON.parse(message.data);
        if (data.type === 'item_detail') {
            $("#i_image").attr("src", data.detail_i_image);
            change_word("description", data.detail_description);
            change_word("price", "Price: ￡ " + data.detail_price);
            $("#s_image").attr("src", data.detail_u_image);
            change_word("s_name", data.detail_u_name);
            change_word("date", "Date of purchase: " + data.detail_date);
            change_word("status", "Product Status: " + data.detail_status);
            change_word("type", "Type of product: " + data.detail_product);
            change_word("i_name", "Production: " + data.detail_i_name)
            change_word("successful_number", "Number of successful transactions: " + data.detail_times);
            change_word("score", "Merchant Score: " + data.detail_score + "(max: 5)");
            let pass_seller_email = window.btoa(data.detail_seller);
            console.log(data.detail_sale_status);
            if (data.detail_sale_status === "finish") {
                $("#detail_box_button_middle_cancel").css("display", "none");
                $("#detail_box_button_middle_change").css("display", "none");
                $("#detail_box_button_middle_delete").css("display", "none");
                $("#detail_box_middle_button_collection").css("display", "none");
                $("#detail_box_button_middle_Chat").css("display", "none");
                $("#detail_box_button_middle_buy").css("display", "none");
                $("#detail_box_button_middle_delivery").css("display", "none");
            }
            else if (data.detail_sale_status === "in transit") {
                $("#detail_box_button_middle_cancel").css("display", "none");
                $("#detail_box_button_middle_change").css("display", "none");
                $("#detail_box_button_middle_delete").css("display", "none");
                $("#detail_box_middle_button_collection").css("display", "none");
                $("#detail_box_button_middle_Chat").css("display", "none");
                $("#detail_box_button_middle_buy").css("display", "none");
                $("#detail_box_button_middle_delivery").css("display", "none");
            }
            else if (data.detail_sale_status === "Awaiting delivery from seller") {
                if (pass_email_address !== pass_seller_email) {
                    $("#detail_box_button_middle_buy").css("display", "none");
                    $("#detail_box_button_middle_delete").css("display", "none");
                    $("#detail_box_button_middle_change").css("display", "none");
                    $("#detail_box_button_middle_delivery").css("display", "none");
                } else if (pass_email_address === pass_seller_email) {
                    $("#detail_box_button_middle_cancel").css("display", "none");
                    $("#detail_box_middle_button_collection").css("display", "none");
                    $("#detail_box_button_middle_Chat").css("display", "none");
                    $("#detail_box_button_middle_buy").css("display", "none");
                    $("#detail_box_button_middle_delete").css("display", "none");
                    $("#detail_box_button_middle_change").css("display", "none");
                }
            }
            else if (data.detail_sale_status === "selling") {
                if (pass_email_address !== pass_seller_email) {
                    $("#detail_box_button_middle_delete").css("display", "none");
                    $("#detail_box_button_middle_change").css("display", "none");
                    $("#detail_box_button_middle_cancel").css("display", "none");
                    $("#detail_box_button_middle_delivery").css("display", "none");
                } else if (pass_email_address === pass_seller_email) {
                    $("#detail_box_button_middle_cancel").css("display", "none");
                    $("#detail_box_middle_button_collection").css("display", "none");
                    $("#detail_box_button_middle_Chat").css("display", "none");
                    $("#detail_box_button_middle_buy").css("display", "none");
                    $("#detail_box_button_middle_delivery").css("display", "none");
                }
            }
            $("#detail_box_button_middle_delivery").click(function () {
                jump("delivery.html?=" + item_id);
            })
            $("#detail_box_button_middle_Chat").click(function () {
                if (pass_seller_email === pass_email_address) {
                    alert("you cannot talk with yourself");
                } else if (passed_email_address === "") {
                    jump("Login.html");
                } else {
                    jump("Chat_message.html?=" + pass_email_address + "/" + pass_seller_email);
                }
            })
            $("#detail_box_middle_button_collection").click(function () {
                if (passed_email_address !== "" && pass_seller_email !== pass_email_address) {
                    ws.send(JSON.stringify({
                        add_collection_email: passed_email_address,
                        add_collection_id: item_id,
                        type: 'add_collection'
                    }));
                } else if (pass_seller_email === pass_email_address) {
                    alert("you cannot collection yourself product");
                } else {
                    jump("Login.html");
                }
            })
            $("#detail_box_button_middle_buy").click(function () {
                if (passed_email_address !== "" && pass_seller_email !== pass_email_address) {
                    ws.send(JSON.stringify({
                        add_buy_email: passed_email_address,
                        add_buy_id: item_id,
                        type: 'add_buy'
                    }));
                } else if (pass_seller_email === pass_email_address) {
                    alert("you cannot buy yourself product");
                } else {
                    jump("Login.html");
                }
            })
            $("#detail_box_button_middle_delete").click(function () {
                ws.send(JSON.stringify({item_id: item_id, type: 'delete'}))
                ws.onmessage = function (message) {
                    let data = JSON.parse(message.data);
                    if (data.type === 'delete') {
                        alert("delete successful, jump to shop page");
                        jump("Shop.html?=" + pass_email_address);
                    }
                }
            })
            $("#detail_box_button_middle_cancel").click(function () {
                ws.send(JSON.stringify({item_id: item_id, type: 'cancel_buy'}))
            })
            $("#detail_box_button_middle_change").click(function () {
                jump("sale_item_change.html?=" + pass_email_address + "/" + item_id)
            })
        } else if (data.type === 'add_data') {
            if (data.add_type === 'fail') {
                alert('Cannot be repeatedly added');
            } else if (data.add_type === 'successful') {
                alert('Added successfully');
            }
        } else if (data.type === 'cancel') {
            if (data.cancel_type === 'successful') {
                alert("Cancellation successful, ready to jump back to personal page");
                jump("Personal-information.html?=" + pass_email_address);
            }
        } else if (data.type === 'name_data') {
            $("#login_box").css("display", "none");
            $('#register_box').css("display", "none");
            change_word("name", "Hello " + data.user_name);
        } else if (data.type === 'buy') {
            if (data.buy_type === 'address') {
                alert("Please go to the personal information page first and fill in your personal information completely.");
                jump("Personal-information.html?=" + pass_email_address);
            } else if (data.buy_type === 'phone') {
                alert("Please go to the personal information page first and fill in your personal information completely.");
                jump("Personal-information.html?=" + pass_email_address);
            } else if (data.buy_type === 'successful') {
                alert("Please wait patiently for your purchase to be shipped. Please note that the merchant will send the courier bill number to your email address upon delivery. (Note: payment on delivery)");
                jump("Shop.html?=" + pass_email_address);
            }
        }
    }

})