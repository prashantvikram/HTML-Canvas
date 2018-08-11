document.addEventListener("DOMContentLoaded", function () {
    var canvas = document.getElementById("main-canvas");

    var requestAnimationFrame = window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;

    //set up canvas
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    var context = canvas.getContext("2d");
    context.fillStyle = '#FFFFFF';
    context.fillRect(0, 0, canvas.width, canvas.height);
    var pause = false;

    var maxScale = 50;
    var minScale = 0.05;

    var sigma = 10;
    var rho = 28;
    var beta = 8 / 3;
    var i = j = 0;
    var xpos = -1,
        ypos = 3,
        zpos = 1;

    var dt = 100;

    // var autoPlay = true;
    var perspective = false;

    perspective ? scale = 0.1 : scale = 2;

    var isDragging = false;
    var rotate = {
        x: 45,
        y: 0,
        z: 0
    };

    var points = [];

    function point(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    RotateX = function (x, y, z) {
        return x +
            y * Math.cos(rotate.x) -
            z * Math.sin(rotate.x) +
            y * Math.sin(rotate.x) +
            z * Math.cos(rotate.x);
    }

    RotateY = function (x, y, z) {
        return x * Math.cos(rotate.y) +
            z * Math.sin(rotate.y) +
            y -
            x * Math.sin(rotate.y) +
            z * Math.cos(rotate.y);
    }

    RotateZ = function (x, y, z) {
        return x * Math.cos(rotate.z) -
            y * Math.sin(rotate.z) +
            x * Math.sin(rotate.z) +
            y * Math.cos(rotate.z) +
            z;
    }

    transformPoint = function (point) {

        var x = point.x;
        var y = point.y;
        var z = point.z;

        // apply rotation
        var rotatedX = RotateX(x, y, z);
        var rotatedY = RotateY(x, y, z);
        var rotatedZ = RotateZ(x, y, z);

        if (perspective) {
            var xPrime = rotatedX / rotatedZ;
            var yPrime = rotatedY / rotatedZ;
        }
        else {
            var xPrime = rotatedX;
            var yPrime = rotatedY;
        }

        //adjust to be visible on canvas
        var X = (canvas.width / 2) + (scale * xPrime);
        var Y = (canvas.height / 4) + (scale * yPrime);

        return [X, Y]
    }

    getPoints = function () {
        //Lorenz Attractor
        var dx = sigma * (ypos - xpos);
        var dy = (xpos * (rho - zpos)) - ypos;
        var dz = (xpos * ypos) - (beta * zpos);

        var xnew = xpos + (dx / dt);
        var ynew = ypos + (dy / dt);
        var znew = zpos + (dz / dt);

        if (points.length < 30000) {
            points.push(new point(xnew, ynew, znew));
        }
        else {
            pause = true;
        }

        xpos = xnew;
        ypos = ynew;
        zpos = znew;
    }

    calcDistance = function (point1, point2) {
        var distX = point1.x - point2.y;
        var distY = point1.x - point2.y;
        return Math.sqrt(distX * distX + distY * distY);
    }


    draw = function () {
        context.fillStyle = '#FFFFFF';
        context.fillRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < (points.length - 1); i++) {
            var point1 = transformPoint(points[i]);
            var point2 = transformPoint(points[i + 1]);
            context.beginPath();
            context.lineJoin = 'round';
            context.lineCap = 'round';
            context.lineWidth = 0.5;
            context.strokeStyle = 'rgba(0, 0, 0, 0.5)';
            context.moveTo(point1[0], point1[1]);
            context.lineTo(point2[0], point2[1]);
            // context.arc(point1[0], point1[1], 0.5, 0, 2 * Math.PI);
            context.stroke();
            context.closePath();
        }
    }

    update = function () {
        getPoints();
        draw();
        if (!pause) {
            requestAnimationFrame(update);
        }

    }

    var dragStartX, dragStartY, theta1;

    canvas.onmousedown = function (e) {
        isDragging = true;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
    }

    canvas.onmouseup = function (e) {
        isDragging = false;
    }

    canvas.onmousemove = function (e) {
        if (isDragging) {
            var diffX = Math.abs(dragStartX - e.clientX);
            var diffY = Math.abs(dragStartY - e.clientY);
            var dirX = Math.sign(dragStartX - e.clientX);
            var dirY = Math.sign(dragStartY - e.clientY);

            diffX > 5 ? rotate.x += dirX * 0.2 : rotate.x += 0;
            diffY > 5 ? rotate.y += dirY * 0.2 : rotate.y += 0;
            i = 0;

            dragStartX = e.clientX;
            dragStartY = e.clientY;
        }
        getPoints();
        draw();
    }

    canvas.onmousewheel = function (e) {
        if (Math.sign(e.deltaY) === 1) {
            if (scale < maxScale) {
                scale += 0.1;
            }
        }
        else if (Math.sign(e.deltaY) === -1) {
            if (scale > minScale) {
                scale -= 0.1;
            }
        }
        getPoints();
        draw();
    }

    update();
});
