function Neuron(num_inputs) {
  if (num_inputs == null) { throw "You must provide a number of inputs for your neuron.";}
  this.num_inputs = num_inputs;
  this.weights = math.random([num_inputs], -1, 1);;
  this.bias = math.random(-1, 1);
  this.activation_fn = nnjs_functions.sigmoid;
  this.activation_grad = nnjs_functions.sigmoid_prime;
};

Neuron.prototype = {
  forward: function(inputs) {
    return this.activation_fn(weighted_input(inputs));
  },

  backward: function(inputs, output_gradient) {
    var del = this.output_gradient(weighted_input(this.inputs), output_gradient);
    var bias_gradient = del;
    var weights_gradient = inputs * del;
    return [bias_gradient, weights_gradient];
  },

  weighted_input: function(inputs) {
    return math.multiply(weights, inputs) + bias;
  },

  output_gradient: function(weighted_input, output_gradient) {
    return weighted_input * output_gradient;
  },
};
