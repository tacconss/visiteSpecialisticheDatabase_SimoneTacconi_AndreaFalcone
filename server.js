//Imports
const  generateDatabase = require("./database.js");

//Libraries
const express = require("express");
const http = require('http');
const path = require('path');
const fs = require('fs');
const app = express();
const multer = require('multer');
const mysql = require('mysql2');


//Vars
const conf = JSON.parse(fs.readFileSync('conf.json'));
    conf.ssl.ca =  fs.readFileSync(__dirname + '/ca.pem')

const database = generateDatabase(conf, mysql);

app.set({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
});

app.use("/", express.static(path.join(__dirname, "public")));
app.use("/node_modules", express.static(path.join(__dirname, "node_modules")));
app.use(express.json());

//Aggiunta Immagini
app.post('/add', (req, res) => {
    console.log("--------------");
    const dict = req.body;
    console.log(dict);
    console.log("--------------");
    res.json(dict);
    database.insert(dict);
});

//Ottenere lista URLs Immagini
app.get('/get', async (req, res) => {
    let hold = await database.select();
    res.json(hold)
});

const server = http.createServer(app);
server.listen(5700, () => {
  console.log("5700- server running");
});
