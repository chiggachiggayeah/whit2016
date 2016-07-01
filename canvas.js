// TODO
// [x] click to draw
// [x] click and drag to draw
// [] save image (can probably encode as a collection of pts and rgbs, show gif from url)
// [] edit image - should have a human skeleton that can be edited, so walking works
// --live editing could be cool
// [] animate
// [] one agent, walking around
// [] controllable desires

function Pixel(x, y) {
  this.x = x
  this.y = y;
}

// for the animation

// show frames (likely circles kinda like in asperite)
// show controls (play pause)
function TimeLine() {
  this.controls = {
    playPauseBtn: "",
    frames: []
  }
}

(function(){
  var canvas = document.querySelector('#world');
  var height;
  var width;
  var controls = {
    saveBtn : document.querySelector('#save-btn')
  }

  var ctx;
  var state = {
    drawing: false,
    pixels: []
  }
  // var ctx = canvas.getContext('2d');
  var Colors = {
    blue: 'rgb(135,206,250)',
    green: 'rgb(34,139,34)',
    black: 'rgb(1,1,1)'
  }

  // EVENTS
  function logCoords(event) {
    var pos = mousePositionElement(event);
    console.log(pos.x);
    console.log(pos.y);
  }

  function startDraw(event) {
    state.drawing = true; // update state

    var pos = mousePositionElement(event);

    var rX = Math.floor(pos.x / width);
    var rY = Math.floor(pos.y / height);

    ctx.fillRect(rX * width, rY * height, width, height);
    state.pixels.push(new Pixel(rX * width, rY * height));
  }

  function updateDraw(event) {
    if(state.drawing) {
      var pos = mousePositionElement(event)

      var rX = Math.floor(pos.x / width);
      var rY = Math.floor(pos.y / height);

      ctx.fillRect(rX * width, rY * height, width, height);
      state.pixels.push(new Pixel(rX * width, rY * height));
    }
  }

  function endDraw(event) {
    if(state.drawing) {
      state.drawing = false;
    }
  }

  function redrawImage(pixels) {
    if(canvas) {
      pixels.forEach(function(p) {
        ctx.fillRect(p.x, p.y, width, height);
      });
    }
  }

  function drawCanvasRects() {
    for(var y = 0; y < 32; y++) {
      for(var x = 0; x < 32; x++) {
        ctx.strokeRect(x * width, y * height, height, width);
      }
    }
  }

  function clearCanvasRects() {
    for(var y = 0; y < 32; y++) {
      for(var x = 0; x < 32; x++) {
        ctx.clearRect(x * width, y * height, height, width);
      }
    }
  }

  // returns a data url
  // ultimately will want to take this and transform it
  // save it in the cloud
  // then pull it back whenever I need it

  // will need to clear the rectangles of the canvas
  function saveImg(event) {
    if(canvas) {
      clearCanvasRects();

      redrawImage(state.pixels);
      var dataUrl = canvas.toDataURL();

      document.querySelector('#canvas-img').src = dataUrl;

      // redraw canvas and it's rects
      drawCanvasRects();
      redrawImage(state.pixels);
    }
  }

  // ------

  // MOUSE
  // Which HTML element is the target of the event
  function mouseTarget(e) {
  	var targ;
  	if (!e) var e = window.event;
  	if (e.target) targ = e.target;
  	else if (e.srcElement) targ = e.srcElement;
  	if (targ.nodeType == 3) // defeat Safari bug
  		targ = targ.parentNode;
  	return targ;
  }

  // Mouse position relative to the document
  // From http://www.quirksmode.org/js/events_properties.html
  function mousePositionDocument(e) {
  	var posx = 0;
  	var posy = 0;
  	if (!e) {
  		var e = window.event;
  	}
  	if (e.pageX || e.pageY) {
  		posx = e.pageX;
  		posy = e.pageY;
  	}
  	else if (e.clientX || e.clientY) {
  		posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
  		posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
  	}
  	return {
  		x : posx,
  		y : posy
  	};
  }

  // Find out where an element is on the page
  // From http://www.quirksmode.org/js/findpos.html
  function findPos(obj) {
  	var curleft = curtop = 0;
  	if (obj.offsetParent) {
  		do {
  			curleft += obj.offsetLeft;
  			curtop += obj.offsetTop;
  		} while (obj = obj.offsetParent);
  	}
  	return {
  		left : curleft,
  		top : curtop
  	};
  }

  // Mouse position relative to the element
  // not working on IE7 and below
  function mousePositionElement(e) {
  	var mousePosDoc = mousePositionDocument(e);
  	var target = mouseTarget(e);
  	var targetPos = findPos(target);
  	var posx = mousePosDoc.x - targetPos.left;
  	var posy = mousePosDoc.y - targetPos.top;
  	return {
  		x : posx,
  		y : posy
  	};
  }

  function localToScreen(event) {
    var target = mouseTarget(e);
    var targetPos = findPos(target);
  }
  // ------

  // CANVAS
  if(canvas.getContext) {
    ctx = canvas.getContext('2d');
    ctx.strokeStyle = Colors.black;

    height = 20;
    width = 20;

    // will be y, x indexed
    // var pixels = [];
    // draw squares
    for(var y = 0; y < 32; y++) {
      for(var x = 0; x < 32; x++) {
        ctx.strokeRect(x * width, y * height, height, width);
      }
    }

    // canvas.addEventListener('mousemove', logCoords, false);
    canvas.addEventListener('mousedown', startDraw, false);
    canvas.addEventListener('mousemove', updateDraw, false)
    canvas.addEventListener('mouseup', endDraw, false);


  } else {
    // no support for canvas
    console.log("Your browser does not support canvas");
  }

  //--------

  // BUTTONS
  controls.saveBtn.addEventListener('click', saveImg, false);
  //--------
})();
