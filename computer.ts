import { ProgramCounter, ARegister, BRegister, OutputRegister,
         InstructionRegister, MemoryAddressRegister } from './registers.js';
import { RAM16 } from './ram.js';
import { AdderSubtractor } from './adder.js';
import { ControlSequencer } from './control.js';

export interface ControlLines {
  hlt: number,
  mi: number,
  ri: number,
  ro: number,
  io: number,
  ii: number,
  ai: number,
  ao: number,
  so: number,
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

export class Computer {
  public bus: Bus8Bit;
  public controlLines: ControlLines;
  public pc: ProgramCounter;
  public aRegister: ARegister;
  public bRegister: BRegister;
  public mar: MemoryAddressRegister;
  public ir: InstructionRegister;
  public out: OutputRegister;
  public ram: RAM16;
  public adderSubtractor: AdderSubtractor;
  public controller: ControlSequencer;

  constructor (){
    this.resetControlLines();
    this.bus = new Bus8Bit();
    this.pc = new ProgramCounter(this);
    this.aRegister = new ARegister(this);
    this.bRegister = new BRegister(this);
    this.mar = new MemoryAddressRegister(this);
    this.ir = new InstructionRegister(this);
    this.out = new OutputRegister(this);
    this.ram = new RAM16(this);
    this.adderSubtractor = new AdderSubtractor(this);
    this.controller = new ControlSequencer(this);
  }

  clockTick() {
    this.pc.update();
    this.adderSubtractor.update();
    this.update();
    this.update();

  }
  update() {
    this.aRegister.update();
    this.bRegister.update();
    this.mar.update();
    this.ir.update();
    this.out.update();
    this.ram.update();

  }

  clockTock() {
    this.controller.update();
  }

  resetControlLines() {
    this.controlLines = {
      hlt: 0,
      mi: 0,
      ri: 0,
      ro: 0,
      io: 0,
      ii: 0,
      ai: 0,
      ao: 0,
      so: 0,
      su: 0,
      bi: 0,
      oi: 0,
      ci: 0,
      co: 0,
      j: 0,
      fi: 0
    }
  }
}
