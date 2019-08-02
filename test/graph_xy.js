import { GraphXY } from '../lib/graph_xy.js'

var graphs = {};

$(document).ready(function() {
  graphs.path = new GraphXY($("#path")[0]);
  graphs.path.xlim(0,1);
  graphs.path.ylim(0,1);
  graphs.path.path(generate_path_data());

  graphs.matrix = new GraphXY($("#matrix")[0]);
  graphs.matrix.xlim(0,5);
  graphs.matrix.ylim(0,10);
  graphs.matrix.zlim(0,5);
  var {x, y, z} = generate_matrix_data();
  graphs.matrix.matrix(x, y, z);

  graphs.scatter = new GraphXY($("#scatter-text")[0]);
  graphs.scatter.xlim(0,1);
  graphs.scatter.ylim(0,1);
  graphs.scatter.scatter(generate_scatter_data(0.2, 0.4, 0.2, 0.4), 'x', 'rgb(200,0,0)',30)
  graphs.scatter.scatter(generate_scatter_data(0.5, 0.4, 0.7, 0.9), 'o', 'rgb(0,0,200)',30)

  graphs.scatter = new GraphXY($("#scatter-symbol")[0]);
  graphs.scatter.xlim(0,1);
  graphs.scatter.ylim(0,1);
  graphs.scatter.scatter(generate_scatter_data(0.2, 0.4, 0.2, 0.4), ':dot', -1, 4)
  graphs.scatter.scatter(generate_scatter_data(0.5, 0.4, 0.7, 0.9), ':dot', 1, 4)
});

const generate_path_data = function() {
  return [
    [0.0, 0],
    [0.1, 0.1],
    [0.2, 0.2],
    [0.5, 0.3],
    [0.6, 0.8],
    [0.8, 0.2],
    [1.0, 0],
  ]
}

const generate_matrix_data = function() {
  return {
    x: [0,1,2,3,4,5],
    y: [0,1,2,3,4,5,6,7,8,9,10],
    z: [
      [0,1,2,3,4,5],
      [5,4,3,2,1,0],
      [0,1,2,3,4,5],
      [5,4,3,2,1,0],
      [0,1,2,3,4,5],
      [5,4,3,2,1,0],
      [0,1,2,3,4,5],
      [5,4,3,2,1,0],
      [0,1,2,3,4,5],
      [5,4,3,2,1,0],
      [0,1,2,3,4,5],
    ],
  };
}

const generate_scatter_data = function(mx, sx, my, sy) {
  var data = new Array(20);
  for (var ii = 0; ii<data.length; ii++) {
    data[ii] = [
      mx + sx * (Math.random() - 0.5),
      my + sy * (Math.random() - 0.5)
    ];
  }
  return data;
}
