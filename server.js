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

app.use("/", express.static(path.join(__dirname, "public")));
app.use("/node_modules", express.static(path.join(__dirname, "node_modules")));

//Aggiunta Immagini
app.post('/upload', (req, res) => {

   // let dict = {}

    //dict[req.body.] = req.body.
        const dict = req.body;
        res.json(dict);
        database.insert(dict);
});

//Cancellare Immagini
app.post('/delete/:id', async (req, res) => {
    let hold = await database.select();
    let id = Number(req.params.id);

    hold.forEach(async (element) => {
        if (element.id == id) {
            await database.delete(element.id);
            res.json({status : "OK"});
        }
    });
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
