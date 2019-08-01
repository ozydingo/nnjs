import { GraphXY } from "./graph_xy.js"
import { NetworkMapper } from "./network_mapper.js"
import { NetworkPainter } from "./network_painter.js"

export class NeuralNetworkRunner {
  constructor(network, network_svg, output_canvas, select_canvas) {
    this.network = network;
    this.network_svg = network_svg
    this.output_canvas = output_canvas
    this.select_canvas = select_canvas
    this.painter = new NetworkPainter(network_svg, network);
    this.output_mapper = new NetworkMapper(this.network)
    this.output_graph = new GraphXY(output_canvas)
    this.output_graph.xlim(0, 1);
    this.output_graph.ylim(0, 1);
    this.output_graph.zlim(0, 1);
    this.select_graph = new GraphXY(select_canvas)
    this.select_graph.xlim(0, 1);
    this.select_graph.ylim(0, 1);
    this.select_graph.zlim(0, 1);

    this.data_model = 'nand';
    this.set_training_data();
    this.batch_size = 100;

    this.timers = {};

    this.painter.paint();
  }

  // Start here. Run the network: continually train and visualize.
  run() {
    this.clear_timers();

    this.timers.training = setInterval(() => {this.train_batch()}, 30)
    this.timers.painting = setInterval(() => {this.update_network()}, 200)
    this.timers.output = setInterval(() => {this.paint_output()}, 100)
  }

  pause() {
    this.clear_timers();
  }

  clear_timers() {
    if (this.timers.training) {clearInterval(this.timers.training)};
    if (this.timers.painting) {clearInterval(this.timers.painting)};
    if (this.timers.output) {clearInterval(this.timers.output)};
  }

  restart_tratining_timer() {
    if (this.timers.training) {clearInterval(this.timers.training)}
  }

  set_training_data() {
    this.training_data = this.generate_training_data();
  }

  generate_training_data(){
    if (this.data_model === 'nand') {
      return this.generate_nand_data();
    } else if (this.data_model === 'gblob') {
      return this.generate_gaussian_blob_data();
    } else if (this.data_model === 'ring') {
      return this.generate_ring_data();
    } else {
      throw 'Unsopprted data_model: ' + this.data_model;
    }
  }

  generate_nand_data() {
    return [
      {inputs: [0.1,0.1], output: [1]},
      {inputs: [0.1,0.9], output: [1]},
      {inputs: [0.9,0.1], output: [1]},
      {inputs: [0.9,0.9], output: [0]},
    ];
  }

  generate_gaussian_blob_data() {
    var n = 10;

    var model0 = new nnjs.DataModels.GBlob(0.2, 0.6, 0.2, 0.6);
    var zeros = model0.generate(n).map(x => {
      return {inputs: x, output: [0]};
    });

    var model1 = new nnjs.DataModels.GBlob(0.6, 0.7, 0.8, 0.7)
    var ones = model1.generate(n).map(x => {
      return {inputs: x, output: [1]};
    });

    return zeros.concat(ones);
  }

  generate_ring_data() {
    var n = 25;

    var model0 = new nnjs.DataModels.Ring(0.5, 0.5, 0, 0.2);
    var zeros = model0.generate(n).map(x => {
      return {inputs: x, output: [0]};
    });

    var model1 = new nnjs.DataModels.Ring(0.5, 0.5, 0.3, 0.5);
    var ones = model1.generate(n).map(x => {
      return {inputs: x, output: [1]};
    });

    return zeros.concat(ones);
  }

  // Train the network with a single batch of training data/
  // Note that this is NOT the method of efficient stochastic gradient descent,
  // Rather, for conceptual clarity, this runs a forward-backward pass for each
  // input-output data frame. SGD would compute deltas for the entire batch
  // before performing any updates, which could improve performance and reduce
  // hysteresis.
  train_batch() {
    var sample_ii;
    var training_sample;
    for(var kk = 0; kk < this.batch_size; kk++) {
      sample_ii = math.floor(math.random(this.training_data.length));
      training_sample = this.training_data[sample_ii];
      this.network.train(training_sample.inputs, training_sample.output);
    }
  }

  log_to_console() {
    console.dir("0,0: " + this.network.forward([0,0]).activations[this.network.layers.length-1])
    console.dir("0,1: " + this.network.forward([0,1]).activations[this.network.layers.length-1])
    console.dir("1,0: " + this.network.forward([1,0]).activations[this.network.layers.length-1])
    console.dir("1,1: " + this.network.forward([1,1]).activations[this.network.layers.length-1])
  }

  paint() {
    this.paint_network();
    this.paint_output();
  }

  update() {
    this.update_network();
    this.paint_output();
  }

  paint_network() {
    this.painter.paint();
  }

  update_network() {
    this.painter.update();
  }

  // Paint the intput-output map of the network. For 2-input networks, this is
  // a 2D matrix plot.
  paint_output() {
    this.output_graph.clear_canvas();
    this.select_graph.clear_canvas();
    var data = this.output_mapper.compute();
    this.output_graph.matrix(this.output_mapper.input_space[0], this.output_mapper.input_space[1], data);
    this.paint_data_on_output();

    if (this.painter.selected_layer > 0 && this.painter.selected_layer <= this.network.layers.length - 1) {
      var data = this.output_mapper.compute(undefined, [this.painter.selected_layer, this.painter.selected_index]);
      this.select_graph.matrix(this.output_mapper.input_space[0], this.output_mapper.input_space[1], data);
      this.paint_data_on_select();
    } else {
      this.select_graph.clear_canvas();
    }
  }

  // Plot training data on the whole-network input-output matrix canvas.
  paint_data_on_output() {
    var zero_data = this.training_data.filter(d => d.output[0] === 0);
    var zeros = zero_data.map(d => d.inputs)
    var one_data = this.training_data.filter(d => d.output[0] === 1);
    var ones = one_data.map(d => d.inputs)
    this.output_graph.scatter(zeros, ':dot', 0, 5);
    this.output_graph.scatter(ones, ':dot', 1, 5);
  }

  // Plot training data on the selected-neuron input-output matrix canvas.
  paint_data_on_select() {
    var zero_data = this.training_data.filter(d => d.output[0] === 0);
    var zeros = zero_data.map(d => d.inputs)
    var one_data = this.training_data.filter(d => d.output[0] === 1);
    var ones = one_data.map(d => d.inputs)
    this.select_graph.scatter(zeros, ':dot', 0, 5);
    this.select_graph.scatter(ones, ':dot', 1, 5);
  }
}