import { Component } from './component.js';

const INSTRUCTION_LOGIC = {
    '0000': {}, //NOP
    '0001': { //LDA
      2: ['mi', 'io'],
      3: ['ro', 'ai']
    },
    '0010': { //ADD
      2: ['mi', 'io'],
      3: ['ro', 'bi'],
      4: ['ai', 'so', 'fi']
    },
    '0011': { //SUB
      2: ['mi', 'io'],
      3: ['ro', 'bi'],
      4: ['ai', 'so', 'su', 'fi']
    },
    '0100': { //STA
      2: ['io', 'mi'],
      3: ['ao', 'ri']
    },
    '0101': { //LDI
      2: ['io', 'ai']
    },
    '1110': { //OUT
      2: ['ao', 'oi']
    },
    '1111': { //HLT
      2: ['hlt']
    }
  }

export class ControlSequencer extends Component {
  private timeStep = 0;
  update() {
    this.computer.resetControlLines();
    //steps 0 and 1 are the fetch part of the cycle
    if (this.timeStep === 0) {
      this.computer.controlLines.co = 1;
      this.computer.controlLines.mi = 1;
    } else if (this.timeStep === 1) {
      this.computer.controlLines.ro = 1;
      this.computer.controlLines.ii = 1;
      this.computer.controlLines.ci = 1;
    } else {
      var instruction = this.computer.ir.opcode.join('');
      //if there are lines to be turned on at this time step
      if (INSTRUCTION_LOGIC[instruction].hasOwnProperty(this.timeStep)) {
        var linesToTurnOn = INSTRUCTION_LOGIC[instruction][this.timeStep];
        for (var line of linesToTurnOn) {
          this.computer.controlLines[line] = 1;
        }
      }
    }
    this.timeStep++;
    this.timeStep %= 7;
  }
}
