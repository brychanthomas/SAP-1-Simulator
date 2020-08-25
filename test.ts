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
}

UnitTests.testARegister();
UnitTests.testRAM();
