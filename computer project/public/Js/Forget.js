let ws = new WebSocket("ws://localhost:1099");
$(function () {
    $("#Forget_email_button").click(function () {
        let user_email = get_word("Forget_email_input");
        sent_forget(user_email);
        ws.onmessage = function (message) {
            let data = JSON.parse(message.data);
            console.log(data.type);
            if (data.type === 'Forget') {
                if (data.Forget_type === 'No such account') {
                    change_color("Forget_email_advice", "red");
                    change_word("Forget_email_advice", data.Forget_type);
                } else if (data.Forget_type === 'please check your email') {
                    change_color("Forget_email_advice", "green");
                    change_word("Forget_email_advice", data.Forget_type);
                    let code = data.email_code;
                    let time = 600;
                    var timer = setInterval(function () {
                        if (time <= 0) {
                            code = null;
                            change_word("Forget_code_advice", "Captcha has timed out");
                            clearInterval(timer);

                        } else {
                            change_word("Forget_code_advice", "Captcha also has: " + time + " seconds to expire");
                            time--;
                        }
                    }, 1000);
                    $("#Forget_code_button").click(function () {
                        let User_code_input = get_word("Forget_code_input")
                        console.log("this is code: " + code + "  " + "This is user: " + User_code_input);
                        if (code === null) {
                            change_color("Forget_code_advice", "red");
                            change_word("Forget_code_advice", "Captcha has timed out");
                        } else if (code !== User_code_input) {
                            change_color("Forget_code_advice", "red");
                            change_word("Forget_code_advice", "Captcha error");
                        } else if (code === User_code_input) {
                            clearInterval(timer);
                            change_color("Forget_code_advice", "green");
                            change_word("Forget_code_advice", "successful, jumping");
                            setTimeout(function () {
                                let pass_email = window.btoa(user_email);
                                jump("Change_password.html?=" + pass_email);
                            }, 1000)
                        }
                    })
                }
            }
        }
    })
    $("#Register_jump").click(function () {
        jump("Register.html");
    })
    $("#Login_jump").click(function () {
        jump("Login.html");
    })
})