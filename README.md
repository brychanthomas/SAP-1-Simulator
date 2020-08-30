# SAP-1-Simulator
This is a simulator of Ben Eater's breadboard computer using the SAP-1 (Simple As Possible 1) architechture described by Albert Malvino in the book Digital Computer Electronics.

# Instruction set

The computer can execute 11 different instructions:

Instruction | Description
--- | ---
NOP | Do nothing
LDA | Load the value in the specified memory address into the A register.
ADD | Add the value in the specified memory address with the value in the A register, storing the result in the A register.
SUB | Subtract the value in the specified memory address from the value in the A register, storing the result in the A register.
STA | Store the value in the A register in the specified memory address.
LDI | Immediately load the specified value into the A register without involving memory.
JMP | Jump to the specified instruction number.
JC | Jump to the specified instruction number if the carry flag is set.
JZ | Jump to the specified instruction number if the zero flag is set.
OUT | Load the value in the A register into the output register to be shown on a display.
HLT | Stop the computer clock.
