function NetworkPainter(svg, network) {
  if (svg.tagName !== 'svg') { throw 'NetworkPainter requires a svg element'; }

  this.svg = svg;
  this.network = network;

}

NetworkPainter.prototype = {
  paint: function() {
    this.clear();
    for (ll=0; ll<this.network.layers.length; ll++) {
      for (ii=0; ii<this.network.layers[ll].length; ii++) {
        this.paint_neuron(ll, ii);
        if (ll > 0) {
          for (jj=0; jj<this.network.layers[ll-1].length; jj++) {
            this.paint_axon(ll, ii, jj);
          }
        }
      }
    }
  },

  clear: function() {
    this.svg.innerHTML = "";
  },

  paint_neuron: function(layer, index) {
    var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', this.neuron_x(layer, index));
    circle.setAttribute('cy', this.neuron_y(layer, index));
    circle.setAttribute('r', this.neuron_radius());
    circle.setAttribute('fill', 'none');
    circle.setAttribute('stroke', this.coef_color(this.network.layers[layer][index].bias));
    circle.setAttribute('stroke-width', 1);
    this.svg.appendChild(circle);
  },

  paint_axon: function(layer, to_index, from_index) {
    var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    var r = this.neuron_radius();
    var nx0 = this.neuron_x(layer - 1, from_index);
    var ny0 = this.neuron_y(layer - 1, from_index);
    var nx1 = this.neuron_x(layer, to_index);
    var ny1 = this.neuron_y(layer, to_index);
    var d = math.sqrt((nx1-nx0)**2 + (ny1-ny0)**2);
    var a = (r + 5) / d;
    var x0 = nx0 + a * (nx1 - nx0);
    var y0 = ny0 + a * (ny1 - ny0);
    var x1 = nx1 - a * (nx1 - nx0);
    var y1 = ny1 - a * (ny1 - ny0);
    var weight = this.network.layers[layer][to_index].weights[from_index];

    line.setAttribute('x1', x0);
    line.setAttribute('y1', y0);
    line.setAttribute('x2', x1);
    line.setAttribute('y2', y1);
    line.setAttribute('style', 'stroke:' + this.coef_color(weight) + ';stroke-width:1');
    this.svg.appendChild(line);
  },

  neuron_radius: function() {
    var xrad = this.canvas_width() / (4 * this.network.layers.length + 1);
    var max_n = math.max(this.network.layers.map(function(ns) {return ns.length;}));
    var yrad = this.canvas_height() / (2 * max_n + 1);
    return math.min(xrad, yrad);
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

  coef_color: function(coef) {
    if (coef > 0) {
      var red = math.round(255 * (2 * nnjs_functions.sigmoid(5 * coef) - 1));
      var blue = 0;
    } else {
      var red = 0;
      var blue = math.round(255 * (2 * nnjs_functions.sigmoid(-5 * coef) - 1));
    }
    return 'rgb(' + red + ',0,' + blue + ')';
  },
}
