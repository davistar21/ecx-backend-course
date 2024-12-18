import * as express from "express";
import * as fs from "fs";

const app = express();

app.use(express.json())  //the global middleware form

//middleware is the action the server performs in sequential order!
// request > action 1(globalmiddleware) . action 2 . action 3 > final action (actions 1-3 are middleware actions);
//the server performs the global middleware first

app.get('/', (request, response) => {
    response.send("Hello World!")
})

app.get("/users", (request, response)=>{
    fs.readFile('users.json', 'utf-8', (err, data)=>{
        if (!err){
            response.send(data)
        }
    })
});
app.get("/ages", (request, response) => {
    fs.readFile("users.json", "utf-8", (err, data)=>{
        if (!err){
            let users = JSON.parse(data);
            let userAges = users.map(user => user.age);
            response.end(JSON.stringify(userAges))
        }
    })
});
app.post("/users", (request, response) => {
    const body = request.body;
    console.log(request.body)
    const {myName, myAge} = body;
    const user = {name: myName, age: myAge};
    fs.readFile("users.json", 'utf-8', (err, data)=>{
        if(!err){
            const users = JSON.parse(data);
            users.push(user);
            fs.writeFile("users.json", JSON.stringify(users), (err)=>{
                if (!err){
                    response.status(201).send(users)
                }
            })
        }
    })
});
app.patch("/users/:position", (request, response)=>{
    const body = request.body;
    // const params = request.params;
    const newAge = body.newAge;
    const position = request.params.position;
    fs.readFile("users.json", 'utf-8', (err, data)=>{
        if(!err){
            const users = JSON.parse(data);
            users[position].age = 14;
            console.log(users)
            fs.writeFile("users.json", JSON.stringify(users), (err)=>{
                if(!err){
                    response.status(200).json(users)
                }
            })
        }
    })
})


app.listen(5000, ()=>{
    console.log("Server is running at port 5000")
});

console.log("Hello")