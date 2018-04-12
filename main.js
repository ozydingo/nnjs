var runner;

$(document).ready(function(){
  var network = new nnjs.Network([2,4,1]);
  var svg = $("#netsvg")[0];
  runner = new nnjs.Runner(network, svg);
  runner.paint();
})

$(document).on("click", "#play", function() {
  $("#play").hide();
  $("#pause").show();
  runner.run();
});

$(document).on("click", "#pause", function() {
  $("#pause").hide();
  $("#play").show();
  runner.pause();
});
