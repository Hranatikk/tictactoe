$(function () {
    let socket = io.connect(),
        canPlay = true,
        userId,
        userSymbol = '',
        userTurn = false;


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


    // Deny user to play this round
    socket.on('game going', function(){
        alert('game is going already');
        canPlay = false;
    });
    //



    //Init player
    socket.on('init player', function(id, symbol, turn){
        userSymbol = symbol;
        userId = id;
        userTurn = turn;
    })
    //



    //end the game when one of the players is disconnected
    socket.on('game over', function(){
        alert('game over cause one of the players if disconnected. Waiting for another user');
    });
    //


    //change turn
    socket.on('change turn', function(){
        userTurn = true;
    });
    //


    // click trigger
    $('.game-point').on('click', function(){
    	if( $(this).text() != '' || !canPlay || !userTurn) {
    		return false;
    	}
    	let index = $(this).index();

    	$(this).text(userSymbol);
    	socket.emit('set state', userSymbol, index);

        socket.emit('change turn', userId);
        userTurn = false;
    	checkWin(userSymbol);
    });
    //


    //win-lose message
    socket.on('you lose', function(){
        alert('you lose');
    });
    socket.on('you win', function(){
        alert('you win');
    });
    //


    //draw
    socket.on('draw', function(){
        alert('draw');
    });
    //



    // check win
    function checkWin(symbol) {
        let point = $('.game-point'),
            gameEnd = false,
            isWin = false;
        
        if( point.eq(0).text() == symbol && point.eq(1).text() == symbol && point.eq(2).text() == symbol ||
            point.eq(3).text() == symbol && point.eq(4).text() == symbol && point.eq(5).text() == symbol ||
            point.eq(6).text() == symbol && point.eq(7).text() == symbol && point.eq(8).text() == symbol ||
            point.eq(0).text() == symbol && point.eq(3).text() == symbol && point.eq(6).text() == symbol ||
            point.eq(1).text() == symbol && point.eq(4).text() == symbol && point.eq(7).text() == symbol ||
            point.eq(2).text() == symbol && point.eq(5).text() == symbol && point.eq(8).text() == symbol ||
            point.eq(0).text() == symbol && point.eq(4).text() == symbol && point.eq(8).text() == symbol ||
            point.eq(2).text() == symbol && point.eq(4).text() == symbol && point.eq(6).text() == symbol
         ) {
            gameEnd = true;
            isWin = true;
            socket.emit('user win', userId);
        }
        if(!gameEnd) {
            let count = 0;
            point.each(function(){
                $(this).text() != '' ? count++ : count = count;
            });
            if(count == 9) {
                gameEnd = true;
                socket.emit('draw');
            }
        }
    }
    //

  });