class Player {
    constructor(x, y, width) {
        // this.image1 = image1;
        this.x = x;
        this.y = y;
        this.width = width;
        this.d = 30;
        this.speed = 7;
    }

    show() {
        circle(this.x, this.y, this.d);
    }

    moveRight() {

        console.log(this.width)
        if (this.x < this.width) {
            this.x += this.speed;
        }
    }

    moveLeft() {
        if (this.x > 0) {
            this.x -= this.speed;
        }
    }
}