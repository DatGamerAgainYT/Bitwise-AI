const Neuron = require("./neuron.js");

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});


const inputs = [new Neuron(), new Neuron()]; // Input Layer w/ 2 neurons
const hiddens = [new Neuron(), new Neuron()]; // Hidden Layer w/ 2 neurons
const outputs = [new Neuron()]; // Output Layer w/ 1 neuron


// Connect Input Layer to Hidden Layer
for (let i = 0; i < inputs.length; i++){
	for (let j = 0; j < hiddens.length; j++){
		inputs[i].connect(hiddens[j]);
	}
}

// Connect Hidden Layer to Output Layer
for (let i = 0; i < hiddens.length; i++){
	for (let j = 0; j < outputs.length; j++){
		hiddens[i].connect(outputs[j]);
	}
}

const activate = (input) => {
  inputs.forEach((neuron, i) => neuron.activate(input[i]));
  hiddens.forEach(neuron => neuron.activate());
  return outputs.map(neuron => neuron.activate());
};


const propagate = (target) => {
  outputs.forEach((neuron, t) => neuron.propagate(target[t]));
  hiddens.forEach(neuron => neuron.propagate());
  return inputs.forEach(neuron => neuron.propagate());
};


const train = (dataset, iterations=1) => {
  while(iterations > 0) {
    dataset.map(datum => {
      activate(datum.inputs);
      propagate(datum.outputs);
    });
    iterations--;
  }
};

// Training data
const trainingdata = {
	XOR: [
	  {inputs: [0, 0], outputs: [0]},
	  {inputs: [0, 1], outputs: [1]},
	  {inputs: [1, 0], outputs: [1]},
	  {inputs: [1, 1], outputs: [0]}
	],
	AND: [
	  {inputs: [0, 0], outputs: [1]},
	  {inputs: [0, 1], outputs: [0]},
	  {inputs: [1, 0], outputs: [0]},
	  {inputs: [1, 1], outputs: [1]}
	],
	OR: [
	  {inputs: [0, 0], outputs: [0]},
	  {inputs: [0, 1], outputs: [1]},
	  {inputs: [1, 0], outputs: [1]},
	  {inputs: [1, 1], outputs: [1]}
	],
	NAND: [
	  {inputs: [0, 0], outputs: [1]},
	  {inputs: [0, 1], outputs: [1]},
	  {inputs: [1, 0], outputs: [1]},
	  {inputs: [1, 1], outputs: [0]}
	],
	NOR: [
	  {inputs: [0, 0], outputs: [1]},
	  {inputs: [0, 1], outputs: [0]},
	  {inputs: [1, 0], outputs: [0]},
	  {inputs: [1, 1], outputs: [0]}
	],
	XNOR: [
	  {inputs: [0, 0], outputs: [1]},
	  {inputs: [0, 1], outputs: [0]},
	  {inputs: [1, 0], outputs: [0]},
	  {inputs: [1, 1], outputs: [1]}
	]
};

// Inputs from the Command Line.
function input1(){
	readline.question(`First number? (in Binary)\n`, input => {
		if (/^[01]+$/.test(input)) {
			return input2(input); 
		}
		input1();
	});
}
function input2(biNum1){
	readline.question(`\nSecond number? (in Binary)\n`, input => {
		if (/^[01]+$/.test(input)) {
			return input3(biNum1, input);
		}
		input2(biNum1);
	});
}
function input3(biNum1, biNum2){
	readline.question(`\nOperation? (OR, AND, XOR, NOR, NAND, XNOR)\n`, input => {
		input = input.toUpperCase();
		if (["OR", "AND", "XOR", "NOR", "NAND", "XNOR"].some(v => input.includes(v))) {
			input4(biNum1, biNum2, input);
		}
		input3(biNum1, biNum2);
	});
}
function input4(biNum1, biNum2, method){
	readline.question(`\nIterations?\n`, input => {
		if (/^[0-9]+$/.test(input)) {
			start(biNum1, biNum2, method, input);
			return readline.close();
		}
		input2(biNum1);
	});
}
// Start inputs.
input1();


// Start the AI
function start(biNum1, biNum2, method, iterations){
	
	// 2 binary numbers, in an array.
	let biNums = [biNum1, biNum2];

	// Sort biNums, descending by length.
	biNums = biNums.sort((a, b) => {
		return b.length - a.length;
	});

	// Add padding to biNums[1].
	biNums[1] = biNums[1].padStart(biNums[0].length, '0');
	
	// Set the iteration to 0.
	let iter = 0;
	
	while (iter < iterations){
		
		// Train the AI with trainingdata.
		train(trainingdata[method], 1);

		let Output = ""; // Initialize Output.

		for (let i = 0; i < biNums[0].length; i++){
			// Activate both neurons with digit i of biNums[0], and biNums[1], respectivley, convert it to a string and add it to the output.
			Output += Math.round(activate([parseInt(biNums[0].charAt(i)), parseInt(biNums[1].charAt(i))])).toString();
		}
		// Format the data and print to the console.
		console.log(`\n${biNums[0]}\n${method}\n${biNums[1]}\n\n${Output}\nIteration: ${iter}`);
		
		// Rinse and repeat until iter = iterations.
		iter++;
	}
}