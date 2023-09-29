function Canvas() {
  this.canvas = document.querySelector("canvas");
  this.ctx = this.canvas.getContext("2d");
}

Canvas.prototype.setSize = function () {
	let w = window.innerWidth;
	let h = window.innerHeight;

	this.canvas.width = w;
	this.canvas.height = h;
};

function Circle(canvas, config) {
	this.canvas = canvas;
	this.rMax = !config.rMax ? 300 : config.rMax;
	this.rMin = !config.rMin ? 100 : config.rMin;
	this.minViewWidth = !config.minViewWidth ? 768 : config.minViewWidth;
	this.maxViewWidth = !config.maxViewWidth ? 1920 : config.maxViewWidth;

	this.fluid = () => this.rMin + (((window.innerWidth / 100) - (this.minViewWidth / 100)) * (100 * (this.rMax - this.rMin) / (this.maxViewWidth - this.minViewWidth)));
	this.r = clamp(this.fluid(), this.rMin, this.rMax);
	this.x = !config.x ? this.r : config.x - this.r;
	this.y = !config.y ? this.r : config.y - this.r;
	this.rot = 0;
	this.dx = 0.5;
	this.dy = 0.5;
	this.dRot = 0.005;
}

Circle.prototype.draw = function() {
		this.r = clamp(this.fluid(), this.rMin, this.rMax);
		const gradient = this.canvas.ctx.createConicGradient(this.rot, this.x, this.y);

		gradient.addColorStop(0.10875, "#DBFF1D");    
		gradient.addColorStop(0.328125, "#FE7DC2");
		gradient.addColorStop(0.4875, "#FE7DC2");     
		gradient.addColorStop(0.82292, "#FFA50E");

		this.canvas.ctx.beginPath();
		this.canvas.ctx.arc(this.x, this.y , this.r, 0, Math.PI * 2, false);
		this.canvas.ctx.fillStyle = gradient;
		this.canvas.ctx.fill();
}

Circle.prototype.move = function() {

	if(this.x > (window.innerWidth - this.r) || this.x < this.r ) {
		this.dx = -this.dx;
		this.dRot = -this.dRot;
	}
	if(this.y > (window.innerHeight - this.r) || this.y < this.r ) {
		this.dy = -this.dy;
		this.dRot = -this.dRot;
	}

	this.x += this.dx;
	this.y += this.dy;
	this.rot += this.dRot;

	this.draw();
}

const canvas = new Canvas();
const circle1 = new Circle(canvas, {});
const circle2 = new Circle(canvas, {x: window.innerWidth, y: window.innerHeight - 80});

canvas.setSize();

circle1.draw();
circle2.draw();

animate(function() {
	canvas.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
	circle1.move();
	circle2.move();
})

onResize(function() {
	canvas.setSize();
	canvas.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
	circle1.move();
});