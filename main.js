"use strict";

const STATUS_FIRST_START = 0;
const STATUS_START = 1;
const STATUS_PAUSE = 2;
const STATUR_END_GAME = 3;
const STATUS_REPLACE = 4;

const PROGRESS_OIL=100;
const START_COUNTER=0;
const MIN_DISTANCE_BETWEEN_ROCK=500;
const SPEED_OIL=0.1;

var menuBlock=document.getElementById('nav');
var iconPlayOrPauseButton=document.getElementById('pause');
var topMenuBlock=document.getElementById('score');
topMenuBlock.style.display='none';
var textEndGame=document.getElementById('textGameOver');
var textValueResult=document.getElementById('result1');

var progressBar=document.getElementById('progressParent');
var progressStatus=document.getElementById('progressStatus');
var progressOil;

var startButton=document.getElementById('startButton');
var gameStatus=STATUS_FIRST_START;

var arrObjects=[];
var wall;

var starObject=null;

var blockWithPlayersName=document.getElementById('UserName');
var playersName;
var blockWithCount=document.getElementById('valueCount');
var rocksNumber=START_COUNTER;

var ifTouchDown=false;

var audioBackground = new Audio();
var ifMusicStarted=false;

var ifGameWithMusic=true;
var ifGameWithVibration=true;
var checkboxMusic=document.getElementById('music');
var checkboxVibration=document.getElementById('Vibration');
checkboxMusic.addEventListener("change", ()=>setFlagForMusic(checkboxMusic));
checkboxVibration.addEventListener("change", ()=>setFlagForVibration(checkboxVibration));

var bodyImage=document.getElementsByTagName('body');
var x=0;

var helicopterObject = new Helicopter();

window.onhashchange=switchToStateFromURLHash;
var SPAState = {};

var mainMenu=document.getElementById('main');
var rulesMenu=document.getElementById('rules');
var recordsMenu=document.getElementById('statistic');

function logicGorRulesButton() {
    mainMenu.style.display='none';
    rulesMenu.style.display='block';
}
function logicGorRecordsButton() {
    getAllRecords();
    mainMenu.style.display='none';
    recordsMenu.style.display='block';
}
function closeRules(){
    rulesMenu.style.display='none';
    mainMenu.style.display='flex';
}
function closeRecords(){
    recordsMenu.style.display='none';
    mainMenu.style.display='flex';
}

var keyOrMouse=0;   // 0 - дефолтное значение, 1 - нажата клавиатура и блокируем нажатие мыши, 2 - нажата мышь и блокируем нажатие клавиатуры

if("ontouchstart" in window)
    {
        addEventListener('touchstart', listenerIfTouchDown);
    }
else
    {
        addEventListener('keydown', listenerIfPressDown);
        addEventListener('mousedown', listenerIfMouseDown);
    }

var hel = document.getElementById('helicopter');

if("ontouchstart" in window)
    {
        addEventListener('touchend', listenerIfTouchUp);
    }
else
    {
        addEventListener('keyup', clearKeyCounter);
        addEventListener('mouseup', clearMouseCounter);
    }
    
//защита от обновления и закрытия страницы во время игры
window.addEventListener('beforeunload', befUnload);
var errorText = "Данные не сохранены, Вы можете их потерять!";
function befUnload(EO) {
    EO=EO || window.event;
    if (location.hash === '#play' && (gameStatus==STATUS_START || gameStatus==STATUS_PAUSE || gameStatus==STATUS_REPLACE)) {
        EO.returnValue=errorText;
    }
}

function autoplayBackgroundAudio() {
    if (ifGameWithMusic && !ifMusicStarted) {
        audioBackground.src = "siniy_traktor_raketa.mp3";
        audioBackground.preload = 'auto';
        audioBackground.loop='true';
        audioBackground.play();
        ifMusicStarted=true;
    }
}

//анимация меню главного
function start() {
    menuBlock.style.transform="translateZ(0) translateX(0%) translateY(-150%)";
}
//обработчик начала игры
function startGame() {
    start();
    setTimeout(function() {
        menuBlock.style.display='none';
        topMenuBlock.style.display='block';
        gameStatus = STATUS_START;
        updateGamesStatus(gameStatus);
        
        var stateStr='play';
        location.hash=stateStr;

        autoplayBackgroundAudio();
    }, 500);
}
function updateGamesStatus(status) {
    switch(status) {
        case STATUS_START:
            setStartParamerets();
            createRock();
            helicopterObject.newGame();
            iconPlayOrPauseButton.src='buttons.svg#pause';
            blockWithCount.innerHTML=rocksNumber;
            playersName = blockWithPlayersName.value;
            break;
        case STATUS_PAUSE:
            setZeroSpeed();
            iconPlayOrPauseButton.src='buttons.svg#play';
            break;
        case STATUR_END_GAME:
            setZeroSpeed();
            writeNewRecord(playersName, rocksNumber);

            menuBlock.style.display='block';
            menuBlock.style.transitionDuration='1s';
            menuBlock.style.transform="translateZ(0) translateX(0%) translateY(0%)";

            topMenuBlock.style.display='none';
            textEndGame.style.display='block';
            textValueResult.style.display='block';
            textValueResult.innerHTML="Ваш результат: "+rocksNumber;

            location.hash='menu';
            break;
        case STATUS_REPLACE: 
            replaceGame();
            iconPlayOrPauseButton.src='buttons.svg#pause';
            break;
    }
}

