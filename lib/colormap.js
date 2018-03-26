nnjs.Colormap = function(preset) {
  this.preset = preset || 'yuletide'
}

nnjs.Colormap.prototype = {
  style: function(coef) {
    var rgba = this.rgba(coef)
    return 'rgb(' + rgba[0] + ',' + rgba[1] + ',' + rgba[2] + ')';
  },

  rgba: function(coef) {
    if (coef > 1) { coef = 1; }
    if (coef < -1) { coef = -1; }
    if (coef > 0) {
      var red = this.color_partial(coef, 220, 220);
      var green = this.color_partial(coef, 200, 100);
      var blue = this.color_partial(coef, 200, 100);
    } else {
      var red = this.color_partial(-coef, 220, 100);
      var green = this.color_partial(-coef, 200, 200);
      var blue = this.color_partial(-coef, 200, 100);
    }
    // TODO: add gradient alpha support
    var alpha = 1;
    return [red, green, blue, alpha];
  },

  color_partial: function(x, min, max) {
    if (min === undefined) { min = 0; }
    if (max === undefined) { max = 255; }
    return math.round(min + (max - min) * x);
  }
}
