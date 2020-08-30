/**
Object used by the instruction register graphics to convert
machine code back to assembly mnemonics.
*/
const binaryToInstuction = {
    '0000': 'NOP',
    '0001': 'LDA',
    '0010': 'ADD',
    '0011': 'SUB',
    '0100': 'STA',
    '0101': 'LDI',
    '0110': 'JMP',
    '0111': 'JC',
    '1000': 'JZ',
    '1110': 'OUT',
    '1111': 'HLT'
};
/**
The assembly program running when the page loads.
*/
var default_program = `LDI 0
STA 14
LDI 1
STA 15
OUT
ADD 14
STA 14
JC 0
OUT
ADD 15
JMP 3`;
/**
Used to indicate that the user wants their program stored in RAM -
when true the program in the textarea is compiled and the computer
is reset and reprogrammed.
*/
var newProgram = false;
/**
Object that calls relevant graphics functions whenever the
state of a tracked computer part changes.
*/
var computerState = {
    _bus: [0, 0, 0, 0, 0, 0, 0, 0],
    _pc: [1, 0, 0, 0],
    _aRegister: [1, 0, 0, 0, 0, 0, 0, 0],
    _adder: [1, 0, 0, 0, 0, 0, 0, 0],
    _bRegister: [1, 0, 0, 0, 0, 0, 0, 0],
    _output: [1, 0, 0, 0, 0, 0, 0, 0, 0],
    _mar: [1, 0, 0, 0],
    _ram: [[0]],
    _ir: [1, 0, 0, 0, 0, 0, 0, 0],
    _ctrl: {},
    _time: 1,
    _flags: '',
    _clock: 0,
    set bus(bus) {
        this._bus = bus;
        drawBus(bus, 400, 20);
        if (this._clock === 1) {
            drawBusConnections(this._ctrl);
        }
    },
    set pc(state) {
        if (!state.every((val, idx) => val === this._pc[idx])) {
            this._pc = state;
            drawRegister4Bit(state, 600, 30, "Program counter");
        }
    },
    set clock(state) {
        if (state !== this._clock) {
            this._clock = state;
            drawClock(state, 230, 30);
        }
    },
    set aRegister(state) {
        if (!state.every((val, idx) => val === this._aRegister[idx])) {
            this._aRegister = state;
            drawRegister8Bit(state, 600, 120, "A register");
            Draw.verticalConnections(state, 605, 212, 248);
        }
    },
    set adder(state) {
        if (!state.every((val, idx) => val === this._adder[idx])) {
            this._adder = state;
            drawAdder(state, 600, 250);
        }
    },
    set bRegister(state) {
        if (!state.every((val, idx) => val === this._bRegister[idx])) {
            this._bRegister = state;
            drawRegister8Bit(state, 600, 380, "B register", 70);
            Draw.verticalConnections(state, 605, 342, 378);
        }
    },
    set output(state) {
        if (!state.every((val, idx) => val === this._output[idx])) {
            this._output = state;
            drawOutput(state, 600, 510);
        }
    },
    set mar(state) {
        if (!state.every((val, idx) => val === this._mar[idx])) {
            this._mar = state;
            drawRegister4Bit(state, 230, 120, "Memory address register", -90);
            Draw.verticalConnections(state, 275, 172, 208);
        }
    },
    set ram(state) {
        if (JSON.stringify(this._ram) !== JSON.stringify(state)) {
            this._ram = state;
            drawRAM(state, 105, 210);
        }
    },
    set ir(state) {
        if (!state.every((val, idx) => val === this._mar[idx])) {
            this._ir = state;
            drawInstructionRegister(state, 170, 570);
            Draw.verticalConnections(state.slice(0, 4), 275, 662, 698, [0, 0, 255]);
        }
    },
    set ctrl(state) {
        this._ctrl = state;
    },
    set time(state) {
        if ((state + 5) % 6 !== this._time) {
            this._time = (state + 5) % 6;
            drawController(this._ctrl, 30, 700);
        }
    },
    set flags(state) {
        if (state !== this._flags) {
            this._flags = state;
            drawFlagsRegister(state, 750, 380);
        }
    },
    set clockSpeed(speed) {
        textSize(15);
        noStroke();
        fill(0);
        Draw.title("Clock speed: " + speed + " Hz", 17, 50);
    }
};
var slider;
var programBox;
var assembleButton;
/**
Called by p5.js when the page has loaded - creates the canvas
and DOM elements.
*/
function setup() {
    createCanvas(900, 800);
    background(255);
    slider = createSlider(0.1, 20, 6, 0.1);
    slider.position(20, 20);
    programBox = createElement('textarea', default_program);
    programBox.position(900, 100);
    programBox.size(70, 250);
    programBox.style('resize', 'none');
    assembleButton = createButton("Restart and write to RAM");
    assembleButton.position(900, 370);
    assembleButton.size(70, 70);
    assembleButton.mousePressed(() => newProgram = true);
}
/**
Class of static functions for drawing common graphics.
*/
class Draw {
    /**
     * Draws several circles like LEDs to represent a sequence of bits.
     */
    static binary(binArray, x, y, colour) {
        for (var i = 0; i < binArray.length; i++) {
            fill(colour.map((itm) => itm * binArray[i]));
            circle(x + 15 * i, y, 10);
        }
    }
    /**
     * Draws circles to represent bits with the decimal conversion above.
     */
    static binaryAndNumerical(binArray, x, y, colour) {
        fill(0);
        textSize(25);
        noStroke();
        var value = binArray.slice().reverse().reduce((acc, val, idx) => acc + val * (2 ** idx));
        text(String(value), x, y);
        Draw.binary(binArray, x + 5, y + 10, colour);
    }
    /**
     * Draws a rectangle with a white background and black outline.
     */
    static rectangle(x, y, w, h) {
        strokeWeight(2);
        fill(255);
        stroke(0);
        rect(x, y, w, h);
    }
    /**
     * Draws an arrow pointing in a given direction.
     */
    static arrow(x, y, dir) {
        fill(0);
        noStroke();
        if (dir === 'r') {
            rect(x, y, 20, 4);
            triangle(x + 20, y - 4, x + 20, y + 8, x + 28, y + 2);
        }
        else if (dir === 'l') {
            rect(x, y, 20, 4);
            triangle(x, y - 4, x, y + 8, x - 8, y + 2);
        }
    }
    /**
     * Draws connections between a component and the low 4 bits of the bus
     * with an arrow to show whether it is reading or writing.
     */
    static lowNibbleConnection(x, y, dataDir) {
        var bus = computerState._bus.slice(4);
        strokeWeight(3);
        for (var i = 0; i < 4; i++) {
            stroke([0, 255 * bus[i], 0]);
            fill([0, 255 * bus[i], 0]);
            line(460 + 15 * i, y - 10 * i + 40, x, y - 10 * i + 40);
            circle(460 + 15 * i, y - 10 * i + 40, 5);
        }
        var arrowX = (x < 400) ? 350 : 550;
        Draw.arrow(arrowX, y - 10, dataDir);
    }
    /**
     * Draws connections between a component and all 8 bits of the bus
     * with an optional arrow to show whether it is reading or writing.
     */
    static busConnection(x, y, dataDir) {
        var bus = computerState._bus;
        strokeWeight(3);
        for (var i = 0; i < bus.length; i++) {
            stroke([0, 255 * bus[i], 0]);
            fill([0, 255 * bus[i], 0]);
            line(400 + 15 * i, y - 10 * i + 80, x, y - 10 * i + 80);
            circle(400 + 15 * i, y - 10 * i + 80, 5);
        }
        var arrowX = (x < 400) ? 350 : 550;
        Draw.arrow(arrowX, y - 10, dataDir);
    }
    /**
     * Draws vertical lines between two components, with the
     * default colour of orange for 1.
     */
    static verticalConnections(state, x, y1, y2, col) {
        strokeWeight(3);
        col = col || [255, 125, 0];
        for (var i = 0; i < state.length; i++) {
            stroke([col[0] * state[i], col[1] * state[i], col[2] * state[i]]);
            line(x + 8 * i, y1, x + 8 * i, y2);
        }
    }
    /**
     * Draws text with a white background to prevent titles from
     * becoming bolder over time.
     */
    static title(title, x, y) {
        fill(255);
        rect(x, y - 15, 8.5 * title.length, 20);
        fill(0);
        text(title, x, y);
    }
}
/**
 * Draws the 8 bit bus with green for 1 and black for 0.
 */
