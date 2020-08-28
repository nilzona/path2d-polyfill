(function () {
  var canvas = document.getElementById('can5');
  var ctx = canvas.getContext('2d');

  var path = new Path2D('M20,20h100v100Zm120,0h100v100Z');

  ctx.strokeStyle = '#666';
  ctx.fillStyle = '#DDD';

  ctx.fill(path);
  ctx.stroke(path);
})();
