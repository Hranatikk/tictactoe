const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);


let gameState = ['', '', '', '', '', '', '', '', ''];

app.use(express.static(__dirname + '/public' ));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(socket){

  console.log('user connected');


  // Get game state and show user
  socket.on('get state', function(id){
  	io.to(`${id}`).emit('set game state', gameState);
  });
  //


  // Set new symbol to game pad
  socket.on('set state', function(letter, index){
  	gameState[index] = letter;
  	console.log(gameState);
  });
  //


  socket.on('chat message', function(msg){
  	chatHistory.push(msg);
    io.emit('chat message', msg);
  });


  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});