function drawBus(bus, x, y) {
    noStroke();
    fill(255);
    rect(x - 94, y - 10, 293, 800);
    textSize(15);
    fill(0);
    Draw.title("Bus", 440, 12);
    strokeWeight(5);
    for (var i = 0; i < 8; i++) {
        stroke([0, 255 * bus[i], 0]);
        line(x + 15 * i, y, x + 15 * i, y + 750);
    }
}
/**
 * Draws a 4 bit register with a binary and a numerical display.
 */
function drawRegister4Bit(state, x, y, name, namexOffset) {
    Draw.rectangle(x, y, 75, 50);
    Draw.binaryAndNumerical(state, x + 10, y + 25, [255, 125, 0]);
    fill(0);
    textSize(15);
    noStroke();
    namexOffset = namexOffset || 0;
    Draw.title(name, x + namexOffset, y - 8);
}
/**
 * Draws a clock that is either high or low.
 */
function drawClock(state, x, y) {
    Draw.rectangle(x, y, 75, 50);
    fill(0);
    noStroke();
    textSize(15);
    Draw.title("Clock", x, y - 8);
    textSize(20);
    if (state === 1) {
        text("High", x + 17, y + 25);
        fill([255, 0, 255]);
        circle(x + 38, y + 40, 10);
    }
    else {
        text("Low", x + 20, y + 25);
        circle(x + 38, y + 40, 10);
    }
}
/**
 * Draws an 8 bit register with a binary and numerical display.
 */
