class Jar extends Thing {
  constructor(x, y, question, answer) {
    super(x, y);
    this.img = loadImage('res/jar.png');
    this.r = 26;
    this.hr = this.r/2;
  
    this.score = 5;
    this.question = question;
    this.answer = answer;
  }
  
  draw() {
    if( !this.isAlive() ) {
      return;
    }    
    image(this.img,this.x - this.hr,this.y - this.hr,this.r,this.r);  
    // circle(this.x, this.y, this.w);
  }  
  
  getScore() {
    return this.score;
  }
  
  getAnswer(answer) {
    return (this.answer == answer) ? true : false;
  }
}

