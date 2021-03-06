let camList = [];

let cam;

let blackLineIndex = 0;

var mystream;

var peer_id = null;

// Register for an API Key:	http://peerjs.com/peerserver
//var peer = new Peer({key: 'YOUR API KEY'});
// The Peer Cloud Server doesn't seem to be operational, I setup a server on a Digital Ocean instance for our use, you can use that with the following constructor:
var peer = new Peer({host: 'liveweb-new.itp.io', port: 9000, path: '/'});


function setup(){
    let cvs = createCanvas(windowWidth * 0.48, windowWidth * 0.48 * 0.695).parent('#cameraTwo');
    cvs.id('camTwo');

    navigator.mediaDevices.enumerateDevices().then(function(devices){
        console.log(devices);


        for(device in devices){
            //console.log(device);
            if(devices[device].kind == "videoinput"){
                camList.push(devices[device]);
            }
        }
    }).then(function(){

        console.log('add cameras');

        cam = createCapture({
            video: {
                width: 640,
                height: 480,
                deviceId: camList[1].deviceId
            }
        }, captureCallback);
        cam.size(640, 480);
        cam.hide();
    });

    pixelDensity(1);

    noStroke();
}


function draw(){

    if(frameCount % 2 == 0){
        blackLineIndex++;

        if(blackLineIndex > 4){
            blackLineIndex = 0;
        }
    }

    if(cam != null){

        cam.loadPixels();

       for(let y = 0; y < cam.height; y++){
            for(let x = 0; x < cam.width; x++){
                let i = (cam.width * y + x) * 4;

                if(y % 5 == blackLineIndex){
                    pixels[i] = 0;
                    pixels[i + 1] = 0;
                    pixels[i + 2] = 0;
                }
                else{
                    let gray = 0.2126 * pixels[i] + 0.7152 * pixels[i + 1] + 0.0722 * pixels[i + 2];
                    let randomPix = int(random(-100, 100));
                    pixels[i - randomPix] = pixels[i - randomPix - 1] = pixels[i - randomPix - 2] = gray;
                }
            }

       }

        cam.updatePixels();

        image(cam, 0, 0, width, width * (240 / 320));

    }


    let date = "" + Date();

    textFont('Courier');
    textSize(12);
    fill(255);
    stroke(0);
    text(date, width - textWidth(date) - 25, 30);

}

function truncateColor(value) {
    if (value < 0) {
        value = 0;
    } else if (value > 255) {
        value = 255;
    }
    return value;
}

let streamObject = null;

function captureCallback(s){
    streamObject = s;
}

function keyPressed(){
    if(key == 1){
        console.log('sending stream object');
        initwebrtc(streamObject);
    }
}

// Get an ID from the PeerJS server
peer.on('open', function(id) {
    console.log('My peer ID is: ' + id);
    peer_id = id;
});

peer.on('error', function(err) {
    console.log(err);
});

function initwebrtc(stream) {
    mystream = stream;
    print("Calling watcher");
    var call = peer.call("dual-watcher", mystream);
    call.on('stream', function(remoteStream) {
        print("Got a response");
        // Don't do anything
    });

}

peer.on('call', function(incoming_call) {
    console.log("Got a call!");
    incoming_call.answer(mystream); // Answer the call with our stream from getUserMedia
    incoming_call.on('stream', function(remoteStream) {  // we receive a getUserMedia stream from the remote caller
        // Don't do anything
    });
});

function sendStreamObject(){
    const options = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            // "Content-Type": "application/x-www-form-urlencoded",
        },
        body: JSON.stringify(streamObject)
    }
    fetch(`/stream`, options).then(result => {
        console.log('stream object success');
    })
}



