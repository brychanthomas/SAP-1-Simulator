import {ProgramCounter} from './exports';

export interface ControlLines {
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

//class to represent central 8 bit bus that components connect
// to.
export class Bus8Bit {
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
  protected computer: Computer;

  constructor(computer: Computer) {
    this.computer = computer;
  }

  abstract update(): void;
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
