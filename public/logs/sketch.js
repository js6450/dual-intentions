console.log("hello from logs")

let myData;
let $entries;
function preload(){
    myData = loadJSON('/api');
}

function setup(){
    noCanvas();
    noLoop();

    $entries = select("#entries");
    // console.log(myData);
}

function myEntryEl(item){
    const myImage = `<img src="${item.image}">`;
    // const lat = nfc(item.location.lat, 4)
    // const lon = nfc(item.location.lon, 4)
    const dateString = moment(item.created).toDate().toString();
    return`
        <div class="log">
            <div class="log-items">${myImage}</div>
            <div class="log-times">${dateString}</div>
        </div>
    `
}

function draw(){

    for(p in myData){
        let item = myData[p];
        let itemEl = myEntryEl(item);
        // console.log(itemEl)
        entries.innerHTML += itemEl
    }

}