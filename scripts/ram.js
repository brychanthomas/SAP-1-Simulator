import { Register8Bit } from './registers.js';
import { Component } from './component.js';
/**
 * A Register that forms a part of the RAM - has a
 * numerical address as well as its contents.
 */
class RAMRegister extends Register8Bit {
    constructor(computer, address) {
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
            if (this.computer.controlLines.ro === 1) {
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
    constructor(computer) {
        super(computer);
        this.registers = [];
        for (var i = 0; i < 16; i++) {
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
    program(data) {
        for (var byte = 0; byte < Math.min(data.length, this.registers.length); byte++) {
            this.registers[byte].contents = data[byte];
        }
    }
    /**
     * Returns an array of 8-bit arrays with the contents of all
     * registers.
     */
    get contents() {
        var c = [];
        for (var i = 0; i < this.registers.length; i++) {
            c.push(this.registers[i].contents);
        }
        return c;
    }
    /**
     * Sets the contents of all the registers to 0.
     */
    clear() {
        for (var i = 0; i < this.registers.length; i++) {
            this.registers[i].contents = [0, 0, 0, 0, 0, 0, 0, 0];
        }
    }
}
//# sourceMappingURL=ram.js.map