import { Register8Bit } from './registers.js';
import type { Computer } from './computer.js';
import { Component } from './component.js'

class RAMRegister extends Register8Bit {
  public address: number;

  constructor(computer: Computer, address: number) {
    super(computer);
    this.address = address;
  }

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

export class RAM16 extends Component {
  public registers: Array<RAMRegister>;
  constructor(computer: Computer) {
    super(computer);
    this.registers = [];
    for (var i=0; i<16; i++) {
      this.registers.push(new RAMRegister(computer, i));
    }
  }

  update() {
    for (var reg of this.registers) {
      reg.update();
    }
  }

  program(data: Array<Array<number>>) {
    for (var byte=0; byte<data.length; byte++) {
      this.registers[byte].contents = data[byte];
    }
  }
}
