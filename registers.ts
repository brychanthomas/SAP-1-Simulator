import { Component, Computer } from "./script";

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

class ARegister extends Register8Bit {
  update() {
    if (this.computer.controlLines.ai === 1) {
      this.readFromBus();
    }
    if (this.computer.controlLines.ao === 1) {
      this.writeToBus();
    }
  }
}

class BRegister extends Register8Bit {
  update() {
    if (this.computer.controlLines.bi === 1) {
      this.readFromBus();
    }
  }
}

class OutputRegister extends Register8Bit {
  update() {
    if (this.computer.controlLines.oi === 1) {
      this.readFromBus();
    }
  }
}

class InstructionRegister extends Register8Bit {
  update() {
    if (this.computer.controlLines.ii === 1) {
      this.readFromBus();
    }
    if (this.computer.controlLines.io === 1) {
      this.computer.bus.lowNibble = this.contents.slice(4);
    }
  }
}
