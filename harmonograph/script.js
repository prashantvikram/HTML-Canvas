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

    var parameters = [];
    const scale = 100;
    var i = 0;
    var animationId;

    function parameter(){
        this.f = Math.floor(Math.random() * 5);
        this.p = Math.random() * (2 * Math.PI);
        this.d = Math.random() * 0.01;
    }

    function clearCanvas(){        
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = 'white';
        context.fillRect(0, 0, canvas.width, canvas.height);
    }

    function equationComponent(index, i){
        return Math.sin(i * parameters[index].f + parameters[index].p) *
            Math.exp(-parameters[index].d * i)
    }

    function generateX(i){
        return equationComponent(0,i) + equationComponent(1,i);
    }

    function generateY(i) {
        return equationComponent(2, i) + equationComponent(3, i);
    }

    function transform(value, axis){
        return axis === "y" ? (canvas.height/2) + scale * value : (canvas.width/2) + scale * value
    }

    function generateParameters(){
        for(var i = 0; i <=3; i++){
            var p = new parameter();
            parameters.push(p);
        }
    }

    canvas.onmouseup = function(){
        start();
    }
    

    function update(){
        context.fillStyle = 'rgba(255, 255, 255, 0.02)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        var x = transform(generateX(i), "x");
        var y = transform(generateY(i), "y");
        
        context.strokeStyle = 'rgba(0, 0, 0, 0.9)';
        context.beginPath();
        context.arc(x, y, 1, 0, 2 * Math.PI);
        
        context.stroke();
        if (i < 100) {
            i += 0.009;
            animationId = requestAnimationFrame(update);
        }
        else{
            start();
        }
    }
    function init(){
        i = 0;
        parameters.length = 0;

        generateParameters();
        update();
    }

    function start(){
        clearCanvas();
        cancelAnimationFrame(animationId);
        init();
    }

    start();

});