function setButtonEvent() {
  btnUsa.mousePressed(() => {
    let name = txtPlayerName.value();
    let school = txtSchoolName.value();
    if( name.length == 0  || school.length == 0 ) {
      alert('Plz fill out your name and school for the ranking!');
      return;
    }

    divNavi.show();
    showScore();    
  });
  
  btnScore.mousePressed(() => {
    showScore();    
  });
                        
  btnStudy.mousePressed(() => {
    if( qStarted ) {
      if (confirm('Are you sure you want to quit this challenge?')) {
        saveScore();
      }      
      else {
        return;
      }
    }

    initGame('USA');  
    qStarted = false;
    image(studyImg,0,0);    
  });
  
  btnStart.mousePressed(() => {
    if( qStarted ) {
      if (confirm('Are you sure you want to quit this challenge?')) {
        saveScore();
      }      
      else {
        return;
      }
    }

    initGame('USA');  
    qStarted = true;
    image(questionImg,0,0);    
  });
  
  btnPrev.mousePressed(() => {
    if( qPrevNum > 0) {
      clearText();

      qStep = gameStep.GOTO_PREV;
      qPrevNum -= 1;
    }    
  });
  
  btnNext.mousePressed(() => {
    // if it hasn't started yet
    if(qStarted == true) {
      if( qPrevNum < qCurrNum && qPrevNum < qQuestions.length -1 ) {
        clearText();

        qPrevNum++;
        if( qPrevNum == qCurrNum ) {
          drawCurrDot(qCurrAnswer);
          drawStatus();
          drawQuestion(qCurrAnswer);
          qStep = gameStep.CHECK_ANSWER;    
        }
        else {
          qStep = gameStep.GOTO_PREV;
        }
      }
    }    
  });
}

function showScore() {
  if( qStarted ) {
    if (confirm('Are you sure you want to quit this challenge?')) {
      saveScore();
    }      
    else {
      return;
    }
  }

  // for debug purpose
  //localStorage.clear();
  initGame();  
  // writeScore(); 
  writeScore1();
}