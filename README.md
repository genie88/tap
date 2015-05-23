#tap
 lightweight script (~1kb) to detect via Javascript events like 'tap' 'dbltap' 'longtap' 'swipe' 'pinch' 'rotate' on any kind of device. no dependencies.

##Usage
Include the script into your page:
```html
<script src="path/to/tap.js"></script>
```

Once you have included tap.js you will be able to catch all the new events:

```js
elm.addEventListener('tap',function(e){});
elm.addEventListener('dbltap',function(e){});
elm.addEventListener('longtap',function(e){});
elm.addEventListener('swipe',function(e){});
elm.addEventListener('pinch',function(e){});
elm.addEventListener('rotate',function(e){});
```

It works with jQuery as well:

```js
$(elm).on('tap',function(e,data){});
$(elm).on('dbltap',function(e,data){});
$(elm).on('longtap',function(e,data){});
$(elm).on('swipe',function(e,data){});
$(elm).on('pinch',function(e,data){});
$(elm).on('rotate',function(e,data){});
```



Anyway you can combine tap.js with the default javascript touch events:

- touchmove
- touchstart
- touchend
- touchcancel

To disable the default touch behaviours (zoom on double tap, scroll on swipe...) on a certain element via javascript you can always use the following snippet:

elm.addEventListener('touchmove',function(e){e.preventDefault()});
elm.addEventListener('touchstart',function(e){e.preventDefault()});
elm.addEventListener('touchend',function(e){e.preventDefault()});

##API and Examples
@todo

##Browser Support

Actually the script has been tested on all the modern browsers but it need a better testing phase over several platforms: Chrome 29+ Firefox 23+ Opera 12+ Safari 5+

It works on mobile/tablet browsers and on desktop browsers as well.

On the old browsers all the tap.js events cannot be triggered.