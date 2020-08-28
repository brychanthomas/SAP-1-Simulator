//https://github.com/EnigmaCurry/SAP
//https://eater.net/schematics/high-level.png
//https://1.bp.blogspot.com/-jcMswG3yvwo/VmacKcGNGcI/AAAAAAAAAw4/GO51tD-s75g/s1600/image1.jpeg
import { Computer } from "./computer.js";

var computer = new Computer();
computer.ram.program([
  [0,1,0,1, 0,0,0,1], // LDI 1
  [0,1,0,0, 1,1,1,0], // STA 14
  [0,1,0,1, 0,0,0,0], // LDI 0
  [0,1,0,0, 1,1,1,1], // STA 15
  [1,1,1,0, 0,0,0,0], // OUT
  [0,0,0,1, 1,1,1,0], // LDA 14
  [0,0,1,0, 1,1,1,1], // ADD 15
  [0,1,0,0, 1,1,1,0], // STA 14
  [1,1,1,0, 0,0,0,0], // OUT
  [0,0,0,1, 1,1,1,1], // LDA 15
  [0,0,1,0, 1,1,1,0], // ADD 14
  [0,1,1,1, 0,0,0,0], // JC 0
  [0,1,1,0, 0,0,1,1]  // JMP 3
]);

computer.startClock();
computer.clock.speed = 6;

setInterval(() => {
  computerState.ctrl = computer.controlLines;
  computerState.pc = computer.pc.state;
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
}, Math.max(50, 1000/(computer.clock.speed*2)));
