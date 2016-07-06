// TODO
// [x] click to draw
// [x] click and drag to draw
// [x] save image as array of rgbs
// [] animate
// [] edit image - should have a human skeleton that can be edited, so walking works

//-------------------------MOUSE------------------------------------------------
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
//------------------------------------------------------------------------------


//----------------------------------APP-----------------------------------------
function App() {
  var _this = this;

  // this.isDrawing = false;

  this.entity = new Agent();

  this.curState = this.entity.states.idle;

  this.curFrame;

  this._db = localStorage;

  // save the current entity to localStorage
  // can only save if a name has been entered for the entity
  this.save = function() {
    // name of the current entity maps to a number of frames
    var eName = document.querySelector('#entity-name').value;
    if(eName) {
      // te key will be the entity name and the index of the frame
      // _this._db.setItem(eName + )
    }
  };

}
//---------------------------------END APP--------------------------------------

//---------------------------------CANVAS---------------------------------------
// controller for drawing to the canvas
// must pass an app state in
function Canvas(state, pWidth = 20, pHeight = 20, imgWidth = 32, imgHeight = 32) {
  var _this = this;

  var canvas;

  var ctx;

  var isDrawing = false;

  var pixelDim = {
    width: pWidth,
    height: pHeight
  };

  var imgDim = {
    width: imgWidth,
    height: imgHeight
  };


  var Colors = {
    blue: 'rgb(135,206,250)',
    green: 'rgb(34,139,34)',
    black: 'rgb(1,1,1)'
  }

  this.color = Colors.black;

  init();
  // needs a canvas and a context
  this.render = function(pixels) {
    if(canvas) {
      clearCanvasRects();
      drawCanvasRects();
      // TODO
      // change this to the array of rgbs for pixels
      // will, in actuality, have to set the rgb for every pixel
      var x, y;
      pixels.forEach(function(p, ind) {
        x = (ind % imgDim.width) * pixelDim.width;
        y = Math.floor(ind / imgDim.height) * pixelDim.height;
        // if the value isn't "" then draw something, else draw nothing
        if(p != "") {
          ctx.fillRect(
            x,
            y,
            pixelDim.width,
            pixelDim.height
          );
        }
      });
    }
  }

  function startDraw(event) {
    console.log("clicked");
    isDrawing = true; // update state

    var pos = mousePositionElement(event);

    var rX = Math.floor(pos.x / pixelDim.width);
    var rY = Math.floor(pos.y / pixelDim.height);

    ctx.fillRect(rX * pixelDim.width, rY * pixelDim.height, pixelDim.width, pixelDim.height);

    // TODO: will need to communicate with the app state
    state.curFrame.pixels[rX % imgDim.width + (rY * imgDim.height)] = new Pixel().save();
    // console.log(rX % state.imgDim.width + (rY * state.imgDim.height));
  };

  function updateDraw(event) {
    if(isDrawing) {
      var pos = mousePositionElement(event)

      var rX = Math.floor(pos.x / pixelDim.width);
      var rY = Math.floor(pos.y / pixelDim.height);

      ctx.fillRect(rX * pixelDim.width, rY * pixelDim.height, pixelDim.width, pixelDim.height);

      // get the index from the x and y values
      state.curFrame.pixels[rX % imgDim.width + (rY * imgDim.height)] = new Pixel().save();
    }
  }

  function endDraw(event) {
    if(isDrawing) {
      isDrawing = false;
      // should save here
    }
  }

  // function drawFrame(event) {
  //   var ind = _this.frames.elements.indexOf(event.target);
  //   if(ind != state.curStateFrames.indexOf(state.curFrame)) {
  //     // do the rendering
  //     render()
  //     // set state curFrame to the new frame
  //     state.curFrame = state.curState.frames[ind];
  //   }
  // };

  function drawCanvasRects() {
    for(var y = 0; y < 32; y++) {
      for(var x = 0; x < 32; x++) {
        ctx.strokeRect(x * pixelDim.width, y * pixelDim.height, pixelDim.height, pixelDim.width);
      }
    }
  }

  function clearCanvasRects() {
    ctx.clearRect(0, 0, 640, 640);
  }

  function init() {
    canvas = document.querySelector('#world');
    // CANVAS
    if(canvas.getContext) {
      ctx = canvas.getContext('2d');
      ctx.strokeStyle = Colors.black;

      // will be y, x indexed
      // var pixels = [];
      // draw squares
      for(var y = 0; y < 32; y++) {
        for(var x = 0; x < 32; x++) {
          ctx.strokeRect(x * pWidth, y * pHeight, pHeight, pWidth);
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
  }
}
//------------------------------END CANVAS--------------------------------------

//-----------------------------------UI-----------------------------------------

// you also need a way to switch states (idle, etc.)

// controller for the UI
function UI(state, canvas) {
  var _this = this;

  this.frames = document.querySelector('#frame-hldr');

  this.selectedFrameInd = 0;

  init();

  // TODO
  function renderFrame(event) {
    console.log('rendering');
    // grab pixels from somewhere
    var ind = event.target.dataset.ind;
    console.log(ind);
    var pixels = state.curState.frames[ind].pixels;
    // render those pixels
    canvas.render(pixels);
    // update the current frame
    state.curFrame = state.curState.frames[ind];
  }

  function init(){
      var html;
      var frameRadio = '<input type="radio" name="frames">';
      // considers the state that's been passed and set's up the UI
      state.curState.frames.forEach(function(frame, ind){
        html = _this.frames.innerHTML;
        _this.frames.innerHTML = html + frameRadio;
        // _this.frames.elements[ind].addEventListener('click', renderFrame, false);
      });
      for(var i = 0; i < _this.frames.length; i++) {
        _this.frames.elements[i].addEventListener('click', renderFrame, false);
        _this.frames.elements[i].dataset.ind = i;
      }

      document.querySelector('input[name=frames]').checked = true; // check the first frame

      // set the curFrame of the application state
      state.curFrame = state.curState.frames[_this.selectedFrameInd];
  };
}
//------------------------------END UI------------------------------------------

// I don't know that this necessary other than an rgb
function Pixel(rgb='black') {
  var _this = this;

  this.rgb = rgb;

  this.save = function(){return _this.rgb};
}

// might have to bind this into the closure w/ that or something

// maybe pixels should be a map so that I can get rid of specific pixels
// Frame size defaults to 32 by 32
function Frame(size = 1024) {
  var _this = this;

  this.pixels = [];

  // effectively pixel will just be an index
  // find that index in the array and update it with val
  this.update = function update(pixel, value){
    _this.pixels.push(pixel);
  }

  // you have to take the dimensions of the frame and at that many elements
  // where do the dimensions of the frame get decided?
  function initFrame() {
    for(var i = 0; i < size; i++) {
      _this.pixels.push(""); // empty string represents the empty pixel
    }
  }
}

// an entity can be an agent or object
// every state has an associated set of frames
// every frame has a pixel set

function Agent() {
  var _this = this;

  this.states = {
    idle: new EntityState(),
    move: new EntityState(),
  };

  initFrames();

  function initFrames() {
    for(var i = 0; i < 3; i++) {
      _this.states.idle.addFrame()
    };
    for(var i = 0; i < 8; i++) {
      _this.states.move.addFrame()
    };
  }
};

function Object() {
  var _this = this;

  this.states = {
    idle: new EntityState()
  }

  initFrames();

  function initFrames() {
    for(var i = 0; i < 3; i++) {
      _this.states.idle.addFrame()
    };
  }
};

function EntityState(num) {
  var _this = this;

  this.frames = []

  this.addFrame = function(){
    _this.frames.push(new Frame());
  }
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

//------------------------------MAIN--------------------------------------------
(function(){

  // put this into the UI
  var controls = {
    saveBtn : document.querySelector('#save-btn')
  }

  var ctx;

  // radio buttons edit this state
  var state = new App();
  var canvas = new Canvas(state);
  var ui = new UI(state, canvas);
  // var ctx = canvas.getContext('2d');

  // EVENTS
  // function logCoords(event) {
  //   var pos = mousePositionElement(event);
  //   console.log(pos.x);
  //   console.log(pos.y);
  // }

  // returns a data url
  // ultimately will want to take this and transform it
  // save it in the cloud
  // then pull it back whenever I need it

  // will need to clear the rectangles of the canvas

  // might have to incorporate react, maybe not

  // ------

  // BUTTONS
  // controls.saveBtn.addEventListener('click', saveImg, false);
  //--------
})();
//--------------------------------END MAIN--------------------------------------
