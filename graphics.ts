
/**
Object that calls relevant graphics functions whenever the
state of a computer part changes.
*/
var computerState = {
  _bus: [0,0,0,0,0,0,0,0],
  _pc: [0,0,0,0],
  set bus(bus: Array<number>) {
    if (!bus.every((val, idx) => val === this._bus[idx])) {
      this._bus = bus;
      drawBus(bus, 400, 10);
    }
  },
  set pc(state: Array<number>) {
    if (!state.every((val, idx) => val === this._pc[idx])) {
      this._pc = state;
      drawPC(state, 600, 20);
    }
  }
}

function setup()  {
  createCanvas(800, 200);
  background(255);
}

class Draw {
  static binaryAndNumerical(binArray: Array<number>, x: number, y: number, colour: Array<number>) {
    fill(0);
    textSize(25);
    noStroke();
    var value = binArray.slice().reverse().reduce(
      (acc, val, idx) => acc + val * (2**idx));
    text(String(value), x, y);
    for (var i=0; i<binArray.length; i++) {
      fill(colour.map((itm) => itm * binArray[i]));
      circle(x+5+15*i, y+10, 10);
    }
  }

  static rectangle(x: number, y: number, w: number, h: number) {
    strokeWeight(2);
    fill(255);
    stroke(0);
    rect(x, y, w, h);
  }

  static lowNibbleConnection(x: number, y: number, dataDir: 'r'|'l') {
    var bus = computerState._bus.slice(4);
    strokeWeight(3);
    for (var i=0; i<4; i++) {
      stroke([0, 255*bus[i], 0]);
      fill([0, 255*bus[i], 0]);
      line(460+15*i, y-10*i+40, x, y-10*i+40);
      circle(460+15*i, y-10*i+40, 5);
    }
    fill(0);
    noStroke();
    var arrowX = (490+x)/2;
    rect(arrowX, y-10, 20, 4);
    if (dataDir === 'r') {
      triangle(arrowX+20, y-14, arrowX+20, y-2, arrowX+28, y-8);
    } else {
      triangle(arrowX, y-14, arrowX, y-2, arrowX-8, y-8);
    }
  }
}

function drawBus(bus: Array<number>, x: number, y: number) {
  noStroke();
  fill(255);
  rect(x-95, y, 295, 100)
  strokeWeight(5);
  for (var i=0; i<8; i++) {
    stroke([0, 255*bus[i], 0]);
    line(x+15*i, y, x+15*i, y+100);
  }
}

function drawPC(state: Array<number>, x: number, y: number) {
  Draw.rectangle(x, y, 75, 50);
  Draw.binaryAndNumerical(state, x+10, y+25, [255,125,0]);
  fill(0);
  textSize(15);
  text("Program Counter", x, y-8);
}
