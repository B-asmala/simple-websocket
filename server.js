const express = require("express");
const webSocket = require("ws").Server;
const tasks = []; // store all tasks


const app = express();
const port = 3000;

const server = app.listen(port , () => {
    console.log(`server running on port ${port}`);
});

app.get("/", (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
})

const socket = new webSocket({server});

socket.on('connection', (ws) => {
    console.log('Websocket Established');

    //server gets a new task
    ws.on('message', (data) => {
        try {
            console.log('New task added!');
            const task = JSON.parse(data);
            tasks.push(task); // add to the array of tasks

            socket.broadcast(JSON.stringify({data : [task]})); //broadcast to all clients
            

        } catch (error) {
            console.error(error);
        }
    });


    //connection started
    ws.send(JSON.stringify({message : "Websocket Established"}));
    if(tasks.length > 0){
        //send previous tasks 
        ws.send(JSON.stringify({data : tasks})); 
    }
    
});


//broadcast function
socket.broadcast = function broadcast(msg) {
    console.log(msg);
    socket.clients.forEach(function each(client) {
        client.send(msg);
     });
 };