//обработчик таймера
function tick() {

    if (helicopterObject.speedY != 0) {
        logicForHelicopter();

        startAnimation();
        //движение для колонн
        for (var i=rocksNumber; i<arrObjects.length; i++) {
            arrObjects[i].updateRock(i);
        }
        //проверка на соприкосновение с первыми колоннами
        if(arrObjects.length>=rocksNumber+1) {
            checkCollision(arrObjects[rocksNumber]);
        }
        //создаем новые колонны, если отступ последних колонн от края экрана больше MIN_DISTANCE_BETWEEN_ROCK
        if ((window.innerWidth - (arrObjects[arrObjects.length-1].topPosX+arrObjects[arrObjects.length-1].width) > MIN_DISTANCE_BETWEEN_ROCK) || 
        ((arrObjects[arrObjects.length-1].topPosX+arrObjects[arrObjects.length-1].width) < 0) ) {
            createRock();
        }
        //создаем звезду, если ее нет
        if (starObject==null &&
            (Number.parseInt(window.innerWidth-(arrObjects[arrObjects.length-1].topPosX)) >= MIN_DISTANCE_BETWEEN_ROCK/2-50) &&
            (Number.parseInt(window.innerWidth-(arrObjects[arrObjects.length-1].topPosX)) <= MIN_DISTANCE_BETWEEN_ROCK/2+50) ) {

                starObject = new Star();
                starObject.renderStar(helicopterObject);
        }
        //если здезда есть на экране, перемещаем и проверяем на соприкосновение с вертолетиком
        if (starObject != null) {
            checkCollisionWithStar(starObject);
            starObject.updateStar();
        }

        progressOil-=SPEED_OIL;   //скорость уменьшения топлива за процесс
        startProgress(progressOil);

        //смещение фона
        x-=5;
        bodyImage[0].style.backgroundPosition=x+'px 0px';    
    }
    //адаптируем высоту колонн под новую высоту экрана
    for (var i=rocksNumber; i<arrObjects.length; i++) {
        arrObjects[i].checkHeight(helicopterObject);
    }
    if (starObject != null) {
        starObject.checkHeight();
    }
    helicopterObject.updateSize();
    requestAnimationFrame(tick);
}

requestAnimationFrame(tick);

function clearElemFromArr(index) {
    arrObjects.splice(index, 1, 1);
}

function createRock() {
    var rock = new Rock();
    rock.renderRock(helicopterObject);
    arrObjects.push(rock);
}

function logicForHelicopter() {
    if(ifTouchDown) {
        helicopterObject.posY-=helicopterObject.speedY;
    } else {
        helicopterObject.posY+=helicopterObject.speedY;
    }

    if (helicopterObject.posY+helicopterObject.height>window.innerHeight) {
        helicopterObject.posY=window.innerHeight-helicopterObject.height;
        gameStatus=STATUR_END_GAME;
        updateGamesStatus(gameStatus);
    }
    if (helicopterObject.posY<0) {
        helicopterObject.posY=0;
        gameStatus=STATUR_END_GAME;
        updateGamesStatus(gameStatus);
    }
    helicopterObject.updateHelicopter();
}
//проверка на соприкосновение со столбиками
function checkCollision(rock) {
    if (helicopterObject.posX+helicopterObject.width>=rock.topPosX && helicopterObject.posX<rock.topPosX+rock.width) {
        if (helicopterObject.posY>rock.topHeight&& 
            (helicopterObject.posY+helicopterObject.height)<rock.bottomPosY) {
                //если нет соприкосновение - продолжаем игру
            } 
        else {
            //если есть соприкосновение - воспроизводим вибрацию, музыку и устанавливаем статус "конец игры"
            if (ifGameWithVibration) {
                window.navigator.vibrate(200);
            }

            if (ifGameWithMusic) {
                var audio = new Audio();
                audio.src = "test_audio.mp3";
                audio.preload = 'auto';
                audio.play();
            }

            gameStatus=STATUR_END_GAME;
            updateGamesStatus(gameStatus);
        }
    }
}

function updateCounter() {
    rocksNumber++;
    blockWithCount.innerHTML="";
    blockWithCount.innerHTML=rocksNumber;
}

function checkCollisionWithStar(star) {
    if (helicopterObject.posX+helicopterObject.width>=star.posX && helicopterObject.posX<star.posX+star.width) {
        if ( (helicopterObject.posY<=(star.correctPosY+star.height) && helicopterObject.posY>=star.correctPosY) || 
             (helicopterObject.posY+helicopterObject.height)<=(star.correctPosY+star.height) && (helicopterObject.posY+helicopterObject.height) >=star.correctPosY  
            ) {
                star.setNoneVisible();
                progressOil=100;
            }
    }
}

