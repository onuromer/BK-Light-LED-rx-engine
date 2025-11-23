let selectedTool = ""
let color = ""
let id = ""
let userText = ""
let selectedImg = null;
function objectsPaintInit() {

    toolButton("text", () => { selectedTool = "text" }, "Smart paint")
    toolButton("rectangle", () => { selectedTool = "rectangle" }, "Smart paint")
    toolButton("image", async () => {
        selectedImg = downscaleImage(await selectImage(), 16, 16);
        selectedTool = "image"
    }, "Smart paint")

    toolInput((e) => { id = e.target.value; }, "Smart paint")
    toolInput((e) => { userText = e.target.value; }, "Smart paint")

}

function updateAttributes() {
    color = document.getElementById('colorPicker').value.slice(1, 7);
}

function pixelClicked(x, y) {
    updateAttributes()
    if (selectedTool == "line")
        rectangle(id, x, y, x, y, color)
    if (selectedTool == "text")
        text(id, userText, x, y, color)
    if (selectedTool == "image")
        image(id, selectedImg, x, y)
    render();
}
function pixelUnclicked(x, y) {

}
function pixelEnteredClicked(x, y) {
    if (selectedTool == "line")
        rectangle(id, null, null, x, y, null)
    if (selectedTool == "text")
        text(id, userText, x, y, color)
    if (selectedTool == "image")
        image(id, null, x, y)

    render();
}

async function render() {
    let pixels = []
    Object.values(shapesObjects).map(e => {
        const p = e.func(e.args)
        pixels = [...pixels.filter(oldPixel => !p.some(newPixel => newPixel.x == oldPixel.x && newPixel.y == oldPixel.y)), ...p]
    })

    Object.values(textObjects).map(e => {
        const p = e.func(e.args)
        pixels = [...pixels.filter(oldPixel => !p.some(newPixel => newPixel.x == oldPixel.x && newPixel.y == oldPixel.y)), ...p]
    })

    Object.values(imageObjects).map(e => {
        const p = e.func(e.args)
        pixels = [...pixels.filter(oldPixel => !p.some(newPixel => newPixel.x == oldPixel.x && newPixel.y == oldPixel.y)), ...p]
    })
    await updatePixels(pixels, true)
}

objectsPaintInit();