(function () {
  var canvas = document.getElementById('can1');
  var ctx = canvas.getContext('2d');

  function draw2circles(x1, y1, x2, y2, r) {
    ctx.strokeStyle = '#999999';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x1, y1, r, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x2, y2, r, 0, 2 * Math.PI);
    ctx.stroke();
  }

  ctx.translate(50, 50);

  ctx.strokeStyle = 'black';
  draw2circles(125, 80, 80, 125, 45);
  var path1 = new Path2D('M 80 80 A 45 45 0 0 0 125 125 L 125 80 Z');
  ctx.fillStyle = 'rgba(0, 255, 0, 0.8)';
  ctx.lineWidth = 2;
  ctx.stroke(path1);
  ctx.fill(path1);

  draw2circles(275, 80, 230, 125, 45);
  var path2 = new Path2D('M 230 80 A 45 45 0 1 0 275 125 L 275 80 Z');
  ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
  ctx.lineWidth = 2;
  ctx.stroke(path2);
  ctx.fill(path2);

  draw2circles(125, 230, 80, 275, 45);
  var path3 = new Path2D('M80 230 A 45 45 0 0 1 125 275 L 125 230 Z');
  ctx.fillStyle = 'rgba(128, 0, 128, 0.8)';
  ctx.lineWidth = 2;
  ctx.stroke(path3);
  ctx.fill(path3);

  draw2circles(275, 230, 230, 275, 45);
  var path4 = new Path2D('M230 230 A 45 45 0 1 1 275 275 L 275 230 Z');
  ctx.fillStyle = 'rgba(0, 0, 255, 0.8)';
  ctx.lineWidth = 2;
  ctx.stroke(path4);
  ctx.fill(path4);
})();
