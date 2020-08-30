import { Component } from './component.js';
/**
 * Object that stores which control signals should be
 * set at which time steps for different instructions.
 */
const MICROCODE = {
    '0000': {},
    '0001': {
        2: ['mi', 'io'],
        3: ['ro', 'ai']
    },
    '0010': {
        2: ['mi', 'io'],
        3: ['ro', 'bi'],
        4: ['ai', 'so', 'fi']
    },
    '0011': {
        2: ['mi', 'io'],
        3: ['ro', 'bi'],
        4: ['ai', 'so', 'su', 'fi']
    },
    '0100': {
        2: ['io', 'mi'],
        3: ['ao', 'ri']
    },
    '0101': {
        2: ['io', 'ai']
    },
    '0110': {
        2: ['io', 'j']
    },
    '01110x': {},
    '01111x': {
        2: ['io', 'j']
    },
    '1000x0': {},
    '1000x1': {
        2: ['io', 'j']
    },
    '1110': {
        2: ['ao', 'oi']
    },
    '1111': {
        2: ['hlt']
    }
};
/**
 * A controller sequencer that sets the control lines
 * based on the instruction currently being executed
 * and the time step (and the flags for conditional
 * jumps).
 */
export class ControlSequencer extends Component {
    constructor() {
        super(...arguments);
        this.timeStep = 0;
    }
    /**
     * Called on falling edge of clock to set the
     * control signals for the next time step.
     */
    update() {
        this.computer.resetControlLines();
        //steps 0 and 1 are the fetch part of the cycle
        if (this.timeStep === 0) {
            this.computer.controlLines.co = 1;
            this.computer.controlLines.mi = 1;
        }
        else if (this.timeStep === 1) {
            this.computer.controlLines.ro = 1;
            this.computer.controlLines.ii = 1;
            this.computer.controlLines.ci = 1;
        }
        else {
            var instruction = this.computer.ir.opcode.join('');
            //if the 4 bit instruction does not exist, try adding the
            //carry flag register (for conditional jump)
            if (!MICROCODE.hasOwnProperty(instruction)) {
                instruction = instruction + this.computer.flagsRegister.cf + 'x';
            }
            //if cf version of instruction does not exist try zf version
            if (!MICROCODE.hasOwnProperty(instruction)) {
                instruction = instruction.slice(0, 4) + 'x' + this.computer.flagsRegister.zf;
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
        this.timeStep %= 6;
    }
}
/**
 * The clock calls the clockTock and clockTick methods
 * on each falling and rising edge so that the computer
 * can execute instructions. The speed (in hertz) is
 * controlled by the 'speed' property.
 */
export class Clock extends Component {
    constructor() {
        super(...arguments);
        this.level = 0;
        this.speed = 20; // Hertz (clock cycles per second)
    }
    /**
     * Updates the level of the clock (1 or 0) and
     * calls clockTock and clockTick based on whether it
     * is a falling or rising edge, then uses setTimeout
     * so that update is called again later.
     */
    update() {
        if (this.computer.controlLines.hlt === 0) { //if computer not halted
            this.level = Number(!this.level);
            if (this.level === 0) { //falling edge
                this.computer.clockTock();
            }
            else { //rising edge
                this.computer.clockTick();
            }
        }
        setTimeout(this.update.bind(this), 1000 / (this.speed * 2));
    }
}
//# sourceMappingURL=control.js.map