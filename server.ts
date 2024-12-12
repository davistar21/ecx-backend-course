import * as http from "http";
import * as fs from "fs";
import * as path from "path";

interface User {
    id: string,
    name: string,
    age: number,
}

const PORT = 4001;
const databasePath = path.join(__dirname, "users.json")

function readDB(callback: (data: User[] | null) =>  void){
    fs.readFile(databasePath, "utf-8", (err, data)=>{
        if (err){
            console.log("Error reading file:", err);
            callback(null)
            return
        }
        callback(JSON.parse(data))
    })
}

function writeDB(response:any, dataS:any){
    fs.writeFile("users.json", JSON.stringify(dataS), (err)=>{
        if(err){
            console.log(err);
            response.writeHead(500, {
                "Content-Type": "application/json",
            });
            response.end("Unable to add user")
        } else {
                response.writeHead(201, {
                    "Content-Type": "application/json",
                });
                response.end(JSON.stringify(dataS));
        }
    })
};

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

const server = http.createServer((request, response)=>{
    if (request.url == "/" && request.method == "GET"){
        response.end("Hello Not Oswald!")
    };
    if (request.url == "/users" && request.method == "GET"){
        readDB((users)=>{
            if (!users) {
                response.writeHead(500, { "Content-Type": "application/json" });
                response.end(JSON.stringify({ error: "Could not read users" }));
            } else {
                response.writeHead(200, { "Content-Type": "application/json" });
                response.end(JSON.stringify(users));
            }
        })
    };
    if (request.url == "/age" && request.method == "GET"){
        readDB((users)=>{
            if(users){
                const userAges = users.map(user => user.age);
                response.end(JSON.stringify(userAges))
            }
        })
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

    if(request.url == '/users' && request.method == 'POST'){
        let body:User = {
            "id": "0001",
            "name": "Gabrielle",
            "age": 90
        };
        request.on('data', (chunk)=>{
            body += chunk.toString();
        });
        request.on('end', ()=>{
            const newUser:User = JSON.parse(JSON.stringify(body));
            // newUser.id = '00031';
            // newUser.age = 12;
            // newUser.name = "Shanice"
            readDB((users)=>{
                if (users){
                    users.push(newUser);
                    writeDB(response, users);
                }
            })
        })
    };
    let id:string = '0001';    
    if (request.url == `/users/${id}` && request.method == 'DELETE'){
        readDB((users)=>{
            if (users){
                console.log(users[0].id);
                const updatedUsers = users.filter((user)=> user.id !== id);
                response.end(JSON.stringify(updatedUsers));
                writeDB(response, updatedUsers);
            }
        })
    };
    if (request.url == '/users' && request.method == 'PATCH'){

    }

    
});
server.listen(PORT, ()=>{
    console.log(`Server is listening on port ${PORT}`)
});

