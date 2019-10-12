
var pos;
var blocks = [];
var balls = [];
var level = 1;
var ball;
var canvas = document.getElementById("gameCanvas");
var ctx = document.getElementById("gameCanvas").getContext('2d');
var collisions = 0;

function game() {
    //ball = new ball(canvas.width / 2 + 3,canvas.height - 6)
    myGameArea.start();
}

var myGameArea = {
    canvas : document.getElementById("gameCanvas"),
    start : function() {
        this.context = this.canvas.getContext("2d");
        this.interval = setInterval(updateGame, 20);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}


var pointer =  {
    x : 0,
    y : 0,
    draw : function() {
        // Reset the current path
        ctx.beginPath(); 
        // Left hash
        ctx.moveTo(pointer.x - 7.5, pointer.y);
        ctx.lineTo(pointer.x - 2.5, pointer.y);
        // Right hash
        ctx.moveTo(pointer.x + 2.5, pointer.y);
        ctx.lineTo(pointer.x + 7.5, pointer.y);

        // top hash
        ctx.moveTo(pointer.x , pointer.y - 7.5);
        ctx.lineTo(pointer.x , pointer.y - 2.5);

        // bottom hash
        ctx.moveTo(pointer.x , pointer.y + 2.5);
        ctx.lineTo(pointer.x , pointer.y + 7.5);

        ctx.strokeStyle = "White";
        // Make the line visible
        ctx.stroke();
    },
    reposition : function(event) {
        var rect = canvas.getBoundingClientRect();
        pointer.x = event.clientX - rect.left;
        pointer.y = event.clientY - rect.top;
    }
} 


class Ball {
    constructor(x, y, vx, vy) {         
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.alive = true;
        this.mass = 6 * 6 * 6;
        this.radius = 6;
        this.started = false;
        this.hits = 10;
    }
    kill() {
        this.alive = false;
        this.started = false;
    }
    draw() { 
        if (this.y + this.vy < 6)
            this.vy *= -1;
        if (this.x + this.vx > myGameArea.canvas.width || this.x + this.vx < 0)
            this.vx *= -1;
        if (this.y + this.vy > myGameArea.canvas.height - 6) {
            this.vy *= -1;
            //this.kill();
        }
        ctx.beginPath();
        ctx.fillStyle = "rgb(240, 150, 0)";
        ctx.arc(this.x, this.y, 6, 0, 2 * Math.PI);
        ctx.fill();
    }
    handleEvent(evt) {
        switch (evt.type) {
            case "touchend":
            case "click":
                this.shoot;
                break;
        }
    }
    getAngle() {
        //angle of ball with the x axis
        return Math.atan2(this.vy, this.vx);
    }
    getSpeed() {
        // magnitude of velocity vector
        return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    }
    onGround() {
        return (this.y + this.radius >= canvas.height)
    }
}

canvas.addEventListener("touchmove", pointer.reposition, true);
canvas.addEventListener("mousemove", pointer.reposition, true);



var startingvx = 0;
var startingvy = 0;

function shoot(event) {
    if (startingvx == 0 && startingvy == 0) {
        var c = document.getElementById("gameCanvas");
        var rect = c.getBoundingClientRect();
        if (startingvx == 0 && startingvy == 0) {
            if (event.type == "touchend") {
                var dx = myGameArea.canvas.width / 2  - 6 - event.touches[0].pageX;
                var dy = myGameArea.canvas.height - 6 - event.touches[0].pageY;
            }
            else if (event.type == "click") {
                var dx = myGameArea.canvas.width / 2  - 6 - (event.clientX - rect.left);
                var dy = myGameArea.canvas.height - 6 - (event.clientY - rect.top);
            }

            var angle = Math.atan2(dy, dx);

            startingvx = 12 * -Math.cos(angle);
            startingvy = 12 * -Math.sin(angle);
        }
    }
}   

canvas.addEventListener("touchend", shoot);
canvas.addEventListener("click", shoot);

// These two variables will space the balls out
var iter = 1;
var times = 0;

function updateGame() { 
    myGameArea.clear();
    if (startingvx != 0 || startingvy != 0) {
        if (balls.length == 0) {
            for (let i = 0; i < 200; i++) {
                if (startingvx != 0 || startingvy != 0) {
                    var newBall = new Ball(myGameArea.canvas.width / 2 - 6, myGameArea.canvas.height -6, startingvx, startingvy);
                    balls.push(newBall);
                }
            }
        }
        var deadCount = 0;
        for (let i = 0; i < iter; i++) {
            balls[i].x += balls[i].vx;
            balls[i].y += balls[i].vy;
            if (balls[i].alive) {
                balls[i].started = true;
                balls[i].draw();
            }
            else {
                deadCount++;
            }
        }
        // separate the balls from each other
        if (times == 5) {
            iter++;
            if (iter > balls.length) {
                iter = balls.length;
            }
            times = 0;
        }
        else
            times++;

        document.getElementById("score").innerHTML = "Collisions: " + collisions;
        applyGravity();
        ballCollision();
    }
    pointer.draw();
    
    if (deadCount == balls.length)
        gameOver();
}

function gameOver() {
    myGameArea.clear();
    clearInterval(myGameArea.interval);

    document.getElementById("playAgain").style.display = "inline";

}

function ballCollision() {
    for (var i = 0; i < balls.length; i++) {
        for (var x = 0; x < balls.length; x++) {
            if (i !== x && distanceNextFrame(balls[i], balls[x]) <= 0) {
                var theta1 = balls[i].getAngle();
                var theta2 = balls[x].getAngle();
                var phi = Math.atan2(balls[x].y - balls[i].y, balls[x].x - balls[i].x);
                var m1 = balls[i].mass;
                var m2 = balls[x].mass;
                var v1 = balls[i].getSpeed();
                var v2 = balls[x].getSpeed();

                var dx1F = (v1 * Math.cos(theta1 - phi) * (m1-m2) + 2*m2*v2*Math.cos(theta2 - phi)) / (m1+m2) * Math.cos(phi) + v1*Math.sin(theta1-phi) * Math.cos(phi+Math.PI/2);
                var dy1F = (v1 * Math.cos(theta1 - phi) * (m1-m2) + 2*m2*v2*Math.cos(theta2 - phi)) / (m1+m2) * Math.sin(phi) + v1*Math.sin(theta1-phi) * Math.sin(phi+Math.PI/2);
                var dx2F = (v2 * Math.cos(theta2 - phi) * (m2-m1) + 2*m1*v1*Math.cos(theta1 - phi)) / (m1+m2) * Math.cos(phi) + v2*Math.sin(theta2-phi) * Math.cos(phi+Math.PI/2);
                var dy2F = (v2 * Math.cos(theta2 - phi) * (m2-m1) + 2*m1*v1*Math.cos(theta1 - phi)) / (m1+m2) * Math.sin(phi) + v2*Math.sin(theta2-phi) * Math.sin(phi+Math.PI/2);

                if (balls[i].vx != dx1F || balls[i].vy != dy1F || balls[x].vx != dx2F || balls[x].vy != dy2F)
                    if (balls[i].started && balls[x].started) {
                        collisions++;
                        if (!(balls[i].hits--)) {
                            balls[i].kill();
                        }
                        if (!(balls[x].hits--)) {
                            balls[x].kill();
                        }
                    }
                    

                balls[i].vx = dx1F;
                balls[i].vy = dy1F;
                balls[x].vx = dx2F;
                balls[x].vy = dy2F;
            }            
        }
        //wallCollision(balls[obj1]);
    }
}

function applyGravity() {
    for (var b in balls) {
        if (balls[b].onGround() == false) {
            balls[b].vy += 0.009;
        }   
    }
}


function distanceNextFrame(a, b) {
    return Math.sqrt((a.x + a.vx - b.x - b.vx)**2 + (a.y + a.vy - b.y - b.vy)**2) - a.radius - b.radius;
}