function Canvas() {
  this.canvas = document.querySelector("canvas");
  this.ctx = this.canvas.getContext("2d");
  this.animation = null;
}

Canvas.prototype.setSize = function () {
	let w = window.innerWidth;
	let h = window.innerHeight;

	this.canvas.width = w;
	this.canvas.height = h;
};

Canvas.prototype.animate = function(cb) {
	cb();
	this.animation = requestAnimationFrame(() => this.animate(cb));
}

Canvas.prototype.resumeAnimation = this.animate;

Canvas.prototype.stopAnimation = function() {
	cancelAnimationFrame(this.animation);
	this.animation = null;
}

function Circle(canvas, config) {
	this.canvas = canvas;
	this.rMax = !config.rMax ? 300 : config.rMax;
	this.rMin = !config.rMin ? 100 : config.rMin;
	this.minViewWidth = !config.minViewWidth ? 768 : config.minViewWidth;
	this.maxViewWidth = !config.maxViewWidth ? 1920 : config.maxViewWidth;
	this.mass = 1;

	this.fluid = () => this.rMin + (((window.innerWidth / 100) - (this.minViewWidth / 100)) * (100 * (this.rMax - this.rMin) / (this.maxViewWidth - this.minViewWidth)));
	this.r = clamp(this.fluid(), this.rMin, this.rMax);
	this.x = !config.x ? this.r : config.x - this.r;
	this.y = !config.y ? this.r : config.y - this.r;
	this.rot = 0;
	this.velocity = {x: 0.5, y: 0.5, rot: 0.005}
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
		this.velocity.x = -this.velocity.x;
		this.velocity.rot = -this.velocity.rot;
	}
	if(this.y > (window.innerHeight - this.r) || this.y < this.r ) {
		this.velocity.y = -this.velocity.y;
		this.velocity.rot = -this.velocity.rot;
	}

	this.x += this.velocity.x;
	this.y += this.velocity.y;
	this.rot += this.velocity.rot;

	this.draw();
}

Circle.prototype.collide = function(circ) {
	const dx = this.x - circ.x;
	const dy = this.y - circ.y;

	const distance = Math.hypot(dx, dy);
	const sumRadius = this.r + circ.r; 

	if(distance < sumRadius) return resolveCollision(this, circ);
}

const canvas = new Canvas();
const circle1 = new Circle(canvas, {});
const circle2 = new Circle(canvas, {x: window.innerWidth, y: window.innerHeight - 80});

canvas.setSize();
circle1.draw();
circle2.draw();

canvas.animate(function() {
	canvas.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
	circle1.move();
	circle1.collide(circle2);
	
	circle2.move();
	circle2.collide(circle1);
});


onResize(function() {
	canvas.setSize();
	canvas.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

	circle1.x = circle1.r;
	circle1.y = circle1.r;

	circle2.x = window.innerWidth - circle2.r;
	circle2.y = window.innerHeight - circle2.r - 80;
});

// Collision Function -> https://gist.github.com/christopher4lis/f9ccb589ee8ecf751481f05a8e59b1dc

function rotate(velocity, angle) {
    const rotatedVelocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };

    return rotatedVelocities;
}

function resolveCollision(particle, otherParticle) {
    const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
    const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

    const xDist = otherParticle.x - particle.x;
    const yDist = otherParticle.y - particle.y;

    // Prevent accidental overlap of particles
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

        // Grab angle between the two colliding particles
        const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

        // Store mass in var for better readability in collision equation
        const m1 = particle.mass;
        const m2 = otherParticle.mass;

        // Velocity before equation
        const u1 = rotate(particle.velocity, angle);
        const u2 = rotate(otherParticle.velocity, angle);

        // Velocity after 1d collision equation
        const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
        const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

        // Final velocity after rotating axis back to original location
        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);

        // Swap particle velocities for realistic bounce effect
        particle.velocity.x = vFinal1.x;
        particle.velocity.y = vFinal1.y;

        otherParticle.velocity.x = vFinal2.x;
        otherParticle.velocity.y = vFinal2.y;
    }
}