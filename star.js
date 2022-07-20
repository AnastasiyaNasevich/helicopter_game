const STARS_SPEED = 5.1;
class Star {
    constructor() {
        this.starObject=document.createElement('div');
        this.posX=window.innerWidth;
        this.correctPosY;
        this.oldPosY;
        this.width=70;
        this.height=70;
        this.speedX=STARS_SPEED;  
        this.heightWindow;
    }
    renderStar(ball) {
        this.body=document.getElementsByTagName('body');

        this.starObject.id='star';

        var newPosY=randomDiap(0+ball.height, window.innerHeight-ball.height);
        this.correctPosY=Number.parseInt(newPosY);
        this.oldPosY=this.correctPosY;

        this.starObject.style.position='fixed';
        this.starObject.style.transform='translateZ(0) translateX('+this.posX+'px) translateY('+this.correctPosY+'px)';
        this.starObject.style.willChange='transform';
        this.starObject.style.width=this.width+'px';
        this.starObject.style.height=this.height+'px';
        this.body[0].appendChild(this.starObject);

        this.heightWindow = window.innerHeight;
    }
    updateStar() {
        this.posX-=this.speedX;
        this.starObject.style.transform='translateZ(0) translateX('+this.posX+'px) translateY('+this.correctPosY+'px)';

        if (this.posX+this.width<0) {
            this.starObject.remove();
            starObject=null;
        }
    }
    checkHeight() {
        if (this.heightWindow != window.innerHeight) {
            var difference=this.heightWindow-window.innerHeight;
            var ifLess=true;

            if (difference<0) {
                difference=difference*(-1);
                ifLess=false;
            }
            if (ifLess) {
                this.correctPosY-=difference;
                if (this.correctPosY<0) {
                    this.correctPosY=0;
                }
            } else {
                this.correctPosY+=difference;
                //высота верхнего препятствия не может быть больше первоначального значения
                if (this.correctPosY>this.oldPosY) {
                    this.correctPosY=this.oldPosY;
                }
            }

            this.starObject.style.transform='translateZ(0) translateX('+this.posX+'px) translateY('+this.correctPosY+'px)';

            this.heightWindow = window.innerHeight;
        }
    }
    setNoneVisible() {
        this.starObject.style.display='none';
    }
    removeObject() {
        this.starObject.remove();
    }
}