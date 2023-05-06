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
    $("#1").click(function () {
        $("#1").css("color", "yellow");
        $("#2").css("color", "white");
        $("#3").css("color", "white");
        $("#4").css("color", "white");
        $("#5").css("color", "white");
        change_word("score", "score: 1");
        change_word("review_word", "Terrible")
        change_word("number", "1");
        $(".review_word").css("opacity", "1");
    })
    $("#2").click(function () {
        $("#1").css("color", "yellow");
        $("#2").css("color", "yellow");
        $("#3").css("color", "white");
        $("#4").css("color", "white");
        $("#5").css("color", "white");
        change_word("score", "score: 2");
        change_word("review_word", "Bad");
        change_word("number", "2");
        $(".review_word").css("opacity", "1");
    })
    $("#3").click(function () {
        $("#1").css("color", "yellow");
        $("#2").css("color", "yellow");
        $("#3").css("color", "yellow");
        $("#4").css("color", "white");
        $("#5").css("color", "white");
        change_word("score", "score: 3");
        change_word("review_word", "Satisfied");
        change_word("number", "3");
        $(".review_word").css("opacity", "1");
    })
    $("#4").click(function () {
        $("#1").css("color", "yellow");
        $("#2").css("color", "yellow");
        $("#3").css("color", "yellow");
        $("#4").css("color", "yellow");
        $("#5").css("color", "white");
        change_word("score", "score: 4");
        change_word("review_word", "Good");
        change_word("number", "4");
        $(".review_word").css("opacity", "1");

    })
    $("#5").click(function () {
        $("#1").css("color", "yellow");
        $("#2").css("color", "yellow");
        $("#3").css("color", "yellow");
        $("#4").css("color", "yellow");
        $("#5").css("color", "yellow");
        change_word("score", "score: 5");
        change_word("review_word", "Excellent");
        change_word("number", "5");
        $(".review_word").css("opacity", "1");
    })

})
$(function product() {
    $(".review").css("display", "none");
    $(".white_background").css("display", "none");
    $(".box").css("display", "none");
    $(".title").css("display", "none");
    $(".review_word").css("display", "none");
    $(".thank").css("display", "none");
    var timer = setInterval(function () {
        if (ws.readyState === 1) {
            ws.send(JSON.stringify({product_email: passed_email, type: 'my_purchase'}));
            ws.send(JSON.stringify({name_data: passed_email, type: 'name'}));
            clearInterval(timer);
        }
    }, 50)
    ws.onmessage = function (message) {
        let data = JSON.parse(message.data);
        if (data.type === 'score') {
            if (data.score_type === 'successful') {
                $(".box").css("display", "none");
                $(".title").css("display", "none");
                $(".review_word").css("display", "none");
                $(".thank").css("display", "block");
                setTimeout(function () {
                    $(".review").css("display", "none");
                    $(".white_background").css("display", "none");
                    $(".product_box_item").remove();
                    ws.send(JSON.stringify({product_email: passed_email, type: 'my_purchase'}));
                    ws.send(JSON.stringify({name_data: passed_email, type: 'name'}));
                }, 1500);
            }
        }
        if (data.type === 'my_purchase') {
            if (data.purchase_sale_status === "in transit") {
                $(".product_box").append(`<div class="product_box_item" id=${data.purchase_id}>
            <div class="product_box_item_image"><img src=${data.purchase_image} class="img_setting"></div>
            <div class="product_box_item_price">￡ ${data.purchase_price}</div>
            <div class="product_box_item_profile">${data.purchase_description}</div>
            <div class="product_box_item_sale_status">${data.purchase_sale_status}....</div>
            <div class="product_box_item_button" id=d${data.purchase_id}>Confirm receipt</div>
        </div>
        <script>
        $(".product_box_item").off("click");
        $(".product_box_item").click(function (){
            let box_id = $(this).attr("id");
            console.log(box_id);
            jump("Item_detail.html?="+pass_email+"/"+box_id);
        })
        $(".product_box_item_button").off("click");
        $(".product_box_item_button").click(function (event){
            event.stopPropagation();
            let button_id = $(this).attr("id");
            let purchase_id = button_id.substring(button_id.indexOf("d")+1);
            ws.send(JSON.stringify({purchase_id:purchase_id,type:'change_type'}))
            console.log(button_id);
        })
</script>`)
            } else if (data.purchase_score === null && data.purchase_sale_status === "finish") {
                $(".product_box").append(`<div class="product_box_item" id=${data.purchase_id}>
            <div class="product_box_item_image"><img src=${data.purchase_image} class="img_setting"></div>
            <div class="product_box_item_price">￡ ${data.purchase_price}</div>
            <div class="product_box_item_profile">${data.purchase_description}</div>
            <div class="product_box_item_sale_status">${data.purchase_sale_status}....</div>
            <div class="product_box_item_button" id=d${data.purchase_id}>Go to Reviews</div>
        </div>
        <script>
        $(".product_box_item").off("click");
        $(".product_box_item").click(function (){
            let box_id = $(this).attr("id");
            console.log(box_id);
            jump("Item_detail.html?="+pass_email+"/"+box_id);
        })
        $(".product_box_item_button").off("click");
        $(".product_box_item_button").click(function (event){
            event.stopPropagation();
            let button_id = $(this).attr("id");
            let purchase_id = button_id.substring(button_id.indexOf("d")+1);
            $(".review").css("display","flex");
            $(".white_background").css("display","block");
            $(".box").css("display","block");
            $(".title").css("display","block");
            $(".review_word").css("display","block");
            $("#submit").click(function (){
                let score = $("#number").text();
                if (score === ""){
                    
                }else {
                    ws.send(JSON.stringify({
                    item_id:purchase_id,
                    item_score:score,
                    type:'item_score'
                    }))
                }
            })
            console.log(button_id);
        })
</script>`)

            } else if (data.purchase_sale_status === "finish" && data.purchase_score !== null || data.purchase_sale_status === "Awaiting delivery from seller") {
                $(".product_box").append(`<div class="product_box_item" id=${data.purchase_id}>
            <div class="product_box_item_image"><img src=${data.purchase_image} class="img_setting"></div>
            <div class="product_box_item_price">￡ ${data.purchase_price}</div>
            <div class="product_box_item_profile">${data.purchase_description}</div>
            <div class="product_box_item_sale_status">${data.purchase_sale_status}....</div>
        </div>
        <script>
        $(".product_box_item").off("click");
        $(".product_box_item").click(function (){
            let box_id = $(this).attr("id");
            console.log(box_id);
            jump("Item_detail.html?="+pass_email+"/"+box_id);
        })
</script>`)
            }

        } else if (data.type === 'name_data') {
            change_word("name", "Hello " + data.user_name);
        } else if (data.type === 'check') {
            if (data.change_type === 'successful') {
                alert("check successful");
                ws.send(JSON.stringify({product_email: passed_email, type: 'my_purchase'}));
                $(".product_box_item").remove();
            }
        }
    }
})