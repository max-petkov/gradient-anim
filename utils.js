function clamp(val, min, max) {
	return Math.min(Math.max(val, min), max);
}

function onResize(cb) {
	let w = window.innerWidth;
	let h = window.innerHeight;

	window.addEventListener("resize", function() {
		if(w !== window.innerWidth || h !== window.innerHeight ) {
			w = window.innerWidth;
			h = window.innerHeight;
			cb();
		}
	})
}

function animate(cb) {
    requestAnimationFrame(function() { animate(cb)});
    cb();
}