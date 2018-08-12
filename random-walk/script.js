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
    
    var animationId, start_x, start_y;
    var scale = 10;

    function clearCanvas() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = 'white';
        context.fillRect(0, 0, canvas.width, canvas.height);
    }

    canvas.onmouseup = function () {
        start();
    }

    function move() {
        dir = 1 + Math.floor(Math.random() * 4);
        
        switch (dir) {
            case 1: // left
                return [start_x - scale, start_y];
            case 2: // up
                return [start_x, start_y - scale];
            case 3: // right
                return [start_x + scale, start_y];
            case 4: // down
                return [start_x, start_y + scale];
        }
    }

    function update() {
        context.fillStyle = 'rgba(255, 255, 255, 0.02)';
        context.fillRect(0, 0, canvas.width, canvas.height);

        var nextCoords = move();
        if(!nextCoords)
        
        context.strokeStyle = 'rgba(0, 0, 0, 0.9)';
        context.beginPath();
        context.moveTo(start_x, start_y);
        context.lineTo(nextCoords[0], nextCoords[1]);
        context.stroke();
        start_x = nextCoords[0];
        start_y = nextCoords[1];
        animationId = requestAnimationFrame(update);
    }


    function init() {
        start_x = canvas.width / 2;
        start_y = canvas.height / 2;
        update();
    }

    function start() {
        clearCanvas();
        cancelAnimationFrame(animationId);
        init();
    }

    start();

});