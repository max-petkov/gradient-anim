const canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");


// drawRect();
// drawLine();
drawCircle();

function drawRect() {
    ctx.fillStyle = "red";
    ctx.fillRect(100, 300, 150, 150);
    ctx.fillStyle = "green";
    ctx.fillRect(300, 100, 150, 150);
    ctx.fillStyle = "blue";
    ctx.fillRect(150, 250, 150, 150);
}

function drawLine() {
    ctx.beginPath();
    ctx.moveTo(50, 300);
    ctx.lineTo(300, 100);
    ctx.strokeStyle = "red";
    ctx.stroke()
}

function drawCircle() {
    //Need to add resize event
    
    const rMax = 300;
    const rMin = 150;
    const minViewWidth = 480;
    const maxViewWidth = 1920;
    const fluidSize = () => rMin + (((window.innerWidth / 100) - (minViewWidth / 100)) * (100 * (rMax - rMin) / (maxViewWidth - minViewWidth)));
    
    const r = clamp(fluidSize(), rMin, rMax);

    ctx.beginPath();
    ctx.arc(r, r , r, 0, Math.PI * 2, false);
    ctx.fillStyle = fillGradient();
    ctx.fill()

    function fillGradient() {
        const gradient = ctx.createConicGradient(0, r, r);
        gradient.addColorStop(0.10875, "#DBFF1D");    
        gradient.addColorStop(0.328125, "#FE7DC2");
        gradient.addColorStop(0.4875, "#FE7DC2");     
        gradient.addColorStop(0.82292, "#FFA50E");

        return gradient;
    }
}

function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
}