nnjs.NeuronMapper = function(neuron) {
  this.neuron = neuron;
  // TODO: all the dimensions, not just the piddly ones
  this.dims = [0, 1]
  this.ndim = this.dims.length;
  this.lims = new Array(this.ndim);
  this.steps = new Array(this.ndim);
  this.input_space = null;

  for (var ii=0; ii<neuron.num_inputs; ii++) {
    this.lims[ii] = [-1, 1];
    this.steps[ii] = 0.05;
  }
  this.input_space = this.compute_input_space();
}

nnjs.NeuronMapper.prototype = {
  compute: function() {
    var inputs = new Array(this.dims.length);


    // Initialize input array
    for (var ii=0; ii < this.dims.length; ii++){
      inputs[ii] = this.lims[this.dims[ii]][0];
    }

    return this.map_one(inputs, this.ndims - 1);
  },

  //-------private-ish---------//

  map_one: function(inputs, index) {
    var mapper = this;
    return this.input_space[index].map(function(x, jj) {
      // this is in-place modification of inputs, but that's ok.
      inputs[index] = mapper.input_space[index][jj];
      if (index == 0) {
        return mapper.neuron.forward(inputs);
      } else {
        return mapper.map_one(inputs, index - 1);
      }
    });
  },

  compute_input_space: function() {
    var space = new Array(this.ndim);
    for (var ii=0; ii<neuron.num_inputs; ii++) {
      space[ii] = new Array;
      for (var jj = this.lims[ii][0]; jj <= this.lims[ii][1]; jj += this.steps[ii]) {
        space[ii][space[ii].length] = jj
      }
    }
    return space;
  }


}
