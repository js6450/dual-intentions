let camList = [];

let camTwo;
let redLayer, greenLayer, blueLayer;
let bThresh = 40;
let contrast = 35;
let bright = 30;
let offset = 50;

function setup(){
    createCanvas(windowWidth, windowHeight);

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

        camTwo = createCapture(VIDEO, {
            video: {
                width: 640,
                height: 480,
                deviceId: camList[0].deviceId
            }
        });
        camTwo.size(640, 480);
        camTwo.hide();
    });

    redLayer = createGraphics(320, 240);
    greenLayer = createGraphics(320, 240);
    blueLayer = createGraphics(320, 240);

    pixelDensity(1);

    noStroke();
}

function draw(){

    if(camTwo != null){
        // greenLayer.background(255);
        // image(camTwo, 0, 0);
        noStroke();
        camTwo.loadPixels();
        redLayer.loadPixels();
        greenLayer.loadPixels();
        blueLayer.loadPixels();

        for(i = 0; i < greenLayer.pixels.length; i++){
            redLayer.pixels[i] = 0;
            greenLayer.pixels[i] = 0;
            blueLayer.pixels[i] = 0;
        }

        for(let y = 0; y < camTwo.height; y++){
            for(let x = 0; x < camTwo.width; x++){
                let i = (camTwo.width * y + x) * 4;
                // let mappedX = map(x, 0, camTwo.width, 0, width);
                // let mappedY = map(y, 0, camTwo.height, 0, height);

                let c = color(pixels[i], pixels[i + 1], pixels[i + 2]);
                let b = brightness(c);
                if(b < bThresh){

                    redLayer.pixels[i] = bright;
                    redLayer.pixels[i + 1] = pixels[i + 1] + bright;
                    redLayer.pixels[i + 2] = pixels[i + 2] + bright;
                    redLayer.pixels[i + 3] = 150;

                    greenLayer.pixels[i] = pixels[i] + bright;
                    greenLayer.pixels[i + 1] = bright;
                    greenLayer.pixels[i + 2] = pixels[i + 2] + bright;
                    greenLayer.pixels[i + 3] = 150;

                    blueLayer.pixels[i] = pixels[i] + bright;
                    blueLayer.pixels[i + 1] = pixels[i + 1] + bright;
                    blueLayer.pixels[i + 2] = bright;
                    blueLayer.pixels[i + 3] = 150;
                }
                //
                // pixels[i] += 15;
                // pixels[i + 1] += 15;
                // pixels[i + 2] += 15;

                let factor = (259.0 * (contrast + 255.0)) / (255.0 * (259.0 - contrast));
                pixels[i] = truncateColor(factor * (pixels[i] - 128.0) + 128.0 + bright);
                pixels[i + 1] = truncateColor(factor * (pixels[i + 1] - 128.0) + 128.0 + bright);
                pixels[i + 2] = truncateColor(factor * (pixels[i + 2] - 128.0) + 128.0 + bright);

            }
        }

        redLayer.updatePixels();
        greenLayer.updatePixels();
        blueLayer.updatePixels();

        camTwo.updatePixels();

        image(camTwo, 0, 0, width, width * (240 / 320));

        if(random() > 0.001){

            let randNum = random();

            if(randNum < 0.2){
                image(redLayer, random(-offset, offset), 0, width, width * (240 / 320));
            }else if(randNum >= 0.2 && randNum < 0.4){
                image(greenLayer, random(-offset, offset), 0, width, width * (240 / 320));
            }else if(randNum >= 0.4 && randNum < 0.6){
                image(blueLayer, random(-offset, offset), 0, width, width * (240 / 320));
            }else{
                image(redLayer, random(-offset, offset), 0, width, width * (240 / 320));
                image(greenLayer, random(-offset, offset), 0, width, width * (240 / 320));
                image(blueLayer, random(-offset, offset), 0, width, width * (240 / 320));
            }
        }
    }

    if(random() > 0.02){
        let w = int(random(50, width / 4));
        let h = int(random(50, height / 4));

        let randNum = random();

        if(randNum < 0.3){
            fill(255, 255, 0, 30);
        }else if(randNum >= 0.3 && randNum < 0.6){
            fill(255, 0, 255, 30);
        }else{
            fill(0, 255, 255, 30);
        }
        rect(random(width), random(height), w, h);
    }

    for(let i = 1; i < 6; i++){
        stroke(0, 50);
        strokeWeight(2);
        line(0, noise(frameCount * 0.01 * i) * height, width, noise(frameCount * 0.01 * i) * height);
    }

    for(let i = 0; i < 50; i++){
        let x = int(random(width));
        let y = int(random(height));

        let color = noise(x, y);

        fill(color, 50);
        rect(x, y, 5, 2);
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