import type { Computer } from './computer.js';

/**
 * Abstract class representing a component of the
 * computer.
 */
export abstract class Component {
  protected computer: Computer;

  constructor(computer: Computer) {
    this.computer = computer;
  }

  abstract update(): void;
}
