let ws = new WebSocket("ws://localhost:1099");
$(function () {
    $("#Login_button").click(function () {
        let UserEmail = get_word("Login_email_input");
        let UserPassword = get_word("Login_password_input");
        sent_login(UserEmail, UserPassword);
        ws.onmessage = function (message) {
            let data = JSON.parse(message.data);
            console.log(data.type);
            if (data.type === 'Login') {
                if (data.Login_type === 'No such account') {
                    change_color("Login_advice", "red");
                    change_word("Login_advice", data.Login_type);
                } else if (data.Login_type === 'Password error') {
                    change_color("Login_advice", "red");
                    change_word("Login_advice", data.Login_type);
                } else if (data.Login_type === 'Login successful') {
                    change_color("Login_advice", "green");
                    change_word("Login_advice", data.Login_type);
                    setTimeout(function () {
                        let pass_email = window.btoa(UserEmail);
                        jump("Shop.html?=" + pass_email);
                    }, 1000)
                    console.log(data.id);
                }
            }
        }
    })
    $("#Register_jump").click(function () {
        jump("Register.html");
    })
    $("#forget_jump").click(function () {
        jump("Forget.html");
    })
})
$(function enter(){
    $(document).keyup(function (event) {
        if (event.keyCode == "13") {
            $("#Login_button").click();
        }
    })
})