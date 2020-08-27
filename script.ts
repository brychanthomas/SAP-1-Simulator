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

function tock() {
  computer.clockTock();
  setTimeout( () => tick() , 40);
}

function tick() {
  computer.clockTick();
  setTimeout( () => tock() , 40);
}

tock();
