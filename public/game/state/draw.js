function writeScore(data) {
  console.log('data length', data.length);

  let scoreStr = "<< Score Board >><br>";  

  divScore = createDiv();
  divScore.parent(divBody);  

  if( data.length == 0) {
    scoreStr += "No one played yet!<br>";
    scoreStr += "Be the first student challenging this game!<br>";
  }
  else {
    let playerNum = data.length;
    scoreStr += `${playerNum} student(s) have challenged this game!<br><br>`;
    
    let sortbyNameAscend = data.slice().sort((a, b) => (a.name - b.name));
    let sortbyHitDescend = sortbyNameAscend.slice().sort((a, b) => b.hit - a.hit);

    let rank = 1;
    //console.log('scoreArr', scoreArr);  
    for( let i in sortbyHitDescend ) {
      let score = sortbyHitDescend[i];
      let timestamp = score.timestamp;
      let date = new Date(timestamp).toUTCString(); 
      let name = score.name;
      let school = score.school;
      let hit = score.hit;
      let wrong = score.wrong;
      
      name = name.charAt(0).toUpperCase() + name.slice(1);
      school = school.charAt(0).toUpperCase() + school.slice(1);

      let lineStr = `Rank #${rank} : ${hit} right answer(s), ${date}, ${name} from ${school}<br>`;
      
      scoreStr += lineStr;
      rank++;      
    }
  }

  divScore.html(scoreStr);      
}


function writeStatus() {
  let str;
  
  if( divStatus ) {
    divStatus.remove();  
  }
  
  
  divStatus = createDiv();
  divStatus.parent(divBody);
  let total = qQuestions.length;
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
  divStatus.html(str);  
}


function writeQuestion(key) {
  
  if( divQuestion ) {
    divQuestion.remove();  
  } 
  
  let str;
  
  divQuestion = createDiv();
  divQuestion.parent(divBody);
  str = '#' + (qCurrNum + 1) + ' : Choose the name of the circled state';
  divQuestion.html(str);
  
  divAnswer = createDiv();
  divAnswer.parent(divBody);
  
  radioAnswer = createRadio();
  radioAnswer.parent(divAnswer);  
  
  // radioAnswer.style('width', cw+'px');
  
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

    // shuffle the answers and add to the radio button
    shuffleArray(answerSelection);  
    for(let i=0;i<answerSelection.length;i++) {
      radioAnswer.option(answerSelection[i]);
    }

    prevAnswers = answerSelection.slice();
  }  
  else {
    for(let i=0;i<prevAnswers.length;i++) {
      radioAnswer.option(prevAnswers[i]);
    }    
  }
}

function writeYourAnswer() {
  
  if( divYourAnswer ) {
    divYourAnswer.remove();  
  }  
  
  divYourAnswer = createDiv();
  divYourAnswer.parent(divBody);
  
  let str, yourAnswer, correct, correctAnswer;
  if(qYourAnswer.length != 0) {
    yourAnswer = qYourAnswer[qPrevNum][0];
    if( qYourAnswer[qPrevNum][1] == 0 ) {
      correct = 'wrong';
    }
    else {
      correct = 'right';
    }
      
    correctAnswer = qYourAnswer[qPrevNum][2];
  }
  str = 'Your answer of #'+ (qPrevNum + 1) + ' was ' + yourAnswer;
  str += ' which was ' + correct;
  str += '. The answer was ' + correctAnswer + '.';
  divYourAnswer.html(str);
}


function writeGameEnd(){
  divYourAnswer = createDiv();
  divYourAnswer.parent(divBody);
  
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
  
  divYourAnswer.html(str);  
}


function drawCurrDot(state = '', c = color(255,0,0) ) {
  let answer, x, y;
  let pos = [];
  
  // draw current dot
  if(state != '') {
    pos = USA_STATE[state];
    x = map(pos[0],0,1400,0,cw);
    y = map(pos[1],0,860,0, ch);

    drawO(x,y,c);
    drawNum(qCurrNum+1, x,y);
    
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
    drawNum(i+1, x,y);
  }
}


function drawO(x, y, c, size=15) {
  overlay.stroke(color(255));
  overlay.strokeWeight(2);  
  overlay.fill(c);
  overlay.ellipse(x,y, size);  
  overlay.ellipse(x,y, size);
}

function drawNum(n, x, y, size=10) {
  overlay.stroke(color(255));
  overlay.fill(color(255));
  overlay.strokeWeight(1);  
  overlay.textSize(size);
  overlay.textAlign(CENTER,CENTER);
  overlay.text(n, x, y);
}


function clearText() {
  divBody.html(''); 
}

