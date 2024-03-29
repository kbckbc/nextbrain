class Board {
  constructor() {
    this.x = 10;
    this.y = 25;
    this.alive = true;
  }
  
  draw() {
    // console.log('board.draw', this.ltxt, this.rtxt);
    if( !this.alive ) return;
    
    textSize(18);
    stroke(150, 150, 255);
    strokeWeight(2);
    fill(255,255,255);
    
    textAlign(LEFT);
    text(`Stage ${_stage+1}, Score : ${_score}`, this.x, this.y);  
    
    textAlign(RIGHT);
    text(`Left, Right, Space key`, _w - this.x, this.y);  

    textAlign(CENTER);
    text(`Time : ${(_timer==null) ? 0 :_time}`, _w/2, this.y);  
  }
} 