
	// polyfill
	var reqAnimationFrame = (function () {
	    return window['requestAnimationFrame'] || function (callback) {
	        window.setTimeout(callback, 1000 / 60);
	    };
	})();

	var screen = document.querySelector(".device-screen");
	var el = document.querySelector("#hitarea");
	var preventDefault = function(e){e.preventDefault();};

	var START_X = Math.round((screen.offsetWidth - el.offsetWidth) / 2);
	var START_Y = Math.round((screen.offsetHeight - el.offsetHeight) / 2);

	var ticking = false;
	var transform;
	var timer;

	el.addEventListener('tap', onTap);
	el.addEventListener('longtap', onLongTap);
	el.addEventListener('dbltap', onDoubleTap);
	el.addEventListener('swipeup', onSwipe);
	el.addEventListener('swipedown', onSwipe);
	el.addEventListener('swipeleft', onSwipe);
	el.addEventListener('swiperight', onSwipe);
	//el.addEventListener('pan', updateHtml);
	el.addEventListener('pinch', onPinch);
	el.addEventListener('rotate-clockwise', onRotate);
	el.addEventListener('rotate-anticlockwise', onRotate);
	el.addEventListener('touchmove', preventDefault);
	el.addEventListener('touchstart', preventDefault);
	el.addEventListener('touchend', preventDefault);

	// mc.on("panstart panmove", onPan);
	// mc.on("rotaelart rotatemove", onRotate);
	// mc.on("pinchstart pinchmove", onPinch);
	// mc.on("swipe", onSwipe);
	// mc.on("tap", onTap);
	// mc.on("doubletap", onDoubleTap);

	function logEvent(ev) {
	    el.innerText = ev.type;
	}

	function resetElement() {
	    el.className = 'animate';
	    transform = {
	        translate: { x: START_X, y: START_Y },
	        scale: 1,
	        angle: 0,
	        rx: 0,
	        ry: 0,
	        rz: 0
	    };
	    requestElementUpdate();
	}

	function updateElementTransform() {
	    var value = [
	        'translate3d(' + transform.translate.x + 'px, ' + transform.translate.y + 'px, 0)',
	        'scale(' + transform.scale + ', ' + transform.scale + ')',
	        'rotate3d('+ transform.rx +','+ transform.ry +','+ transform.rz +','+  transform.angle + 'deg)'
	    ];

	    value = value.join(" ");
	    el.style.webkitTransform = value;
	    el.style.mozTransform = value;
	    el.style.transform = value;
	    ticking = false;
	}

	function requestElementUpdate() {
	    if(!ticking) {
	        reqAnimationFrame(updateElementTransform);
	        ticking = true;
	    }
	}

	function onPan(ev) {
	    el.className = '';
	    transform.translate = {
	        x: START_X + ev.deltaX,
	        y: START_Y + ev.deltaY
	    };

	    logEvent(ev);
	    requestElementUpdate();
	}

	var initScale = 1;
	function onPinch(ev) {
	    initScale = transform.scale || 1;
	    el.className = '';
	    transform.scale = initScale * 0.5;

	    logEvent(ev);
	    requestElementUpdate();
	}

	var initAngle = 0;
	function onRotate(ev) {
	    initAngle = transform.angle || 0;

	    el.className = '';
	    transform.rz = 1;
	    transform.angle = initAngle + 20;

	    logEvent(ev);
	    requestElementUpdate();
	}

	function onSwipe(ev) {
	    var angle = 50;
	    transform.ry = (ev.type == 'swipeleft' || ev.type == 'swiperight') ? 1 : 0;
	    transform.rx = (ev.type == 'swipeup' || ev.type == 'swipedown') ? 1 : 0;
	    transform.angle = (ev.type == 'swiperight' || ev.type == 'swipedown') ? angle : -angle;

	    clearTimeout(timer);
	    timer = setTimeout(function () {
	        resetElement();
	    }, 300);

	    logEvent(ev);
	    requestElementUpdate();
	}

	function onTap(ev) {
	    transform.rx = 1;
	    transform.angle = 25;

	    clearTimeout(timer);
	    timer = setTimeout(function () {
	        resetElement();
	    }, 200);

	    logEvent(ev);
	    requestElementUpdate();
	}

	function onLongTap(ev) {
	    transform.rx = 1;
	    transform.angle = 55;

	    clearTimeout(timer);
	    timer = setTimeout(function () {
	        resetElement();
	    }, 200);

	    logEvent(ev);
	    requestElementUpdate();
	}

	function onDoubleTap(ev) {
	    transform.rx = 1;
	    transform.angle = 80;

	    clearTimeout(timer);
	    timer = setTimeout(function () {
	        resetElement();
	    }, 500);

	    logEvent(ev);
	    requestElementUpdate();
	}

	resetElement();

	document.querySelector(".device-button").addEventListener("click", function(){
	document.querySelector(".device").classList.toggle('hammertime');
	}, false);