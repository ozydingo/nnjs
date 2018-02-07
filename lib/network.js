function Network(num_neurons) {
  if (typeof(num_neurons) !== 'object' || num_neurons.length === undefined) {
    throw 'num_neurons must be an array of num neurons per layer.'
  }
  this.num_neurons = num_neurons;
  this.layers = num_neurons.map(function(num, ll) {
    layer = new Array(num);
    var num_inputs = (ll === 0) ? 1 : num_neurons[ll-1]
    for (ii=0; ii<num; ii++) {
      layer[ii] = new Neuron(num_inputs);
      if (ll===0) {
        layer[ii].activation_fn = function(x) { return x; };
        layer[ii].activation_grad = function(x) { return 1; };
        layer[ii].bias = 0;
        layer[ii].weights = [1];
      }
    }
    return layer;
  });

  this.outputs = this.layers.map(function(neurons) {
    return neurons.map(function(neuron) {
      return null;
    })
  });
}

Network.prototype = {
  forward: function(inputs) {
    if (typeof(inputs) !== 'object') {
      throw 'Invalid inputs: expected numbers.'
    } else if (inputs.length !== this.layers[0].length) {
      throw '' + this.layers[0].length + ' inputs expected, ' + inputs.length + ' given.'
    }

    var outputs = this.outputs
    outputs[0] = inputs;
    for (ii = 1; ii < this.layers.length; ii++) {
      outputs[ii] = this.layers[ii].map(function(neuron) {
        return neuron.forward(outputs[ii-1]);
      })
    }

    return outputs;
  }
}
