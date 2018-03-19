nnjs.Runner = function(network, svg) {
  this.network = network;
  this.svg = svg
  this.painter = new nnjs.NetworkPainter(svg, network);
  this.training_data = this.generate_training_data();
  this.batch_size = 100;

  this.timers = {};
}

nnjs.Runner.prototype = {
  run: function() {
    var runner = this;
    this.clear_timers();

    this.timers.training = setInterval(function(){runner.train_batch()}, 30)
    this.timers.painting = setInterval(function(){runner.paint()}, 200)
    this.timers.logging = setInterval(function(){runner.log_to_console()}, 2000)
  },

  pause: function() {
    this.clear_timers();
  },

  clear_timers: function() {
    if (this.timers.training) {clearInterval(this.timers.training)};
    if (this.timers.painting) {clearInterval(this.timers.painting)};
    if (this.timers.logging) {clearInterval(this.timers.logging)};
  },

  restart_tratining_timer: function() {
    if (this.timers.training) {clearInterval(this.timers.training)}
  },

  generate_training_data: function(){
    return [
      {inputs: [0,0], output: [1]},
      {inputs: [0,1], output: [1]},
      {inputs: [1,0], output: [1]},
      {inputs: [1,1], output: [0]},
    ];
  },

  train_batch: function() {
    var sample_ii;
    var training_sample;
    for(var kk = 0; kk < this.batch_size; kk++) {
      sample_ii = math.floor(math.random(this.training_data.length));
      training_sample = this.training_data[sample_ii];
      this.network.train(training_sample.inputs, training_sample.output);
    }
  },

  log_to_console: function() {
    console.log("0,0: " + this.network.forward([0,0]).activations[this.network.layers.length-1])
    console.log("0,1: " + this.network.forward([0,1]).activations[this.network.layers.length-1])
    console.log("1,0: " + this.network.forward([1,0]).activations[this.network.layers.length-1])
    console.log("1,1: " + this.network.forward([1,1]).activations[this.network.layers.length-1])
  },

  paint: function() {
    this.painter.paint();
  }
}
