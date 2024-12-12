"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http = require("http");
var fs = require("fs");
var path = require("path");
var PORT = 4001;
var databasePath = path.join(__dirname, "users.json");
function readDB(callback) {
    fs.readFile(databasePath, "utf-8", function (err, data) {
        if (err) {
            console.log("Error reading file:", err);
            callback(null);
            return;
        }
        callback(JSON.parse(data));
    });
}
function writeDB(response, dataS) {
    fs.writeFile("users.json", JSON.stringify(dataS), function (err) {
        if (err) {
            console.log(err);
            response.writeHead(500, {
                "Content-Type": "application/json",
            });
            response.end("Unable to add user");
        }
        else {
            response.writeHead(201, {
                "Content-Type": "application/json",
            });
            response.end(JSON.stringify(dataS));
        }
    });
}
;
// function removeUser(id:string, callback:(success: boolean) => void){
//     readDB((users)=>{
//         if (users){
//             const updatedUsers = users.filter(user => user.id !== id);
//             fs.writeFile('users.json', JSON.stringify(updatedUsers, null, 2), (err) => {
//                 if (err) {
//                     callback(false);
//                     return;
//                 }
//                 callback(true);
//             });
//         }
//     })
// }
// function addNewUser(callback: (user: User[])=>void){
//     const newUser:User[] = JSON.parse(body);
//     readDB((users)=>{
//         users.push(newUser)
//     })
// }
var server = http.createServer(function (request, response) {
    if (request.url == "/" && request.method == "GET") {
        response.end("Hello Not Oswald!");
    }
    ;
    if (request.url == "/users" && request.method == "GET") {
        readDB(function (users) {
            if (!users) {
                response.writeHead(500, { "Content-Type": "application/json" });
                response.end(JSON.stringify({ error: "Could not read users" }));
            }
            else {
                response.writeHead(200, { "Content-Type": "application/json" });
                response.end(JSON.stringify(users));
            }
        });
    }
    ;
    if (request.url == "/age" && request.method == "GET") {
        readDB(function (users) {
            if (users) {
                var userAges = users.map(function (user) { return user.age || user.name; });
                response.end(JSON.stringify(userAges));
            }
        });
    }
    // if (request.method === "POST" && request.url === "/users"){
    //     let body = '';
    // 	request.on('data', (chunk) => {
    // 		body += chunk.toString();
    // 	});
    //     request.on('end', ()=>{
    //         const newUser = JSON.parse(body)
    //     })
    //     console.log("Hello World!");
    //     response.end("Hello Oswald!")
    //     fs.readFile("users.json", "utf-8", (err, data)=>{
    //         if(err){
    //             response.end(err);
    //             return
    //         };
    //         let users = JSON.parse(data);
    //         response.end(JSON.stringify(users));
    //         response.end("Kardashian")
    //     })
    // };
    if (request.url == '/users' && request.method == 'POST') {
        var body_1 = {
            "id": "0001",
            "name": "Gabrielle",
            "age": 90
        };
        request.on('data', function (chunk) {
            body_1 += chunk.toString();
        });
        request.on('end', function () {
            var newUser = JSON.parse(JSON.stringify(body_1));
            // newUser.id = '00031';
            // newUser.age = 12;
            // newUser.name = "Shanice"
            readDB(function (users) {
                if (users) {
                    users.push(newUser);
                    writeDB(response, users);
                }
            });
        });
    }
    ;
    var id = '0001';
    if (request.url == "/users/".concat(id) && request.method == 'DELETE') {
        readDB(function (users) {
            if (users) {
                console.log(users[0].id);
                var updatedUsers = users.filter(function (user) { return user.id !== id; });
                response.end(JSON.stringify(updatedUsers));
                writeDB(response, updatedUsers);
            }
        });
    }
    ;
    if (request.url == '/users' && request.method == 'PATCH') {
    }
});
server.listen(PORT, function () {
    console.log("Server is listening on port ".concat(PORT));
});
