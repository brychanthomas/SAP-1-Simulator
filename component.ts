import type { Computer } from './computer.js';

export abstract class Component {
  protected computer: Computer;

  constructor(computer: Computer) {
    this.computer = computer;
  }

  abstract update(): void;
}
