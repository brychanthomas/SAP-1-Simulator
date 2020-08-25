import { Computer } from "./computer.js";

class UnitTests {
  static passCSS = 'background: #222; color: #bada55';
  static failCSS = 'background: #222; color: #ff6666';

  static compare(output: any, expected: any, testName: string) {
    if (JSON.stringify(output) === JSON.stringify(expected)) {
      console.log("%cPassed " + testName, UnitTests.passCSS);
    } else {
      console.log("%cFailed " + testName, UnitTests.failCSS);
    }
  }

  static testARegister(): void {
    var c = new Computer();
    c.controlLines.ai = 1;
    c.bus.lines = [0,1,0,1,0,1,0,1];
    c.clockTick();
    UnitTests.compare(c.aRegister.contents, [0,1,0,1,0,1,0,1], "A register in");
    c.bus.lines = [0,0,0,0,0,0,0,0];
    c.controlLines.ai = 0;
    c.controlLines.ao = 1;
    c.clockTick();
    UnitTests.compare(c.bus.lines, [0,1,0,1,0,1,0,1], "A register out");
  }

  static testRAM(): void {
    var c = new Computer();
    c.bus.lowNibble = [0, 0, 1, 0];
    c.controlLines.mi = 1;
    c.clockTick();
    UnitTests.compare(c.mar.address, 2, "MAR load");
    c.controlLines.mi = 0;
    c.bus.lines = [0,1,0,1,0,1,0,1];
    c.controlLines.ri = 1;
    c.clockTick();
    c.bus.lines = [0,0,0,0,0,0,0,0];
    c.controlLines.ri = 0;
    c.controlLines.ro = 1;
    c.clockTick();
    UnitTests.compare(c.bus.lines, [0,1,0,1,0,1,0,1], "RAM in/out");
  }

  static testAdderSubtractor(): void {
    var c = new Computer();
    c.aRegister.contents = [0, 0, 0, 0, 0, 1, 0, 0];
    c.bRegister.contents = [0, 0, 0, 0, 0, 1, 1, 1];
    c.controlLines.so = 1;
    c.clockTick();
    var output = c.bus.lines.concat([c.adderSubtractor.flags.cf, c.adderSubtractor.flags.zf]);
    UnitTests.compare(output, [0,0,0,0,1,0,1,1, 0,0], "addition");
    c.controlLines.su = 1;
    c.clockTick();
    output = c.bus.lines.concat([c.adderSubtractor.flags.cf, c.adderSubtractor.flags.zf]);
    UnitTests.compare(output, [1,1,1,1,1,1,0,1, 0,0], "subtraction");
    c.aRegister.contents = [1, 1, 1, 1, 1, 1, 1, 1];
    c.controlLines.su = 0;
    c.controlLines.fi = 1;
    c.clockTick();
    output = c.bus.lines.concat([c.adderSubtractor.flags.cf, c.adderSubtractor.flags.zf]);
    UnitTests.compare(output, [0,0,0,0,0,1,1,0, 1,0], "carry flag");
    c.bRegister.contents = [1, 1, 1, 1, 1, 1, 1, 1];
    c.controlLines.su = 1;
    c.clockTick();
    output = c.bus.lines.concat([c.adderSubtractor.flags.cf, c.adderSubtractor.flags.zf]);
    UnitTests.compare(output, [0,0,0,0,0,0,0,0, 0,1], "zero flag");
  }

  static testInstructionFetch() {
    var c = new Computer();
    c.ram.registers[0].contents = [1,0,1,0,1,0,1,0];
    c.clockTock(); c.clockTick();
    c.clockTock(), c.clockTick();
    UnitTests.compare(c.ir.contents, [1,0,1,0,1,0,1,0], "instruction fetch");
    UnitTests.compare(c.pc.state, [0,0,0,1], "program counter increment");
  }
}

UnitTests.testARegister();
UnitTests.testRAM();
UnitTests.testAdderSubtractor();
UnitTests.testInstructionFetch();
