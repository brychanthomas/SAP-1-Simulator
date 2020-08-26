//https://github.com/EnigmaCurry/SAP
//https://eater.net/schematics/high-level.png
//https://1.bp.blogspot.com/-jcMswG3yvwo/VmacKcGNGcI/AAAAAAAAAw4/GO51tD-s75g/s1600/image1.jpeg
import { Computer } from "./computer.js";

var computer = new Computer();
computer.ram.registers[0].contents = [0,0,1,0, 1,1,1,1]; // ADD 15
computer.ram.registers[1].contents = [1,1,1,0, 0,0,0,0]; // OUT
computer.ram.registers[2].contents = [0,1,1,0, 0,0,0,0]; // JMP 0
computer.ram.registers[15].contents = [0,0,0,0,0,0,1,1];

function tock() {
  computer.clockTock();
  setTimeout( () => tick() , 10);
}

function tick() {
  computer.clockTick();
  setTimeout( () => tock() , 10);
}

tock();
