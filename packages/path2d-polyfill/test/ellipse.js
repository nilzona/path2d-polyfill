(function run() {
  const canvas = document.getElementById("ellipse-canvas");
  const ctx = canvas?.getContext("2d");
  if (ctx) {
    ctx.translate(50, 50);
    ctx.strokeStyle = "red";
    const path1 = new Path2D("M 10 90 l 40 -40");
    ctx.stroke(path1);
    ctx.strokeStyle = "black";
    const path2 = new Path2D("M 10 90 a 30 50 -20 1 0 40 -40");
    ctx.stroke(path2);
    ctx.strokeStyle = "black";
    const path3 = new Path2D("M 10 90 a 40 60 20 1 1 40 -40");
    ctx.stroke(path3);
    ctx.strokeStyle = "blue";
    const path4 = new Path2D("M 10 90 a 30 50 -20 0 1 40 -40");
    ctx.stroke(path4);
    ctx.strokeStyle = "blue";
    const path5 = new Path2D("M 10 90 a 40 60 20 0 0 40 -40");
    ctx.stroke(path5);
    ctx.strokeStyle = "black";
    const path6 = new Path2D(
      "M0,300 l 30,-15" +
        "a15,15 -30 0,1 30,-15 l 30,-15" +
        "a15,30 -30 0,1 30,-15 l 30,-15" +
        "a15,45 -30 0,1 30,-15 l 30,-15" +
        "a15,60 -30 0,1 30,-15 l 30,-15",
    );
    ctx.stroke(path6);
    ctx.strokeStyle = "black";
    const path7 = new Path2D(
      "a15,15 -30 0,1 30,-15 l 30,-15" +
        "a15,30 -30 0,1 30,-15 l 30,-15" +
        "a15,45 -30 0,1 30,-15 l 30,-15" +
        "a15,60 -30 0,1 30,-15 l 30,-15",
    );
    ctx.stroke(path7);
  }
})();
