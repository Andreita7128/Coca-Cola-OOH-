class Button {
    constructor(x, y, image) {
        this.x = x;
        this.y = y;
        this.image = image;
        this.size = 60;
    }

    show() {
        imageMode(CENTER);
        image(this.image, this.x, this.y);
        imageMode(CORNER);
    }

    show2() {
        image(this.image, this.x, this.y);
    }

    click() {
        return dist(this.x, this.y, mouseX, mouseY) < this.size / 2
    }

    click2(b, h) {
        return mouseX > this.x && mouseX < (this.x + b) && mouseY > this.y && mouseY < (this.y + h);
    }
}