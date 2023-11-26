(function run() {
  const canvas = document.getElementById("bezier-canvas");
  const ctx = canvas?.getContext("2d");
  if (ctx) {
    ctx.strokeStyle = "black";
    ctx.stroke(new Path2D("M10 80 C 40 10, 65 10, 95 80 S 150 150, 180 80"));
    ctx.translate(200, 0);
    ctx.stroke(new Path2D("M10 80 Q 95 10 180 80"));
    ctx.translate(-200, 200);
    ctx.stroke(new Path2D("M10 80 Q 52.5 10, 95 80 T 180 80"));
  }
})();
