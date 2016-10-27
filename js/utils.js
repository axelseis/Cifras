


PIXI.Graphics.prototype.drawStar = function(xCenter, yCenter, nPoints, outerRadius, innerRadius){
    var points = [];
    for (var ixVertex = 0; ixVertex <= 2 * nPoints; ++ixVertex) {
        var angle = ixVertex * Math.PI / nPoints - Math.PI / 2;
        var radius = ixVertex % 2 == 0 ? outerRadius : innerRadius;
        points.push(xCenter + radius * Math.cos(angle));
        points.push(yCenter + radius * Math.sin(angle));
        //this.lineTo(xCenter + radius * Math.cos(angle), yCenter + radius * Math.sin(angle));
    }
    this.drawPolygon(points);
};

var Cifras = Cifras || {};
Cifras.Utils = {};

Cifras.Utils.spiral = function (cols, rows){
    var x,y,dx,dy;
    x = y = dx =0;
    dy = -1;
    var t = Math.max(cols,rows);
    var maxI = t*t;
    var points = [[0,0]];

    for(var i =0; i < maxI; i++){
        if ((-cols/2 <= x) && (x <= cols/2) && (-cols/2 <= y) && (y <= cols/2)){
            // DO STUFF...
        }
        if( (x == y) || ((x < 0) && (x == -y)) || ((x > 0) && (x == 1-y))){
            t = dx;
            dx = -dy;
            dy = t;
        }
        x += dx;
        y += dy;
        points.push([x,y])
    }
    return points;
    console.log('points ' , points);
};

