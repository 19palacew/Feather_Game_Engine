
let deltaTime = 0;
let then = 0;

var counter = 0;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

requestAnimationFrame(render);

function render(now) {
    now *= 0.001;
    deltaTime = now - then;
    then = now;
    // But when will then be now?
    // Soon
    clearScene();
    drawScene();

    requestAnimationFrame(render);
}

function drawScene(){
    counter += deltaTime*20;
    ctx.fillRect(counter, 25, 100, 100);
}

function clearScene(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}