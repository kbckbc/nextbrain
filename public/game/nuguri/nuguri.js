class Nuguri extends Thing {
  constructor(x, y, ani) {
    super(x,y,ani);

    // this.img = [ loadImage('res/nuguril.png'), loadImage('res/nugurir.png')];
    this.img = [ 
      [loadImage('res/nl1.png'), loadImage('res/nl2.png'), loadImage('res/nl3.png')],
      [loadImage('res/nr1.png'), loadImage('res/nr2.png'), loadImage('res/nr3.png')],
      [loadImage('res/ns.png')]
    ];
    this.r = 40;
    this.hr = this.r/2;
    this.dir = 1; // left 0, right 1
    this.stand = true;
    this.speed = 5;
    
    this.aniTick = 0;
    this.aniChange = [5, 10, 15];    
  }
  
  draw() {
    if( !this.isAlive() ) {
      return;
    }
    
    // if(this.dir == 0) {
    //   image(this.img[0],this.x - this.hr,this.y - this.hr,this.r, this.r);  
    // } 
    // else {
    //   image(this.img[1],this.x- this.hr,this.y- this.hr,this.r, this.r);
    // }
    // circle(this.x, this.y, this.r);
    
    
    
      if( this.isMovable() && this.stand != true ) {
        this.aniTick++;
      }
      
      
    
      if( this.aniTick < this.aniChange[0]) {
        image(this.img[this.dir][0],this.x - this.hr,this.y - this.hr,this.r, this.r);    
      }
      else if( this.aniTick <= this.aniChange[1]){
        image(this.img[this.dir][1],this.x - this.hr,this.y - this.hr,this.r, this.r);    
      }
      else if( this.aniTick <= this.aniChange[2]){
        if( this.aniTick == this.aniChange[2]) {
          this.aniTick = 0;
        }
        image(this.img[this.dir][2],this.x - this.hr,this.y - this.hr,this.r, this.r);    
      }    
      
      
    
  }
  
  checkCollisions(objs) {
    for(let obj of objs) {
      this.checkCollision(obj);
    }
  }
  
  checkCollision(obj) {
    // as long as obj is alive
    if( !this.isAlive() || !obj.isAlive()) {
      return;
    }
    // if the obj already collided, then return
    if(obj.isColl()) {
      return;
    }
    
    // console.log('coll', this, obj);
    let coll = collideCircleCircle(this.x, this.y, this.r, obj.x, obj.y, obj.r);
    if( coll ) {
      // console.log('nuguri', 'coll happend');
      
      // stop objs' animation
      super.stop();
      for(let enemy of _enemy) {
        enemy.stop();  
      }
      
      
      if( obj instanceof Jar ) {
        _judge.setText(obj.question, obj);
        _judge.setState(JudgeState.ASK, obj);
      }
      else if( obj instanceof Gate ) {
        stopTimer();
        
        _judge.setState(JudgeState.GATE, obj);
      }
      else if( obj instanceof Spike ) {
        stopTimer();
        
        _bumpSound.play();
        _judge.setState(JudgeState.SPIKE, obj);
      }
      else if( obj instanceof Enemy ) {
        stopTimer();
        
        _bumpSound.play();
        _judge.setState(JudgeState.ENEMY, obj);
      }
      
      // check collision not to check again
      obj.setColl();
    }         
  }
  
  up() {
    if( this.v == 0 ) { // don't allow double up
      this.v -= this.yf;  
      this.xf = 30; 
    }
  }
    

  keyPressed(keyCode) {
    // console.log('keyPresed', this.ani, this.alive);
    if( !this.isMovable() ) {
      return;
    }     
    
    if( keyCode == 32 ) { // space
      this.up();  
      _jumpSound.play();
    }
  }
  
  keyDragging(l, r) {
    // console.log('keyDragging', l, r);
    if( !this.isMovable() ) {
      return;
    }     
    
    // not floating
    if( this.xf == 0) {
      if(l) {
        this.dir = 0;
        this.x -= this.speed;
        this.stand = false;
        if( !_walkSound.isPlaying() ) {
          _walkSound.play();
        }
      }
      else if(r) {
        this.dir = 1;
        this.x += this.speed;
        this.stand = false;
        if( !_walkSound.isPlaying() ) {
          _walkSound.play();
        }
      }   
      else { // stand
        this.stand = true;
      }
    }    
  }
}