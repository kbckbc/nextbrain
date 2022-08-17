const JudgeState = {
  "STAGE":0,
  "PLAY":1,
  "ASK":2,
  "WRONG":3,
  "GATE":4,
  "SPIKE":5,
  "ENEMY":6,
  "UNPAID":7,
  "NOTENOUGHCOIN":8,
  "RANK":9
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
        text(`${_oneCoin} coin(s) per play. Want to play? Y or N?`, this.x, this.y);      
        break;
        
      case JudgeState.NOTENOUGHCOIN:
        this.setFont(28, CENTER);
        text('Not enough coins.', this.x, this.y);      
        
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
        
        
      case JudgeState.GATE:
        this.setFont(28, CENTER);
        msg = 'Great Job. Press Enter to Next Lv!';
        text(msg, this.x, this.y);        
        break;     

      case JudgeState.WRONG:
      case JudgeState.SPIKE:
      case JudgeState.ENEMY:
        this.setFont(28, CENTER);
        if(this.state == JudgeState.WRONG) {
          msg = 'Wrong Answer :(';
          
        }
        else if(this.state == JudgeState.SPIKE) {
          msg = 'Ouch! Dodge the spikes!';
        }
        else if(this.state == JudgeState.ENEMY) {
          msg = 'Be careful of enemies!';
        }
        msg += '\nWanna save your score? Y or N?';
        text(msg, this.x, this.y);
        break;
   
      case JudgeState.RANK:
        this.setFont(28, CENTER);
        msg = 'Try more? Y or N?';
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
          startTimer();
          
          // start animation
          _nuguri.noStop();
          for(let enemy of _enemy) {
            enemy.noStop();  
          }
        }
        break;        
        
      case JudgeState.UNPAID:
        if(keyCode == 89 || keyCode == 121) { // y, Y
          useCoin(_oneCoin)
            .then((data) => {
              if( data.result) {
                initTimer();
                
                this.state = JudgeState.STAGE;
                setHeaderCoin(data.coin);

                _introSound.play();

                globalToast('Coin used successfully!');
              }
              else {
                globalToast('Earning coins for playing after Signup!');
                this.state = JudgeState.NOTENOUGHCOIN;
              }

            })
            .catch( err => console.log(err));
        }
        else if(keyCode == 78 || keyCode == 110) { // n, N
          resetGame();
        }           
        break;
        
      case JudgeState.NOTENOUGHCOIN:
        
        resetGame();
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
          
          // when hit answer
          if( this.caller.getAnswer(this.inputTxt)) {
            this.state = JudgeState.SLEEP;
            startTimer();

            _score += this.caller.getScore();

            // start animation
            _nuguri.noStop();
            for(let enemy of _enemy) {
              enemy.noStop();  
            }
          }
          // when wrong answer
          else {
            this.state = JudgeState.WRONG;
            stopTimer();
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
        
      case JudgeState.WRONG:
      case JudgeState.SPIKE:
      case JudgeState.ENEMY:
        if(keyCode == 89 || keyCode == 121) { // y, Y
          saveScore();
          this.state = JudgeState.RANK;
        }
        else if(keyCode == 78 || keyCode == 110) { // n, N
          this.state = JudgeState.RANK;
        }
        break;

      case JudgeState.RANK:
        if(keyCode == 89 || keyCode == 121) { // y, Y
          initGameMode(_stage); 
          setHeaderCoin(data.coin);

        // useCoin()
        //   .then((data) => {
        //     if( data.result ) {
        //       initGameMode(_stage); 
        //       setHeaderCoin(data.coin);
        //     }
        //     else {
        //       this.state = JudgeState.NOTENOUGHCOIN;
        //     }
        //   })
        //   .catch( err => console.Console(err));
      }
      else if(keyCode == 78 || keyCode == 110) { // n, N
        resetGame();
      }            
        break;
    }// switch
    
  }// keypressed
  
}  