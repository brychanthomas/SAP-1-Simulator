interface ControlLines {
  hlt: 0,
  mi: 0,
  ri: 0,
  ro: 0,
  io: 0,
  ii: 0,
  ai: 0,
  ao: 0,
  e: 0,
  su: 0,
  bi: 0,
  oi: 0,
  ci: 0,
  co: 0,
  j: 0,
  fi: 0
}

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
