let ws = new WebSocket("ws://localhost:1099");
$(function () {
    var pattern = /^[A-Za-z0-9.-]+@students.[a-z0-9]+.ac.uk$/;
    $("#Register_button").click(function () {
        let register_name = word_clear(get_word("Register_name_input"));
        let register_password = word_clear(get_word("Register_password_input"));
        let register_password_check = word_clear(get_word("Register_password_check_input"));
        let register_email = word_clear(get_word("Register_email_input"));
        if (register_name == "" | register_password == "" | register_email == "") {
            if (register_name == "") {
                change_color("Register_advice", "red");
                change_word("Register_advice", "name is empty");
            } else if (register_password == "") {
                change_color("Register_advice", "red");
                change_word("Register_advice", "password is empty");
            } else {
                change_color("Register_advice", "red");
                change_word("Register_advice", "email is empty");
            }
        } else if (register_password !== register_password_check) {
            change_color("Register_advice", "red");
            change_word("Register_advice", "two times password input is different");
        } else if (register_password.length < 6) {
            change_color("Register_advice", "red");
            change_word("Register_advice", "password need more than 6 number");
        } else {
            if (pattern.test(register_email)) {
                sent_register(register_name, register_password, register_email);
                ws.onmessage = function (message) {
                    let data = JSON.parse(message.data);
                    let type = data.type;
                    if (type === 'Register') {
                        if (data.Register_type === 'successful') {
                            change_color("Register_advice", "green");
                            change_word("Register_advice", "register success");
                            setTimeout(function () {
                                jump("Login.html");
                            }, 1000)
                        } else if (data.Register_type === 'Email is registered') {
                            change_color("Register_advice", "red");
                            change_word("Register_advice", data.Register_type);
                        }
                    }
                }
            } else {
                change_color("Register_advice", "red");
                change_word("Register_advice", "The email address used is not a student email address");
            }

        }
    })
    $("#Login_jump").click(function () {
        jump("Login.html");
    })
})
$(function enter(){
    $(document).keyup(function (event) {
        if (event.keyCode == "13") {
            $("#Register_button").click();
        }
    })
})