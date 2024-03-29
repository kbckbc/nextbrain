let _divCanvas;

let qCurr; //current question position
let qMax; // max question position
let qHistory = [];
let digitRange = [[1,9], [10,99], [100,999]];
let qTimes;

let _w = 900;
let _h = 400;

let _introSound, _walkSound, _bumpSound, _jumpSound;

const _gameSetting = [
  [['+','-'],0,2,0,0],
  [['+','-'],1,3,0,0],
  [['+','-'],1,4,1,0],
  [['*','/'],0,2,1,1],
  [['*','/'],1,2,2,1],
  [['*','/'],1,3,2,1],
  [['+','-','*','/'],0,3,2,1],
  [['+','-','*','/'],1,3,2,1],
  [['+','-','*','/'],2,3,2,2]
];
let _maxStage = _gameSetting.length;
// _maxStage = 1;
const _jarPos = [200, 300, 400, 500, 600];
const _spikePos = [150, 250, 350, 450, 550];
const _enemyPos = [300, 450, 600];

let _stage;

let _nuguri;
let _judge;
// let _board;
// let _jar = [];
// let _spike = [];
// let _enemy = [];

const _oneCoin = 2;
let _coinRemain = 0;
let _coinAvailable = {
  '+':[1,1,1],
  '-':[1,1,1],
  '*':[1,1,1],
  '**':[1,1,1,1,1,1,1,1],
  '/':[1,1,1]
}

let _score=0;


let _time;
let _timer;
let _timerPause;




function preload() { 
  _introSound = loadSound('./res/intro.mp3'); 
  _walkSound = loadSound('./res/walk.mp3');
  _bumpSound = loadSound('./res/bump.mp3');
  _jumpSound = loadSound('./res/jump.mp3');
}

function setup() {
  console.log('setup');
  _divCanvas = createCanvas(_w, _h);
  _divCanvas.style('margin','auto');

  _stage = 0;
  
  initGameMode(_stage);   
}

function draw() {
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


function keyPressed() {

  _judge.keyPressed(keyCode);
  _nuguri.keyPressed(keyCode);
}


function initTimer() {
  if( _timer != null) {
    clearInterval(_timer);
  }
  _time = 0;  
  _timerPause = true;
  _timer = setInterval(function () {if( !_timerPause) _time++;}, 1000);
}
function startTimer() {
  _timerPause = false;
}
function stopTimer() {
  _timerPause = true;
}

function initGameMode(stage=0) {
  _divCanvas.show();
  ellipseMode(CENTER);  
  
  _nuguri = new Nuguri(50,-50,false);
  _jar = [];
  _spike = [];
  _enemy = [];

  maxdigit = _gameSetting[stage][1];
  jarCnt   = _gameSetting[stage][2];
  spikeCnt = _gameSetting[stage][3];
  enemyCnt = _gameSetting[stage][4];
  
  
  qTimes = [1,2,3,4,5,6,7,8,9];
  
  // jar
  let jarPos = [..._jarPos];
  for(let i = 0;i < jarCnt; i++) {
    let q = getQuestion(0, random(_gameSetting[stage][0]), randomInt([0,maxdigit]), random(qTimes));
    let x = random(jarPos);
    jarPos.splice(jarPos.indexOf(x),1);
    let jar = new Jar(x, 0, q.question, q.answer);
    _jar.push(jar);
  }
  // spike
  let spikePos = [..._spikePos];
  for(let i = 0;i < spikeCnt; i++) {
    let x = random(spikePos);
    spikePos.splice(spikePos.indexOf(x),1);
    let spike = new Spike(x, 0);
    _spike.push(spike);
  }
  
  // enemy
  enemyPos = [..._enemyPos];
  for(let i = 0;i < enemyCnt; i++) {
    let x = random(enemyPos);
    enemyPos.splice(enemyPos.indexOf(x),1);
    let enemy = new Enemy(x, -50, false);
    _enemy.push(enemy);
  }  
    
  
  _gate = new Gate(_w - 30, 0);
  _board = new Board();
  _judge = new Judge(_w/2,_h/2);
}



function saveScore() {
  console.log('nuguri', 'saveScore', _time, _score, _stage);
  
  // don's save if score is 0
  if( _score == 0 ) {
    console.log('saveScore score 0 no save');
    return;
  }

  let data = {"score":_score, "time":_time, "stage":_stage};

  return fetch('/ranking/nuguri', {
    method:'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body:JSON.stringify(data)
  })
  .then(res => res.json())
  .catch(err => console.log('saveScore', err));
}




function getQuestion(num, op, lv, times) {
  let question = '';
  
  if( op == '**') {
    digit = 0; // for one digit.
  }
  else {
    digit = lv;

  }
  // originally, 3terms was available, but it's too hard. so remove it.
  term = 2; 

  // console.log('getQuestion', num, op, digit, term, times);
  
  let x,y,z;
  let answer = 0;
  let remain = 0;
  

  // Get random x,y,z
  for(let i=0; i<term; i++) {
    // first term
    if( i== 0 ) {
      x = randomInt(digitRange[digit]);
      answer = x;
    }
    // second term
    else if( i == 1) {
      if( op == '*' || op == '/') {
        // second random value is one digit otherwise too difficult.
        y = randomInt(digitRange[0]);  
      }
      else {
        // to make it easy
        if( digit == 2) {
          digit = 1;
        }        
        y = randomInt(digitRange[digit]);
        if( x < y) {
          y = randomInt([1, x]);
        }
      }
    }
    // third term
    else if( i == 2) {
      z = randomInt(digitRange[digit]);
    }
  }
  
  // when division, make there's no remain
  if( op == '/') {
    let re = x % y;
    x -= re;
    if( x == 0) {
      x = y;
    }
  }
  
  // But in ttimes tables, diff logic
  if( op == '+' ){
    answer = x + y;
    answer += (term == 3) ? z : 0; 
  }
  else if( op == '-') {
    answer = x - y;
    answer -= (term == 3) ? z : 0;
  }
  else if( op == '*') {
    answer = x * y;
    answer *= (term == 3) ? z : 1;
  }
  else if( op == '**') {
    x = times;
    y = random(qTimes);
    let pos = qTimes.indexOf(y);
    qTimes.splice(pos, 1);
    answer = x * y;
  }
  else if( op == '/') {
    answer = floor(x / y);
    remain = x % y;
  }
  
  question += String(x);
  question += (op == '**') ? '*' : op;
  question += String(y);
  if(term == 3) {
    question += operation;
    question += String(z);
  }
  
  // console.log('#',num,'x,y,z,question, answer, remain', x,y,z,question, answer, remain);

  return {num, op, question, answer, remain};
}

function resetGame() {
  window.location.replace("/");
}
