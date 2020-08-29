import { ProgramCounter, ARegister, BRegister, OutputRegister,
         InstructionRegister, MemoryAddressRegister } from './registers.js';
import { RAM16 } from './ram.js';
import { AdderSubtractor } from './adder.js';
import { ControlSequencer, Clock } from './control.js';

/**
 * Interface of object representing the control lines
 * that carry control signals from the controller
 * sequencer around the CPU.
 */
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

/**
 * Class to represent central 8 bit bus that components
 * connect to.
 */
export class Bus8Bit {
  public lines: Array<number>;

  constructor() {
    this.lines = [0, 0, 0, 0, 0, 0, 0, 0];
  }

  /**
   * Sets the top (leftmost) 4 bits of the bus.
   */
  set highNibble(nibble: Array<number>) {
    this.lines = nibble.concat(this.lines.slice(4));
  }

  /**
   * Gets the top (leftmost) 4 bits of the bus.
   */
  get highNibble() {
    return this.lines.slice(0, 4);
  }

  /**
   * Sets the lowest (rightmost) 4 bits of the bus.
   */
  set lowNibble(nibble: Array<number>) {
    this.lines = this.lines.slice(0, 4).concat(nibble);
  }

  /**
   * Gets the lowest (rightmost) 4 bits of the bus.
   */
  get lowNibble() {
    return this.lines.slice(4);
  }
}

/**
Class representing 8-bit SAP-1 CPU.
*/
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
  public flagsRegister = {cf: 0, zf: 0, flags: '00'}
  public controller: ControlSequencer;
  public clock: Clock;

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
    this.clock = new Clock(this);
  }

  /**
   * Called on 'rising edge' of clock - updates all of
   * the components except the controller sequencer,
   * which is updated on the falling edge.
   */
  clockTick() {
    this.bus.lines = [0,0,0,0,0,0,0,0];
    // the adderSubtractor must be updated separately because
    // otherwise the A register could load the sum, the sum
    // will change and the A register will then load the new sum,
    // causing errors such as 2 + 1 = 4
    this.adderSubtractor.update();
    // the PC increment must be done separately because otherwise
    // it will increment twice
    this.pc.updateIncrement();
    this.update();
    this.update();
  }

  /**
   * Called by clockTick to update the state of components.
   */
  update() {
    this.pc.updateReadWrite();
    this.aRegister.update();
    this.bRegister.update();
    this.mar.update();
    this.ir.update();
    this.out.update();
    this.ram.update();
  }

  /**
   * Called on the falling edge of the clock to update
   * the controller sequencer, which writes signals to
   * controlLines.
   */
  clockTock() {
    this.controller.update();
  }

  /**
   * Starts the clock at the clock speed in
   * Computer.clock.speed.
   */
  startClock() {
    this.clock.update();
  }


  /**
   * Resets all of the control lines to 0, or low.
   */
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

  reset() {
    this.resetControlLines();
    this.aRegister.contents = [0,0,0,0,0,0,0,0];
    this.bRegister.contents = [0,0,0,0,0,0,0,0];
    this.mar.contents = [0,0,0,0];
    this.pc.state = [0,0,0,0];
    this.controller.timeStep = 0;
    this.adderSubtractor.output = [0,0,0,0,0,0,0,0],
    this.flagsRegister.flags = '00';
    this.ir.contents = [0,0,0,0,0,0,0,0];
    this.out.contents = [0,0,0,0,0,0,0,0];
  }
}
