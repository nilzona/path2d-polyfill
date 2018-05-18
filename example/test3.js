/* eslint-disable */

var canvas = document.getElementById('can3');
var ctx = canvas.getContext('2d')

var path1 = new Path2D();

path1.arc(75, 75, 50, 0, Math.PI);
ctx.strokeStyle = '#999999';
ctx.fillStyle = 'rgba(0, 255, 0, 0.8)';
ctx.lineWidth = 1;
ctx.stroke(path1);
ctx.fill(path1)

ctx.translate(100, 0);
var path2 = new Path2D();
path2.moveTo(75, 75);
path2.lineTo(125, 75);
path2.lineTo(125, 125);
path2.lineTo(75, 125);
path2.closePath();
ctx.fillStyle = 'rgba(0, 0, 255, 0.8)';
ctx.stroke(path2);
ctx.fill(path2)

ctx.translate(-100, 100);
var path3 = new Path2D();
path3.rect(75, 75, 80, 50);
ctx.fillStyle = 'rgba(255, 0, 255, 0.8)';
ctx.stroke(path3);
ctx.fill(path3)


ctx.translate(100, 0);
var path4 = new Path2D(path3);

ctx.fillStyle = 'rgba(0, 255, 255, 0.8)';
ctx.stroke(path4);
ctx.fill(path4)

ctx.translate(100, -50);
var path5 = new Path2D();
path5.moveTo(150, 20);
path5.arcTo(150, 100, 50, 20, 30);
path5.lineTo(50, 20)
path5.closePath();
ctx.fillStyle = 'rgba(255, 255, 0, 0.8)';
ctx.stroke(path5);
ctx.fill(path5)
