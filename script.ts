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

export class Computer {
  public bus: Bus8Bit;
  public controlLines: ControlLines;
  public pc: ProgramCounter;

  constructor (){
    this.bus = new Bus8Bit();
    this.controlLines = {
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
    this.pc = new ProgramCounter(this);
  }

  clockTick() {
    this.pc.update();
  }
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

export abstract class Component {
  public computer: Computer;

  constructor(computer: Computer) {
    this.computer = computer;
  }

  abstract update(): void;
}

class ProgramCounter extends Component {
  private state: Array<number>;

  constructor(computer: Computer) {
    super(computer)
    this.state = [0, 0, 0, 0];
  }

  update() {
    if (this.computer.controlLines.co === 1) { //output to bus
      this.computer.bus.lowNibble = this.state;
    }

    if (this.computer.controlLines.ci === 1) { //increment counter
      let value = this.state.slice().reverse().reduce(
        (acc, val, idx) => acc + val * (2**idx)); //convert to number
      value++; //increment number
      value %= 15;
      //convert number back to array of 4 bits
      this.state = (value >>> 0).toString(2).padStart(4, '0').split('').slice(-4).map(x=>+x);
    }

    if (this.computer.controlLines.j === 1) { //jump to bus value
      this.state = this.computer.bus.lowNibble;
    }
  }
}
