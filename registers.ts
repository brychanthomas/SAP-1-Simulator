import { Component, Computer } from "./exports";

abstract class Register8Bit extends Component {
  public contents: Array<number>;
  constructor(computer: Computer) {
    super(computer);
    this.contents = [0, 0, 0, 0, 0, 0, 0, 0];
  }

  abstract update(): void;


  protected writeToBus() {
    this.computer.bus.lines = this.contents;
  }

  protected readFromBus() {
    this.contents = this.computer.bus.lines;
  }
}

export class ARegister extends Register8Bit {
  update() {
    if (this.computer.controlLines.ai === 1) {
      this.readFromBus();
    }
    if (this.computer.controlLines.ao === 1) {
      this.writeToBus();
    }
  }
}

export class BRegister extends Register8Bit {
  update() {
    if (this.computer.controlLines.bi === 1) {
      this.readFromBus();
    }
  }
}

export class OutputRegister extends Register8Bit {
  update() {
    if (this.computer.controlLines.oi === 1) {
      this.readFromBus();
    }
  }
}

export class InstructionRegister extends Register8Bit {
  update() {
    if (this.computer.controlLines.ii === 1) {
      this.readFromBus();
    }
    if (this.computer.controlLines.io === 1) {
      this.computer.bus.lowNibble = this.contents.slice(4);
    }
  }
}

export class MemoryAddressRegister extends Component {
  public contents: Array<number>;

  constructor(computer: Computer) {
    super(computer);
    this.contents = [0, 0, 0, 0];
  }

  update() {
    if (this.computer.controlLines.mi) {
      this.contents = this.computer.bus.lowNibble;
    }
  }
}

export class ProgramCounter extends Component {
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
