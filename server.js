"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var fs = require("fs");
var app = express();
app.use(express.json()); //the global middleware form
//middleware is the action the server performs in sequential order!
// request > action 1(globalmiddleware) . action 2 . action 3 > final action (actions 1-3 are middleware actions);
//the server performs the global middleware first
app.get('/', function (request, response) {
    response.send("Hello World!");
});
app.get("/users", function (request, response) {
    fs.readFile('users.json', 'utf-8', function (err, data) {
        if (!err) {
            response.send(data);
        }
    });
});
app.get("/ages", function (request, response) {
    fs.readFile("users.json", "utf-8", function (err, data) {
        if (!err) {
            var users = JSON.parse(data);
            var userAges = users.map(function (user) { return user.age; });
            response.end(JSON.stringify(userAges));
        }
    });
});
app.post("/users", function (request, response) {
    var body = request.body;
    console.log(request.body);
    var myName = body.myName, myAge = body.myAge;
    var user = { name: myName, age: myAge };
    fs.readFile("users.json", 'utf-8', function (err, data) {
        if (!err) {
            var users_1 = JSON.parse(data);
            users_1.push(user);
            fs.writeFile("users.json", JSON.stringify(users_1), function (err) {
                if (!err) {
                    response.status(201).send(users_1);
                }
            });
        }
    });
});
app.patch("/users/:position", function (request, response) {
    var body = request.body;
    var params = request.params;
    var newAge = body.newAge;
    var position = params.position;
    fs.readFile("users.json", 'utf-8', function (err, data) {
        if (!err) {
            var users_2 = JSON.parse(data);
            users_2[position].age = 14;
            console.log(users_2);
            fs.writeFile("users.json", JSON.stringify(users_2), function (err) {
                if (!err) {
                    response.status(200).json(users_2);
                }
            });
        }
    });
});
app.listen(5000, function () {
    console.log("Server is running at port 5000");
});
console.log("Hello");
