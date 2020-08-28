import { Register8Bit } from './registers.js';
import type { Computer } from './computer.js';
import { Component } from './component.js'

/**
 * A Register that forms a part of the RAM - has a
 * numerical address as well as its contents.
 */
class RAMRegister extends Register8Bit {
  public address: number;

  constructor(computer: Computer, address: number) {
    super(computer);
    this.address = address;
  }

  /**
   * If this register is selected by the memory address
   * register this RAM register is controlled by the
   * ram out and ram in control signals.
   */
  update() {
    if (this.computer.mar.address === this.address) {
      if  (this.computer.controlLines.ro === 1) {
        this.writeToBus();
      }
      if (this.computer.controlLines.ri === 1) {
        this.readFromBus();
      }
    }
  }
}

/**
 * 16 bytes of RAM created using 15 RAMRegisters.
 */
export class RAM16 extends Component {
  public registers: Array<RAMRegister>;
  constructor(computer: Computer) {
    super(computer);
    this.registers = [];
    for (var i=0; i<16; i++) {
      this.registers.push(new RAMRegister(computer, i));
    }
  }

  /**
   * Call the update method on every register.
   */
  update() {
    for (var reg of this.registers) {
      reg.update();
    }
  }

  /**
   * Takes an array of 8-bit arrays and stores each
   * byte into consecutive RAM addresses, starting at 0.
   */
  program(data: Array<Array<number>>) {
    for (var byte=0; byte<data.length; byte++) {
      this.registers[byte].contents = data[byte];
    }
  }

  /**
   * Returns an array of 8-bit arrays with the contents of all
   * registers.
   */
  get contents() {
    var c = [];
    for (var i=0; i<this.registers.length; i++) {
      c.push(this.registers[i].contents);
    }
    return c;
  }
}