function listenerIfPressDown(EO) {
    if (gameStatus==STATUS_START || gameStatus==STATUS_REPLACE) {
        switch(EO.key) {
            case "ArrowUp":
                if (progressOil>0  && keyOrMouse==0) {
                    ifTouchDown=true;
                    keyOrMouse=1;
                }
                break;
        }
    }
}
function listenerIfMouseDown() {
    if (progressOil>0 && keyOrMouse==0) {
        ifTouchDown=true;
        keyOrMouse=2;
    }
}
function listenerIfTouchDown() {
    if (progressOil>0) {
        ifTouchDown=true;
    }
}

function clearKeyCounter(EO) {
    switch(EO.key) {
        case "ArrowUp":
            if (keyOrMouse==1) {
                ifTouchDown=false;
                keyOrMouse=0;
            }
            break;
    }
}
function clearMouseCounter() {
    if (keyOrMouse==2) {
        ifTouchDown=false;
        keyOrMouse=0;
    }
}
function listenerIfTouchUp() {
    ifTouchDown=false;
}

//очищаем все объекты, если есть на экране
function setStartParamerets() {
    helicopterObject.newGame();

    for(var i=0; i<arrObjects.length; i++) {
        arrObjects[i].removeItems();
    }
    arrObjects.length=0;

    if (starObject != null) {
        starObject.removeObject();
    }
    starObject = null;

    progressOil=PROGRESS_OIL;
    rocksNumber=START_COUNTER;
}
//устанавлдиваем для всех объектов нулевую скорость
function setZeroSpeed() {
    helicopterObject.setZeroSpeed();
}
//возобновляем игру после паузы, возвращаем скорость объектам
function replaceGame() {
    helicopterObject.replaceGame();
}
//обработчик кнопки в самой игре
function pauseOrStart() {
    switch(gameStatus) {
        case STATUS_START:
        case STATUS_REPLACE:
            gameStatus=STATUS_PAUSE;
            break;
        case STATUS_PAUSE:
            gameStatus=STATUS_REPLACE;
            break;
    }
    updateGamesStatus(gameStatus);
}

function startProgress(progress) {
    progressStatus.style.width=progress+'%';
}

var startWidth=75;
var startX=50;
var tickPlus=false;
var degrees=0;

//анимация вертолетика
function startAnimation() {
    var SVGHelicopterObject = document.getElementById('myHelicopter');
    var SVGDocument = SVGHelicopterObject.contentDocument;

    var objBack = SVGDocument.getElementById('blade');
    degrees+=10;
    objBack.setAttribute('transform',`rotate(${degrees} 28 65)`)

    var obj1 = SVGDocument.getElementById('svg_11');
    var obj2 = SVGDocument.getElementById('svg_5');

    if (startWidth==75 && startX==50){
        tickPlus=false;
    }
    if (startWidth==15 && startX==110) {
        tickPlus=true;
    }

    if (!tickPlus) {
        startWidth-=1;
        startX+=1;
    } else {
        startWidth+=1;
        startX-=1;
    }

    obj1.setAttribute('width', startWidth);
    obj1.setAttribute('x', startX);
    obj2.setAttribute('width', startWidth);
}

function setFlagForMusic(checkboxElementMusic) {
    if (checkboxElementMusic.checked) {
        ifGameWithMusic=true;
    } else {
        ifGameWithMusic=false;
        //сбрасываем параметры для фоновой музыки
        audioBackground.pause();
        audioBackground.currentTime = 0;
        ifMusicStarted=false;
    }
}
function setFlagForVibration(checkboxElementVibration) {
    if (checkboxElementVibration.checked) {
        ifGameWithVibration=true;
    } else {
        ifGameWithVibration=false;
    }
}

function randomDiap(n,m) {
    return Math.floor(Math.random()*(m-n))+n;
}

function switchToStateFromURLHash() {
    var URLHash=window.location.hash;
  
    var stateStr=URLHash.substr(1);

    if ( stateStr!="" ) {
        var parts=stateStr.split("_")
        SPAState={ pagename: parts[0] };
    }
    else {
        SPAState={pagename:'menu'};
        location.hash='menu';
    }

    switch ( SPAState.pagename ) {
        case 'menu':
            closeRules();
            closeRecords();
            if (gameStatus!=STATUR_END_GAME && gameStatus!=STATUS_FIRST_START) {
                if (!(confirm('Данные будут утеряны'))) {
                    location.hash='play';
                } else {
                    gameStatus=STATUR_END_GAME;
                    updateGamesStatus(gameStatus);
                }
            }
            break;
        case 'rules':
            logicGorRulesButton();
            break;
        case 'statistic':
            logicGorRecordsButton();
            break;
        case 'play':
            if (gameStatus!=STATUS_REPLACE && gameStatus!=STATUS_START && gameStatus!=STATUS_PAUSE) {
                startGame();
            }
            break;
        default:
            location.hash='menu';
            break;
    }
}
switchToStateFromURLHash();
helicopterObject.updateHelicopter();