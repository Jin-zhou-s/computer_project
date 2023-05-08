const express = require('express');
const expressWs = require('express-ws');
const mysql = require('mysql');
const app = express();
var nodemailer = require('nodemailer');
var fs = require('fs');
const {server, client} = require("websocket");
let socket_id = [];
let socket = [];
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: '3303',
    password: 'd546681714',
    database: 'Second_hand_market'
})
expressWs(app);
const port = 1099;
app.use(express.static("public"));
app.get('/', function (req, res, next) {
    res.redirect("/html/Shop.html");
})
app.ws('/', function (ws, req) {
    ws.on('message', function (str) {
        let data = JSON.parse(str);
        if (data.type === 'User_Register') {
            let Register_name = data.name_register;
            let Register_password = data.password_register;
            let Register_email = data.email_register;
            let create_table = 'create table if not exists User_data(' +
                'id int primary key auto_increment,' +
                'User_name varchar(255) not null,' +
                'User_password varchar(255) not null,' +
                'User_email varchar(255) not null,' +
                'User_phone varchar(255) not null,' +
                'User_address varchar(255) not null,' +
                'User_image varchar(255) not null)auto_increment = 10000 charset = utf8';
            let add = 'insert into User_data(' +
                'id,' +
                'User_name,' +
                'User_password,' +
                'User_email,' +
                'User_phone,' +
                'User_address,' +
                'User_image)values (0,?,?,?,0,0,?)';
            let add_data = [Register_name, Register_password, Register_email, 'image'];
            connection.query(create_table, function (error, result, fields) {
                if (error) throw error;
            })
            let search_email = 'select * from user_data where User_email=' + '\'' + Register_email + '\'';
            connection.query(search_email, function (error, results, fields) {
                if (results.length === 0) {
                    connection.query(add, add_data, function (error, result, fields) {
                        if (error) {
                            ws.send(JSON.stringify({Register_type: 'fail', type: 'Register'}));
                            throw error;
                        } else {
                            ws.send(JSON.stringify({Register_type: 'successful', type: 'Register'}));
                        }
                    })
                } else if (results.length !== 0) {
                    ws.send(JSON.stringify({Register_type: 'Email is registered', type: 'Register'}));
                }
            })
        } else if (data.type === 'User_Login') {
            let Login_email = data.email_login;
            let Login_password = data.password_login;
            let search_email = 'select * from user_data where User_email=' + '\'' + Login_email + '\'';
            connection.query(search_email, function (error, results, fields) {
                if (results.length === 0) {
                    ws.send(JSON.stringify({Login_type: 'No such account', type: 'Login'}));
                } else if (results.length !== 0) {
                    if (Login_password === results[0].User_password) {
                        let User_id = results[0].id;
                        ws.send(JSON.stringify({Login_type: 'Login successful', id: User_id, type: 'Login'}));
                    } else {
                        ws.send(JSON.stringify({Login_type: 'Password error', type: 'Login'}));
                    }
                }
            })
        } else if (data.type === 'User_Forget') {
            let Forget_email = data.email_forget;
            let search_email = 'select * from user_data where User_email=' + '\'' + Forget_email + '\'';
            connection.query(search_email, function (error, results, fields) {
                if (results.length === 0) {
                    ws.send(JSON.stringify({Forget_type: 'No such account', type: 'Forget'}))
                } else if (results.length !== 0) {
                    let transporter = nodemailer.createTransport({
                        host: 'smtp.163.com',
                        port: 465,
                        secure: true,
                        auth: {
                            user: "i6v5k8afpx5@163.com",
                            pass: "DEBTYVRXRNEWGLAJ"
                        }
                    });
                    let code = []
                    for (let i = 0; i < 4; i++) {
                        let code_number = Math.floor(Math.random() * 10);
                        code.push(code_number);
                    }
                    const codeNumber = "" + code[0] + "" + code[1] + "" + code[2] + "" + code[3];
                    let mailOptions = {
                        from: 'i6v5k8afpx5@163.com',
                        to: results[0].User_email,
                        subject: 'Second_hand Market',
                        html: '<div>This is code: </div>'
                            + '<div style="font-size: 25px">' + codeNumber + '</div>'
                            + '<div>Captcha valid for 10 minutes</div>'
                    }
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) throw error;
                    })
                    ws.send(JSON.stringify({
                        Forget_type: 'please check your email',
                        email_code: codeNumber,
                        type: 'Forget'
                    }));
                }
            })
        } else if (data.type === 'User_Password_change') {
            let change_email = data.email_change;
            let change_password = data.password_change;
            let update = 'update User_data set User_password=? where User_email=' + '\'' + change_email + '\'';
            let update_data = [change_password];
            connection.query(update, update_data, function (error, result) {
                ws.send(JSON.stringify({change_type: 'fail', type: "Change"}));
                if (error) throw error;
            })
            ws.send(JSON.stringify({change_type: 'successful, jump', type: "Change"}));
        } else if (data.type === 'User_Information') {
            let Information_email = data.email_information;
            let search_email = 'select * from user_data where User_email=' + '\'' + Information_email + '\'';
            connection.query(search_email, function (error, results, fields) {
                if (error) throw error;
                let id = results[0].id;
                let User_name = results[0].User_name;
                let User_email = results[0].User_email;
                let User_phone = results[0].User_phone;
                let User_image_address = results[0].User_image
                try {
                    fs.readFile("./public/img/" + User_image_address + ".txt", "utf-8", function (error, data) {
                        let User_image = data;
                        ws.send(JSON.stringify({
                            information_id: id,
                            information_name: User_name,
                            information_email: User_email,
                            information_phone: User_phone,
                            information_image: User_image,
                            type: 'User_information'
                        }))
                    })
                } catch {
                    ws.send(JSON.stringify({
                        information_id: id,
                        information_name: User_name,
                        information_email: User_email,
                        information_phone: User_phone,
                        type: 'User_information'
                    }))
                }
            })
        } else if (data.type === 'User_Upload') {
            let Upload_email = data.email_upload;
            let search_email = 'select * from user_data where User_email=' + '\'' + Upload_email + '\'';
            connection.query(search_email, function (error, results, fields) {
                if (error) throw error;
                let User_name = results[0].User_name;
                let User_email = results[0].User_email;
                let User_phone = results[0].User_phone;
                let User_address = results[0].User_address;
                let User_image_address = results[0].User_image;
                try {
                    fs.readFile("./public/img/" + User_image_address + ".txt", "utf-8", function (error, data) {
                        let User_image = data;
                        ws.send(JSON.stringify({
                            upload_name: User_name,
                            upload_email: User_email,
                            upload_phone: User_phone,
                            upload_address: User_address,
                            upload_image: User_image,
                            type: 'User_upload'
                        }))
                    })
                } catch {
                    ws.send(JSON.stringify({
                        upload_name: User_name,
                        upload_email: User_email,
                        upload_phone: User_phone,
                        upload_address: User_address,
                        type: 'User_upload'
                    }))
                }
            })
        } else if (data.type === 'User_Upload_change') {
            let name = data.name_upload
            let address = data.address_upload;
            let email = data.email_upload;
            let image = data.image_upload;
            let phone = data.phone_upload
            fs.writeFile("./public/img/" + email + ".txt", image, function (err) {
                if (err) throw err;
            })
            let update = 'update User_data set User_name=?,User_address=?,User_image=?,User_phone=? where User_email=' + '\'' + email + '\'';
            let update_data = [name, address, email, phone];
            connection.query(update, update_data, function (error, results) {
                if (error) throw error;
                ws.send(JSON.stringify({update_type: 'successful,jump', type: 'upload_data'}))
            })
        } else if (data.type === 'shop') {
            let create_table = 'create table if not exists Item_data(' +
                'id int primary key auto_increment,' +
                'seller varchar(255) not null,' +
                'item_description text not null,' +
                'item_price int not null,' +
                'date_purchase varchar(255) not null,' +
                'item_status varchar(255) not null,' +
                'item_product varchar(255) not null,' +
                'item_name varchar(255) not null,' +
                'sale_status varchar(255) not null,' +
                'item_image varchar(255) not null,' +
                'item_score varchar(255))auto_increment = 1000 charset = utf8';
            connection.query(create_table, function (error, results, fields) {
                if (error) throw error;
            })
            let search_item = 'select * from Item_data where sale_status=' + '\'' + 'selling' + '\'';
            connection.query(search_item, function (error, results, fields) {
                if (error) throw error;
                for (let i = 0; i < results.length; i++) {
                    let item_id = results[i].id;
                    let item_seller = results[i].seller;
                    let item_description = results[i].item_description;
                    let item_price = results[i].item_price;
                    let item_image_address = results[i].item_image;
                    let search_User = 'select * from user_data where User_email=' + '\'' + item_seller + '\'';
                    connection.query(search_User, function (error, results, fields) {
                        if (error) throw error;
                        let User_name = results[0].User_name;
                        let User_image_address = results[0].User_image;
                        fs.readFile("./public/img/" + item_image_address + ".txt", "utf-8", function (error, data_item) {
                            if (error) throw error;
                            let item_image = data_item;
                            fs.readFile("./public/img/" + User_image_address + ".txt", "utf-8", function (error, data_user) {
                                if (error) throw error;
                                let User_image = data_user;
                                ws.send(JSON.stringify({
                                    shop_id: item_id,
                                    shop_description: item_description,
                                    shop_price: item_price,
                                    shop_seller: User_name,
                                    shop_i_image: item_image,
                                    shop_u_image: User_image,
                                    type: 'shop_data'
                                }))
                            })
                        })
                    })
                }
            })
        } else if (data.type === 'item_detail') {
            let search_item = 'select * from Item_data where id=' + '\'' + data.item_id + '\'';
            connection.query(search_item, function (error, results_item, fields) {
                if (error) throw error;
                let detail_seller = results_item[0].seller;
                let detail_description = results_item[0].item_description;
                let detail_price = results_item[0].item_price;
                let detail_date = results_item[0].date_purchase;
                let detail_status = results_item[0].item_status;
                let detail_product = results_item[0].item_product;
                let detail_name = results_item[0].item_name;
                let detail_sale_status = results_item[0].sale_status;
                let detail_image_address = results_item[0].item_image;
                let search_User = 'select * from user_data where User_email=' + '\'' + detail_seller + '\'';
                connection.query(search_User, function (error, results_user, fields) {
                    if (error) throw error;
                    let User_name = results_user[0].User_name;
                    let User_image_address = results_user[0].User_image;
                    let User_email_s = results_user[0].User_email;
                    let search_x = 'select * from Item_data where seller=' + '\'' + User_email_s + '\' and sale_status=' + '\'' + 'finish' + '\'';
                    let search_y = 'select item_score from Item_data where sale_status=' + '\'' + 'finish' + '\' and item_score is not null and seller=' + '\'' + User_email_s + '\'';
                    let sam = [];
                    connection.query(search_y, function (error, results) {
                        if (error) throw error;
                        if (results.length === 0) {
                            connection.query(search_x, function (error, results_s) {
                                if (error) throw error;
                                fs.readFile("./public/img/" + detail_image_address + ".txt", "utf-8", function (error, data_i) {
                                    let detail_image = data_i;
                                    fs.readFile("./public/img/" + User_image_address + ".txt", "utf-8", function (error, data_u) {
                                        let User_image = data_u;
                                        ws.send(JSON.stringify({
                                            detail_seller: detail_seller,
                                            detail_u_name: User_name,
                                            detail_u_image: User_image,
                                            detail_description: detail_description,
                                            detail_price: detail_price,
                                            detail_date: detail_date,
                                            detail_status: detail_status,
                                            detail_product: detail_product,
                                            detail_i_name: detail_name,
                                            detail_i_image: detail_image,
                                            detail_sale_status: detail_sale_status,
                                            detail_times: results_s.length,
                                            detail_score: 'No rating',
                                            type: 'item_detail'
                                        }))
                                    })
                                })
                            })
                        } else {
                            for (let i = 0; i < results.length; i++) {
                                sam.push(Number(results[i].item_score));
                            }
                            let total = sam.reduce((a, b) => a + b);
                            let score = total / results.length;
                            let score_1 = score.toFixed(1);
                            connection.query(search_x, function (error, results_s) {
                                if (error) throw error;
                                fs.readFile("./public/img/" + detail_image_address + ".txt", "utf-8", function (error, data_i) {
                                    let detail_image = data_i;
                                    fs.readFile("./public/img/" + User_image_address + ".txt", "utf-8", function (error, data_u) {
                                        let User_image = data_u;
                                        ws.send(JSON.stringify({
                                            detail_seller: detail_seller,
                                            detail_u_name: User_name,
                                            detail_u_image: User_image,
                                            detail_description: detail_description,
                                            detail_price: detail_price,
                                            detail_date: detail_date,
                                            detail_status: detail_status,
                                            detail_product: detail_product,
                                            detail_i_name: detail_name,
                                            detail_i_image: detail_image,
                                            detail_sale_status: detail_sale_status,
                                            detail_score: score_1,
                                            detail_times: results_s.length,
                                            type: 'item_detail'
                                        }))
                                    })
                                })
                            })
                        }
                    })
                })
            })
        } else if (data.type === 'product') {
            let email_product = data.product_email;
            let search_email = 'select * from Item_data where seller=' + '\'' + email_product + '\'';
            connection.query(search_email, function (error, results, fields) {
                if (error) throw error;
                for (let i = 0; i < results.length; i++) {
                    let product_id = results[i].id;
                    let product_description = results[i].item_description;
                    let product_price = results[i].item_price;
                    let product_image_address = results[i].item_image;
                    let product_sale_status = results[i].sale_status;
                    fs.readFile("./public/img/" + product_image_address + ".txt", "utf-8", function (error, data) {
                        if (error) throw error;
                        let product_image = data;
                        ws.send(JSON.stringify({
                            product_id: product_id,
                            product_description: product_description,
                            product_price: product_price,
                            product_image: product_image,
                            product_sale_status: product_sale_status,
                            type: 'product_data'
                        }))
                    })
                }
            })
        } else if (data.type === 'add_collection') {
            let create_collection = 'create table if not exists Collection_data(' +
                'id int primary key auto_increment,' +
                'Collectors varchar(255) not null,' +
                'item_id int not null)auto_increment = 1 charset = utf8';
            connection.query(create_collection, function (error, results, fields) {
                if (error) throw error;
            })
            let search_collection = 'select * from Collection_data where Collectors=' + '\'' + data.add_collection_email + '\' and item_id=' + '\'' + data.add_collection_id + '\'';
            let search_email = data.add_collection_email;
            let search_id = data.add_collection_id;
            let add = 'insert into Collection_data(' +
                'id,' +
                'Collectors,' +
                'item_id)values(0,?,?)';
            let add_data = [search_email, search_id];
            connection.query(search_collection, function (error, result_s) {
                if (result_s.length === 0) {
                    connection.query(add, add_data, function (error, results, fields) {
                        if (error) throw error;
                    })
                    ws.send(JSON.stringify({type: 'add_data', add_type: 'successful'}));
                } else {
                    ws.send(JSON.stringify({type: 'add_data', add_type: 'fail'}));
                }
            })
        } else if (data.type === 'collection_data') {
            let search_item = 'select * from Collection_data where Collectors=' + '\'' + data.collection_email + '\'';
            connection.query(search_item, function (error, results, fields) {
                if (error) throw error;
                if (results.length !== 0) {
                    for (let i = 0; i < results.length; i++) {
                        let item_id = results[i].item_id;
                        let search_item = 'select * from Item_data where id=' + '\'' + item_id + '\'';
                        connection.query(search_item, function (error, results_i) {
                            if (error) throw error;
                            let collection_id = results_i[0].id;
                            let collection_description = results_i[0].item_description;
                            let collection_price = results_i[0].item_price;
                            let collection_i_image_address = results_i[0].item_image;
                            let collection_seller = results_i[0].seller;
                            let search_user = 'select * from User_data where User_email=' + '\'' + collection_seller + '\'';
                            connection.query(search_user, function (error, results_u) {
                                if (error) throw error;
                                let collection_seller_name = results_u[0].User_name;
                                let collection_u_image_address = results_u[0].User_image;
                                fs.readFile("./public/img/" + collection_i_image_address + ".txt", "utf-8", function (error, data_i) {
                                    let collection_i_image = data_i;
                                    fs.readFile("./public/img/" + collection_u_image_address + ".txt", "utf-8", function (error, data_u) {
                                        let collection_u_image = data_u;
                                        let data_number = 'select *  from Item_data where Seller=' + '\'' + collection_seller + '\'and sale_status=' + '\'' + 'finish' + '\'';
                                        connection.query(data_number, function (error, res_n) {
                                            if (error) throw error;
                                            let number = res_n.length;
                                            ws.send(JSON.stringify({
                                                collection_id: collection_id,
                                                collection_u_image: collection_u_image,
                                                collection_i_image: collection_i_image,
                                                collection_u_name: collection_seller_name,
                                                collection_price: collection_price,
                                                collection_description: collection_description,
                                                collection_number: number,
                                                type: 'collection_data'
                                            }))
                                        })
                                    })
                                })
                            })
                        })
                    }
                }
            })
        } else if (data.type === 'Chat message') {
            if (data.chat_message_me !== undefined) {
                socket_id.push({"id_user": data.chat_message_me, "url_id": ws});
                for (let i = 0; i < socket_id.length; i++) {
                    if (socket_id[i].id_user === data.chat_message_me && socket_id[i].url_id !== ws) {
                        socket_id.splice(i, 1);
                    }
                }
            }
            socket.push(ws);
            let my = data.chat_message_me;
            let seller = data.chat_message_seller;
            let search_User = 'select * from User_data where User_email=' + '\'' + my + '\' or User_email=' + '\'' + seller + '\'';
            let search_history = 'select * from chat_data where (Sender=' + '\'' + my + '\'and Receiver=' + '\'' + seller + '\') or (Sender=' + '\'' + seller + '\'and Receiver=' + '\'' + my + '\')';
            connection.query(search_User, function (error, results, fields) {
                if (error) throw  error;
                if (results[0].User_email === my) {
                    let my_name = results[0].User_name;
                    let my_User_image_address = results[0].User_image;
                    let seller_name = results[1].User_name;
                    let seller_User_image_address = results[1].User_image;
                    fs.readFile("./public/img/" + my_User_image_address + ".txt", "utf-8", function (error, data_my) {
                        if (error) throw error;
                        let my_User_image = data_my;
                        fs.readFile("./public/img/" + seller_User_image_address + ".txt", "utf-8", function (error, data_seller) {
                            if (error) throw error;
                            let seller_User_image = data_seller;
                            ws.send(JSON.stringify({
                                my_name: my_name,
                                my_image: my_User_image,
                                seller_name: seller_name,
                                seller_image: seller_User_image,
                                type: 'chat_data'
                            }))
                            connection.query(search_history, function (error, result) {
                                if (error) throw error;
                                for (let i = 0; i < result.length; i++) {
                                    let sender = result[i].Sender;
                                    let receiver = result[i].Receiver;
                                    let message = result[i].message;
                                    ws.send(JSON.stringify({
                                        type: 'chat_history',
                                        sender_history: sender,
                                        sender_history_name: my_name,
                                        sender_history_image: my_User_image,
                                        send_message: message,
                                        receiver_history: receiver,
                                        receiver_history_name: seller_name,
                                        receiver_history_image: seller_User_image
                                    }))
                                }
                            })
                        })
                    })
                } else if (results[0].User_email === seller) {
                    let my_name = results[1].User_name;
                    let my_User_image_address = results[1].User_image;
                    let seller_name = results[0].User_name;
                    let seller_User_image_address = results[0].User_image;
                    fs.readFile("./public/img/" + my_User_image_address + ".txt", "utf-8", function (error, data_my) {
                        if (error) throw error;
                        let my_User_image = data_my;
                        fs.readFile("./public/img/" + seller_User_image_address + ".txt", "utf-8", function (error, data_seller) {
                            if (error) throw error;
                            let seller_User_image = data_seller;
                            ws.send(JSON.stringify({
                                my_name: my_name,
                                my_image: my_User_image,
                                seller_name: seller_name,
                                seller_image: seller_User_image,
                                type: 'chat_data'
                            }))
                            connection.query(search_history, function (error, result) {
                                if (error) throw error;
                                for (let i = 0; i < result.length; i++) {
                                    let sender = result[i].Sender;
                                    let receiver = result[i].Receiver;
                                    let message = result[i].message;
                                    ws.send(JSON.stringify({
                                        type: 'chat_history',
                                        sender_history: sender,
                                        sender_history_name: my_name,
                                        sender_history_image: my_User_image,
                                        send_message: message,
                                        receiver_history: receiver,
                                        receiver_history_name: seller_name,
                                        receiver_history_image: seller_User_image
                                    }))
                                }
                            })
                        })
                    })
                }
            })
        } else if (data.type === 'message_text') {
            let create_chat = 'create table if not exists chat_data(' +
                'id int primary key auto_increment,' +
                'Sender varchar(255) not null,' +
                'Receiver varchar(255) not null,' +
                'message text not null,' +
                'time varchar(255) not null)charset = utf8';
            connection.query(create_chat, function (error, result, fields) {
                if (error) throw error;
            })
            let add = 'insert into chat_data(' +
                'id,' +
                'Sender,' +
                'Receiver,' +
                'message,' +
                'time) values(0,?,?,?,?)';
            let add_data = [data.sender, data.receiver, data.message, data.time];
            connection.query(add, add_data, function (error, results) {
                if (error) throw error;
            })
            let search_message = 'select * from chat_data where Sender=' + '\'' + data.sender + '\' or Receiver=' + '\'' + data.sender + '\'';
            connection.query(search_message, function (error, results) {
                if (error) throw error;
                let message = results[results.length - 1].message;
                let sender = results[results.length - 1].Sender;
                let receiver = results[results.length - 1].Receiver;
                let search_User = 'select * from User_data where User_email=' + '\'' + data.sender + '\' or User_email=' + '\'' + data.receiver + '\'';
                connection.query(search_User, function (error, result_u) {
                    if (error) throw error;
                    if (result_u[0].User_email === data.sender) {
                        let my = result_u[0].User_email;
                        let you = result_u[1].User_email;
                        let my_name = result_u[0].User_name;
                        let you_name = result_u[1].User_name;
                        let my_image_address = result_u[0].User_image;
                        let you_image_address = results[1].User_image;
                        fs.readFile("./public/img/" + my_image_address + ".txt", "utf-8", function (error, data_my) {
                            if (error) throw error;
                            let my_image = data_my;
                            fs.readFile("./public/img/" + you_image_address + ".txt", "utf-8", function (error, data_seller) {
                                let you_image = data_seller
                                socket.forEach(client => {
                                    try {
                                        let check = socket_id.find((item,) => item.id_user === you)
                                        let url = check["url_id"];
                                        if (client === url) {
                                            client.send(JSON.stringify({
                                                sender: my,
                                                sender_name: my_name,
                                                sender_image: my_image,
                                                receiver: you,
                                                receiver_name: you_name,
                                                receiver_image: you_image,
                                                sender_who: sender,
                                                receiver_who: receiver,
                                                send_message: message,
                                                type: 'chat_message'
                                            }))
                                        }
                                    } catch (err) {
                                        console.log("not online")
                                    }
                                })
                                ws.send(JSON.stringify({
                                    sender: my,
                                    sender_name: my_name,
                                    sender_image: my_image,
                                    receiver: you,
                                    receiver_name: you_name,
                                    receiver_image: you_image,
                                    sender_who: sender,
                                    receiver_who: receiver,
                                    send_message: message,
                                    type: 'chat_message'
                                }))
                            })
                        })
                    } else if (result_u[1].User_email === data.sender) {
                        let my = result_u[1].User_email;
                        let you = result_u[0].User_email;
                        let my_name = result_u[1].User_name;
                        let you_name = result_u[0].User_name;
                        let my_image_address = result_u[1].User_image;
                        let you_image_address = results[0].User_image;
                        fs.readFile("./public/img/" + my_image_address + ".txt", "utf-8", function (error, data_my) {
                            if (error) throw error;
                            let my_image = data_my;
                            fs.readFile("./public/img/" + you_image_address + ".txt", "utf-8", function (error, data_seller) {
                                let you_image = data_seller
                                socket.forEach(client => {
                                    try {
                                        let check = socket_id.find((item,) => item.id_user === you)
                                        let url = check["url_id"];
                                        if (client === url) {
                                            client.send(JSON.stringify({
                                                sender: my,
                                                sender_name: my_name,
                                                sender_image: my_image,
                                                receiver: you,
                                                receiver_name: you_name,
                                                receiver_image: you_image,
                                                sender_who: sender,
                                                receiver_who: receiver,
                                                send_message: message,
                                                type: 'chat_message'
                                            }))
                                        }
                                    } catch (err) {
                                        console.log("not online")
                                    }
                                })
                                ws.send(JSON.stringify({
                                    sender: my,
                                    sender_name: my_name,
                                    sender_image: my_image,
                                    receiver: you,
                                    receiver_name: you_name,
                                    receiver_image: you_image,
                                    sender_who: sender,
                                    receiver_who: receiver,
                                    send_message: message,
                                    type: 'chat_message'
                                }))
                            })
                        })
                    }
                })
            })
        } else if (data.type === 'name') {
            let User_email = data.name_data;
            let search_name = 'select * from user_data where User_email=' + '\'' + User_email + '\'';
            connection.query(search_name, function (error, result) {
                if (error) throw error;
                let user_name = result[0].User_name;
                ws.send(JSON.stringify({user_name: user_name, type: 'name_data'}))
            })
        } else if (data.type === 'chat_list') {
            let member = [];
            let user_email = data.chat_email;
            let search_chat = 'select * from chat_data where Sender=' + '\'' + user_email + '\' or Receiver=' + '\'' + user_email + '\'';
            connection.query(search_chat, function (error, result_chat) {
                for (let i = 0; i < result_chat.length; i++) {
                    if (result_chat[i].Sender === user_email) {
                        if (member.indexOf(result_chat[i].Receiver) == -1) {
                            member.push(result_chat[i].Receiver);
                        }
                    } else if (result_chat[i].Sender !== user_email) {
                        if (member.indexOf(result_chat[i].Sender) == -1) {
                            member.push(result_chat[i].Sender);
                        }
                    }
                }
                for (let n = 0; n < member.length; n++) {
                    let search_user = 'select * from User_data where User_email=' + '\'' + member[n] + '\'';
                    connection.query(search_user, function (error, result_user) {
                        if (error) throw error;
                        let user_name = result_user[0].User_name;
                        let user_email_seller = result_user[0].User_email;
                        let user_image_address = result_user[0].User_image;
                        let search_chat = 'select * from chat_data where (Sender=' + '\'' + user_email + '\'and Receiver=' + '\'' + user_email_seller + '\') or (Sender=' + '\'' + user_email_seller + '\'and Receiver=' + '\'' + user_email + '\')';
                        connection.query(search_chat, function (error, result_chat) {
                            if (error) throw error;
                            let user_message = result_chat[result_chat.length - 1].message;
                            fs.readFile("./public/img/" + user_image_address + ".txt", "utf-8", function (error, data_image) {
                                let user_image = data_image;
                                ws.send(JSON.stringify({
                                    user_name: user_name,
                                    user_image: user_image,
                                    user_message: user_message,
                                    user_email: user_email_seller,
                                    type: 'chat_list'
                                }))
                            })
                        })
                    })
                }
            })
        } else if (data.type === 'sale') {
            let search = 'select * from item_data';
            connection.query(search, function (error, results_item) {
                fs.writeFile("./public/img/item_" + results_item[results_item.length - 1].id + ".txt", data.item_image, function (error) {
                    if (error) throw error;
                })
                let add = 'insert into item_data(' +
                    'id,' +
                    'seller,' +
                    'item_description,' +
                    'item_price,' +
                    'date_purchase,' +
                    'item_status,' +
                    'item_product,' +
                    'item_name,' +
                    'sale_status,' +
                    'item_image)values (0,?,?,?,?,?,?,?,?,?)';
                let add_data = [data.item_seller, data.item_description, data.item_price, data.item_date, data.item_status, data.item_type, data.item_name, "selling", "item_" + results_item[results_item.length - 1].id];
                connection.query(add, add_data, function (error) {
                    if (error) throw error;
                    ws.send(JSON.stringify({add_type: 'successful', type: 'add_item'}))
                })
            })
        } else if (data.type === 'delete') {
            let delete_item = 'delete from item_data where id=' + '\'' + data.item_id + '\'';
            connection.query(delete_item, function (error) {
                if (error) throw error;
                ws.send(JSON.stringify({delete_type: 'successful', type: 'delete'}));
            })
        } else if (data.type === 'change_item') {
            let search_item = 'select * from item_data where id=' + '\'' + data.item_id + '\'';
            connection.query(search_item, function (error, results_item) {
                let change_description = results_item[0].item_description;
                let change_price = results_item[0].item_price;
                let change_date = results_item[0].date_purchase;
                let change_status = results_item[0].item_status;
                let change_type = results_item[0].item_product;
                let change_name = results_item[0].item_name;
                let change_image_address = results_item[0].item_image;
                fs.readFile("./public/img/" + change_image_address + ".txt", "utf-8", function (error, data) {
                    let change_image = data;
                    ws.send(JSON.stringify({
                        change_description: change_description,
                        change_price: change_price,
                        change_date: change_date,
                        change_status: change_status,
                        change_type: change_type,
                        change_name: change_name,
                        change_image: change_image,
                        type: 'change_data'
                    }))
                })
            })
        } else if (data.type === 'item_change_data') {
            let update_item = 'update item_data set item_description=?,item_price=?,date_purchase=?,item_status=?,item_product=?,item_name=? where id=' + '\'' + data.item_id + '\'';
            let update_data = [data.item_description, data.item_price, data.item_date, data.item_status, data.item_type, data.item_name];
            let search_image = 'select * from item_data where id=' + '\'' + data.item_id + '\'';
            connection.query(update_item, update_data, function (error) {
                if (error) throw error;
                connection.query(search_image, function (error, results) {
                    let image_address = results[0].item_image;
                    fs.writeFile("./public/img/" + image_address + ".txt", data.item_image_data, function (error) {
                        if (error) throw error;
                        ws.send(JSON.stringify({change_type: 'successful', type: 'change'}))
                    })
                })
            })
        } else if (data.type === 'item_search') {
            let search_item = 'select * from item_data where (item_description like' + '\'' + '%' + data.search_word + '%' + '\'or item_product like' + '\'' + '%' + data.search_word + '%' + '\'or item_name like' + '\'' + '%' + data.search_word + '%' + '\')and sale_status=' + '\'' + 'selling' + '\'';
            connection.query(search_item, function (error, results) {
                if (error) throw error;
                for (let i = 0; i < results.length; i++) {
                    let result_id = results[i].id;
                    let result_seller = results[i].seller;
                    let result_description = results[i].item_description;
                    let result_price = results[i].item_price;
                    let result_image_address = results[i].item_image;
                    let search_user = 'select * from user_data where User_email=' + '\'' + result_seller + '\'';
                    connection.query(search_user, function (error, res_user) {
                        if (error) throw error;
                        let user_image_address = res_user[0].User_image;
                        let user_name = res_user[0].User_name;
                        fs.readFile("./public/img/" + user_image_address + ".txt", "utf-8", function (error, data) {
                            if (error) throw error;
                            let user_image = data;
                            fs.readFile("./public/img/" + result_image_address + ".txt", "utf-8", function (error, data_i) {
                                if (error) throw error;
                                let item_image = data_i;
                                ws.send(JSON.stringify({
                                    res_id: result_id,
                                    res_seller: user_name,
                                    res_description: result_description,
                                    res_price: result_price,
                                    res_user_image: user_image,
                                    res_item_image: item_image,
                                    type: 'search_item'
                                }))
                            })
                        })
                    })
                }
            })
        } else if (data.type === 'delete_collection') {
            let delete_collection = 'delete from Collection_data where Collectors=' + '\'' + data.delete_user + '\' and item_id=' + '\'' + data.delete_collection + '\'';
            connection.query(delete_collection, function (error) {
                if (error) throw error;
                ws.send(JSON.stringify({delete_type: 'successful', type: 'delete_collection'}));
            })
        } else if (data.type === 'add_buy') {
            let create_buy = 'create table if not exists buy_data(' +
                'id int primary key auto_increment,' +
                'Purchasers varchar(255) not null,' +
                'item_id int not null)auto_increment = 1 charset = utf8';
            connection.query(create_buy, function (error) {
                if (error) throw error;
            })
            let search_address = 'select * from User_data where User_email=' + '\'' + data.add_buy_email + '\'';
            connection.query(search_address, function (error, result_user) {
                if (error) throw error;
                if (result_user[0].User_address == 0 || result_user[0].User_address == "") {
                    ws.send(JSON.stringify({buy_type: 'address', type: 'buy'}));
                } else if (result_user[0].User_phone == 0 || result_user[0].User_phone == "") {
                    ws.send(JSON.stringify({buy_type: 'phone', type: 'buy'}));
                } else {
                    let add = 'insert into buy_data(' +
                        'id,' +
                        'Purchasers,' +
                        'item_id)values(0,?,?)';
                    let add_data = [data.add_buy_email, data.add_buy_id];
                    connection.query(add, add_data, function (error) {
                        if (error) throw error;
                        ws.send(JSON.stringify({buy_type: 'successful', type: 'buy'}));
                        let update_item = 'update item_data set sale_status=? where id=' + '\'' + data.add_buy_id + '\'';
                        let update_data = ['Awaiting delivery from seller'];
                        connection.query(update_item, update_data, function (error) {
                            if (error) throw error;
                        })
                    })
                }
            })
        } else if (data.type === 'my_purchase') {
            let email_product = data.product_email;
            let search_email = 'select * from buy_data where Purchasers=' + '\'' + email_product + '\'';
            connection.query(search_email, function (error, results_id) {
                if (error) throw error;
                for (let i = 0; i < results_id.length; i++) {
                    let item_id = results_id[i].item_id;
                    let search_item = 'select * from item_data where id=' + '\'' + item_id + '\'';
                    connection.query(search_item, function (error, result_item) {
                        if (error) throw error;
                        let purchase_id = result_item[0].id;
                        let purchase_description = result_item[0].item_description;
                        let purchase_price = result_item[0].item_price;
                        let purchase_image_address = result_item[0].item_image;
                        let purchase_sale_status = result_item[0].sale_status;
                        let purchase_seller = result_item[0].seller;
                        let purchase_score = result_item[0].item_score
                        fs.readFile("./public/img/" + purchase_image_address + ".txt", "utf-8", function (error, data_item) {
                            let purchase_image = data_item;
                            ws.send(JSON.stringify({
                                purchase_id: purchase_id,
                                purchase_description: purchase_description,
                                purchase_price: purchase_price,
                                purchase_image: purchase_image,
                                purchase_sale_status: purchase_sale_status,
                                purchase_seller: purchase_seller,
                                purchase_score: purchase_score,
                                type: 'my_purchase'
                            }))
                        })
                    })
                }
            })
        } else if (data.type === 'change_type') {
            let update_type = 'update item_data set sale_status=? where id=' + '\'' + data.purchase_id + '\'';
            let type = ["finish"];
            connection.query(update_type, type, function (error) {
                if (error) throw error;
                ws.send(JSON.stringify({change_type: 'successful', type: 'check'}));
            })
        } else if (data.type === 'delivery_type') {
            let search_Buyers = 'select * from buy_data where item_id=' + '\'' + data.delivery_id + '\'';
            connection.query(search_Buyers, function (error, results_buyer) {
                if (error) throw error;
                let buyer_email = results_buyer[0].Purchasers;
                let search_user = 'select * from user_data where User_email=' + '\'' + buyer_email + '\'';
                connection.query(search_user, function (error, results_user) {
                    if (error) throw error;
                    let user_name = results_user[0].User_name;
                    let user_address = results_user[0].User_address;
                    let user_phone = results_user[0].User_phone;
                    let user_email = results_user[0].User_email;
                    ws.send(JSON.stringify({
                        user_name: user_name,
                        user_address: user_address,
                        user_phone: user_phone,
                        user_email: user_email,
                        type: 'delivery_data'
                    }))
                })
            })
        } else if (data.type === 'sent_delivery') {
            let update_status = 'update item_data set sale_status=? where id=' + '\'' + data.item_id + '\'';
            let status_type = ['in transit'];
            let search_seller = 'select * from item_data where id=' + '\'' + data.item_id + '\'';
            connection.query(update_status, status_type, function (error) {
                if (error) throw error;
            })
            let transporter = nodemailer.createTransport({
                host: 'smtp.163.com',
                port: 465,
                secure: true,
                auth: {
                    user: "i6v5k8afpx5@163.com",
                    pass: "DEBTYVRXRNEWGLAJ"
                }
            });
            let mailOptions = {
                from: 'i6v5k8afpx5@163.com',
                to: data.email_address,
                subject: 'Second-hand Market',
                html: '<div>Please note that the merchant has shipped the product.</div>' +
                    '<div> The following is your courier bill number:</div>'
                    + '<div style="font-size: 16px">' + data.delivery_number + '</div>'
            }
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) throw error;
                connection.query(search_seller, function (error, result_seller) {
                    let seller_address = result_seller[0].seller;
                    ws.send(JSON.stringify({
                        sent_type: 'successful',
                        seller_address: seller_address,
                        type: 'send_delivery_email'
                    }));
                })
            })
        } else if (data.type === 'email') {
            let search_user = 'select * from item_data where id=' + '\'' + data.item_id + '\'';
            connection.query(search_user, function (error, result) {
                if (error) throw error;
                let email_address = result[0].seller;
                ws.send(JSON.stringify({type: 'jump_email', email_address: email_address}))
            })
        } else if (data.type === 'cancel_buy') {
            let delete_buy = 'delete from buy_data where item_id=' + '\'' + data.item_id + '\'';
            connection.query(delete_buy, function (error) {
                if (error) throw error;
            })
            let update_item = 'update item_data set sale_status=? where id=' + '\'' + data.item_id + '\'';
            let type = ['selling'];
            connection.query(update_item, type, function (error) {
                if (error) throw error;
                ws.send(JSON.stringify({cancel_type: 'successful', type: 'cancel'}))
            })
        } else if (data.type === 'item_score') {
            let update = 'update item_data set item_score=? where id=' + '\'' + data.item_id + '\'';
            let update_data = [data.item_score];
            connection.query(update, update_data, function (error) {
                if (error) throw error;
                ws.send(JSON.stringify({score_type: 'successful', type: 'score'}));
            })
        }
    })
    ws.on('close', function (e) {

    })
})
app.listen(port, () => {
    console.log('express server listen at http://localhost:' + port);
})
