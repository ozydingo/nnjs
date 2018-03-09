var network = new nnjs.Network([2,4,1]);
var svg = $("#svg0")[0];
var runner = new nnjs.Runner(network, svg);
runner.run();

bob = new nnjs.NetworkPainter(svg, network)


var inputs = [1,2];
var desired_outputs = [1];
network.train(inputs, desired_outputs)

var training_data = [
  {inputs: [0,0], output: [1]},
  {inputs: [0,1], output: [1]},
  {inputs: [1,0], output: [1]},
  {inputs: [1,1], output: [0]},
]

var sample_ii;
var training_sample;

for(var kk = 0; kk < 1000; kk++) {
  sample_ii = math.floor(math.random(training_data.length));
  training_sample = training_data[sample_ii];
  network.train(training_sample.inputs, training_sample.output);
}

console.log("0,0: " + network.forward([0,0]).activations[network.layers.length-1])
console.log("0,1: " + network.forward([0,1]).activations[network.layers.length-1])
console.log("1,0: " + network.forward([1,0]).activations[network.layers.length-1])
console.log("1,1: " + network.forward([1,1]).activations[network.layers.length-1])

bob.paint();
