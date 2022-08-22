function writeStatus() {
  let str;
  let total = qLengthOfQuestion;
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
  
  str = 'Total : ' + total + ', Hit : ' + hit + ', Wrong : ' + wrong;

  select('#cardStatus1').html(str);
  select('#cardStatus2').html(str);
  select('#cardStatus3').html(str);
}


function writeQuestion(key) {
  
  let str = '#' + (qCurrNum + 1) + ' : Choose the name of the circled state';

  select('#cardQuestion').html(str);
  
  // In case of next button after returning back from previous question,
  // Do not generate candidate answers again.
  if( prevAnswers.length == 0 ) {
    
    let answerSelection = [];

    // copy the whole question into new array except the question state.
    let cloneKeys = qQuestions.slice();
    for(let i=0;i<cloneKeys.length;i++) {
      if( key == cloneKeys[i] ) {
        cloneKeys.splice(i,1);
        break;
      }
    }

    // pick randomly wrong answers
    answerSelection.push(key);
    for(let i=0;i<numOfAddSelection;i++) {
      let x = floor(random((cloneKeys.length-1)));
      answerSelection.push(cloneKeys[x]);
      cloneKeys.splice(x,1);  
    }

    let targetId;
    // shuffle the answers and add to the radio button
    shuffleArray(answerSelection);  
    for(let i=0;i<answerSelection.length;i++) {
      targetId = '#btnA' + (i + 1);
      select(targetId).html(answerSelection[i]);
    }

    prevAnswers = answerSelection.slice();
  }  
  else {
    let targetId;

    for(let i=0;i<prevAnswers.length;i++) {
      targetId = '#btnA' + (i + 1);
      select(targetId).html(prevAnswers[i]);
    }    
  }
}

function writePrevAnswer() {
  let str, yourAnswer, correct, correctAnswer;
  if(qYourAnswer.length != 0) {
    yourAnswer = qYourAnswer[qPrevNum][0];
    if( qYourAnswer[qPrevNum][1] == 0 ) {
      correct = 'wrong';
    }
    else {
      correct = 'correct';
    }
      
    correctAnswer = qYourAnswer[qPrevNum][2];
  }
  str = 'Your answer of #'+ (qPrevNum + 1) + ' was ' + yourAnswer;
  str += ' which was ' + correct;
  str += '. The answer was ' + correctAnswer + '.';

  select('#cardPrevQuestion').html(str);
}


function writeGameEnd(){
  let str;
  let wrong= 0;
  for(let i=0;i<qYourAnswer.length;i++) {
    if(qYourAnswer[i][1] == 0 ) {
      wrong++;
    }
  }
  if(wrong == 0) {
    str = 'What! No way! You got a perfect score. I am impressed';
    perfectSound.play();
  }
  else {
    str = 'Good job! Review the wrong questions and try again.';  
    applauseSound.play();
  }

  select('#cardEndGame').html(str);
}


function drawCurrDot(state = '', c = color(0,0,255), size = 10 ) {
  let answer, x, y;
  let pos = [];
  
  // draw current dot
  if(state != '') {
    pos = USA_STATE[state];
    x = map(pos[0],0,1400,0,cw);
    y = map(pos[1],0,860,0, ch);

    drawO(x,y,c, size);
    // drawNum(qCurrNum+1, x,y);
  }
}

function drawLine(state, c = color(255,0,0)) {
  let x, y;
  let pos = [];
  
  // draw current dot
  if(state != '') {
    pos = USA_STATE[state];
    x = map(pos[0],0,1400,0,cw);
    y = map(pos[1],0,860,0, ch);

    stroke(c);
    strokeWeight(1);
    line(680,60,x,y);
    line(680,60,710,60);

    textSize(30);
    fill(c);
    text('?',720,70);
  }
}

function drawPastDot() {
  for(let i=0;i<qYourAnswer.length;i++) {
    let yourAnswer = qYourAnswer[i][0];
    let correct= qYourAnswer[i][1];
    let answer = qYourAnswer[i][2];
    let pos = USA_STATE[answer];
    
    let x = map(pos[0],0,1400,0,cw);
    let y = map(pos[1],0,860,0, ch);
    let c;
    if(correct == 1 ) {
      c = color(0,255,0);
    }
    else {
      c = color(255,0,0);
    }
    
    drawO(x,y, c);
    // drawNum(i+1, x,y);
  }
}


function drawO(x, y, c, size=10) {
  stroke(color(255));
  strokeWeight(2);  
  fill(c);
  ellipse(x,y, size);    
}

function drawNum(n, x, y, size=10) {
  stroke(color(255));
  fill(color(255));
  strokeWeight(1);  
  textSize(size);
  textAlign(CENTER,CENTER);
  text(n, x, y);
}

