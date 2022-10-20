class Player {
    constructor(x, y, width, image1, image2, image3) {
        this.image1 = image1;
        this.image2 = image2;
        this.image3 = image3;
        this.imageActual = image1;
        this.x = x;
        this.y = y;
        this.width = width;
        this.d = 30;
        this.speed = 7;
        this.lives = 3;
    }

    show() {
        image(this.imageActual, this.x, this.y);
    }

    moveRight() {
        if (this.x < this.width - 330) {
            this.x += this.speed;
            this.imageActual = this.image2;
        }
    }

    moveFront(){
        this.imageActual = this.image1;
    }


    moveLeft() {
        if (this.x > 0) {
            this.x -= this.speed;
            this.imageActual = this.image3;
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