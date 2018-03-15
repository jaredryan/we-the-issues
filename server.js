const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const port = process.env.PORT || 8000;
const path = require("path");
const secret = process.env.SECRET || "localserversecret";
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

app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});
