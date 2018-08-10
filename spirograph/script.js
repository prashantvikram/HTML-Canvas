document.addEventListener("DOMContentLoaded", function () {
    var canvas = document.getElementById("main-canvas");

    var requestAnimationFrame = window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;

    //set up canvas
    canvas.style.width = '100%';
    canvas.style.height = '70vh';
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    var context = canvas.getContext("2d");
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);

    const scale = 1;
    var i = 0;
    var animationId, a, b, c;
    var x_start = canvas.width/2;
    var y_start = canvas.height/2;

    function clearCanvas() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = 'white';
        context.fillRect(0, 0, canvas.width, canvas.height);
    }

    function generateX(i) {
        return a * Math.cos(i) - b * Math.cos(c*i);
    }

    function generateY(i) {
        return a * Math.sin(i) - b * Math.sin(c * i)
    }

    function transform(value, axis) {
        return axis === "y" ? (canvas.height / 2) + scale * value : (canvas.width / 2) + scale * value
    }

    canvas.onmouseup = function () {
        start();
    }

    function update() {
        context.fillStyle = 'rgba(255, 255, 255, 0.02)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        var x = transform(generateX(i), "x");
        var y = transform(generateY(i), "y");
        context.strokeStyle = 'rgba(0, 0, 0, 0.9)';
        context.beginPath();
        context.moveTo(x_start, y_start);
        context.lineTo(x, y);
        
        context.stroke();
        if (i < 20) {
            i += 0.05;
            x_start = x;
            y_start = y;
            animationId = requestAnimationFrame(update);
        }
        else {
            start();
        }
    }
    function init() {
        i = 0;
        var R = Math.floor((Math.random() * 50) + 30);
        var r = Math.floor((Math.random() * 50) + 20);
        var o = Math.floor((Math.random() * 30) + 0);

        a = R + r;
        b = r + o;
        c = (R + r) / r;

        x_start = transform(generateX(0), "x");
        y_start = transform(generateY(0), "y");

        update();
    }

    function start() {
        clearCanvas();
        cancelAnimationFrame(animationId);
        init();
    }

    start();

});