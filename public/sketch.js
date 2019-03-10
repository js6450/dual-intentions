let videoInput;
let cropped;

let leftX, leftY, rightX, rightY;
let rectWidth, rectHeight, yMin;

let mappedX, mappedY, mappedI;

function setup(){

    console.log('setting up hidden layer');

    createCanvas(160, 120).parent("#mySketch");

    videoInput = createCapture(VIDEO);
    videoInput.hide();
    videoInput.size(width, height);

    ctracker = new clm.tracker();
    ctracker.init(pModel);
    ctracker.start(videoInput.elt);

    fill(255);

    cropped = createGraphics(width, height);

    pixelDensity(1);
    cropped.pixelDensity(1);
}

function handleSubmit(){
    let output = {
        image: ''
    };

    const last_img = get()
    output.image = last_img.canvas.toDataURL()

    console.log(last_img)

    const options = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            // "Content-Type": "application/x-www-form-urlencoded",
        },
        body: JSON.stringify(output)
    }
    fetch(`/api`, options).then(result => {
        console.log('success')
    })
}

function draw(){

    cropped.background(0);

    positions = ctracker.getCurrentPosition();

    if (positions[1] != null) {

        leftX = int(positions[1][0]);
        leftY = int(positions[1][1]);
        rightX = int(positions[13][0]);
        rightY = int(positions[13][1]);

        rectWidth = int(rightX - leftX);
        rectHeight = rectWidth;
        yMin = int((leftY + rightY) / 2 - rectHeight / 2);

        videoInput.loadPixels();

        cropped.loadPixels();

        for(let y = 0; y < cropped.height; y++){
            for(let x = 0; x < cropped.width; x++){

                let i = ((y * cropped.width) + x) * 4;

                mappedX = map(x, 0, width, leftX, rightX);
                mappedY = map(y, 0, height, yMin, yMin + rectHeight);

                mappedI = ((int(mappedY) * videoInput.width) + int(mappedX)) * 4;

                cropped.pixels[i] = pixels[mappedI];
                cropped.pixels[i + 1] = pixels[mappedI + 1];
                cropped.pixels[i + 2] = pixels[mappedI + 2];
                cropped.pixels[i + 3] = 255;

            }
        }

        cropped.updatePixels();

        image(cropped, 0, 0);

        if(frameCount % 15 == 0){
            handleSubmit();
        }
    }
}