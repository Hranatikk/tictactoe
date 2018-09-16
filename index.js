const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);


let gameState = ['', '', '', '', '', '', '', '', ''];
let gameUsers = [
  firstUser = {
    id: null,
    symboll: null,
    turn: false,
  },
  secondUser = {
    id: null,
    symboll: null,
    turn: false,
  }
];


//Show game page
app.use(express.static(__dirname + '/public' ));
app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});
//


//randomizer for set user symbol
function randomizer() {
    let rand = Math.random() * (2),
        symbol = '';
    symbol =  Math.floor(rand) == 0 ? 'X' : 'O';
    return symbol;
}
//


// check which user is connected
function setNewUser(id){
  if(firstUser['id'] != null && secondUser['id'] != null) {
    io.to(`${id}`).emit('game going');
    return false;
  }

  if(firstUser['id'] == null){
    firstUser['id'] = id;
    firstUser['symbol'] = secondUser['symbol'] == null ? randomizer() 
                        : secondUser['symbol'] == 'O' ? 'X' : 'O';

    firstUser['turn'] = secondUser['turn'] ? false : true;
  } else { 
    secondUser['id'] = id;
    secondUser['symbol'] = firstUser['symbol'] == null ? randomizer() 
                         : firstUser['symbol'] == 'O' ? 'X' : 'O';

    secondUser['turn'] = firstUser['turn'] ? false : true;
  }
  firstUser['id'] == id ? io.to(`${firstUser['id']}`).emit('init player', firstUser['id'], firstUser['symbol'], firstUser['turn']) : io.to(`${secondUser['id']}`).emit('init player', secondUser['id'], secondUser['symbol'], secondUser['turn']);
}
//


io.on('connection', function(socket){

  console.log('user connected');

  setNewUser(socket.id); // check access to game

  // Get game state and show user
  socket.on('get state', function(id){
  	io.to(`${id}`).emit('set game state', gameState);
  });
  //


  // Set current game state to user
  socket.on('set state', function(letter, index){
  	gameState[index] = letter;
    io.emit('set game state', gameState);
  });
  //

  //user win
  socket.on('user win', function(userId){
  	io.to(`${userId}`).emit('you win');
  	gameUsers[0]['id'] == userId ? io.to(`${gameUsers[1]['id']}`).emit('you lose') : io.to(`${gameUsers[0]['id']}`).emit('you lose');

  	gameState = ['', '', '', '', '', '', '', '', ''];
    io.emit('set game state', gameState);
  });
  //


  //draw
   socket.on('draw', function(){
   	io.emit('draw');
   	gameState = ['', '', '', '', '', '', '', '', ''];
    io.emit('set game state', gameState);
   });
  //


  //change turn
  socket.on('change turn', function(id){
    gameUsers[0]['id'] == id ? io.to(`${gameUsers[1]['id']}`).emit('change turn') : io.to(`${gameUsers[0]['id']}`).emit('change turn');
    gameUsers[0]['id'] == id ? gameUsers[0]['turn'] = false : gameUsers[1]['turn'] = false; 
  });
  //


  //disconnecting and remove user form current players
  socket.on('disconnect', function(){
    if(socket.id == gameUsers[0]['id'] || socket.id == gameUsers[1]['id']){

      if(socket.id == gameUsers[0]['id']){
        gameUsers[0]['symbol'] = null;
        gameUsers[0]['turn'] = null;
        gameUsers[0]['id'] = null;
        gameUsers[1]['turn'] = true;
      } else {
        gameUsers[1]['symbol'] = null;
        gameUsers[1]['turn'] = null;
        gameUsers[1]['id'] = null;
        gameUsers[0]['turn'] = true;
      }
      gameState = ['', '', '', '', '', '', '', '', ''];
      io.emit('set game state', gameState);
      io.emit('game over');

      gameUsers[0]['id'] == socket.id ? io.to(`${gameUsers[1]['id']}`).emit('change turn') :  io.to(`${gameUsers[0]['id']}`).emit('change turn');
    }
  });
  //

});


http.listen(3000, function(){
  console.log('listening on *:3000');
});