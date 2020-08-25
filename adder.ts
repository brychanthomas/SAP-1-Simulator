import { Component } from './component.js';

export class AdderSubtractor extends Component {
  public flags = {cf: 0, zf: 0}
  update() {
    var a = this.computer.aRegister.contents.slice().reverse().reduce(
      (acc, val, idx) => acc + val * (2**idx)); //convert to number
    var b = this.computer.bRegister.contents.slice().reverse().reduce(
      (acc, val, idx) => acc + val * (2**idx));
    var out = a + b;
    if (this.computer.controlLines.su === 1) { // Subtract
      out = a - b;
    }
    if (this.computer.controlLines.so === 1) { // Sum out
      this.computer.bus.lines =
        (out >>> 0).toString(2).padStart(8, '0').split('').slice(-8).map(x=>+x);
    }
    if (this.computer.controlLines.fi === 1) { // Flags in
      this.flags.cf = Number((out >>> 0).toString(2).padStart(9, '0')[0]);
      this.flags.zf = Number(out === 0);
    }
  }
}
