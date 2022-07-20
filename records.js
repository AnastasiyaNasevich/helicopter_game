const MY_NAME='NASEVICH_HELICOPTER_GAMESss';
const AJAX_SCRIPT="https://fe.it-academy.by/AjaxStringStorage2.php";
var updatePassword;

var newRecords=[];
var thisCount;
var thisName;

//добавить отображение рекордов в DOM элементы

//когда открываем список рекордов - получаем его и вносим в таблицу
function getAllRecords() {
    let sp = new URLSearchParams();
    sp.append('f', 'READ');
    sp.append('n', MY_NAME);

    fetch(AJAX_SCRIPT, { method: 'post', body: sp })
        .then(response => response.json())
        .then(data => updateRecordsOnDOM(data))
        .catch(error => { console.error(error); });
}
//записываем рекорды в DOM
function updateRecordsOnDOM(data) {
    if (data.result != "") {
        var newArray = JSON.parse(data.result);
        console.log('newArray old: '+newArray);

        deleteOldRecords();
       
        var numberColumn=document.getElementById('numberColumn');
        var nameColumn=document.getElementById('nameColumn');
        var scoreColumn=document.getElementById('scoreColumn');

        var customnNumberLine = document.createElement('div');
        var customnNameLine = document.createElement('div');
        var customnScoreLine = document.createElement('div');
        customnNumberLine.id='customnNumberLine';
        customnNameLine.id='customnNameLine';
        customnScoreLine.id='customnScoreLine';

        for (var i=0; i<newArray.length; i++) {
            var position=i+1;
            var playersName=newArray[i].name;
            var playersCount=newArray[i].count;
            console.log(position+' '+playersName+' '+playersCount);

            var numberLine = document.createElement('div');
            var nameLine = document.createElement('div');
            var scoreLine = document.createElement('div');
            numberLine.innerHTML=position;
            nameLine.innerHTML=playersName;
            scoreLine.innerHTML=playersCount;

            customnNumberLine.appendChild(numberLine);
            customnNameLine.appendChild(nameLine);
            customnScoreLine.appendChild(scoreLine);
        }
        
        numberColumn.appendChild(customnNumberLine);
        nameColumn.appendChild(customnNameLine);
        scoreColumn.appendChild(customnScoreLine);
    }
}
function deleteOldRecords() {
    if (document.getElementById('customnNumberLine')!=null && document.getElementById('customnNameLine')!=null && document.getElementById('customnScoreLine')!=null) {
        document.getElementById('customnNumberLine').remove();
        document.getElementById('customnNameLine').remove();
        document.getElementById('customnScoreLine').remove();
    }
}

//глобавльный метод для обновления списка рекордов
function writeNewRecord(playersName, playersCounters) {

    thisCount = playersCounters;
    thisName = playersName;

    blockDataBase();
}

function blockDataBase() {
    updatePassword=Math.random();

    let sp = new URLSearchParams();
    sp.append('f', 'LOCKGET');
    sp.append('n', MY_NAME);
    sp.append('p', updatePassword);

    fetch(AJAX_SCRIPT, {method:'POST', body:sp})
        .then(response => response.json())
        .then( data => rewriteData(data))
        .catch(error => console.error(error));
}
function rewriteData(data) {
    if (data.result != "") {
        newRecords = JSON.parse(data.result);

        if (newRecords.length == 0) {
            //если массив пустой - добавляем новый элемент
            newRecords.push({name:thisName, count:thisCount});
            console.log("push");
        } else {
            //в противном случае проходимся по элементам и если старый рекорд меньше нового - 
            //помещаем на его место новый рекорд
            for (var i=0; i< newRecords.length; i++) {
                if (newRecords[i].count < thisCount) {
                    newRecords.splice(i, 0, {name:thisName, count:thisCount});
                    console.log("update");
                    break;
                }
            }
            // если длина массива с рекордами больше 4 - удаляем последний элемент
            if (newRecords.length > 4) {
                newRecords.splice(4, 1);
                console.log("delete");
            }
        }
    }
    writeData();
}
//записываем обновленный массив в базу
function writeData() {
    let sp = new URLSearchParams();
    sp.append('f', 'UPDATE');
    sp.append('n', MY_NAME);
    sp.append('p', updatePassword);
    sp.append('v', JSON.stringify(newRecords));

    fetch(AJAX_SCRIPT, { method: 'post', body: sp })
        .then(response => response.json())
        .catch(error => { console.error(error); });
}