neuron = function(num_inputs) {
  var num_inputs;
  var weights;
  var bias;
  var activation_fn;
  var activation_grad;

  function initialize() {
    activation_fn = nnjs_functions.sigmoid;
    activation_grad = nnjs_functions.sigmoid_prime;
    weights = math.random([num_inputs], -1, 1);
    bias = 0;
  }

  function weighted_input(inputs) {
    return math.multiply(weights, inputs) + bias;
  }

  function forward(inputs) {
    return activation_fn(weighted_input(inputs));
  }

  function backward(inputs, output_gradient) {
    var del = output_gradient(weighted_input(inputs), output_gradient);
    var bias_gradient = del;
    var weights_gradient = inputs * del;
    return [bias_gradient, weights_gradient];
  }

  function output_gradient(weighted_input, output_gradient) {
    return weighted_input * output_gradient;
  }

  function get_num_inputs() {
    return num_inputs;
  }

  function get_weights() {
    return weights;
  }

  function set_weights(new_weights) {
    if (weights.length !== new_weights.length) {
      throw('Weights must have ' + num_inputs + ' elements.')
    }
    weights = new_weights;
  }

  function get_bias() {
    return bias;
  }

  function set_bias() {
    bias = bias;
  }

  initialize();

  return {
    get_num_inputs: get_num_inputs,
    get_weights: get_weights,
    set_weights: set_weights,
    get_bias: get_bias,
    set_bias: set_bias,
    forward: forward,
    backward: backward
  };
}
