class Player {
    constructor(x, y, width, image1) {
        this.image1 = image1;
        this.x = x;
        this.y = y;
        this.width = width;
        this.d = 30;
        this.speed = 7;
        this.lives = 3;
    }

    show() {
        image(this.image1, this.x, this.y);
    }

    moveRight() {
        if (this.x < this.width - 180) {
            this.x += this.speed;
        }
    }

    moveLeft() {
        if (this.x > 0) {
            this.x -= this.speed;
        }
    }

    loseLive(){
        this.lives -= 1;
    }

    getX(){
        return this.x;
    }

    getY(){
        return this.y;
    }

    getLives(){
        return this.lives;
    }

}