// op, maxdigit(0:1digit, 1:2digit, 2:3digit), jar, spike, enemy
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
const _jarPos = [200, 300, 400, 500, 600];
const _spikePos = [150, 250, 350, 450, 550];
const _enemyPos = [300, 450, 600];

let _mode; // 'practice', 'game'
let _stage;

let _nuguri;
let _judge;
// let _board;
// let _jar = [];
// let _spike = [];
// let _enemy = [];

const _oneCoin = 1;
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

function initTimer() {
  _time = 0;  
  _timerPause = true;
  _timer = setInterval(function () {if( !_timerPause) _time++;}, 1000);
}
function startTimer() {
  _timerPause = false;
}
function stopTimer(i) {
  _timerPause = true;
}
function resetTimer() {
  _time = 0;
  clearInterval(_timer);
  
  // _score= 0; // :)  
}

function addCoin() {
  _coinRemain++;
  document.getElementById("btnCoin").innerText = 'Coin :' + _coinRemain;
}

function useCoin() {
  if( _debug ) {
    return true;
  } 
  
  if( _coinRemain >= _oneCoin) {
    _coinRemain -= _oneCoin;  
    document.getElementById("btnCoin").innerText = 'Coin :' + _coinRemain;
    return true;
  }
  return false;
}
function getCoin() {
  return _coinRemain;
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
  
  _introSound.play();
}
