class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.d = 30;
    }
  
    show() {
        circle(this.x, this.y, this.d);
    }
  
    moveRight(){
      this.x += 10;
    }
  
    moveLeft(){
      this.x -= 10;
    }
  }