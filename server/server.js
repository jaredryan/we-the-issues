const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const port = process.env.PORT || 7000;

const app = express();

app.use(bodyParser.json());
app.use(morgan("dev"));
app.use("/issues", require('./routes/issues'));

mongoose.connect('mongodb://localhost/issues', err => {
    if (err) throw err;
    console.log("Connected to the database.");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});
