let _debug = false;

let _divCanvas;

let qCurr; //current question position
let qMax; // max question position
let qHistory = [];
let digitRange = [[1,9], [10,99], [100,999]];
let qTimes;

let _w = 700;
let _h = 300;

const _oneCoin = 1;
let _coinRemain = 0;
let _coinAvailable = {
  '+':[1,2,4],
  '-':[1,2,4],
  '*':[1,2,4],
  '**':[1,1,1,1,1,1,1,1],
  '/':[1,2,4]
}

function preload() { 
}

function setup() {
  _divCanvas = createCanvas(_w, _h);

  initEvent();
}

function draw() {
    _divCanvas.hide();
}


function keyPressed() {
    // enter
    if( keyCode == 13 && qCurr != -1 && select('#inputAnswer').value() != '') { 
      // check the whole question has ended!
      if( checkGameEnd() ) {
        goNextStep();
      }
      // disable Remain on division
      // else if( getOp() == '/' && inputRemain.value() == '') {
      //   document.getElementById("inputRemain").focus();
      // }
      // else if(getOp() == '/' && inputRemain.value() != '') {
      //   submitAnswer();
      // }
      else {
        submitAnswer();  
      }
    }
}
