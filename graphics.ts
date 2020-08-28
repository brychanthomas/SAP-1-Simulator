// The x position of components on the left side of the bus should
// be 305 - (width of component)

/**
Object that calls relevant graphics functions whenever the
state of a tracked computer part changes.
*/
var computerState = {
  _bus: [0,0,0,0,0,0,0,0],
  _pc: [1,0,0,0],
  _aRegister: [1,0,0,0,0,0,0,0],
  _adder: [1,0,0,0,0,0,0,0],
  _bRegister: [1,0,0,0,0,0,0,0],
  _output: [1,0,0,0,0,0,0,0,0],
  _mar: [1,0,0,0],
  set bus(bus: Array<number>) {
    if (!bus.every((val, idx) => val === this._bus[idx])) {
      this._bus = bus;
      drawBus(bus, 400, 10);
    }
  },
  set pc(state: Array<number>) {
    if (!state.every((val, idx) => val === this._pc[idx])) {
      this._pc = state;
      drawRegister4Bit(state, 600, 30, "Program counter");
    }
  },
  set clock(state: number) {
    if (state !== this._clock) {
      this._clock = state;
      drawClock(state, 230, 30);
    }
  },
  set aRegister(state: Array<number>) {
    if (!state.every((val, idx) => val === this._aRegister[idx])) {
      this._aRegister = state;
      drawRegister8Bit(state, 600, 120, "A register");
      Draw.verticalConnections(state, 605, 212, 248);
    }
  },
  set adder(state: Array<number>) {
    if (!state.every((val, idx) => val === this._adder[idx])) {
      this._adder = state;
      drawAdder(state, 600, 250);
    }
  },
  set bRegister(state: Array<number>) {
    if (!state.every((val, idx) => val === this._bRegister[idx])) {
      this._bRegister = state;
      drawRegister8Bit(state, 600, 380, "B register", 70);
      Draw.verticalConnections(state, 605, 342, 378);
    }
  },
  set output(state: Array<number>) {
    if (!state.every((val, idx) => val === this._output[idx])) {
      this._output = state;
      drawOutput(state, 600, 510);
    }
  },
  set mar(state: Array<number>) {
    if (!state.every((val, idx) => val === this._mar[idx])) {
      this._mar = state;
      drawRegister4Bit(state, 230, 120, "Memory address register", -90);
    }
  }
}

function setup()  {
  createCanvas(800, 600);
  background(255);
}

class Draw {
  static binary(binArray: Array<number>, x:number, y: number, colour: Array<number>) {
    for (var i=0; i<binArray.length; i++) {
      fill(colour.map((itm) => itm * binArray[i]));
      circle(x+15*i, y, 10);
    }
  }

  static binaryAndNumerical(binArray: Array<number>, x: number, y: number, colour: Array<number>) {
    fill(0);
    textSize(25);
    noStroke();
    var value = binArray.slice().reverse().reduce(
      (acc, val, idx) => acc + val * (2**idx));
    text(String(value), x, y);
    Draw.binary(binArray, x+5, y+10, colour);
  }

  static rectangle(x: number, y: number, w: number, h: number) {
    strokeWeight(2);
    fill(255);
    stroke(0);
    rect(x, y, w, h);
  }

  static arrow(x: number, y: number, dir: 'l'|'r') {
    fill(0);
    noStroke();
    if (dir === 'r') {
      rect(x, y, 20, 4);
      triangle(x+20, y-4, x+20, y+8, x+28, y+2);
    } else if (dir === 'l') {
      rect(x, y, 20, 4);
      triangle(x, y-4, x, y+8, x-8, y+2);
    }
  }

  static lowNibbleConnection(x: number, y: number, dataDir?: 'r'|'l') {
    var bus = computerState._bus.slice(4);
    strokeWeight(3);
    for (var i=0; i<4; i++) {
      stroke([0, 255*bus[i], 0]);
      fill([0, 255*bus[i], 0]);
      line(460+15*i, y-10*i+40, x, y-10*i+40);
      circle(460+15*i, y-10*i+40, 5);
    }
    Draw.arrow(x, y-10, dataDir);
  }

  static busConnection(x: number, y: number, dataDir?: 'r'|'l') {
    var bus = computerState._bus;
    strokeWeight(3);
    for (var i=0; i<bus.length; i++) {
      stroke([0, 255*bus[i], 0]);
      fill([0, 255*bus[i], 0]);
      line(400+15*i, y-10*i+80, x, y-10*i+80);
      circle(400+15*i, y-10*i+80, 5);
    }
    var arrowX = (490+x)/2;
    Draw.arrow(arrowX, y-10, dataDir);
  }

  static verticalConnections(state: Array<number>, x: number, y1: number, y2: number) {
    strokeWeight(3);
    for (var i=0; i<state.length; i++) {
      stroke([255*state[i], 125*state[i], 0]);
      fill([0, 255*state[i], 0]);
      line(x+8*i, y1, x+8*i, y2);
    }
  }
}

function drawBus(bus: Array<number>, x: number, y: number) {
  noStroke();
  fill(255);
  rect(x-94, y, 293, 100)
  strokeWeight(5);
  for (var i=0; i<8; i++) {
    stroke([0, 255*bus[i], 0]);
    line(x+15*i, y, x+15*i, y+100);
  }
}

function drawRegister4Bit(state: Array<number>, x: number, y: number, name: string, namexOffset?: number) {
  Draw.rectangle(x, y, 75, 50);
  Draw.binaryAndNumerical(state, x+10, y+25, [255,125,0]);
  fill(0);
  textSize(15);
  noStroke();
  namexOffset = namexOffset || 0;
  text(name, x+namexOffset, y-8);
}

function drawClock(state: number, x: number, y: number) {
  Draw.rectangle(x, y, 75, 50);
  fill(0);
  noStroke();
  textSize(15);
  text("Clock", x, y-8);
  textSize(20);
  if (state === 1) {
    text("High", x+15, y+25);
    fill([255, 0, 255]);
    circle(x+35, y+40, 10);
  } else {
    text("Low", x+15, y+25);
    circle(x+35, y+40, 10);
  }
}

function drawRegister8Bit(state: Array<number>, x: number, y: number, name: string, namexOffset?: number) {
  Draw.rectangle(x, y, 135, 90);
  Draw.binaryAndNumerical(state, x+10, y+25, [255,125,0]);
  textSize(15);
  fill(0);
  namexOffset = namexOffset || 0;
  text(name, x+namexOffset, y-8);
}

function drawAdder(state: Array<number>, x: number, y: number) {
  Draw.rectangle(x, y, 180, 90);
  Draw.binaryAndNumerical(state, x+10, y+25, [255,125,0]);
  textSize(15);
  fill(0);
  text("Adder / Subtractor", x+70, y-8);
}

function drawOutput(state: Array<number>, x: number, y: number) {
  Draw.rectangle(x, y, 150, 90);
  noStroke();
  Draw.binary(state, x+25, y+70, [255, 0, 0]);
  textSize(15);
  fill(0);
  text("Output register", x, y-8);
  fill(150);
  rect(x+25, y+5, 100, 50);
  fill([255, 0, 0]);
  textSize(50);
  var value = state.slice().reverse().reduce(
    (acc, val, idx) => acc + val * (2**idx));
  text(String(value), x+27, y+45);
}