function drawRegister8Bit(state, x, y, name, namexOffset) {
    Draw.rectangle(x, y, 135, 90);
    Draw.binaryAndNumerical(state, x + 10, y + 25, [255, 125, 0]);
    textSize(15);
    fill(0);
    namexOffset = namexOffset || 0;
    Draw.title(name, x + namexOffset, y - 8);
}
/**
 * Draws an adder/subtractor with binary and numerical displays as
 * well as showing whether it is adding or subtracting.
 */
function drawAdder(state, x, y) {
    Draw.rectangle(x, y, 180, 90);
    Draw.binaryAndNumerical(state, x + 10, y + 25, [255, 125, 0]);
    fill([0, 0, 255]);
    textSize(20);
    if (computerState._ctrl['su'] === 1) {
        text("A - B", x + 10, y + 70);
    }
    else {
        text("A + B", x + 10, y + 70);
    }
    textSize(15);
    fill(0);
    Draw.title("Adder / Subtractor", x + 70, y - 8);
}
/**
 * Draws an output component with a grey rectangle to represent
 * the display.
 */
function drawOutput(state, x, y) {
    Draw.rectangle(x, y, 150, 90);
    noStroke();
    Draw.binary(state, x + 25, y + 70, [255, 0, 0]);
    textSize(15);
    fill(0);
    Draw.title("Output register", x, y - 8);
    fill(150);
    rect(x + 25, y + 5, 100, 50);
    fill([255, 0, 0]);
    textSize(50);
    var value = state.slice().reverse().reduce((acc, val, idx) => acc + val * (2 ** idx));
    text(String(value), x + 27, y + 47);
}
/**
 * Draws a 16 byte RAM showing the contents as binary and hexadecimal.
 */
function drawRAM(state, x, y) {
    Draw.rectangle(x, y, 200, 320);
    textSize(15);
    fill(0);
    strokeWeight(2);
    line(x + 30, y, x + 30, y + 320);
    noStroke();
    for (var i = 0; i < state.length; i++) {
        fill(0);
        text(String(i) + ':', x + 5, y + 15 + i * 20);
        var dec = state[i].slice().reverse().reduce((acc, val, idx) => acc + val * (2 ** idx));
        text(dec.toString(16).toUpperCase(), x + 40, y + 15 + i * 20);
        Draw.binary(state[i], x + 70, y + 10 + i * 20, [255, 125, 0]);
    }
    fill(0);
    Draw.title("Random access memory", x - 10, y - 8);
}
/**
 * Draws the instruction register with the binary opcode in blue and
 * the operand in orange. Also draws the mnemonic of the instruction
 * in blue and the decimal operand in orange.
 */
