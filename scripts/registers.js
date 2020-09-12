import { Component } from "./component.js";
/**
 * Abstract class representing an 8-bit register.
 */
export class Register8Bit extends Component {
    constructor(computer) {
        super(computer);
        this.contents = [0, 0, 0, 0, 0, 0, 0, 0];
    }
    /**
     * Output the contents of the register to the bus.
     */
    writeToBus() {
        this.computer.bus.lines = this.contents;
    }
    /**
     * Overwrite the contents of the register with the
     * data on the bus.
     */
    readFromBus() {
        this.contents = this.computer.bus.lines;
    }
}
/**
 * Abstract class representing a 4-bit register.
 */
export class Register4Bit extends Component {
    constructor(computer) {
        super(computer);
        this.contents = [0, 0, 0, 0];
    }
    /**
     * Output the contents of the register to the lower
     * 4 bits of the bus.
     */
    writeToBus() {
        this.computer.bus.lowNibble = this.contents;
    }
    /**
     * Overwrite the contents of the register with the
     * data on the lower 4 bits of the bus.
     */
    readFromBus() {
        this.contents = this.computer.bus.lowNibble;
    }
}
/**
 * Class to represent the A register, the first
 * input and the output of the AdderSubtractor.
 */
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
/**
 * Class to represent the B register, the second
 * input to the AdderSubtractor.
 */
export class BRegister extends Register8Bit {
    update() {
        if (this.computer.controlLines.bi === 1) {
            this.readFromBus();
        }
    }
}
/**
 * Class to represent the output register, which
 * stores the value to be displayed by the
 * display (written to by the OUT instruction).
 */
export class OutputRegister extends Register8Bit {
    update() {
        if (this.computer.controlLines.oi === 1) {
            this.readFromBus();
            console.log('OUT: ' + this.contents.slice().reverse().reduce((acc, val, idx) => acc + val * (2 ** idx)));
        }
    }
}
/**
 * Register that stores the most recently fetched
 * instruction. Outputs the operand (last 4 bits) to
 * the bus, not the entire instruction.
 */
export class InstructionRegister extends Register8Bit {
    update() {
        if (this.computer.controlLines.ii === 1) {
            this.readFromBus();
        }
        if (this.computer.controlLines.io === 1) {
            this.computer.bus.lowNibble = this.contents.slice(4);
        }
    }
    /**
     * Gets the first 4 bits of the current instruction, the
     * opcode. Used by the ControllerSequencer.
     */
    get opcode() {
        return this.contents.slice(0, 4);
    }
}
/**
 * 4-bit register that stores the RAM address that is to
 * be read from or written to.
 */
export class MemoryAddressRegister extends Register4Bit {
    /**
     * Stores the address on the bus when the 'memory
     * in' control signal is high. Also converts the
     * binary address to decimal in the 'address'
     * property.
     */
    update() {
        if (this.computer.controlLines.mi) {
            this.readFromBus();
        }
        //contents of MAR as integer
        this.address = this.contents.slice().reverse().reduce((acc, val, idx) => acc + val * (2 ** idx));
    }
}
/**
 * 4-bit program counter that can increment, write to the
 * bus and jump to the value on the bus.
 */
export class ProgramCounter extends Register4Bit {
    /**
     * The PC does not use the update method - it uses
     * updateIncrement and updateReadWrite instead,
     * as updateIncrement should only be called once
     * every clock cycle.
     */
    update() {
        throw new Error("PC does not use update method.");
    }
    /**
     * Outputs the count to the bus or jumps to the
     * value on the bus if counter out or jump control
     * signals are set.
     */
    updateReadWrite() {
        if (this.computer.controlLines.co === 1) { //output to bus
            this.writeToBus();
        }
        if (this.computer.controlLines.j === 1) { //jump to bus value
            this.readFromBus();
        }
    }
    /**
     * Increments counter by one if counter increment
     * control signal is set.
     */
    updateIncrement() {
        if (this.computer.controlLines.ci === 1) { //increment counter
            let value = this.contents.slice().reverse().reduce((acc, val, idx) => acc + val * (2 ** idx)); //convert to number
            value++; //increment number
            value %= 16;
            //convert number back to array of 4 bits
            this.contents = (value >>> 0).toString(2).padStart(4, '0').split('').slice(-4).map(x => +x);
        }
    }
}
//# sourceMappingURL=registers.js.map