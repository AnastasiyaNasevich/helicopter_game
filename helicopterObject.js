const HELICOPTERS_SPEED = 5;
class Helicopter {
    constructor() {
        var helicopterElement=document.getElementById('helicopter');
        this.posX = 20;
        this.posY = window.innerHeight/5;
        this.speedY = 0;
        this.width = helicopterElement.offsetWidth;
        this.height = helicopterElement.offsetHeight;
    }
    updateHelicopter() {
        var helicopterElement=document.getElementById('helicopter');
        helicopterElement.style.left=this.posX+"px";
        helicopterElement.style.top=this.posY+"px";
    }
    newGame() {
        this.posX = 20;
        this.posY = window.innerHeight/5;
        this.speedY = HELICOPTERS_SPEED;
    }
    updateSize() {
        var helicopterElement=document.getElementById('helicopter');
        this.width = helicopterElement.offsetWidth;
        this.height = helicopterElement.offsetHeight;
    }
    setZeroSpeed() {
        this.speedY = 0;
    }
    replaceGame() {
        this.speedY = HELICOPTERS_SPEED;
    }
}