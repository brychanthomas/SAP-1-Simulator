const instructionToBinary = {
  'NOP': [0,0,0,0],
  'LDA': [0,0,0,1],
  'ADD': [0,0,1,0],
  'SUB': [0,0,1,1],
  'STA': [0,1,0,0],
  'LDI': [0,1,0,1],
  'JMP': [0,1,1,0],
  'JC':  [0,1,1,1],
  'JZ':  [1,0,0,0],
  'OUT': [1,1,1,0],
  'HLT': [1,1,1,1]
}

function assemble(program: string) {
  var programArr = program.toUpperCase().split('\n');
  var output: number[][] = [];
  for (var line of programArr) {
    var opcode = line.split(' ')[0];
    var operand = line.split(' ')[1] || 0;
    var lineOutput = instructionToBinary[opcode]
    var operandBinary = Number(operand).toString(2).padStart(4, '0').
                        split('').map((n) => Number(n));
    lineOutput = lineOutput.concat(operandBinary);
    output.push(lineOutput);
  }
  return output;
}
