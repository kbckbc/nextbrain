
function checkGameEnd() {
  
  if( qCurr == qMax) {
    // console.log('checkGameEnd', true);
    return true;
  }  
  // console.log('checkGameEnd', false);
  return false;
}

function setHistory() {
  let str = getAnswerHistory();
  // str += '<br>' + "You've got your job done.";
  // str += '<br>' + "Wanna learn more? Press 'Reset' button and Go!";
  let html = `<div class="shadow-none p-3 mb-5 bg-light rounded">${str}</div>`;
  select('#divResult').html(str);


  

}

function initPractice(op = '') {
  // console.log('initPractice', op);
  
  qCurr = -1;
  qHistory = [];
  
  if(op == '**') {
    qMax = 9;
    qTimes = [1,2,3,4,5,6,7,8,9];
  }
  else {
    qMax = 5;
  }
  
  select('#divResult').show();
  select('#divQuestion').show();
  select('#divTryNext').hide();
  
  
  select('#divResult').html('');
  select('#inputAnswer').value('');
  select('#inputRemain').value('');
}

function startQuestion(op, lv, times) {
  // console.log('startQuestion', op, lv, times);

  qCurr++;
  
  if(checkGameEnd()) {
    select('#divQuestion').hide();
    select('#divTryNext').show();1
    
    
    let hit = 0;
    for(let h of qHistory) {
      if( h.correct == true ) {
        hit++;
      }
    }
    let msg = 'All the answers must be correct to get a coin!';
    if( hit == qMax) {
      msg = `You've got all correct answers!`;
      let secondIndex = (getOp() == '**') ? getTimes() - 2 : getLv();
      if( _coinAvailable[getOp()][secondIndex] == 1) {
        msg += ` Get this coin :)`;
        
        // minus coin
        _coinAvailable[getOp()][secondIndex] = 0;
        document.getElementById("btnCoinLeft").innerText = 'Coin Left : 0';

        addCoin();
      }
      else {
        msg += ` But,, no coin left :(`;
      }
    }
    
    select('#divCoinMsg').html(msg);
    
    return;
  }
  
  
  setHistory();
  
  
  select('#inputAnswer').value('');
  // inputRemain.value('');
  
  let q = getQuestion(qCurr, op, lv, times);
  qHistory.push(q);      
  let ques = `Question #${qHistory[qCurr].num + 1}: ${qHistory[qCurr].question} = `;
  select('#spanQuestion').html(ques);

  
  // disable Remain to make it easy
  // if(op == '/') {
  //   labelRemain.style("display", "inline");
  //   inputRemain.style("display", "inline");
  // }
  // else {
  //   labelRemain.style("display", "none");
  //   inputRemain.style("display", "none");
  // }
  select('#spanSubmit').style('display','inline');
  
  document.getElementById("inputAnswer").focus();




}


function getQuestion(num, op, lv, times) {
  let question = '';
  
  if( op == '**') {
    digit = 0; // for one digit.
  }
  else {
    digit = lv;

  }
  // originally, 3terms was available, but it's too hard. so remove it.
  term = 2; 

  // console.log('getQuestion', num, op, digit, term, times);
  
  let x,y,z;
  let answer = 0;
  let remain = 0;
  

  // Get random x,y,z
  for(let i=0; i<term; i++) {
    // first term
    if( i== 0 ) {
      x = randomInt(digitRange[digit]);
      answer = x;
    }
    // second term
    else if( i == 1) {
      if( op == '*' || op == '/') {
        // second random value is one digit otherwise too difficult.
        y = randomInt(digitRange[0]);  
      }
      else {
        // to make it easy
        if( digit == 2) {
          digit = 1;
        }        
        y = randomInt(digitRange[digit]);
        if( x < y) {
          y = randomInt([1, x]);
        }
      }
    }
    // third term
    else if( i == 2) {
      z = randomInt(digitRange[digit]);
    }
  }
  
  // when division, make there's no remain
  if( op == '/') {
    let re = x % y;
    x -= re;
    if( x == 0) {
      x = y;
    }
  }
  
  // But in ttimes tables, diff logic
  if( op == '+' ){
    answer = x + y;
    answer += (term == 3) ? z : 0; 
  }
  else if( op == '-') {
    answer = x - y;
    answer -= (term == 3) ? z : 0;
  }
  else if( op == '*') {
    answer = x * y;
    answer *= (term == 3) ? z : 1;
  }
  else if( op == '**') {
    x = times;
    y = random(qTimes);
    let pos = qTimes.indexOf(y);
    qTimes.splice(pos, 1);
    answer = x * y;
  }
  else if( op == '/') {
    answer = floor(x / y);
    remain = x % y;
  }
  
  question += String(x);
  question += (op == '**') ? '*' : op;
  question += String(y);
  if(term == 3) {
    question += operation;
    question += String(z);
  }
  
  // console.log('#',num,'x,y,z,question, answer, remain', x,y,z,question, answer, remain);

  return {num, op, question, answer, remain};
}


