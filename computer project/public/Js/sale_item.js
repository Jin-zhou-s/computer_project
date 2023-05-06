let ws = new WebSocket("ws://localhost:1099");
let email_net = window.location.search;
let email_address_me = email_net.substring(email_net.indexOf("=") + 1);
let passed_email_address_me = window.atob(email_address_me);
let pass_email_address_me = window.btoa(passed_email_address_me);
$(function () {
    let image_up = $("#image_up");
    image_up.on("change", () => {
        let read = new FileReader();
        read.readAsDataURL(image_up[0].files[0]);
        read.onloadend = (e) => {
            $("#item_image").attr("src", e.target.result);
        }
    })
    $("#detail_box_middle_button_submit").click(function () {
        let item_description = $("#description_input");
        let description = item_description.val();
        let description_input = word_clear(description);
        let price_input_string = get_word("price")
        let price_input_number = Number(get_word("price"));
        let date_input = get_word("date_input");
        let status_input = get_word("status_input");
        let type_input = get_word("type_input");
        let name_input = get_word("name_input");
        let item_image = undefined;
        console.log(price_input_number);
        try {
            item_image = $("#item_image").attr("src").toString();
        } catch (error) {
            item_image = $("#item_image").attr("src");
        }
        if (description_input !== "" && price_input_string !== "" && price_input_number >= 0 && date_input !== "" && status_input !== "" && type_input !== "" && name_input !== "" && item_image !== undefined) {
            ws.send(JSON.stringify({
                item_description: description_input,
                item_image: item_image,
                item_price: price_input_number,
                item_date: date_input,
                item_status: status_input,
                item_type: type_input,
                item_name: name_input,
                item_seller: passed_email_address_me,
                type: 'sale'
            }))
        } else if (item_image === undefined) {
            change_word("advice", "Please upload a picture of the item");
        } else if (description_input === "") {
            change_word("advice", "Description cannot be empty");
        } else if (price_input_string === "") {
            change_word("advice", "Price cannot be empty");
        } else if (price_input_number < 0) {
            change_word("advice", "Price cannot be less than 0");
        } else if (date_input === "") {
            change_word("advice", "date cannot be empty");
        } else if (status_input === "") {
            change_word("advice", "Item status cannot be empty");
        } else if (type_input === "") {
            change_word("advice", "The item type cannot be empty");
        } else if (name_input === "") {
            change_word("advice", "Item name cannot be empty");
        }
    })
    ws.onmessage = function (message) {
        let data = JSON.parse(message.data);
        if (data.type === 'add_item') {
            change_color("advice", "green");
            change_word("advice", "Submitted successfully and will soon jump back to your personal page.")
            setTimeout(function () {
                jump("Personal-information.html?=" + pass_email_address_me);
            }, 1000)
        }
    }
})
$(function top_bar() {

    $("#personal_box").click(function () {
            jump("Personal-information.html?=" + pass_email_address_me);
    })
    $("#message_box").click(function () {
            jump("Chat.html?=" + pass_email_address_me);
    })

    $("#collection_box").click(function () {
            jump("Collection.html?=" + pass_email_address_me);
    })

})