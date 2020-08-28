// The x position of components on the left side of the bus should
// be 305 - (width of component)

const binaryToInstuction = {
  '0000': 'NOP',
  '0001': 'LDA',
  '0010': 'ADD',
  '0011': 'SUB',
  '0100': 'STA',
  '0101': 'LDI',
  '0110': 'JMP',
  '0111': 'JC',
  '1000': 'JZ',
  '1110': 'OUT',
  '1111': 'HLT'
}

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
  _ram: [[0]],
  _ir: [1,0,0,0,0,0,0,0],
  _ctrl: {},
  _time: 1,
  set bus(bus: Array<number>) {
    this._bus = bus;
    drawBus(bus, 400, 10);
    drawBusConnections(this._ctrl);
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
      Draw.verticalConnections(state, 275, 172, 208);
    }
  },
  set ram(state: Array<Array<number>>) {
    if (JSON.stringify(this._ram) !== JSON.stringify(state)) {
      this._ram = state;
      drawRAM(state, 105, 210);
    }
  },
  set ir(state: Array<number>) {
    if (!state.every((val, idx) => val === this._mar[idx])) {
      this._ir = state;
      drawInstructionRegister(state, 170, 570);
      Draw.verticalConnections(state.slice(0,4), 275, 662, 698, [0,0,255]);
    }
  },
  set ctrl(state: object) {
    this._ctrl = state;
  },
  set time(state: number) {
    if ((state+5)%6 !== this._time) {
      this._time = (state+5) % 6;
      drawController(this._ctrl, 30, 700);
    }
  }
}

function setup()  {
  createCanvas(800, 800);
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
    var arrowX = (x < 400)? 350 : 550;
    Draw.arrow(arrowX, y-10, dataDir);
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
    var arrowX = (x < 400)? 350 : 550;
    Draw.arrow(arrowX, y-10, dataDir);
  }

  static verticalConnections(state: Array<number>, x: number, y1: number, y2: number, col?: Array<number>) {
    strokeWeight(3);
    col = col || [255, 125, 0];
    for (var i=0; i<state.length; i++) {
      stroke([col[0]*state[i], col[1]*state[i], col[2]*state[i]]);
      line(x+8*i, y1, x+8*i, y2);
    }
  }
}

function drawBus(bus: Array<number>, x: number, y: number) {
  noStroke();
  fill(255);
  rect(x-94, y, 293, 800)
  strokeWeight(5);
  for (var i=0; i<8; i++) {
    stroke([0, 255*bus[i], 0]);
    line(x+15*i, y, x+15*i, y+770);
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

function drawRAM(state: Array<Array<number>>, x: number, y: number) {
  Draw.rectangle(x, y, 200, 320);
  textSize(15);
  fill(0);
  strokeWeight(2);
  line(x+30, y, x+30, y+320);
  noStroke();
  for (var i=0; i<state.length; i++) {
    fill(0);
    text(String(i)+':', x+5, y+15+i*20);
    var dec  = state[i].slice().reverse().reduce(
      (acc, val, idx) => acc + val * (2**idx));
    text(dec.toString(16).toUpperCase(), x+40, y+15+i*20);
    Draw.binary(state[i], x+70, y+10+i*20, [255,125,0]);
  }
  fill(0);
  text("Random access memory", x-10, y-8);
}

function drawInstructionRegister(state: Array<number>, x: number, y: number) {
  Draw.rectangle(x, y, 135, 90);
  noStroke();
  textSize(20);
  fill([0, 0, 255]);
  text(binaryToInstuction[state.slice(0, 4).join('')], x+20, y+35);
  var operand  = state.slice(4).reverse().reduce(
    (acc, val, idx) => acc + val * (2**idx));
  fill([255,125,0])
  text(String(operand), x+85, y+35);
  fill(0);
  textSize(15);
  text("Instruction register", x, y-8);
  Draw.binary(state.slice(0,4), x+15, y+60, [0, 0, 255]);
  Draw.binary(state.slice(4), x+75, y+60, [255, 125, 0]);
}

function drawController(state: object, x: number, y: number) {
  Draw.rectangle(x, y, 275, 100);
  var signals = Object.keys(state);
  noStroke();
  textSize(12);
  textAlign(CENTER);
  for (var i=0; i<signals.length; i++) {
    Draw.binary([state[signals[i]]], x+10+i*17, y+85, [0,0,255]);
    text(signals[i], x+10+i*17, y+75);
  }
  for (var i=0; i<6; i++) {
    Draw.binary([Number(i === computerState._time)], x+10+i*17, y+25, [255, 0, 255]);
    text('T'+i, x+10+i*17, y+15);
  }
  textAlign(LEFT);
  strokeWeight(1);
  stroke(100);
  fill(100);
  line(x+7, y+35, x+30, y+35);
  line(x+41, y+35, x+98, y+35);
  noStroke();
  text("fetch", x+5, y+47);
  text("execute", x+48, y+47);
  fill(0);
  textSize(15);
  text("Controller sequencer", x, y-7);
}

function drawBusConnections(ctrl: object) {
  if (ctrl['j'] === 1 || ctrl['co'] === 1) {
    Draw.lowNibbleConnection(598, 30, (ctrl['j'] === 1)? 'r' : 'l');
  }
  if (ctrl['mi'] === 1) {
    Draw.lowNibbleConnection(307, 120, 'l');
  }
  if (ctrl['ri'] === 1 || ctrl['ro'] === 1) {
    Draw.busConnection(307, 210, (ctrl['ro'] === 1)? 'r' : 'l');
  }
  if (ctrl['ii'] === 1) { Draw.busConnection(307, 570, 'l'); }
  if (ctrl['io'] === 1) { Draw.lowNibbleConnection(307, 570, 'r'); }
  if (ctrl['ai'] || ctrl['ao']) {
    Draw.busConnection(598, 120, (ctrl['ai'] === 1)? 'r' : 'l');
  }
  if (ctrl['so'] === 1) { Draw.busConnection(598, 250, 'l'); }
  if (ctrl['bi'] === 1) { Draw.busConnection(598, 380, 'r'); }
  if (ctrl['oi'] === 1) { Draw.busConnection(598, 510, 'r'); }

}
