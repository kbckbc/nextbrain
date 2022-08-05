let _debug = false;

let _divCanvas;

let qCurr; //current question position
let qMax; // max question position
let qHistory = [];
let digitRange = [[1,9], [10,99], [100,999]];
let qTimes;

let _w = 700;
let _h = 300;

let _introSound, _walkSound, _bumpSound, _jumpSound;

function preload() { 
  _introSound = loadSound('./res/intro.mp3'); 
  _walkSound = loadSound('./res/walk.mp3');
  _bumpSound = loadSound('./res/bump.mp3');
  _jumpSound = loadSound('./res/jump.mp3');
}

function setup() {
  _divCanvas = createCanvas(_w, _h);

  initEvent();
}

function draw() {
  if( _mode == 'practice') {
    _divCanvas.hide();
  }
  else if( _mode == 'game') {
    background(0,0,0);

    _judge.draw();    


    for(let enemy of _enemy) {
      enemy.update();
      enemy.draw();
    }      

    for(let jar of _jar) {
      jar.update();
      jar.draw();
    }

    for(let spike of _spike) {
      spike.update();
      spike.draw();
    }
    
    _gate.update();
    _gate.draw();

    _nuguri.update();
    _nuguri.checkCollisions(_jar);
    _nuguri.checkCollisions(_spike);
    _nuguri.checkCollisions(_enemy);
    _nuguri.checkCollision(_gate);
    _nuguri.keyDragging(keyIsDown(LEFT_ARROW), keyIsDown(RIGHT_ARROW));
    _nuguri.draw();
    
    
    _board.draw();    
  }
}


function keyPressed() {
  if( _mode == 'practice') {
    // enter
    if( keyCode == 13 && qCurr != -1 && select('#inputAnswer').value() != '') { 
      // check the whole question has ended!
      if( checkGameEnd() ) {
        goNextStep();
      }
      // disable Remain on division
      // else if( getOp() == '/' && inputRemain.value() == '') {
      //   document.getElementById("inputRemain").focus();
      // }
      // else if(getOp() == '/' && inputRemain.value() != '') {
      //   submitAnswer();
      // }
      else {
        submitAnswer();  
      }
    }
  }
  else if( _mode == 'game') {
    _judge.keyPressed(keyCode);
    _nuguri.keyPressed(keyCode);
  }
}
