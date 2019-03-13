const express = require('express');
const logger = require('morgan');
const path = require('path');
const http = require('http');
const port = process.env.PORT || 3030;
const Datastore = require('nedb');
const pathToData = path.resolve(__dirname, "db/db")
const db = new Datastore({ filename: pathToData});
db.loadDatabase();

const app = express();

const fs = require('fs');
const dataOrigin = "db/db-backup.json";
const dataDest = "/renders/";
let dataIndex = 0;
let imgData = [];

let searchFor = "data:image/jpeg;base64,";

function renderImages(){
    fs.readFile(dataOrigin, 'utf8', function(err, data){
        console.log('start parsing');
        imgData = JSON.parse(data);
        console.log("total num of images: " + imgData.length);

        for(let i = 0; i < imgData.length; i++){
            let dat = imgData[i].image;
            let strippedImage = dat.slice(dat.indexOf(searchFor) + searchFor.length);
            console.log(strippedImage);
            let binaryImage = new Buffer(strippedImage, 'base64');
            fs.writeFile(__dirname + dataDest + i + ".png", binaryImage, function(err) {
                if(err){
                    return console.log(err);
                }
            });
        }
    })


}

//renderImages();
//
// var strippedImage = data.slice(data.indexOf(searchFor) + searchFor.length);
// var binaryImage = new Buffer(strippedImage, 'base64');
// fs.writeFileSync(__dirname + '/renders/theimage.jpg', binaryImage);

let streamObject = null;

app.use(logger("dev"));

app.use(express.json({limit: '5mb'}));
app.use(express.urlencoded({limit: '5mb'}));

const publicPath = path.resolve(__dirname, 'public');
app.use( express.static(publicPath));

app.get("/", (req, res) => {
    res.sendFile('index.html')
});

app.get("/logs", (req, res) => {
    res.sendFile('/logs/logs.html');
});

app.get("/api", (req, res) => {    
    db.find({}).sort({created: -1}).exec(function (err, docs) {
        if(err){
            return err;
        } 
        res.json(docs);
    });
});

app.post("/api", (req, res) => {
    // our unix timestamp
    const unixTimeCreated = new Date().getTime();
    // add our unix time as a "created" property and add it to our request.body
    const newData = Object.assign({"created": unixTimeCreated}, req.body)

    // add in our data object to our database using .insert()
    db.insert(newData, (err, docs) =>{
        if(err){
            return err;
        }
        res.json(docs);
    });
});

app.get("/stream", (req, res) =>{
    console.log('send stream object');
    res.json(streamObject);
});

app.post("/stream", (req, res) => {
    console.log("received stream object");
    streamObject = res;
});

http.createServer(app).listen(port, () =>{
    console.log(`see the magic at: http://localhost:${port}`)
});

