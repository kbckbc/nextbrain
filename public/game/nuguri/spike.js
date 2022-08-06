class Spike extends Thing {
  constructor(x, y) {
    super(x, y);
    this.img = loadImage('res/spike.png');
    this.r = 18;
    this.hr = this.r/2;
  }

  draw() {
    if( !this.isAlive() ) {
      return;
    }
    image(this.img,this.x - this.hr,this.y - this.hr,this.r,this.r);  
      // circle(this.x, this.y, this.w);
  }  
}

