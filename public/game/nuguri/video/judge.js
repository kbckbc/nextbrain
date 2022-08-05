const JudgeState = {
  "STAGE":0,
  "PLAY":1,
  "ASK":2,
  "WRONG":3,
  "GATE":4,
  "SPIKE":5,
  "ENEMY":6,
  "UNPAID":7,
  "NOTENOUGHCOIN":8
}

class Judge {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.txt = '';
    this.inputTxt = '';
    this.caller;
    this.state = JudgeState.UNPAID;    
    if(_stage > 0) {
      this.state = JudgeState.STAGE;
    }
  }
  
  setState(type, obj) {
    this.state = type;
    this.caller = obj;
  }
  
  setText(txt, caller) {
    if( txt == null || txt.length == 0) {
      return;
    }

    
    this.txt = txt;
    this.inputTxt = '';
    
  }
  
  setFont(size, align) {
    textSize(size);
    stroke(240, 150, 255);
    strokeWeight(1);
    fill(255,255,255);
    textAlign(align);    
  }
  
  draw() {
    let msg = '';
    // console.log('draw');
    switch(this.state) {
      case JudgeState.STAGE:  
        this.setFont(28, CENTER);
        text(`Stage ${_stage+1}. Press enter when ready!`, this.x, this.y);      
        break;        
        
      case JudgeState.UNPAID:
        this.setFont(28, CENTER);
        text(`${_oneCoin} coin is needed. Want to play? Y or N?`, this.x, this.y);      
        break;
        
      case JudgeState.NOTENOUGHCOIN:
        this.setFont(28, CENTER);
        text('Not enough coins. Earn coins on Practice mode!', this.x, this.y);      
        
        break;
        
      case JudgeState.ASK:
        this.setFont(28, CENTER);
        // console.log('ASK', this.txt, msg);
        msg = this.txt;
        if( this.inputTxt.length == 0) {
          msg += ' = ?';  
        }
        else {
          msg += ' = ' + this.inputTxt;
        }

        text(msg, this.x, this.y);        
        break;
        
      case JudgeState.WRONG:
        this.setFont(28, CENTER);
        msg = 'Wrong Answer :( Try more? Y or N?';
        text(msg, this.x, this.y);
        break;
        
      case JudgeState.SPIKE:
        this.setFont(28, CENTER);
        msg = 'Ouch! Dodge the spikes! Try again(Y/N)?';
        text(msg, this.x, this.y);        
        break;
        
      case JudgeState.ENEMY:
        this.setFont(28, CENTER);
        msg = 'Be careful enemy :( Try more? Y or N?';
        text(msg, this.x, this.y);        
        break;
        
      case JudgeState.GATE:
        this.setFont(28, CENTER);
        msg = 'Great Job. Press Enter to Next Lv!';
        text(msg, this.x, this.y);        
        break;        
      
    }
  }  
  
  keyPressed(keyCode) {
    
    switch(this.state) {
      case JudgeState.PLAY:
        // do nothing
        break;
        
      case JudgeState.STAGE:  
        if( keyCode == 13 ) { // enter
          this.state = JudgeState.PLAY;

          // start timer
          startTimer(false);
          
          // start animation
          _nuguri.noStop();
          for(let enemy of _enemy) {
            enemy.noStop();  
          }
        }
        break;        
        
      case JudgeState.UNPAID:
        if(keyCode == 89 || keyCode == 121) { // y, Y
          if( useCoin()) {
            initTimer();
            
            this.state = JudgeState.STAGE;
          }
          else {
            this.state = JudgeState.NOTENOUGHCOIN;
          }
        }
        else if(keyCode == 78 || keyCode == 110) { // n, N
          resetGame();
        }           
        break;
        
      case JudgeState.NOTENOUGHCOIN:
        this.state = JudgeState.UNPAID;
        resetGame();
        break;
        
      case JudgeState.GATE:
        if( keyCode == 13) {        
          this.state = JudgeState.STAGE;
          
          this.caller.addScore();
          _stage++;
          if(_stage == _maxStage){
            _stage = 0;
          }
          initGameMode(_stage); 
          
        }        
        break;         
        
      case JudgeState.ASK:
        if( !isKeyAccept(keyCode)) {
          break;
        }
        // enter
        if( keyCode == 13) {
          if( this.inputTxt.length == 0 ) {
            break;
          }

          // kill jar which called judge
          this.caller.kill();
          
          if( this.caller.getAnswer(this.inputTxt)) {
            this.state = JudgeState.SLEEP;

            _score += this.caller.getScore();

            startTimer();
            // start animation
            _nuguri.noStop();
            for(let enemy of _enemy) {
              enemy.noStop();  
            }
          }
          else {
            this.state = JudgeState.WRONG;
          }
        } 
        else {
          // backspace
          if( this.inputTxt.length !=0 && keyCode == 8) {
            this.inputTxt = this.inputTxt.substring(0, this.inputTxt.length - 1);  
          }
          else if ( keyCode != 8) {
            this.inputTxt += String.fromCharCode(keyCode);
          }
        }        
        break;
        
      case JudgeState.WRONG:
      case JudgeState.SPIKE:
      case JudgeState.ENEMY:
        if(keyCode == 89 || keyCode == 121) { // y, Y
          if( useCoin()) {
            initGameMode(_stage); 
          }
          else {
            this.state = JudgeState.NOTENOUGHCOIN;
          }
        }
        else if(keyCode == 78 || keyCode == 110) { // n, N
          resetGame();
        }          
        break;
    }// switch
    
  }// keypressed
  
}  