(function run() {
  const canvas = document.getElementById("clip-canvas");
  const ctx = canvas?.getContext("2d");
  if (ctx) {
    // Create clipping path
    const region = new Path2D();
    region.rect(80, 10, 20, 130);
    region.rect(40, 50, 100, 50);
    ctx.clip(region, "evenodd");

    // Draw stuff that gets clipped
    ctx.fillStyle = "blue";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
})();
