var runner;

$(document).ready(function(){
  var network = new nnjs.Network([2,4,1]);
  var svg = $("#svg0")[0];
  runner = new nnjs.Runner(network, svg);
})

$(document).on("click", "#play_pause", function() {
  runner.run();
});
