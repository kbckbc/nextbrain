function initEvent() {
  select('#btnSubmit').mousePressed(() => {
    submitAnswer();
  });

  
  select('#btnTryAgain').mousePressed(() => {
    // console.log('btnTryAgain');
    if( getOp() == "" ) {
      globalToast('Choose operation');
    }
    else if(getOp() != '**' && getLv() == "") {
      globalToast('Choose Level');
    }                                                                
    else if(getOp() == '**' && getTimes() == "") {
      globalToast('Choose Times');
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


function radioOpClick(myRadio) {
  // console.log('radioOpClick', myRadio.value);
  
  clearRadioValue(3);
  toggleLvTimes(myRadio.value);
    
  select('#divResult').hide();
  select('#divQuestion').hide();
  select('#divTryNext').hide();       

}


function radioLvClick(myRadio) {
  // console.log('radioLvClick', myRadio.value);

  if(getOp() == "") {
    globalToast('Choose operation!');
  }
  else {
    select('#btnCoinLeft').style('display', 'inline');

    let coinLeft = _coinAvailable[getOp()][getLv()];
    document.getElementById("btnCoinLeft").innerText = 'Coin Available :' + coinLeft;
    
    
    initPractice();
    startQuestion(getOp(), getLv(), getTimes());    
  }
  
  
}

function radioTimesClick(myRadio) {
  // console.log('radioLvClick', myRadio.value);

  if(getOp() == "") {
    globalToast('Choose operation!');
  }
  else {
    select('#btnCoinLeft').style('display', 'inline');
    
    let coinLeft = _coinAvailable[getOp()][getTimes() -2];
    document.getElementById("btnCoinLeft").innerText = 'Coin Available :' + coinLeft;
        
    
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


