//https://github.com/EnigmaCurry/SAP
//https://eater.net/schematics/high-level.png
//https://1.bp.blogspot.com/-jcMswG3yvwo/VmacKcGNGcI/AAAAAAAAAw4/GO51tD-s75g/s1600/image1.jpeg

interface ControlLines {
  hlt: number,
  mi: number,
  ri: number,
  ro: number,
  io: number,
  ii: number,
  ai: number,
  ao: number,
  e: number,
  su: number,
  bi: number,
  oi: number,
  ci: number,
  co: number,
  j: number,
  fi: number
}

var c:ControlLines;

abstract class Component {
  private bus: Bus8Bit;
  private controlLines: ControlLines;

  constructor(bus: Bus8Bit, controlLines: ControlLines) {
    this.bus = bus;
    this.controlLines = controlLines;
  }

  abstract update(): void;

  //abstract draw();
}

//class to represent central 8 bit bus that components connect
// to.
class Bus8Bit {
  public lines: Array<number>;

  constructor() {
    this.lines = [0, 0, 0, 0, 0, 0, 0, 0];
  }

  set highNibble(nibble: Array<number>) {
    this.lines = nibble.concat(this.lines.slice(4));
  }

  get highNibble() {
    return this.lines.slice(0, 4);
  }

  set lowNibble(nibble: Array<number>) {
    this.lines = this.lines.slice(0, 4).concat(nibble);
  }

  get lowNibble() {
    return this.lines.slice(4);
  }
}
