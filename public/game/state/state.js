let cnv;
let cw, ch;

const _oneCoin = 1;

// resources
let sutdyImg;
let questionImg;
let correctSound;
let wrongSound;
let perfectSound;
let applauseSound;

const qQuestions = Object.keys(USA_STATE);
let qLengthOfQuestion = qQuestions.length;
// qLengthOfQuestion = 5; // for debugging
let qLeftQuestion;


// question control
const numOfAddSelection = 4;
let qStarted;
// qStep controls question steps.
let qStep; 

let qCurrNum;
let qPrevNum;
let qCurrAnswer;
let qYourAnswer = [];
let prevAnswers = [];
let playerAnswer;
let dotAnimation = 0;



const currPath = '/game/state';
const gameStep = Object.freeze({
  "GIVE_QUESTION":1, 
  "CHECK_ANSWER":2, 
  "GOTO_PREV":3,
  "GOTO_NEXT":4,
  "GAME_END":5
});



function preload() {
  // canvas setting
  // cw = windowWidth;
  // ch = windowHeight-200;
  cw = 1400;
  ch = 600;

  setButtonEvent();
  
  // resource loading
  questionImg = loadImage(currPath + '/res/usa_0.png');
  studyImg = loadImage(currPath + '/res/usa_1.png');
  correctSound = loadSound(currPath + '/res/correct.mp3');
  wrongSound = loadSound(currPath + '/res/wrong.mp3');
  perfectSound = loadSound(currPath + '/res/perfect.mp3');
  applauseSound = loadSound(currPath + '/res/applause.mp3');
  
  console.log('preload complete');
}


function setup() {
  console.log('windowWidth', windowWidth);
  console.log('windowHeight', windowHeight);
  cnv = createCanvas(cw, ch);
  questionImg.resize(0,ch);
  studyImg.resize(0,ch);
  
  // after image resize, 
  // adjust canvas size
  cw = questionImg.width;
  ch = questionImg.height;
  resizeCanvas(cw,ch);
  
  console.log('setup complete');

  showStudy();
}

function draw() {
  gameLoop();  
}

// called inside of the draw function.
// called every draw frame.
function gameLoop() {
  // console.log('gameLoop:', 'qStep:' + qStep + ', qCurrNum:' + qCurrNum + ', qPrevNum:' + qPrevNum);
  
  if( qStarted == false ) {
    image(studyImg,0,0);
    return;
  }
  else {
    image(questionImg,0,0);
  }

  
  // questioning state
  if( qStep == gameStep.GIVE_QUESTION ) {
    // console.log('before', qLeftQuestion.length);
    let result = getQuestion(qLeftQuestion);
    let key = result.key;
    qLeftQuestion = result.questionArr;
    // console.log('gameLoop', 'result', result);
    // console.log('gameLoop', 'key', key);
    // console.log('after', qLeftQuestion.length);

    // drawPastDot();
    writeStatus();
    writeQuestion(key);
    qCurrAnswer = key;
    
    qStep = gameStep.CHECK_ANSWER;
  }
  // answer checking state
  else if( qStep == gameStep.CHECK_ANSWER) {
    drawPastDot();

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
    drawLine(qCurrAnswer);
    drawCurrDot(qCurrAnswer, c);


    // if answer has been placed, goto next step
    if(checkAnswer()) {
      prevAnswers = [];
      qStep = gameStep.GOTO_NEXT;
    }
  }
  // goto next question state
  else if( qStep == gameStep.GOTO_NEXT) {
    qCurrNum++;
    qPrevNum = qCurrNum;
    qCurrAnswer = '';
    
    // if reached at the end
    if( qCurrNum == qLengthOfQuestion ) {
      drawPastDot();
      writeStatus();
      writeGameEnd();


      select('#cardSectionNext').hide();
      select('#cardSectionPrev').hide();
      select('#cardSectionEnd').show();
        
      qStep = gameStep.GAME_END;
    }
    else {
      qStep = gameStep.GIVE_QUESTION;  
    }
  }
  // show prev result state
  else if( qStep == gameStep.GOTO_PREV) {

    drawLine(qYourAnswer[qPrevNum][2]);
    drawPastDot();
    writeStatus();
    writePrevAnswer();
    // qStep = 
  }
  // end state
  else if( qStep == gameStep.GAME_END) {
    drawPastDot();
    writeStatus();
    writeGameEnd();
  }
}

function initGame(which) {
  qStarted = false;
  qSaved = false; // save score on the ranking
  qStep = gameStep.GIVE_QUESTION;
  playerAnswer = '';
  qCurrNum = 0;
  qPrevNum = 0;
  qCurrAnswer = '';  
  qYourAnswer = [];
  prevAnswers = [];
  qLeftQuestion = Object.keys(USA_STATE);
  cnv.clear();
}

function getQuestion(questionArr) {
  let i = floor(random((questionArr.length-1)));
  let key = questionArr[i];
  questionArr.splice(i,1);
  
  return {key, questionArr};
}

function checkAnswer() {
  if( playerAnswer == '' ) return false;
  
  let correct = (qCurrAnswer == playerAnswer) ? 1 : 0;
  if( correct == 0 ) {
    wrongSound.play();
  }
  else {
    correctSound.play();
  }
  qYourAnswer.push([playerAnswer, correct, qCurrAnswer]);
  
  playerAnswer = '';
  return true;
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
    // divResult = createDiv();
    // divResult.parent(divBody);
    // divResult.html(res.msg);

    globalToast('Your Score has been recorded!');

  })
  .catch(err => console.log('saveScore', err));
      
}