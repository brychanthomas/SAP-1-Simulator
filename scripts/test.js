import { Computer } from "./computer.js";
/**
 * Class of static methods testing different components
 * and instructions of the CPU.
 */
class UnitTests {
    /**
     * Compares the actual output of a test with the expected
     * output and writes a passed/failed message to the
     * console accordingly.
     */
    static compare(output, expected, testName) {
        if (JSON.stringify(output) === JSON.stringify(expected)) {
            console.log("%cPassed " + testName, UnitTests.passCSS);
        }
        else {
            console.log("%cFailed " + testName, UnitTests.failCSS);
        }
    }
    static testARegister() {
        var c = new Computer();
        c.controlLines.ai = 1;
        c.bus.lines = [0, 1, 0, 1, 0, 1, 0, 1];
        c.update();
        UnitTests.compare(c.aRegister.contents, [0, 1, 0, 1, 0, 1, 0, 1], "A register in");
        c.bus.lines = [0, 0, 0, 0, 0, 0, 0, 0];
        c.controlLines.ai = 0;
        c.controlLines.ao = 1;
        c.update();
        UnitTests.compare(c.bus.lines, [0, 1, 0, 1, 0, 1, 0, 1], "A register out");
    }
    static testRAM() {
        var c = new Computer();
        c.bus.lowNibble = [0, 0, 1, 0];
        c.controlLines.mi = 1;
        c.update();
        UnitTests.compare(c.mar.address, 2, "MAR load");
        c.controlLines.mi = 0;
        c.bus.lines = [0, 1, 0, 1, 0, 1, 0, 1];
        c.controlLines.ri = 1;
        c.update();
        c.bus.lines = [0, 0, 0, 0, 0, 0, 0, 0];
        c.controlLines.ri = 0;
        c.controlLines.ro = 1;
        c.update();
        UnitTests.compare(c.bus.lines, [0, 1, 0, 1, 0, 1, 0, 1], "RAM in/out");
    }
    static testAdderSubtractor() {
        var c = new Computer();
        c.aRegister.contents = [0, 0, 0, 0, 0, 1, 0, 0];
        c.bRegister.contents = [0, 0, 0, 0, 0, 1, 1, 1];
        c.controlLines.so = 1;
        c.clockTick();
        var output = c.bus.lines.concat([c.flagsRegister.cf, c.flagsRegister.zf]);
        UnitTests.compare(output, [0, 0, 0, 0, 1, 0, 1, 1, 0, 0], "addition");
        c.controlLines.su = 1;
        c.clockTick();
        output = c.bus.lines.concat([c.flagsRegister.cf, c.flagsRegister.zf]);
        UnitTests.compare(output, [1, 1, 1, 1, 1, 1, 0, 1, 0, 0], "subtraction");
        c.aRegister.contents = [1, 1, 1, 1, 1, 1, 1, 1];
        c.controlLines.su = 0;
        c.controlLines.fi = 1;
        c.clockTick();
        output = c.bus.lines.concat([c.flagsRegister.cf, c.flagsRegister.zf]);
        UnitTests.compare(output, [0, 0, 0, 0, 0, 1, 1, 0, 1, 0], "carry flag");
        c.bRegister.contents = [1, 1, 1, 1, 1, 1, 1, 1];
        c.controlLines.su = 1;
        c.clockTick();
        output = c.bus.lines.concat([c.flagsRegister.cf, c.flagsRegister.zf]);
        UnitTests.compare(output, [0, 0, 0, 0, 0, 0, 0, 0, 0, 1], "zero flag");
    }
    static testInstructionFetch() {
        var c = new Computer();
        c.ram.registers[0].contents = [1, 0, 1, 0, 1, 0, 1, 0];
        c.clockTock();
        c.clockTick();
        c.clockTock(), c.clockTick();
        UnitTests.compare(c.ir.contents, [1, 0, 1, 0, 1, 0, 1, 0], "instruction fetch");
        UnitTests.compare(c.pc.contents, [0, 0, 0, 1], "program counter increment");
    }
    static testBasicInstructions() {
        var c = new Computer();
        c.ram.registers[0].contents = [0, 0, 0, 1, 1, 1, 1, 1]; //LDA 15
        c.ram.registers[15].contents = [0, 1, 0, 1, 0, 1, 0, 1];
        for (var i = 0; i < 6; i++) {
            c.clockTock();
            c.clockTick();
        }
        UnitTests.compare(c.aRegister.contents, [0, 1, 0, 1, 0, 1, 0, 1], "LDA instruction");
        c.ram.registers[14].contents = [0, 0, 0, 0, 0, 0, 0, 1];
        c.ram.registers[1].contents = [0, 0, 1, 0, 1, 1, 1, 0]; //ADD 14
        for (var i = 0; i < 6; i++) {
            c.clockTock();
            c.clockTick();
        }
        UnitTests.compare(c.aRegister.contents, [0, 1, 0, 1, 0, 1, 1, 0], "ADD instruction");
        c.ram.registers[13].contents = [0, 0, 1, 0, 0, 0, 0, 0];
        c.ram.registers[2].contents = [0, 0, 1, 1, 1, 1, 0, 1]; // SUB 13
        for (var i = 0; i < 6; i++) {
            c.clockTock();
            c.clockTick();
        }
        UnitTests.compare(c.aRegister.contents, [0, 0, 1, 1, 0, 1, 1, 0], "SUB instruction");
        c.ram.registers[3].contents = [1, 1, 1, 0, 0, 0, 0, 0]; // OUT
        for (var i = 0; i < 6; i++) {
            c.clockTock();
            c.clockTick();
        }
        UnitTests.compare(c.out.contents, [0, 0, 1, 1, 0, 1, 1, 0], "OUT instruction");
    }
    static testExtraInstructions() {
        var c = new Computer();
        c.aRegister.contents = [0, 1, 0, 1, 0, 1, 0, 1];
        c.ram.registers[0].contents = [0, 1, 0, 0, 1, 1, 1, 1]; // STA 15
        for (var i = 0; i < 6; i++) {
            c.clockTock();
            c.clockTick();
        }
        UnitTests.compare(c.ram.registers[15].contents, [0, 1, 0, 1, 0, 1, 0, 1], "STA instruction");
        c.ram.registers[1].contents = [0, 1, 0, 1, 0, 0, 1, 1]; // LDI 3
        for (var i = 0; i < 6; i++) {
            c.clockTock();
            c.clockTick();
        }
        UnitTests.compare(c.aRegister.contents, [0, 0, 0, 0, 0, 0, 1, 1], "LDI instruction");
        c.ram.registers[2].contents = [0, 1, 1, 0, 0, 1, 1, 0]; // JMP 6
        for (var i = 0; i < 6; i++) {
            c.clockTock();
            c.clockTick();
        }
        UnitTests.compare(c.pc.contents, [0, 1, 1, 0], "JMP instruction");
    }
    static testConditionalJumps() {
        var c = new Computer();
        c.ram.registers[0].contents = [0, 1, 1, 1, 1, 1, 1, 1]; // JC 15
        for (var i = 0; i < 6; i++) {
            c.clockTock();
            c.clockTick();
        }
        var output = c.pc.contents;
        c.flagsRegister.cf = 1;
        c.ram.registers[1].contents = [0, 1, 1, 1, 1, 1, 1, 1]; // JC 15
        for (var i = 0; i < 6; i++) {
            c.clockTock();
            c.clockTick();
        }
        output = output.concat(c.pc.contents);
        UnitTests.compare(output, [0, 0, 0, 1, 1, 1, 1, 1], "JC instruction");
        var c = new Computer();
        c.ram.registers[0].contents = [1, 0, 0, 0, 1, 1, 1, 1]; // JZ 15
        for (var i = 0; i < 6; i++) {
            c.clockTock();
            c.clockTick();
        }
        var output = c.pc.contents;
        c.flagsRegister.zf = 1;
        c.ram.registers[1].contents = [1, 0, 0, 0, 1, 1, 1, 1]; // JZ 15
        for (var i = 0; i < 6; i++) {
            c.clockTock();
            c.clockTick();
        }
        output = output.concat(c.pc.contents);
        UnitTests.compare(output, [0, 0, 0, 1, 1, 1, 1, 1], "JZ instruction");
    }
}
UnitTests.passCSS = 'background: #222; color: #bada55';
UnitTests.failCSS = 'background: #222; color: #ff6666';
UnitTests.testARegister();
UnitTests.testRAM();
UnitTests.testAdderSubtractor();
UnitTests.testInstructionFetch();
UnitTests.testBasicInstructions();
UnitTests.testExtraInstructions();
UnitTests.testConditionalJumps();
//# sourceMappingURL=test.js.map