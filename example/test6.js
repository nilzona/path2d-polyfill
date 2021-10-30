(function () {
  var canvas = document.getElementById("can6");
  var ctx = canvas.getContext("2d");

  // even odd path
  var region = new Path2D("M 30 90 L 110 20 L 240 130 L 60 130 L 190 20 L 270 90 Z");

  ctx.fillStyle = "red";
  ctx.fill(region, "evenodd");

  // Listen for mouse moves
  canvas.addEventListener("mousemove", function (event) {
    // Check whether point is inside region
    if (ctx.isPointInPath(region, event.offsetX, event.offsetY, "evenodd")) {
      ctx.fillStyle = "green";
    } else {
      ctx.fillStyle = "red";
    }

    // Draw region
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fill(region, "evenodd");
  });
})();
