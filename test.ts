import { Computer } from "./computer.js";

function run_tests(): void {
  var c = new Computer();
  c.controlLines.ai = 1;
  c.bus.lines = [0,1,0,1,0,1,0,1];
  c.clockTick();
  console.log(c.aRegister.contents == [0,1,0,1,0,1,0,1])
  c.bus.lines = [0,0,0,0,0,0,0,0];
  c.controlLines.ai = 0;
  c.controlLines.ao = 1;
  c.clockTick();
  console.log(c.bus.lines == [0,1,0,1,0,1,0,1]);
}

run_tests();
