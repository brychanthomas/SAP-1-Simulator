//https://github.com/EnigmaCurry/SAP
//https://eater.net/schematics/high-level.png
//https://1.bp.blogspot.com/-jcMswG3yvwo/VmacKcGNGcI/AAAAAAAAAw4/GO51tD-s75g/s1600/image1.jpeg
import { Computer } from "./computer.js";
var computer = new Computer();
computer.ram.program(assemble(default_program));
computer.startClock();
computer.clock.speed = 6; // 6 Hertz
/*
 * Set all of the properties of the computerState object to
 * update the graphics.
 */
setInterval(() => {
    computerState.ctrl = computer.controlLines;
    computerState.pc = computer.pc.contents;
    computerState.clock = computer.clock.level;
    computerState.aRegister = computer.aRegister.contents;
    computerState.adder = computer.adderSubtractor.output;
    computerState.flags = computer.flagsRegister.flags;
    computerState.bRegister = computer.bRegister.contents;
    computerState.output = computer.out.contents;
    computerState.mar = computer.mar.contents;
    computerState.ram = computer.ram.contents;
    computerState.ir = computer.ir.contents;
    computerState.time = computer.controller.timeStep;
    computerState.bus = computer.bus.lines;
    computer.clock.speed = slider.value();
    computerState.clockSpeed = computer.clock.speed;
    // if the user has requested that their program be assembled
    // and written to RAM
    if (newProgram) {
        newProgram = false;
        computer.reset();
        computer.ram.program(assemble(programBox.value()));
    }
    // update graphics twice every clock cycle but not more often than every 50ms
}, Math.max(50, 1000 / (computer.clock.speed * 2)));
//# sourceMappingURL=script.js.map