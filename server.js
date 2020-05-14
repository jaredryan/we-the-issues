const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const http = require('http');
const { v4 } = require('uuid');
const webSocketServer = require('websocket').server;

const port = process.env.PORT || 8000;
const path = require("path");
require("dotenv").config()

const app = express();

app.use(express.static(path.join(__dirname, "client", "build")))
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use("/issues", require('./routes/issues'));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/issues", err => {
    if (err) throw err;
    console.log("Connected to the database.");
});

app.get("*", (req, res) => {  
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

// Make it a websocket
const httpServer = http.createServer(app);
httpServer.listen(port);
const wsServer = new webSocketServer({
    httpServer
});

// Stores all clients
const clients = {};

// Fake auditing
const logs = [];

// Update all clients 
const sendData = (json, userId) => Object.keys(clients).forEach((key) => key !== userId && clients[key].sendUTF(json));

wsServer.on('request', request => {
    // Can rewrite this part of the code to accept only the requests from allowed origin
    const connection = request.accept(null, request.origin);
    logs.push(`${new Date()}: Received a new connection from origin ${request.origin}.`);

    const userId = v4();
    clients[userId] = connection;

    logs.push(`Connected: ${userId} in ${Object.getOwnPropertyNames(clients)}`);
    
    connection.on('message', message => {
        if (message.type === 'utf8') {
            sendData(JSON.stringify(JSON.parse(message.utf8Data)), userId);
        }
    });

    connection.on('close', () => {
        logs.push(`${userId} left.`);
        delete clients[userId];
    });
});
