function Neuron(num_inputs) {
  if (num_inputs == null) { throw "You must provide a number of inputs for your neuron.";}
  this.num_inputs = num_inputs;
  this.weights = math.random([num_inputs], -1, 1);;
  this.bias = math.random(-1, 1);
  this.activation_fn = nnjs_functions.sigmoid;
  this.activation_grad = nnjs_functions.sigmoid_prime;
  this.eta = 0.1;
};

Neuron.prototype = {
  forward: function(inputs) {
    return this.activation_fn(this.weighted_input(inputs));
  },

  backward: function(inputs, output_gradient) {
    var input_gradients = this.back_gradient(inputs, output_gradient);
    var bias_gradient = input_gradients[1];
    var weights_gradient = input_gradients[0];
    this.bias = this.bias - this.eta * bias_gradient;
    this.weights = math.subtract(this.weights, math.multiply(this.eta, weights_gradient));
    return this;
  },

  weighted_input: function(inputs) {
    return math.multiply(this.weights, inputs) + this.bias;
  },

  output_gradient: function(weighted_input, output_gradient) {
    return weighted_input * output_gradient;
  },

  back_gradient: function(inputs, output_gradient) {
    var del = this.output_gradient(this.weighted_input(inputs), output_gradient);
    var bias_gradient = del;
    var weights_gradient = inputs * del;
    return [weights_gradient, bias_gradient];
  },
};
