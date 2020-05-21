// Setup empty JS object to act as endpoint for all routes
const trips = [];

// Require Express to run server and routes
const express = require("express");

// Start up an instance of app
const app = express();

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

// Initialize the main project folder
app.use(express.static('dist'))

// Setup Server
const port = 8000;
const server = app.listen(port, () => {
    console.log(`running on localhost: ${port}`)
})

app.post('/trips', function(req, res) {
    trips.push(req.body);
    console.log("Got POST request: " + JSON.stringify(req.body));
    res.status(201).send();
});

app.get('/trips', function(req, res) {
    console.log("Got GET request, returning " + JSON.stringify(trips));
    res.status(200).json(trips);
});

function dummyTest(){
    return "Abc";
}

module.exports = { dummyTest }