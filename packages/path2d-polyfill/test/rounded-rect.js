(function run() {
  const canvas = document.getElementById("rounded-rect-canvas");
  const ctx = canvas?.getContext("2d");
  if (ctx) {
    ctx.translate(30, 30);
    ctx.fillStyle = "rgba(155, 0, 255, 0.8)";
    ctx.strokeStyle = "black";
    // roundRect, 4 radiuses
    const path1 = new Path2D();
    path1.roundRect(0, 0, 80, 50, [5, 10, 20, 30]);
    ctx.stroke(path1);
    ctx.fill(path1);
    // roundRect, 3 radiuses
    ctx.translate(100, 0);
    const path2 = new Path2D();
    path2.roundRect(0, 0, 80, 50, [5, 10, 20]);
    ctx.stroke(path2);
    ctx.fill(path2);
    // roundRect, 2 radiuses
    ctx.translate(100, 0);
    const path3 = new Path2D();
    path3.roundRect(0, 0, 80, 50, [5, 10]);
    ctx.stroke(path3);
    ctx.fill(path3);
    // roundRect, 1 radius
    ctx.translate(100, 0);
    const path4 = new Path2D();
    path4.roundRect(0, 0, 80, 50, [5]);
    ctx.stroke(path4);
    ctx.fill(path4);
    // roundRect, radius as number
    ctx.translate(-300, 100);
    const path5 = new Path2D();
    path5.roundRect(0, 0, 80, 50, 5);
    ctx.stroke(path5);
    ctx.fill(path5);
    // roundRect, no radius
    ctx.translate(100, 0);
    const path6 = new Path2D();
    path6.roundRect(0, 0, 80, 50);
    ctx.stroke(path6);
    ctx.fill(path6);

    // round rect with big linewidth
    ctx.translate(100, 0);
    const path7 = new Path2D();
    path7.roundRect(0, 0, 80, 50, [15, 15, 15, 0]);
    const temp = ctx.lineWidth;
    ctx.lineWidth = 10;
    ctx.stroke(path7);
    ctx.lineWidth = temp;
    // roundRect when path already has begun with other elements and with more path elements after
    ctx.translate(-100, 100);
    const path8 = new Path2D();
    path8.moveTo(0, 75);
    path8.lineTo(50, 75);
    path8.lineTo(0, 125);
    path8.roundRect(0, 0, 80, 50, [5]);
    path8.lineTo(-50, 50);
    path8.lineTo(-50, 0);
    ctx.stroke(path8);
    ctx.fill(path8);
    // draw roundRect directly in canvas
    ctx.translate(-100, 175);
    ctx.roundRect(0, 0, 80, 50, [5, 10, 20, 30]);
    ctx.translate(100, 0);
    ctx.roundRect(0, 0, 80, 50, [5, 10, 20]);
    ctx.translate(100, 0);
    ctx.roundRect(0, 0, 80, 50, [5, 10]);
    ctx.translate(100, 0);
    ctx.roundRect(0, 0, 80, 50, [5]);
    ctx.stroke();
    ctx.fill();
  }
})();
