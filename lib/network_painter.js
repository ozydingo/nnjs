function NetworkPainter(canvas, network) {
  if (canvas.tagName !== 'CANVAS') { throw 'Graph2 requires a canvas element'; }

  this.canvas = canvas;
  this.cursor = canvas.getContext("2d");
  this.network = network;

}

NetworkPainter.prototype = {
  paint: function() {

  },

  neuron_radius: function() {
    return this.canvas.width / (4 * this.network.layers.length + 1);
  },

  neuron_spacing: function() {
    return 4 * this.neuron_radius();
  },

  neuron_x: function(layer, index) {
    return this.neuron_radius() + layer * (this.canvas.width - 2 * this.neuron_radius()) / (this.network.layers.length - 1);
  },

  neuron_y: function(layer, index) {
    return this.canvas.height - (this.neuron_radius() + layer * (this.canvas.height - 2 * this.neuron_radius()) / (this.network.layers.length - 1));
  },
}
