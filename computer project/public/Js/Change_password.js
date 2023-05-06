let ws = new WebSocket("ws://localhost:1099");
$(function () {
    let email_net = window.location.search;
    let email_address = email_net.substring(email_net.indexOf("=") + 1);
    let pass_email = window.atob(email_address);

    console.log(pass_email);
    change_word("email_address", "your email: " + pass_email);
    $("#button").click(function () {
        let password = word_clear(get_word("change_password_input"));
        let password_check = word_clear(get_word("change_password_check_input"));
        console.log("check: " + password_check, " password: " + password);
        if (password.length < 6) {
            change_color("change_advice", "red");
            change_word("change_advice", "password need more than 6 number")
        } else if (password !== password_check) {
            change_color("change_advice", "red");
            change_word("change_advice", "two times password input is different");
        } else if (password.length >= 6 && password === password_check) {
            sent_change(pass_email, password);
            ws.onmessage = function (message) {
                let data = JSON.parse(message.data);
                let type = data.type;
                if (type === 'Change') {
                    if (data.change_type === 'successful, jump') {
                        change_color("change_advice", "green");
                        change_word("change_advice", "successful, jump");
                        setTimeout(function () {
                            jump("Login.html");
                        }, 1000);
                    } else if (type === fail) {
                        change_color("change_advice", "red");
                        change_word("change_advice", "fail");
                    }
                }
            }
        }
    })
})

