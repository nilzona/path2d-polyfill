(function run() {
  const canvas = document.getElementById("close-canvas");
  const ctx = canvas?.getContext("2d");
  if (ctx) {
    const path = new Path2D("M20,20h100v100Zm120,0h100v100Z");
    ctx.strokeStyle = "#666";
    ctx.fillStyle = "#DDD";
    ctx.fill(path);
    ctx.stroke(path);
  }
})();
