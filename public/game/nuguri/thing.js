class Thing {
  constructor(x, y, ani=true) {
    this.x = x;
    this.y = y;
    this.g = 0.5;  // gravity
    this.v = 0;    // velocity
    
    this.xf = 0;   // x force
    this.yf = 7.5; // y force

    this.alive = true;  // alive or not
    this.ani = ani;   // animation    
    this.coll = false; // to emit one time collision
  }
  kill() {
    this.alive = false;
    this.ani = false;
  }
  noKill() {
    this.alive = true;
  }
  stop() {
    this.ani = false;
  }
  noStop() {
    this.ani = true;
  }
  isAlive() {
    return this.alive;
  }
  isMovable() {
    return ( this.alive && this.ani);
  }
  
  setColl() {
    this.coll = true;
  }
  isColl() {
    return this.coll;
  }
  
  update() {
    // if( !this.isAlive() ) {
    //   return;
    // } 
    if( !this.isMovable() ) {
      return;
    } 
    
    this.v += this.g;
    this.y += this.v;
    
    // when he is floating
    if( this.xf > 0) {
      this.xf -=1;
      if( this.dir == 0 ) {
        this.x -= 4;  
      }
      else {
        this.x += 4;  
      }
    }
       
    // boundary check
    // boundary for top, bottom
    if(this.y > _h - this.hr) {
      this.y = _h - this.hr;
      this.v = 0;
    }
    
    // boundary for left, right
    if( this.x < this.hr ) {
      this.x = this.hr;
    }    
    
    if( this.x > _w - this.hr ) {
      this.x = _w-this.hr;
    }
  }
}