let imageObjects = {}

async function loadImage(source) {
    if (typeof source === "string") {
        const res = await fetch(source);
        source = await res.blob();
    }

    return await createImageBitmap(source);
}

function downscaleImage(imageBitmap, targetWidth, targetHeight) {
    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext("2d");

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(imageBitmap, 0, 0, targetWidth, targetHeight);

    const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);

    return {
        width: targetWidth,
        height: targetHeight,
        pixels: imageData.data
    };
}

function image(id, image, x, y) {
    const prev = imageObjects[id]
    imageObjects[id] = {
        func: getImagePixels, args: { image: image ?? prev?.args.image, x: x ?? prev?.args.x, y: y ?? prev?.args.y }
    }
}

function getImagePixels({ image, x = 0, y = 0 }) {
    const { width, height, pixels } = image;
    const out = [];

    for (let yy = 0; yy < height; yy++) {
        for (let xx = 0; xx < width; xx++) {

            const i = (yy * width + xx) * 4;

            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];

            const hex =
                r.toString(16).padStart(2, "0") +
                g.toString(16).padStart(2, "0") +
                b.toString(16).padStart(2, "0");

            out.push({
                x: x + xx,
                y: y + yy,
                color: hex
            });
        }
    }

    return out;
}

function selectImage() {
    return new Promise((resolve) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = async () => resolve(await createImageBitmap(input.files[0]));
        input.click();
    });
}