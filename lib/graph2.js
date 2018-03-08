nnjs.Graph2 = function(canvas) {
  if (canvas.tagName !== 'CANVAS') { throw 'Graph2 requires a canvas element'; }

  this.canvas = canvas;
  this.cursor = canvas.getContext("2d");
  this.axes = {
    display: false,
    xlim: [-1, 1],
    ylim: [-1, 1],
  }
  this.paths = [];

  this.clear_canvas();
};

nnjs.Graph2.prototype = {
  axis: function(val) {
    if (val === undefined) { return this.axes; }
    this.axes.display = !!val;
    this.redraw();
    return this.axes;
  },

  path: function(path) {
    this.validate_path(path);
    this.paths[this.paths.length] = path;
    this.draw_path(path);
  },

  xlim: function(low, high) {
    if (typeof(low) !== 'number' || typeof(high) !== 'number') {
      throw 'Invalid xlim: numeric type required.'
    }
    this.axes.xlim = [low, high];
    this.redraw();
  },

  ylim: function(low, high) {
    if (typeof(low) !== 'number' || typeof(high) !== 'number') {
      throw 'Invalid ylim: numeric type required.'
    }
    this.axes.ylim = [low, high];
    this.redraw();
  },

  //---------private-ish-----------//

  clear_canvas: function() {
    this.canvas.width = this.canvas.width;
  },

  redraw: function() {
    var graph = this;
    this.clear_canvas();
    if (this.axes.display) { this.draw_axes(); }
    this.paths.forEach(function(path) { graph.draw_path(path)});
  },

  draw_axes: function () {
    this.draw_path([[this.axes.xlim[0], 0], [this.axes.xlim[1], 0]]);
    this.draw_path([[0, this.axes.ylim[0]], [0, this.axes.ylim[1]]]);
  },

  draw_path: function(path) {
    var graph = this;
    var pencil_down = false;
    path.forEach(function(xy, index) {
      if (graph.is_point_in_view(xy)) {
        if (pencil_down) {
          graph.cursor.lineTo(graph.x_to_px(xy[0]), graph.y_to_px(xy[1]));
        } else {
          pencil_down = true;
          graph.cursor.moveTo(graph.x_to_px(xy[0]), graph.y_to_px(xy[1]));
        }
      } else {
        if (pencil_down) { graph.cursor.stroke(); }
        pencil_down = false
      }
    });
    if (pencil_down) { graph.cursor.stroke(); }
  },

  is_point_in_view: function(xy) {
    return (
      xy[0] >= this.axes.xlim[0] && xy[0] <= this.axes.xlim[1] &&
      xy[1] >= this.axes.ylim[0] && xy[1] <= this.axes.ylim[1]
    );
  },

  x_to_px: function(x) {
    return (x - this.axes.xlim[0]) / (this.axes.xlim[1] - this.axes.xlim[0]) * this.canvas.width;
  },

  y_to_px: function(y) {
    return (this.axes.ylim[1] - y) / (this.axes.ylim[1] - this.axes.ylim[0]) * this.canvas.height;
  },

  validate_path: function(path) {
    path.forEach(function(xy, idx) {
      if (
        typeof(xy) !== 'object' ||
        xy.length !== 2
      ) { throw 'Invalid path: must be array of [x,y] pairs.' }
      if (typeof(xy[0]) !== 'number' || typeof(xy[1]) !== 'number') {
        throw 'Invalid path: numeric data pairs required (received ' + typeof(xy[0]) + ', ' + typeof(xy[1]) + ').'
      }
    })
  },
}
