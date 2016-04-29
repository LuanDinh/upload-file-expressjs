var express = require("express");
var multer = require('multer');
var app = express();

var storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './uploads');
    },
    filename: function(req, file, callback) {
        callback(null, Date.now() + '-' + file.originalname);
    }
});

var limits = {
    fieldNameSize: 100,
    files: 2,
    fields: 5
}
var upload = multer({
    storage: storage
}, {
    limits: limits
}).single('userPhoto');

app.get('/', function(req, res) {
    console.log("Access home page");
    res.sendFile(__dirname + "/index.html");
});

app.post('/api/photo', function(req, res) {
    upload(req, res, function(err) {
        if (err) {
            console.log("Error uploading file: ", err);
            return res.end("Error uploading file: ");
        }
        res.redirect('/');
        console.log("uploaded file: ", req.file);
        res.end("File is uploaded");
    });
});


var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/animals', function(err, db) {
    if (err) {
        throw err;
    }
    db.collection('mamals').find().toArray(function(err, result) {
        if (err) {
            throw err;
        }
        console.log('Test querying from mongodb:', result);
    });
});

app.listen(3000, function() {
    console.log("Working on port 3000");
});