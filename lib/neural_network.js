import { Neuron } from './neuron.js'

// num_neurons is an array of integers, length == number of layers
// Each integer represents the number of neurons in that layer.
export class NeuralNetwork {
  constructor(num_neurons) {
    if (typeof(num_neurons) !== 'object' || num_neurons.length === undefined) {
      throw 'num_neurons must be an array of num neurons per layer.'
    }
    this.num_neurons = num_neurons;
    this.layers = [];
    for (var ll=0; ll < num_neurons.length; ll++) {
      if (ll === 0) {
        this.layers[ll] = this.build_input_layer(num_neurons[ll]);
      } else {
        this.layers[ll] = this.build_layer(num_neurons[ll], this.layers[ll-1]);
      }
    }
    this.eta = 0.1;
  }

  // Compute activations and weighted inputs (z) of all neurons in the network.
  forward(inputs) {
    if (typeof(inputs) !== 'object') {
      throw 'Invalid inputs: expected numbers.'
    } else if (inputs.length !== this.layers[0].length) {
      throw '' + this.layers[0].length + ' inputs expected, ' + inputs.length + ' given.'
    }

    var z = this.nulls()
    var activations = this.nulls();
    z[0] = inputs.slice();
    activations[0] = inputs.slice();
    for (var layer = 1; layer < this.layers.length; layer++) {
      z[layer] = math.multiply(this.layer_weights(layer), activations[layer - 1])
      if (typeof(z[layer]) === 'number') {
        z[layer] = [z[layer]];
      } else {
        z[layer] = z[layer]._data;
      }
      activations[layer] = z[layer].map((z, ii) => {
        return this.layers[layer][ii].activation_fn(z);
      });
    }
    return {z: z, activations: activations};
  }

  // Return just the output activations of the network for given inputs.
  output(inputs) {
    var result = this.forward(inputs);
    return result.activations[this.layers.length - 1];
  }

  // Run one forward-backward pass and update the network params
  train(inputs, desired_outputs) {
    if (typeof(inputs) !== 'object') {
      throw 'Invalid inputs: expected numbers.'
    } else if (inputs.length !== this.layers[0].length) {
      throw '' + this.layers[0].length + ' output errors expected, ' + inputs.length + ' given.'
    }
    if (typeof(desired_outputs) !== 'object') {
      throw 'Invalid desired_outputs: expected numbers.'
    } else if (desired_outputs.length !== this.layers[this.layers.length - 1].length) {
      throw '' + this.layers[this.layers.length - 1].length + ' output errors expected, ' + desired_outputs.length + ' given.'
    }

    var forward_values = this.forward(inputs);
    var z = forward_values["z"];
    var activations = forward_values["activations"];
    var activation_grads = this.compute_activation_gradients(z);
    var layer_error = this.compute_layer_errors(activations, activation_grads, desired_outputs);
    var gradients = this.compute_gradients(activations, layer_error);

    // Apply deltas
    for (var layer = 1; layer < this.layers.length; layer++) {
      for (var ii = 0; ii < this.layers[layer].length; ii++) {
        this.layers[layer][ii].bias = this.layers[layer][ii].bias - gradients["bias"][layer][ii] * this.eta;
        for (var jj = 0; jj < this.layers[layer-1].length; jj++) {
          this.layers[layer][ii].weights[jj] = this.layers[layer][ii].weights[jj] - gradients["weights"][layer]._data[ii][jj] * this.eta;
        }
      }
    }
  }

  // Get the activation gradients in the network given the weighted inputs (z).
  compute_activation_gradients(weighted_inputs) {
    var grads = this.nulls();
    for (var layer=1; layer < this.layers.length; layer++) {
      grads[layer] = weighted_inputs[layer].map((z, ii) => {
        return this.layers[layer][ii].activation_grad(z);
      });
    }
    return grads;
  }

  // Compute the error at each layer, needed for the backprop algorithm.
  compute_layer_errors(activations, activation_grads, desired_outputs) {
    var layer_error = this.nulls();

    layer_error[this.layers.length - 1] = math.dotMultiply(
      math.subtract(
        activations[this.layers.length - 1], desired_outputs
      ),
      activation_grads[this.layers.length - 1]
    );

    for (var layer = this.layers.length - 2; layer > 0; layer--) {
      layer_error[layer] = math.dotMultiply(
        math.multiply(
          math.transpose(this.layer_weights(layer + 1)),
          layer_error[layer + 1]
        ),
        activation_grads[layer],
      )._data;
    }

    return layer_error;
  }

  // Compute the gradients on each param to be applied in backprop
  compute_gradients(activations, layer_error) {
    var d_bias = this.nulls();
    var d_weights = this.nulls();

    for (var layer = 1; layer < this.layers.length; layer++) {
      d_bias[layer] = layer_error[layer].slice();
      d_weights[layer] = math.multiply(
        math.transpose(math.matrix([layer_error[layer]])),
        math.matrix([ activations[layer - 1] ])
      );
    }

    return {bias: d_bias, weights: d_weights};
  }

  // ----- private-ish ------ //

  build_input_layer(num_neurons) {
    var layer = new Array(num_neurons);
    for (var ii=0; ii<num_neurons; ii++) {
      layer[ii] = new Neuron(0);
      layer[ii].activation_fn = (x) => x;
      layer[ii].activation_grad = (x) => 1;
      layer[ii].bias = 0;
      layer[ii].weights = [1];
    }
    return layer;
  }

  build_layer(num_neurons, input_layer) {
    var layer = new Array(num_neurons);
    var num_inputs = input_layer.length;
    for (var ii=0; ii<num_neurons; ii++) {
      layer[ii] = new Neuron(num_inputs);
    }
    return layer;
  }

  layer_weights(layer) {
    return math.matrix(
      this.layers[layer].map(neuron => neuron.weights)
    );
  }

  // Allocate an array of nulls, one for each neuron.
  nulls() {
    return this.layers.map(neurons => neurons.map(neuron => null));
  }
}
