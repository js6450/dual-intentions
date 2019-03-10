let myData;
let $entries;

let numLogs = 0;
function preload(){
    myData = loadJSON('/api');
}

function setup(){
    noCanvas();

    $entries = select("#entries");

    let currentNumLog = Object.keys(myData).length;

    for(let i = numLogs; i < currentNumLog; i++){
        let item = myData[i];
        let itemEl = myEntryEl(item);
        entries.innerHTML += itemEl;
    }
}

function myEntryEl(item){
    const myImage = `<img src="${item.image}">`;

    const dateString = moment(item.created).toDate().toString();
    return`
        <div class="log">
            <div class="log-items">${myImage}</div>
            <div class="log-times">${dateString}</div>
        </div>
    `
}

function draw(){

    if(frameCount % 60 == 0){
        myData = loadJSON('/api');
    }

    let currentNumLog = Object.keys(myData).length;

    if(currentNumLog > 0 && numLogs < currentNumLog){
        for(let i = 0; i < currentNumLog - numLogs; i++){

            console.log("numLogs", numLogs);
            console.log("currentNumLog", currentNumLog);

            let item = myData[i];
            let itemEl = myEntryEl(item);
            // console.log(itemEl)
            entries.innerHTML = itemEl + entries.innerHTML;
        }

        numLogs = currentNumLog;
    }

}