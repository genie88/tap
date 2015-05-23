(function (doc, win) {
    'use strict';
    if (typeof doc.createEvent !== 'function') return false; // no tap events here
    // helpers
    var useJquery = typeof jQuery !== 'undefined',
        // some helpers borrowed from https://github.com/WebReflection/ie-touch
        msPointerEnabled = !! navigator.pointerEnabled || navigator.msPointerEnabled,
        isTouch = ( !! ('ontouchstart' in win) && navigator.userAgent.indexOf('PhantomJS') < 0) || msPointerEnabled,
        msEventType = function (type) {
            var lo = type.toLowerCase(),
                ms = 'MS' + type;
            return navigator.msPointerEnabled ? ms : lo;
        },
        touchevents = {
            touchstart: msEventType('PointerDown') + ' touchstart',
            touchend: msEventType('PointerUp') + ' touchend',
            touchmove: msEventType('PointerMove') + ' touchmove'
        },
        setListener = function (elm, events, callback) {
            var eventsArray = events.split(' '),
                i = eventsArray.length;

            while (i--) {
                elm.addEventListener(eventsArray[i], callback, false);
            }
        },
        getPointerEvent = function (event) {
            return event.targetTouches ? event.targetTouches[0] : event;
        },
        getTimestamp = function () {
            return new Date().getTime();
        },
        sendEvent = function (elm, eventName, originalEvent, data) {
            var customEvent = doc.createEvent('Event');
            data = data || {};
            data.x = currX;
            data.y = currY;
            data.distance = data.distance;
            if (useJquery) jQuery(elm).trigger(eventName, data);
            else {
                customEvent.originalEvent = originalEvent;
                for (var key in data) {
                    customEvent[key] = data[key];
                }
                customEvent.initEvent(eventName, true, true);
                elm.dispatchEvent(customEvent);
            }
        },

        onTouchStart = function (e) {
            if (e.touches.length === 1) {
                var pointer = getPointerEvent(e);
                // caching the current x
                cachedX = currX = pointer.pageX;
                // caching the current y
                cachedY = currY = pointer.pageY;

                timestamp = getTimestamp();
                tapNum++;
                // we will use these variables on the touchend events

            } else if (e.touches.length === 2) {
                handleGestureStart(e.touches[0].clientX, e.touches[0].clientY,
                e.touches[1].clientX, e.touches[1].clientY);
            }
        },
        onTouchEnd = function (e) {
            var deltaY = Math.abs(cachedY - currY),
                deltaX = Math.abs(cachedX - currX),
                deltaT = getTimestamp() - timestamp;

            // clear the previous timer in case it was set
            clearTimeout(tapTimer);

            if (e.targetTouches.length < 2) {
                handleGestureStop();
            }

            if (deltaY >= swipeThreshold || deltaX >= swipeThreshold) {
                sendEvent(e.target, 'swipe', e, {
                        distance: {
                            x: deltaX,
                            y: deltaY
                        },
                        direction: (deltaX > deltaY)? ((cachedX > currX) ? 'left' : 'right' ) :
                                                      ((cachedY > currY) ? 'up' : 'down' ),
                        velocity: {
                            x: deltaX / deltaT,
                            y: deltaY / deltaT
                        }
                });
            } else {
                if (
                (timestamp + tapThreshold) - getTimestamp() >= 0 && cachedX >= currX - tapPrecision && cachedX <= currX + tapPrecision && cachedY >= currY - tapPrecision && cachedY <= currY + tapPrecision) {
                    // Here you get the Tap event
                    sendEvent(e.target, (tapNum === 2) && (target === e.target) ? 'dbltap' : 'tap', e);
                    target = e.target;
                } else if (deltaT > longTapThreshold) {
                    sendEvent(e.target, 'longtap', e);
                    target = e.target;
                }

                // reset the tap counter
                tapTimer = setTimeout(function () {
                    tapNum = 0;
                }, dbltapThreshold);

            }
        },
        onTouchMove = function (e) {
            if (e.touches.length === 1) {
                var pointer = getPointerEvent(e);
                currX = pointer.pageX;
                currY = pointer.pageY;
            } else if (e.touches.length === 2) {
                handleGesture(e.touches[0].clientX, e.touches[0].clientY,
                e.touches[1].clientX, e.touches[1].clientY, e);
            }
        },

        handleGestureStart = function (x1, y1, x2, y2) {
            // sendEvent(e.target, 'guestureStart', e);

            //calculate distance and angle between fingers
            var dx = x2 - x1;
            var dy = y2 - y1;

            cachedDistance = Math.sqrt(dx * dx + dy * dy);
            cachedAngle = Math.atan2(dy, dx) * 180 / Math.PI;
        },

        handleGesture = function (x1, y1, x2, y2, e) {
            if (true) {
                // sendEvent(e.target, 'guestureMove', e);
                //calculate distance and angle between fingers
                var dx = x2 - x1;
                var dy = y2 - y1;
                currDistance = Math.sqrt(dx * dx + dy * dy);
                currAngle = Math.atan2(dy, dx) * 180 / Math.PI;

                //calculate the difference between current touch values and the start values
                distanceChange = currDistance - cachedDistance;
                angleChange = currAngle - cachedAngle;

                if (Math.abs(distanceChange) > pinchThreshold) {
                    sendEvent(e.target, 'pinch', e , {
                        distance: distanceChange,
                        zoomOut: distanceChange > 0 
                    });
                }
                if (Math.abs(angleChange) > rotateThreshold) {
                    sendEvent(e.target, 'rotate', e, {
                        angle: angleChange,
                        clockwise: angleChange > 0
                    });
                }
            }
        },

        handleGestureStop = function () {

        },

        swipeThreshold = win.SWIPE_THRESHOLD || 100,
        tapThreshold = win.TAP_THRESHOLD || 150, // range of time where a tap event could be detected
        longTapThreshold = win.LONG_TAP_THRESHOLD || 500, // range of time where a long tap event could be detected
        dbltapThreshold = win.DBL_TAP_THRESHOLD || 200, // delay needed to detect a double tap
        pinchThreshold = win.PINCH_THRESHOLD || 30, // minimal distance needed to detect a pinch
        rotateThreshold = win.ROTATE_THRESHOLD || 10, // minimal angle needed to detect a rotate
        tapPrecision = win.TAP_PRECISION / 2 || 60 / 2, // touch events boundaries ( 60px by default )
        justTouchEvents = win.JUST_ON_TOUCH_DEVICES || isTouch,
        tapNum = 0,
        //guesture
        currDistance, currAngle, cachedDistance, cachedAngle, distanceChange, angleChange,
        //swipe & tap
        currX, currY, cachedX, cachedY, tapTimer, timestamp, target;

    //setting the events listeners
    setListener(doc, touchevents.touchstart + (justTouchEvents ? '' : ' mousedown'), onTouchStart);
    setListener(doc, touchevents.touchend + (justTouchEvents ? '' : ' mouseup'), onTouchEnd);
    setListener(doc, touchevents.touchmove + (justTouchEvents ? '' : ' mousemove'), onTouchMove);
}(document, window));
