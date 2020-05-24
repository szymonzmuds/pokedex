const express = require('express');
var socket = require('socket.io');
var https = require('https');

var app = express();
var server = app.listen(3456, function () {
    console.log("listen to port 3456");
});

app.use(express.static('public'));

//setup socket
var io = socket(server);

io.on('connection', function (socket) {
    console.log(`${socket.id} is connect to the server`);
    socket.on('get_poke', function (data) {
        url = data.url;
        https.get(url, (resp)=>{
            var datas = '';
            resp.on('data', (chunk)=>{
                    datas+=chunk;
            });
            resp.on('end', ()=>{
               var pokemon = JSON.parse(datas);
               poke = pokemon['results'];
               pokemon["type"]=data.type;
               pokemon["idd"]=data.url;
               
               console.log(pokemon);
               io.sockets.emit(data.type, pokemon);
               console.log(`otrzymano takiego requesta: ${data.type}`);

            });
        });
    });
});