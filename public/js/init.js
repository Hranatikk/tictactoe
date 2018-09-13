$(function () {
    let socket = io.connect();


    // Set game state to user
    socket.on('connect', function(){
    	initGameState(socket.io.engine.id);
    });

    function initGameState(id){
    	socket.emit('get state', id);
    }

    socket.on('set game state', function(state){
    	for(let i = 0; i  < state.length; i++){
    		$('.game-point').eq(i).text(state[i]);
    	}
    });
    //



    $('.game-point').on('click', function(){
    	if( $(this).text() != '') {
    		return false;
    	}
    	let index = $(this).index();

    	$(this).text('O');
    	socket.emit('set state', 'O', index);
    	// checkWin('O');
    });


    function checkWin(text) {
    	console.log('check here');
    }

  });