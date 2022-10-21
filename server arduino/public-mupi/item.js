class Item {
    
    constructor(x, y, image, width, high, type){
        this.x = x;
        this.y = y;
        this.image = image;
        this.width = width;
        this.high = high;
        this.type = type;
        this.speed = 3;
        this.contact = false;
    }

    show(){
        image(this.image, this.x, this.y);
    }

    move(){
        this.y += this.speed;
    }


    near(pjX, pjY){
       return this.x > pjX && this.x < pjX + 180 && this.y >= pjY && this.y <= pjY + 407; 
    }

    getType(){
        return this.type;
    }
}