(function run() {
  const canvas = document.getElementById("path2d-methods-canvas");
  const ctx = canvas?.getContext("2d");
  if (ctx) {
    const path1 = new Path2D();
    path1.arc(75, 75, 50, 0, Math.PI);
    path1.lineTo(75, 50);
    path1.lineTo(100, 60);
    path1.closePath();
    ctx.strokeStyle = "#999999";
    ctx.fillStyle = "rgba(0, 255, 0, 0.8)";
    ctx.lineWidth = 1;
    ctx.stroke(path1);
    ctx.fill(path1);
    ctx.translate(100, 0);
    const path2 = new Path2D();
    path2.moveTo(75, 75);
    path2.lineTo(125, 75);
    path2.lineTo(125, 125);
    path2.lineTo(75, 125);
    path2.closePath();
    ctx.fillStyle = "rgba(0, 0, 255, 0.8)";
    ctx.stroke(path2);
    ctx.fill(path2);
    ctx.translate(-100, 100);
    const path3 = new Path2D();
    path3.rect(75, 75, 80, 50);
    ctx.fillStyle = "rgba(255, 0, 255, 0.8)";
    ctx.stroke(path3);
    ctx.fill(path3);
    ctx.translate(100, 0);
    const path4 = new Path2D(path3);
    ctx.fillStyle = "rgba(0, 255, 255, 0.8)";
    ctx.stroke(path4);
    ctx.fill(path4);
    // arc
    ctx.translate(100, -50);
    const path5 = new Path2D();
    path5.moveTo(150, 20);
    path5.arcTo(150, 100, 50, 20, 30);
    path5.lineTo(50, 20);
    path5.closePath();
    ctx.fillStyle = "rgba(255, 255, 0, 0.8)";
    ctx.stroke(path5);
    ctx.fill(path5);
    // ellipse
    ctx.translate(0, 50);
    const path6 = new Path2D();
    path6.ellipse(150, 120, 60, 40, Math.PI / 4, 0, (5 * Math.PI) / 6, true);
    path6.closePath();
    ctx.fillStyle = "rgba(255, 0, 0, 0.8)";
    ctx.stroke(path6);
    ctx.fill(path6);
  }
})();