function submitAnswer() {
  // console.log('submitAnswer', submitAnswer);
  
  if(select('#inputAnswer').value() == '') {
    return;
  } 
  checkAnswer();
  setHistory();
  
  startQuestion(getOp(), getLv(), getTimes());
}

function checkAnswer() {
  let correct = false;
  let h = qHistory[qCurr];
  if( h == null ) {
    // console.log('checkAnswer', 'null return');
    return;
  }
  let op = h.operation;
  // console.log('checkanswer', h.answer, select('#inputAnswer').value() , h.remain, inputRemain.value());
  
  
  // disable Remain on division to make it easy
  // if( op == '/' && h.answer == select('#inputAnswer').value() && h.remain == inputRemain.value()) {
  //   correct = true;
  // }
  // else 
    
  if(h.answer == select('#inputAnswer').value()) {
    correct = true;
  }
  else {
    correct = false;
  }
  
  h.correct = correct;
  h.yourAnswer = select('#inputAnswer').value();
  // h.yourRemain = select('#inputRemain').value();
  
  let str = `Question #${qCurr+1}: ${h.question} = ${h.yourAnswer}`;
  // if( h.op == '/') {
  //   str += `, remain ${h.yourRemain}`;
  // }
  str += '. ';
    
  if(h.correct == true) {
    str += 'You are correct';
  }
  else {
    str += `You are wrong. The Answer is ${h.answer}`;
    // if( h.op == '/') {
    //   str += `, remain ${h.remain}`;
    // }
  }
  
  h.result = str + '.<br>';
  
  return h.result; 
}

function getAnswerHistory() {
  // console.log('getAnswerHistory', qCurr);
  let resultStr = '';
  let hit = 0;
  for(let h of qHistory) {
    resultStr += h.result;
    if( h.correct == true ) {
      hit++;
    }
  }
  
  let summary =`<h4>Total score is ${hit} out of ${qMax}.</h4>`;
  
  // console.log('qHistory', qHistory);
  // console.log('getAnswerHistory', 'summary', summary);
  // console.log('getAnswerHistory', 'resultStr', resultStr);
  return summary + resultStr;
}




function goNextStep() {
  let op = getOp();
  let lv = getLv();
  if( op == '' && lv == '') {
    op = '/';
    lv = '2';
  }
  // console.log('getnextstop', op,lv);
  switch(op) {
    case '+':
    case '-':
    case '*':
    case '/':
      let currOp = op;
      let nextOp = currOp;
      let currLv = lv;
      let nextLv;
      if(currLv == '2'){
        nextLv = 0;

        switch(currOp) {
          case '+':
            nextOp = '-'; break;
          case '-':
            nextOp = '**'; break;
          case '**':
            nextOp = '*'; break;
          case '*':
            nextOp = '/'; break;
          case '/':
            nextOp = '+'; break;
        }
      }
      else {
        nextLv = parseInt(currLv) + 1;
      }

      let currOpId = 'btnOp' + currOp;
      let nextOpId = 'btnOp' + nextOp;

      document.getElementById(currOpId).checked = false;
      document.getElementById(nextOpId).checked = true;          

      let currLvId = 'btnLv' + currLv;
      let nextLvId = 'btnLv' + nextLv;

      document.getElementById(currLvId).checked = false;
      document.getElementById(nextLvId).checked = true;

      toggleLvTimes(nextOp);

      if(nextOp == '**') {
        document.getElementById(currLvId).checked = false;
        document.getElementById('btnTimes2').checked = true;   

        radioTimesClick();
      }
      else {
        radioLvClick();  
      }

      break;

    case '**':
      let currTimes = getTimes();
      let nextTimes;
      if(currTimes == '9'){
        document.getElementById('btnOp**').checked = false;
        document.getElementById('btnOp*').checked = true;       

        toggleLvTimes('*');

        document.getElementById('btnTimes9').checked = false;
        document.getElementById('btnLv0').checked = true;   

        radioLvClick(); 
      }
      else {
        nextTimes = parseInt(currTimes) + 1;

        let currTimesId = 'btnTimes' + currTimes;
        let nextTimesId = 'btnTimes' + nextTimes;

        document.getElementById(currTimesId).checked = false;
        document.getElementById(nextTimesId).checked = true; 

        radioTimesClick();
      }

      break;
  }  
}


function resetGame() {
  clearRadioValue(1);
  initPractice();
  
  // select('#divOp').style('display','block');  
  // select('#divLvTimes').style('display','block');  
  // select('#divProgressBar').style('display','block');
  // select('#divProgress').style('width','0%');
  
  
  select('#divOp').show();
  select('#divLvTimes').show();
  select('#divProgress').show();
  
  select('#divResult').hide();
  select('#divQuestion').hide();
  select('#divTryNext').hide();
  _divCanvas.hide();
  
  
  // document.getElementById("btnReset").blur();
}