function drawInstructionRegister(state, x, y) {
    Draw.rectangle(x, y, 135, 90);
    noStroke();
    textSize(20);
    fill([0, 0, 255]);
    text(binaryToInstuction[state.slice(0, 4).join('')], x + 20, y + 35);
    var operand = state.slice(4).reverse().reduce((acc, val, idx) => acc + val * (2 ** idx));
    fill([255, 125, 0]);
    text(String(operand), x + 85, y + 35);
    fill(0);
    textSize(15);
    Draw.title("Instruction register", x, y - 8);
    Draw.binary(state.slice(0, 4), x + 15, y + 60, [0, 0, 255]);
    Draw.binary(state.slice(4), x + 75, y + 60, [255, 125, 0]);
}
/**
 * Draws the controller sequencer with LEDs for the 6 time steps and
 * 16 LEDs showing the control word.
 */
function drawController(state, x, y) {
    Draw.rectangle(x, y, 275, 100);
    var signals = Object.keys(state);
    noStroke();
    textSize(12);
    textAlign(CENTER);
    for (var i = 0; i < signals.length; i++) {
        Draw.binary([state[signals[i]]], x + 10 + i * 17, y + 85, [0, 0, 255]);
        text(signals[i], x + 10 + i * 17, y + 75);
    }
    for (var i = 0; i < 6; i++) {
        Draw.binary([Number(i === computerState._time)], x + 10 + i * 17, y + 25, [255, 0, 255]);
        text('T' + i, x + 10 + i * 17, y + 15);
    }
    textAlign(LEFT);
    strokeWeight(1);
    stroke(100);
    fill(100);
    line(x + 7, y + 35, x + 30, y + 35);
    line(x + 41, y + 35, x + 98, y + 35);
    noStroke();
    text("fetch", x + 5, y + 47);
    text("execute", x + 48, y + 47);
    text("Control word", x + 185, y + 55);
    fill(0);
    textSize(15);
    Draw.title("Controller sequencer", x, y - 7);
}
/**
 * Draws the flags register with labels for the carry and zero bits.
 */
function drawFlagsRegister(flags, x, y) {
    Draw.rectangle(x, y, 50, 40);
    noStroke();
    Draw.binary([Number(flags[0])], x + 10, y + 10, [255, 125, 0]);
    Draw.binary([Number(flags[1])], x + 10, y + 30, [255, 125, 0]);
    textSize(12);
    fill(0);
    text("carry", x + 20, y + 15);
    text("zero", x + 20, y + 35);
    textSize(15);
    Draw.title("Flags register", x + 25, y - 8);
    Draw.verticalConnections([Number(flags[0]), Number(flags[1])], 760, 342, 378);
}
/**
 * Draws connections between components and the bus with arrows
 * based on the current control signals.
 */
function drawBusConnections(ctrl) {
    if (ctrl['j'] === 1 || ctrl['co'] === 1) {
        Draw.lowNibbleConnection(598, 30, (ctrl['j'] === 1) ? 'r' : 'l');
    }
    if (ctrl['mi'] === 1) {
        Draw.lowNibbleConnection(307, 120, 'l');
    }
    if (ctrl['ri'] === 1 || ctrl['ro'] === 1) {
        Draw.busConnection(307, 210, (ctrl['ro'] === 1) ? 'r' : 'l');
    }
    if (ctrl['ii'] === 1) {
        Draw.busConnection(307, 570, 'l');
    }
    if (ctrl['io'] === 1) {
        Draw.lowNibbleConnection(307, 570, 'r');
    }
    if (ctrl['ai'] || ctrl['ao']) {
        Draw.busConnection(598, 120, (ctrl['ai'] === 1) ? 'r' : 'l');
    }
    if (ctrl['so'] === 1) {
        Draw.busConnection(598, 250, 'l');
    }
    if (ctrl['bi'] === 1) {
        Draw.busConnection(598, 380, 'r');
    }
    if (ctrl['oi'] === 1) {
        Draw.busConnection(598, 510, 'r');
    }
}
//# sourceMappingURL=graphics.js.map