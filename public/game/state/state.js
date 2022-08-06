let cnv;
let overlay; // for question animation
let cw, ch;


// resources
let sutdyImg;
let questionImg;
let correctSound;
let wrongSound;
let perfectSound;
let applauseSound;

// html 
let divCountry;
let btnUsa;

let divNavi;
let btnScore;
let btnStart;
let btnPrev;
let btnNext;

let divBody;
let divScore;
let divStatus;
let divQuestion;
let divAnswer;
let divYourAnswer;
let radioAnswer;


const qQuestions = Object.keys(USA_STATE);
let qLeftQuestion;


// question control
const numOfAddSelection = 4;
let qStarted = false;
// qStep controls question steps.
let qStep; 

let qCurrNum;
let qPrevNum;
let qCurrAnswer;
let qYourAnswer = [];

let dotAnimation = 0;


const gameStep = Object.freeze({
  "GIVE_QUESTION":1, 
  "CHECK_ANSWER":2, 
  "GOTO_PREV":3,
  "GOTO_NEXT":4,
  "GAME_END":5
});


let prevAnswers = [];


let currPath = '/game/state';


function preload() {
  // html setting
  divNavi = select('#divNavi');
  divBody = select('#divBody');

  btnUsa = select('#btnUsa');
  btnScore = select('#btnScore');
  btnStudy = select('#btnStudy');
  btnStart = select('#btnStart');
  btnPrev = select('#btnPrev');
  btnNext = select('#btnNext');
  
  setButtonEvent();
  
    
  // canvas setting
  cw = windowWidth;
  ch = windowHeight-200;
  
  // resource loading
  let currPath = '/game/state';
  questionImg = loadImage(currPath + '/res/usa_0.png');
  studyImg = loadImage(currPath + '/res/usa_1.png');
  correctSound = loadSound(currPath + '/res/correct.mp3');
  wrongSound = loadSound(currPath + '/res/wrong.mp3');
  perfectSound = loadSound(currPath + '/res/perfect.mp3');
  applauseSound = loadSound(currPath + '/res/applause.mp3');
  
  console.log('preload complete');
}


function setup() {
  cnv = createCanvas(cw, ch);
  questionImg.resize(0,ch);
  studyImg.resize(0,ch);
  
  // after image resize, 
  // adjust canvas size
  cw = questionImg.width;
  ch = questionImg.height;
  resizeCanvas(cw,ch);
  overlay = createGraphics(cw, ch);
  
  console.log('setup complete');
}


function draw() {
  gameLoop();  
}

// called inside of the draw function.
// called every draw frame.
function gameLoop() {
  // console.log('gameLoop:', 'qStep:' + qStep + ', qCurrNum:' + qCurrNum + ', qPrevNum:' + qPrevNum);
  
  if( qStarted == false ) return;
  
  if( overlay ) {
    image(overlay,0,0);
  }
  
  // questioning state
  if( qStep == gameStep.GIVE_QUESTION ) {
    // console.log('before', qLeftQuestion.length);
    let result = getQuestion(qLeftQuestion);
    let key = result.key;
    qLeftQuestion = result.questionArr;
    // console.log('after', qLeftQuestion.length);

    drawCurrDot(key);
    drawPastDot();
    writeStatus();
    writeQuestion(key);
    qCurrAnswer = key;
    
    qStep = gameStep.CHECK_ANSWER;
  }
  // answer checking state
  else if( qStep == gameStep.CHECK_ANSWER) {
    dotAnimation++;
    let c;
    if( dotAnimation <= 50){
      c = color(255,0,0);
    }
    else if( dotAnimation <= 100) {
      c = color(0,0,255);
    }
    else {
      dotAnimation = 0;
    }
    drawCurrDot(qCurrAnswer, c);

    // if answer has been placed, goto next step
    if(checkAnswer()) {
      prevAnswers = [];
      qStep = gameStep.GOTO_NEXT;
    }
  }
  // goto next question state
  else if( qStep == gameStep.GOTO_NEXT) {
    clearText();
    
    qCurrNum++;
    qPrevNum = qCurrNum;
    qCurrAnswer = '';
    
    // if reached at the end
    if( qCurrNum == qQuestions.length ) {
    // if( qCurrNum == 2 ) {
      saveSore();
      drawPastDot();
      writeStatus();
      writeGameEnd();
      qStep = gameStep.GAME_END;
    }
    else {
      qStep = gameStep.GIVE_QUESTION;  
    }
  }
  // show prev result state
  else if( qStep == gameStep.GOTO_PREV) {
    drawPastDot();
    writeStatus();
    writeYourAnswer();
    // qStep = 
  }
  // end state
  else if( qStep == gameStep.GAME_END) {

  }
}

function initGame(which) {
  qStarted = false;
  qSaved = false; // save score on the ranking
  qStep = gameStep.GIVE_QUESTION;
  qCurrNum = 0;
  qPrevNum = 0;
  qCurrAnswer = '';  
  qYourAnswer = [];
  prevAnswers = [];
  qLeftQuestion = Object.keys(USA_STATE);
  cnv.clear();
  overlay.clear();
  clearText();
}

function getQuestion(questionArr) {
  let i = floor(random((questionArr.length-1)));
  let key = questionArr[i];
  questionArr.splice(i,1);
  
  return {key, questionArr};
}

function checkAnswer() {
  if(radioAnswer.value() == '') return false;
  
  let correct = (qCurrAnswer == radioAnswer.value()) ? 1 : 0;
  if( correct == 0 ) {
    wrongSound.play();
  }
  else {
    correctSound.play();
  }
  qYourAnswer.push([radioAnswer.value(), correct, qCurrAnswer]);
  
  return true;
}


function loadScore() {
  initGame();  

  selectFrom()
    .then(data => {
      writeScore(data);
    });
}

function insertInto(obj) {
  console.log('insert into', obj);

  return fetch('/ranking/state', {
    method:'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body:JSON.stringify(obj)
  })
    .then(res => res.json())
    // .then(window.location.assign('/'))
    .catch(err => console.log('insert2db', err));

  // Build formData object.
  // let formData = new FormData();
  // formData.append('hit', '1');
  // formData.append('wrong', '1');

  // fetch("/ranking/state",
  //     {
  //         body: formData,
  //         method: "post"
  //   });  
}

function selectFrom() {
  // load ranking from database
  return fetch(currPath + '/ranking', {
    method:'GET'
  })
    .then(res => res.json())
    .then(res => {
      console.log('mongodb : select from complete', res);
      return res;
    })
    .catch(err => console.log('selectFrom', err));
}


function saveScore() {
  console.log('saveScore');
  let hit = 0, wrong = 0;
  for(let i=0;i<qYourAnswer.length;i++) {
    let correct = qYourAnswer[i][1];
    if( correct == 1) {
      hit++;
    }
    else {
      wrong++;
    }
  }
  
  // don's save if score is 0
  if( hit == 0 ) {
    return;
  }
  let score = hit; // ranking data must have score and timestamp
  let data = {score, hit, wrong};
  // insertInto(data)
  //   .then(res => {
  //     console.log('Nedb : insert into complete', res);
  //     document.getElementById('result').value = res.aaa;
  //     if(res.aaa = 'aaa111' ) {
  //       window.location.assign('/auth/login');
  //     }
  //   })


    fetch('/ranking/state', {
      method:'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body:JSON.stringify(data)
    })
      .then(res => res.json())
      .then(res => {
        showStudy();  
        divResult = createDiv();
        divResult.parent(divBody);
        divResult.html(res.msg);
      })
      .catch(err => console.log('saveScore', err));
      
      
  console.log('saveScore complete');
}