abstract class Component {
  private bus: Bus8Bit;

  constructor(bus) {
    this.bus = bus;
  }

  abstract update();

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
