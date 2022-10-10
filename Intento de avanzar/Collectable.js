class Collectable {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.trap = false;
        this.d = 20;
    }
    show() {
        circle(this.x, this.y, this.d);
    }
    move() {
        if (this.y < 720) {
            this.y = this.y + 2;
        } else {
            this.y = -20;
        }
    }
  
    contact(cx, cy) {
      if (dist(cx, cy, this.x, this.y) < 15) {
          this.trap = true;
      }
  }
  
  }