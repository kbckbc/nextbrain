class Enemy extends Thing {
  constructor(x, y, ani) {
    super(x,y,ani);

    this.img = [
      [loadImage('res/enemyl1.png'),loadImage('res/enemyl2.png')],
      [loadImage('res/enemyr1.png'),loadImage('res/enemyr2.png')],
    ];
    this.r = 26;
    this.hr = this.r/2;
    this.speed = randomInt([1,2]);    
    if( randomInt([0,1]) == 1) {
      this.speed *= -1;
    }

    this.aniTick = 0;
    this.aniChange = [5, 10];
  }

  update() {
    super.update();
    
    if( !this.isMovable() ) {
      return;
    }
    
    this.x += this.speed
    if( this.x > _w - this.hr ) {
      this.speed = this.speed * -1;
    }    
    else if( this.x < this.hr ) {
      this.speed = this.speed * -1;
    }    
  }
  
  draw() {
    if( !this.isAlive() ) {
      return;
    }
    
    if( this.isMovable() ) {
      this.aniTick++;
    }    

    let dir = (this.speed < 0) ? 0 : 1;
    
    if( this.aniTick < this.aniChange[0]) {
      image(this.img[dir][0],this.x - this.hr,this.y - this.hr,this.r, this.r);    
    }
    else if( this.aniTick <= this.aniChange[1]){
      if( this.aniTick == this.aniChange[1]) {
        this.aniTick = 0;
      }
      image(this.img[dir][1],this.x - this.hr,this.y - this.hr,this.r, this.r);    
    }
  }  
}

