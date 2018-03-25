// var app = require('express')();
// var http = require('http').Server(app);
// var io = require('socket.io')(http);
var socket = io();
//const io = require('socket.io-client');

var tl = document.querySelector('#top-left');
var tc = document.querySelector('#top-centre');
var tr = document.querySelector('#top-right');
var cl = document.querySelector('#centre-left');
var cc = document.querySelector('#centre');
var cr = document.querySelector('#centre-right');
var bl = document.querySelector('#bottom-left');
var bc = document.querySelector('#bottom-centre');
var br = document.querySelector('#bottom-right');
var winnerHeader = document.querySelector('.winner-header');
var playerHeader = document.querySelector('.player-name');
var btnReset = document.querySelector('.btn-reset');
var player = '';// = true; //false = player2
var p1Cells = new Array();
var p2Cells = new Array();
var gameOver = true;
var draw = false;
var current = false;

winnerHeader.style.display = 'none';
btnReset.style.display = 'none';

tl.addEventListener('click', function(){Clicked(tl, '1')});
tc.addEventListener('click', function(){Clicked(tc, '2')});
tr.addEventListener('click', function(){Clicked(tr, '3')});
cl.addEventListener('click', function(){Clicked(cl, '4')});
cc.addEventListener('click', function(){Clicked(cc, '5')});
cr.addEventListener('click', function(){Clicked(cr, '6')});
bl.addEventListener('click', function(){Clicked(bl, '7')});
bc.addEventListener('click', function(){Clicked(bc, '8')});
br.addEventListener('click', function(){Clicked(br, '9')});

btnReset.addEventListener('click', function(){
    //player1 = true;
    p1Cells = new Array();
    p2Cells = new Array();
    gameOver = false;
    draw = false;
    winnerHeader.style.display = 'none';
    btnReset.style.display = 'none';
    playerHeader.style.display = 'block';
    playerHeader.textContent = 'Player One\'s turn...';

    var cells = document.querySelector('.game-board').getElementsByTagName('div');
    for (var cell of cells) cell.textContent = '';
});

function Clicked(cell, cellNum) {
    alert(current);
    if(!current) {
        return;
    }
    if(cell.textContent !== '' || gameOver)
        return;

    socket.emit('selectbox', cell.id);

    // if(player1) {
    //     cell.textContent = 'X';
    //     p1Cells.push(cellNum);
    // } else {
    //     cell.textContent = 'O';
    //     p2Cells.push(cellNum);
    // }

    // if(CheckWinner()) {
    //     ShowWinner();
    // } else {
    //     if(player1)
    //         playerHeader.textContent = 'Player Two\'s turn...';
    //     else
    //         playerHeader.textContent = 'Player One\'s turn...';

    //     player1 = !player1;
    // }   
}

socket.on('boxselected', (xo, cellID) => {
    console.log('boxselected entered, xo=' + xo);
    alert(xo + " = " + player);

    current = xo !== player;
    
    alert(xo);

    let cell = document.querySelector('#' + cellID).textContent = xo;
    console.log('cell is ' + cellID);

    //player1 = xo === 'X';
    // if(player !== xo) {
    //     return;
    // }

    if(xo === 'X') {
        p1Cells.push(cellNum);
    } else {
        p2Cells.push(cellNum);
    }
    //cell.textContent = xo;

    if(CheckWinner()) {
        ShowWinner();
    } else {
        if(player === 'X')
            playerHeader.textContent = 'Player Two\'s turn...';
        else
            playerHeader.textContent = 'Player One\'s turn...';

        //player1 = !player1;
    }   

});

socket.on('newconnection', msg => {
    console.log('new connection, msg is ' + msg);
    //Basic version 1, see note below in 'disconnected'

    if(player === '') 
        player = msg;

    switch(msg) {
        case 'X':
            //player 1 joined
            playerHeader.textContent = 'Waiting for Player Two...';
            console.log('player 1 joined');
            break;
        case 'O':
            //player 2 joined
            //Now the game can start
            //current = true;
            current = player === 'X';
            gameOver = false;
            playerHeader.textContent = 'Player One\'s turn...';
            console.log('player 2 joined');
            break;
            case 'Full':
            //Full
            window.location = 'fullup.html';
    }
});

socket.on('disconnected', msg => {
    //Someone left
    //Need to disable input and probably reset the board, wait for new player or something
    //If X left, new connection will be X, or something? need to handle all possibilities in 'newconnection'

});

function CheckWinner() {
    //Check for winner and display
    var pCells = player === 'X' ? p1Cells : p2Cells;

    if(pCells.length < 3)
        return false;

    //Check if player's cells include all of any winning combination;
    var winningCells = new Array('123','456', '789', '147', '258', '369', '159', '357');

    for (var combo of winningCells) {
        //Loop for each win combination

        var comboMatched = false;

        for(var comboNum of combo) {
            //Loop for each single number within win combination

            var cnFound = false;

            for(var cellNum of pCells) {
                //Loop for each player cell

                    if(cellNum === comboNum) {
    
                    cnFound = true;
                    break;
                }
            }

            if(cnFound) {
                comboMatched = true;
            } else {
                comboMatched = false;
                break;
            }
        }

        if(comboMatched) break;
    }

    draw = (p1Cells.length + p2Cells.length === 9) && !comboMatched;
    gameOver = (comboMatched || draw);
    return gameOver;
}

function ShowWinner() {
    var s = '';
    if(draw) {
        s = 'It\'s a Draw!';
    } else if(player === 'X') {    
        s = 'Player One Wins!';
    } else {
        s = 'Player Two Wins!';
    }  
    
    winnerHeader.textContent = s;
    winnerHeader.style.display = 'block';
    playerHeader.style.display = 'none';
    btnReset.style.display = 'block';
}

