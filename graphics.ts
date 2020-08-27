
/**
Object that calls relevant graphics functions whenever the
state of a computer part changes.
*/
var computerState = {
  _bus: [0,0,0,0,0,0,0,0],
  _pc: 0,
  set bus(bus: Array<number>) {
    if (!bus.every((val, idx) => val === this._bus[idx])) {
      drawBus(bus, 400, 10);
      this._bus = bus;
    }
  },
  set pc(addr: number) {
    if (addr !== this._pc) {
      drawPC(addr, 600, 10);
    }
  }
}

function setup()  {
  createCanvas(700, 200);
  background(255);
}

function draw() {

}

function drawBus(bus: Array<number>, x: number, y: number) {
  strokeWeight(5);
  for (var i=0; i<8; i++) {
    if (bus[i] === 1) {
      stroke([0, 255, 0]);
    } else {
      stroke(0);
    }
    line(x+15*i, y, x+15*i, y+100);
  }
}

function drawPC(addr: number, x: number, y: number) {
  strokeWeight(2);
  stroke(0);
  rect(x, y, 60, 50);
  textSize(40);
  text(String(addr), x+10, y+10, x+70, y+70);
}
