var graphs = {};

$(document).ready(function() {
  graphs.path = new nnjs.GraphXY($("#path")[0]);
  graphs.path.xlim(0,1);
  graphs.path.ylim(0,1);
  graphs.path.path(generate_path_data());

  graphs.matrix = new nnjs.GraphXY($("#matrix")[0]);
  graphs.matrix.xlim(0,5);
  graphs.matrix.ylim(0,10);
  graphs.matrix.zlim(0,5);
  var {x, y, z} = generate_matrix_data();
  graphs.matrix.matrix(x, y, z);

  graphs.scatter = new nnjs.GraphXY($("#scatter")[0]);
});

generate_path_data = function() {
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

generate_matrix_data = function() {
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
