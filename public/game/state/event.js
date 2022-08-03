function setButtonEvent() {
  btnUsa.mousePressed(() => {
    divNavi.show();
    showStudy();
  });

  let str;
  
  btnScore.mousePressed(() => {
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

  
function saveScore() {
  console.log('saveScore');
  let timestamp = Date.now();
  // let name = txtPlayerName.value();
  // let school = txtSchoolName.value();
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
  
  let data = {timestamp, hit, wrong, score};
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
        console.log('insert status', res);  

        divBody.html('');

        divResult = createDiv();
        divResult.parent(divBody);

        divResult.html(res.msg);
        image(studyImg,0,0);

        // showStudy();  
      })
      .catch(err => console.log('insert2db', err));
      
      
  console.log('saveScore complete');
}

  function showStudy() {
    initGame('USA');  
    qStarted = false;
    image(studyImg,0,0);
  }
  btnStudy.mousePressed(showStudy);
  
  btnStart.mousePressed(() => {
    alert(`Don't forget to click 'Save score' to record your result!`);
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
}
