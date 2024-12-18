import * as express from "express";
import * as mongoose from "mongoose";
import UserModel from "./userSchema";

const app = express();
app.use(express.json());
const connectionString = 'mongodb+srv://eyitayobembe:1opAgcct264yV9VK@usersdatabase.l2ysx.mongodb.net/?retryWrites=true&w=majority&appName=usersDatabase';
const connectionPassword = '1opAgcct264yV9VK';

async function getAllUsers(){
    const users = await UserModel.find()
    return users;
};
app.get('/users', async (request, response) => {
    const databaseUsers = await getAllUsers()
    // const users = UserModel.find(/*filter*/); //to get all the users
    response.send(databaseUsers); 
});
app.post("/users", async (request, response) => {
    const body = request.body;
    const myName = "David"; //body.myName;
    const myAge = 19; //body.myAge;
    const newUser = await UserModel.create({name: myName, age: myAge});
    response.status(201).json(newUser);
});
app.get("/ages", async (request, response)=> {
    const databaseUsersAges = (await (getAllUsers())).map(user => user.age)
    response.send(databaseUsersAges);
    console.log(databaseUsersAges)
});
app.get("/users/:id", async(request, response)=>{
    const id = request.params.id;
    const user = await UserModel.findById(id);
    response.status(201).send(user)
});
app.patch("/users/:id", async (request, response) => {
    const body = request.body;
    const id = request.params.id;
    await UserModel.updateOne({//takes in two things, where you want to update and what you want to update...
        _id: id,
    }, {age: 23});
    const updatedUser = await UserModel.findById(id);
    response.status(201).send(updatedUser);
});

mongoose.connect("mongodb+srv://eyitayobembe:1opAgcct264yV9VK@usersdatabase.l2ysx.mongodb.net/?retryWrites=true&w=majority&appName=usersDatabase").then(()=>{
    console.log("Connected!")
});

app.listen(5001, ()=>{
    console.log("Server is listening on PORT 5001")
})



// 1opAgcct264yV9VK
// mongodb+srv://eyitayobembe:1opAgcct264yV9VK@usersdatabase.l2ysx.mongodb.net/?retryWrites=true&w=majority&appName=usersDatabase