import { Component } from './component.js';

const MICROCODE = {
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
    '0110': { //JMP
      2: ['io', 'j']
    },
    '01110x': {}, //JC when cf = 0
    '01111x': {   //JC when cf = 1
      2: ['io', 'j']
    },
    '1000x0': {}, //JZ when cf = 0
    '1000x1': {   //JZ when cf = 1
      2: ['io', 'j']
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
      //if the 4 bit instruction does not exist, try adding the
      //carry flag register (for conditional jump)
      if (!MICROCODE.hasOwnProperty(instruction)) {
        instruction = instruction + this.computer.flagsRegister.cf +'x';
      }
      //if cf version of instruction does not exist try zf version
      if (!MICROCODE.hasOwnProperty(instruction)) {
        instruction = instruction.slice(0,4) +'x'+this.computer.flagsRegister.zf;
      }
      //if there are lines to be turned on at this time step
      if (MICROCODE[instruction].hasOwnProperty(this.timeStep)) {
        var linesToTurnOn = MICROCODE[instruction][this.timeStep];
        for (var line of linesToTurnOn) {
          this.computer.controlLines[line] = 1;
        }
      }
    }
    this.timeStep++;
    this.timeStep %= 7;
  }
}
