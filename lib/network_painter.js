function NetworkPainter(svg, network) {
  if (svg.tagName !== 'svg') { throw 'NetworkPainter requires a svg element'; }

  this.svg = svg;
  this.network = network;

}

NetworkPainter.prototype = {
  paint: function() {
    for (ll=0; ll<this.network.layers.length; ll++) {
      for (ii=0; ii<this.network.layers[ll].length; ii++) {
        this.paint_neuron(ll, ii);
      }
    }
  },

  paint_neuron: function(layer, index) {
    var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', this.neuron_x(layer, index));
    circle.setAttribute('cy', this.neuron_y(layer, index));
    circle.setAttribute('r', this.neuron_radius());
    circle.setAttribute('fill', 'none');
    circle.setAttribute('stroke', 'black');
    circle.setAttribute('stroke-width', 1);
    this.svg.appendChild(circle);
  },

  neuron_radius: function() {
    return this.canvas_width() / (4 * this.network.layers.length + 1);
  },

  neuron_spacing: function() {
    return 4 * this.neuron_radius();
  },

  canvas_width: function() {
    return this.svg.getBoundingClientRect().width;
  },

  canvas_height: function() {
    return this.svg.getBoundingClientRect().height;
  },

  neuron_x: function(layer, index) {
    if (this.network.layers.length === 1) {
      return this.canvas_width() / 2;
    } else {
      return this.neuron_radius() + layer * (this.canvas_width() - 2 * this.neuron_radius()) / (this.network.layers.length - 1);
    }
  },

  neuron_y: function(layer, index) {
    if (this.network.layers[layer].length === 1) {
      return this.canvas_height() / 2;
    } else {
      return this.canvas_height() - (this.neuron_radius() + index * (this.canvas_height() - 2 * this.neuron_radius()) / (this.network.layers[layer].length - 1));
    }
  },
}
