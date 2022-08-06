class Gate extends Thing {
  constructor(x, y) {
    super(x, y);
    this.img = [
      loadImage('res/carrot.png'), 
      loadImage('res/apple.png'), 
      loadImage('res/cherry.png'), 
      loadImage('res/wm.png')
    ]
    this.r = 30;
    this.hr = this.r/2;
    this.score = 5;
    
    this.imgIndex = randomInt([0,3]);
  }
  
  draw() {
    if( !this.isAlive() ) {
      return;
    } 
    image(this.img[this.imgIndex],this.x - this.hr,this.y - this.hr,this.r,this.r);  
    // circle(this.x, this.y, this.w);
  }   

  addScore() {
    _score += this.score * (_stage+1);
  }
}

