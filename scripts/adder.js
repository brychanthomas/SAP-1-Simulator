import { Component } from './component.js';
/**
 * Adds or subtracts the contents of the A register
 * and the B register.
 */
export class AdderSubtractor extends Component {
    constructor() {
        super(...arguments);
        this.output = [0, 0, 0, 0, 0, 0, 0, 0];
    }
    /**
     * Adds or subtracts (based on subtract control signal)
     * the contents of the A register with the contents of
     * the B register and outputs result to bus if
     * sum out control signal is set. Also sets the
     * flags register if flags in control signal is set.
     */
    update() {
        var a = this.computer.aRegister.contents.slice().reverse().reduce((acc, val, idx) => acc + val * (2 ** idx)); //convert to number
        var b = this.computer.bRegister.contents.slice().reverse().reduce((acc, val, idx) => acc + val * (2 ** idx));
        var out = a + b;
        if (this.computer.controlLines.su === 1) { // Subtract
            out = a - b;
        }
        var outArr = (out >>> 0).toString(2).padStart(8, '0').split('').slice(-8).map(x => +x);
        this.output = outArr;
        if (this.computer.controlLines.so === 1) { // Sum out
            this.computer.bus.lines = outArr;
        }
        if (this.computer.controlLines.fi === 1) { // Flags in
            this.computer.flagsRegister.cf = Number((out >>> 0).toString(2).padStart(9, '0')[0]);
            this.computer.flagsRegister.zf = Number(out === 0);
            this.computer.flagsRegister.flags = String(this.computer.flagsRegister.cf) +
                String(this.computer.flagsRegister.zf);
        }
    }
}
//# sourceMappingURL=adder.js.map