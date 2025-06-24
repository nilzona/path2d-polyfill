(function run() {
  const canvas = document.getElementById("rounded-rect-canvas");
  const ctx = canvas?.getContext("2d");
  if (ctx) {
    ctx.translate(30, 30);
    ctx.fillStyle = "rgba(155, 0, 255, 0.8)";
    ctx.strokeStyle = "black";

    // Helper function to draw labels
    function drawLabel(text, x, y) {
      const originalFillStyle = ctx.fillStyle;
      ctx.fillStyle = "black";
      ctx.font = "10px Arial";
      ctx.fillText(text, x, y);
      ctx.fillStyle = originalFillStyle;
    }

    // roundRect, 4 radiuses
    const path1 = new Path2D();
    path1.roundRect(0, 0, 80, 50, [5, 10, 20, 30]);
    ctx.stroke(path1);
    ctx.fill(path1);
    drawLabel("4 radii", 5, -5);

    // roundRect, 3 radiuses
    ctx.translate(100, 0);
    const path2 = new Path2D();
    path2.roundRect(0, 0, 80, 50, [5, 10, 20]);
    ctx.stroke(path2);
    ctx.fill(path2);
    drawLabel("3 radii", 5, -5);

    // roundRect, 2 radiuses
    ctx.translate(100, 0);
    const path3 = new Path2D();
    path3.roundRect(0, 0, 80, 50, [5, 10]);
    ctx.stroke(path3);
    ctx.fill(path3);
    drawLabel("2 radii", 5, -5);

    // roundRect, 1 radius
    ctx.translate(100, 0);
    const path4 = new Path2D();
    path4.roundRect(0, 0, 80, 50, [5]);
    ctx.stroke(path4);
    ctx.fill(path4);
    drawLabel("1 radius", 5, -5);

    // Single elliptical corner radius (all corners same ellipse)
    ctx.translate(-300, 70);
    const pathEllipse1 = new Path2D();
    pathEllipse1.roundRect(0, 0, 80, 50, { x: 15, y: 8 });
    ctx.stroke(pathEllipse1);
    ctx.fill(pathEllipse1);
    drawLabel("Elliptical {x:15,y:8}", 5, -5);

    // Mixed: elliptical and circular corners
    ctx.translate(100, 0);
    const pathEllipse2 = new Path2D();
    pathEllipse2.roundRect(0, 0, 80, 50, [{ x: 12, y: 5 }, 10, { x: 6, y: 15 }, 8]);
    ctx.stroke(pathEllipse2);
    ctx.fill(pathEllipse2);
    drawLabel("Mixed types", 5, -5);

    // Partial DOMPointInit (only x specified)
    ctx.translate(100, 0);
    const pathEllipse3 = new Path2D();
    pathEllipse3.roundRect(0, 0, 80, 50, { x: 20 });
    ctx.stroke(pathEllipse3);
    ctx.fill(pathEllipse3);
    drawLabel("Only x: {x:20}", 5, -5);

    // Partial DOMPointInit (only y specified)
    ctx.translate(100, 0);
    const pathEllipse4 = new Path2D();
    pathEllipse4.roundRect(0, 0, 80, 50, { y: 20 });
    ctx.stroke(pathEllipse4);
    ctx.fill(pathEllipse4);
    drawLabel("Only y: {y:20}", 5, -5);

    // roundRect, radius as number
    ctx.translate(-300, 70);
    const path5 = new Path2D();
    path5.roundRect(0, 0, 80, 50, 5);
    ctx.stroke(path5);
    ctx.fill(path5);
    drawLabel("Number: 5", 5, -5);

    // roundRect, no radius
    ctx.translate(100, 0);
    const path6 = new Path2D();
    path6.roundRect(0, 0, 80, 50);
    ctx.stroke(path6);
    ctx.fill(path6);
    drawLabel("No radius", 5, -5);

    // round rect with big linewidth
    ctx.translate(100, 0);
    const path7 = new Path2D();
    path7.roundRect(0, 0, 80, 50, [15, 15, 15, 0]);
    const temp = ctx.lineWidth;
    ctx.lineWidth = 10;
    ctx.stroke(path7);
    ctx.lineWidth = temp;
    drawLabel("Thick line", 5, -5);

    // Comparison: circular vs elliptical
    ctx.translate(100, 0);
    const pathCompare = new Path2D();
    pathCompare.roundRect(0, 0, 40, 50, 12); // circular
    pathCompare.roundRect(40, 0, 40, 50, { x: 12, y: 6 }); // elliptical
    ctx.stroke(pathCompare);
    ctx.fill(pathCompare);
    drawLabel("Circular vs Elliptical", 5, -5);

    // roundRect when path already has begun with other elements and with more path elements after
    ctx.translate(-300, 70);
    const path8 = new Path2D();
    path8.moveTo(150, 0);
    path8.lineTo(200, 0);
    path8.lineTo(150, 50);
    path8.roundRect(50, 0, 80, 50, { x: 8, y: 12 }); // Using elliptical corners
    path8.lineTo(0, 50);
    path8.lineTo(0, 0);
    ctx.stroke(path8);
    ctx.fill(path8);
    drawLabel("Complex path + elliptical", 5, -5);

    // draw roundRect directly in canvas (existing tests)
    ctx.translate(0, 70);
    ctx.roundRect(0, 0, 80, 50, [5, 10, 20, 30]);
    drawLabel("Direct canvas 4 radii", 5, -5);
    ctx.translate(100, 0);
    ctx.roundRect(0, 0, 80, 50, [5, 10, 20]);
    drawLabel("Direct canvas 3 radii", 5, -5);
    ctx.translate(100, 0);
    ctx.roundRect(0, 0, 80, 50, [5, 10]);
    drawLabel("Direct canvas 2 radii", 5, -5);
    ctx.translate(100, 0);
    ctx.roundRect(0, 0, 80, 50, [5]);
    drawLabel("Direct canvas 1 radius", 5, -5);
    ctx.stroke();
    ctx.fill();

    // draw elliptical roundRect directly in canvas (new functionality)
    ctx.translate(-300, 70);
    ctx.beginPath();
    ctx.roundRect(0, 0, 80, 50, { x: 15, y: 8 });
    drawLabel("Direct elliptical", 5, -5);
    ctx.translate(100, 0);
    ctx.roundRect(0, 0, 80, 50, [{ x: 10, y: 5 }, 8, { x: 5, y: 12 }, 6]);
    drawLabel("Direct mixed", 5, -5);
    ctx.stroke();
    ctx.fill();
  }
})();
