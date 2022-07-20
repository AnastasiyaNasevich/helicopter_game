const ROCKS_SPEED = 5.1;
class Rock{
    constructor() {
        this.topPosX = window.innerWidth;
        this.bottomPosX = window.innerWidth;
        this.topPosY = 0;
        this.speedX = ROCKS_SPEED;
        this.width = 60;

        this.topHeight;
        this.oldTopHeight;
        this.bottomPosY;
        this.heightWindow;
        this.topHeight;
        this.indent;
    }

    renderRock(helicopter) {
        this.svgBody=document.getElementById('svgBody');

        this.wallTop=document.createElementNS("http://www.w3.org/2000/svg",'rect');
        this.wallBottom=document.createElementNS("http://www.w3.org/2000/svg",'rect');

        var indent = helicopter.height*4; //высота отступа
        this.indent = indent; 

        var heightWindow = window.innerHeight;
        var topHeightNew = randomDiap(helicopter.height, heightWindow-(indent+helicopter.height));
        this.heightWindow = heightWindow;
        this.topHeight = topHeightNew;
        this.oldTopHeight = topHeightNew;

        this.wallTop.setAttribute('width', this.width);
        this.wallTop.setAttribute('height', topHeightNew);
        this.wallTop.style.transform='translateX('+this.topPosX+'px)translateY('+this.topPosY+'px)';
        this.wallTop.setAttribute('fill', 'url(#TRP1)');

        var topPosBottom = topHeightNew+indent;
        this.bottomPosY=topPosBottom;
        var newHeightBottom = heightWindow-this.bottomPosY;

        this.wallBottom.setAttribute('width', this.width);
        this.wallBottom.setAttribute('height', newHeightBottom);
        this.wallBottom.style.transform='translateX('+this.bottomPosX+'px)translateY('+this.bottomPosY+'px)';
        this.wallBottom.setAttribute('fill', 'url(#TRP1)');

        this.svgBody.appendChild(this.wallTop);
        this.svgBody.appendChild(this.wallBottom);
    }

    updateRock(index) {
        this.topPosX-=this.speedX;
        this.bottomPosX-=this.speedX;
        this.wallTop.style.transform='translateX('+this.topPosX+'px)translateY('+this.topPosY+'px)';
        this.wallBottom.style.transform='translateX('+this.bottomPosX+'px)translateY('+this.bottomPosY+'px)';

        if (this.topPosX+this.width<0) {
            this.wallTop.remove();
            this.wallBottom.remove();
            //повышаем счетчик пройденных препятствий
            updateCounter();
        }
    }
    //пересчитываем новую высоту препятствий
    checkHeight(helicopter) {
        if (this.heightWindow != window.innerHeight) {
            var difference=this.heightWindow-window.innerHeight;
            var ifLess=true;
            //разница между старым значением окна и новым
            if (difference<0) {
                difference=difference*(-1);
                ifLess=false;
            }
            if (ifLess) {
                this.topHeight-=difference;
                if (this.topHeight<helicopter.height) {
                    this.topHeight=helicopter.height;
                }
            } else {
                this.topHeight+=difference;
                //высота верхнего препятствия не может быть больше первоначального значения
                if (this.topHeight>this.oldTopHeight) {
                    this.topHeight=this.oldTopHeight;
                }
            }
            this.wallTop.setAttribute('height', this.topHeight);

            var indent = helicopter.height*4; //высота отступа
            this.indent = indent; 

            var topPosBottom = this.topHeight+indent;
            this.bottomPosY=topPosBottom;
            var newHeightBottom = window.innerHeight-this.bottomPosY;

            this.wallBottom.setAttribute('height', newHeightBottom);
            this.wallBottom.style.transform='translateX('+this.bottomPosX+'px)translateY('+this.bottomPosY+'px)';

            this.heightWindow = window.innerHeight;
        }
    }
    removeItems() {
        this.wallTop.remove();
        this.wallBottom.remove();
    }
}