function initEvent() {
  select('#btnReset').mousePressed(() => {
    resetGame();
  });

  select('#btnSubmit').mousePressed(() => {
    submitAnswer();
  });

  select('#btnToggleNote').mousePressed(() => {
    if( select('#btnToggleNote').html() == 'Show note') {
      select('#btnToggleNote').html('Hide note');
      _divCanvas.show();
    }
    else {
      select('#btnToggleNote').html('Show note');
      _divCanvas.hide();
    }
  });  

  select('#btnClearNote').mousePressed(() => {
    clearNote(0);
  });  
  
  
  select('#btnTryAgain').mousePressed(() => {
    // console.log('btnTryAgain');
    if( getOp() == "" ) {
      alert('Choose operation');
    }
    else if(getOp() != '**' && getLv() == "") {
      alert('Choose Level');
    }                                                                
    else if(getOp() == '**' && getTimes() == "") {
      alert('Choose Times');
    }                                                                
    else {
      initPractice();
      startQuestion(getOp(), getLv(), getTimes());         
    }
  });  
  
  select('#btnGoNext').mousePressed(() => {
    // console.log('btnGoNext');
    goNextStep();
  });  
}



function radioModeClick(myRadio) {
  // console.log('radioModeClick', myRadio.value);
  
  clearRadioValue(2);
  
  if(myRadio.value == 1) { // practice mode
    _mode = 'practice';
    
    select('#divOp').show();
    select('#divLvTimes').show();
    select('#divProgress').show();
    select('#divProgressBar').style('width','0%');
    
    initPractice();
    goNextStep();
    
  }
  else { // game mode
    _mode = 'game';
    _stage = 0;
    
    select('#divOp').hide();
    select('#divLvTimes').hide();
    select('#divProgress').hide();
    select('#divResult').hide();
    select('#divQuestion').hide();
    select('#divTryNext').hide();    
    
    
    resetTimer();  
    initGameMode(_stage);    
    

  }

  // to prevent arrow key working on the radio btn
  document.getElementById("btnMode1").blur();
  document.getElementById("btnMode2").blur();
}


function radioOpClick(myRadio) {
  // console.log('radioOpClick', myRadio.value);
  
  clearRadioValue(3);
  
  if(getMode() == "") {
    alert('Choose play mode!');
    resetGame();
  }
  else {
    toggleLvTimes(myRadio.value);
    
    select('#divProgressBar').style('width','0%');
    select('#divResult').hide();
    select('#divQuestion').hide();
    select('#divTryNext').hide();       
  }
}


function radioLvClick(myRadio) {
  // console.log('radioLvClick', myRadio.value);

  if(getOp() == "") {
    alert('Choose operation!');
  }
  else {
    select('#btnCoinLeft').style('display', 'inline');

    let coinLeft = _coinAvailable[getOp()][getLv()];
    document.getElementById("btnCoinLeft").innerText = 'Coin Left :' + coinLeft;
    
    
    initPractice();
    startQuestion(getOp(), getLv(), getTimes());    
  }
  
  
}

function radioTimesClick(myRadio) {
  // console.log('radioLvClick', myRadio.value);

  if(getOp() == "") {
    alert('Choose operation!');
  }
  else {
    select('#btnCoinLeft').style('display', 'inline');
    
    let coinLeft = _coinAvailable[getOp()][getTimes() -2];
    document.getElementById("btnCoinLeft").innerText = 'Coin Left :' + coinLeft;
        
    
    initPractice('**');
    startQuestion(getOp(), getLv(), getTimes());    
  }
}


function toggleLvTimes(op) {
  if(op == '**') {
    document.getElementById("spanLv").style.display = "none";
    document.getElementById("spanTimes").style.display = "inline";
  }
  else {
    document.getElementById("spanLv").style.display = "inline";
    document.getElementById("spanTimes").style.display = "none";
  }    
}


function clearRadioValue(line) {
  let ele;
  
  switch(line) {
    case 1:
      ele = document.getElementsByName("btnRadioMode");
      for(var i=0;i<ele.length;i++) {
        ele[i].checked = false;  
      }
    case 2:
      ele = document.getElementsByName("btnRadioOp");
      for(var i=0;i<ele.length;i++) {
        ele[i].checked = false;  
      }
    case 3:
      ele = document.getElementsByName("btnRadioLv");
      for(var i=0;i<ele.length;i++) {
        ele[i].checked = false;  
      }
    case 4:
      ele = document.getElementsByName("btnRadioTimes");
      for(var i=0;i<ele.length;i++) {
        ele[i].checked = false;  
      }
  }
  
}




function getMode() {
  let result = document.querySelector('input[name="btnRadioMode"]:checked');
  if(result != null) {
    return result.value;
  }
  else {
    return "";
  }
}

function getOp() {
  let result = document.querySelector('input[name="btnRadioOp"]:checked');
  if(result != null) {
    return result.value;
  }
  else {
    return "";
  }
}

function getLv() {
  let result = document.querySelector('input[name="btnRadioLv"]:checked');
  if(result != null) {
    return result.value;
  }
  else {
    return "";
  }
}

function getTimes() {
  let result = document.querySelector('input[name="btnRadioTimes"]:checked');
  if(result != null) {
    return result.value;
  }
  else {
    return "";
  }
}


