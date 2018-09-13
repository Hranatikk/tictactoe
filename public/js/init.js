$(function () {
    var socket = io.connect();

    socket.on('connect', function(){
    	initMessageHistory(socket.io.engine.id);
    });

    function initMessageHistory(id){
    	socket.emit('get history', id);
    }

    $('form').submit(function(){
      socket.emit('chat message', $('#input').val());
      $('#input').val('');
      return false;
    });

    socket.on('chat message', function(msg){
      $('#messages').append($('<li>').text(msg));
    });

    socket.on('init history', function(history){
      history.map(function(message){
      	$('#messages').append($('<li>').text(message));
      });
    });

  });