(function () {
  var canvas = document.getElementById("bezier-canvas");
  var ctx = canvas.getContext("2d");

  ctx.strokeStyle = "black";
  ctx.stroke(new Path2D("M10 80 C 40 10, 65 10, 95 80 S 150 150, 180 80"));

  ctx.translate(200, 0);
  ctx.stroke(new Path2D("M10 80 Q 95 10 180 80"));

  ctx.translate(-200, 200);
  ctx.stroke(new Path2D("M10 80 Q 52.5 10, 95 80 T 180 80"));
})();
