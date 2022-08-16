function showStudy() {
  if( qStarted && !qSaved && qYourAnswer.length != 0 ) {
    let str = `You've started your game.`;
    str += `\nIf you proceed, the result will be gone.`;
    str += `\nDo you want to move to Study?`;
    if (!confirm(str)) {
      return;
    }      
  }    

  select('#cardSectionNext').hide();
  select('#cardSectionPrev').hide();  

  initGame('USA');  
  qStarted = false;
  image(studyImg,0,0);
}




function setButtonEvent() {
  select('#btnUsa').mousePressed(() => {
  });

  let str;
  
  select('#btnScore').mousePressed(() => {
    if( !qStarted ) {
      str = `To record your score, start a new game!`;
      alert(str);
    }
    else if( qSaved ) {
      str = `You need to play again to record new score!`;
      alert(str);
    }
    else if( qYourAnswer.length != 0 ) {
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
      
      if( hit == 0 ) {
        str = `To record your score, at least hit one question!`
        alert(str);
      }
      else {
        let str = `Hit: ${hit}, Wrong: ${wrong}\nDo you want to record your score on the ranking system?`;
        if (confirm(str)) {
          saveScore();
          qSaved = true;
        }      
      }
    }
  });

  



  select('#btnStudy').mousePressed(showStudy);
  
  select('#btnStart').mousePressed(() => {
    alert(`Don't forget to click 'Save score' to record your result!`);
    initGame('USA');  
    qStarted = true;
    image(questionImg,0,0); 

    select('#cardSectionNext').show();
    select('#cardSectionPrev').hide();
  });
  
  select('#btnPrev').mousePressed(() => {
    if( qPrevNum > 0) {
      qStep = gameStep.GOTO_PREV;
      qPrevNum -= 1;


      select('#cardSectionNext').hide();
      select('#cardSectionPrev').show();
  
    }   
  });
  
  select('#btnNext').mousePressed(() => {
    // if it hasn't started yet
    if(qStarted == true) {
      if( qPrevNum < qCurrNum && qPrevNum < qQuestions.length -1 ) {
        qPrevNum++;
        if( qPrevNum == qCurrNum ) {
          select('#cardSectionNext').show();
          select('#cardSectionPrev').hide();

          drawCurrDot(qCurrAnswer);
          writeStatus();
          writeQuestion(qCurrAnswer);
          qStep = gameStep.CHECK_ANSWER;    
        }
        else {
          qStep = gameStep.GOTO_PREV;
        }
      }
    }    
  });


  select('#btnA1').mousePressed(() => {
    playerAnswer = select('#btnA1').html();
  });
  select('#btnA2').mousePressed(() => {
    playerAnswer = select('#btnA2').html();
  });
  select('#btnA3').mousePressed(() => {
    playerAnswer = select('#btnA3').html();
  });
  select('#btnA4').mousePressed(() => {
    playerAnswer = select('#btnA4').html();
  });
  select('#btnA5').mousePressed(() => {
    playerAnswer = select('#btnA5').html();
  });

}
