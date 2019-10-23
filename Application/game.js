
var gravStrength;
var blues = true;
var blues_count = 0; 
var pos;
var blocks = [];
var balls = [];
var level = 1;
var ball;
var canvas = document.getElementById("gameCanvas");
var ctx = document.getElementById("gameCanvas").getContext('2d');
var collisions = 0;
var ballCount;
var speed;
var countDown;
var now;
var timr;
var nickname = "";
var namesubmitted = false;

function setVariables() {
    if (localStorage.getItem("speed") === null) {
        //blues = document.getElementById("killer-blues").checked ? true : false;
        gravStrength = document.getElementById("gravRange").value;
        ballCount = document.getElementById("ballCountSlide").value;
        speed = document.getElementById("ballSpeedSlide").value;
    } else {
        //blues = localStorage.getItem("blues");
        gravStrength = localStorage.getItem("gravity");
        ballCount = localStorage.getItem("balls");
        speed = localStorage.getItem("speed");
    }
}



function game() {
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
    reposition : function(e) {

        e.preventDefault();

        var touchstart = e.type === 'touchstart' || e.type === 'touchmove',
            e = touchstart ? e.originalEvent : e,
            pageX = touchstart ? e.targetTouches[0].pageX : e.pageX,
            pageY = touchstart ? e.targetTouches[0].pageY : e.pageY;

            var rect = canvas.getBoundingClientRect();
            pointer.x = pageX - rect.left;
            pointer.y = pageY - rect.top;

        /*if (event == "touchmove") {
            var tchObj = event.changedTouches[0];
            var rect = canvas.getBoundingClientRect();
            pointer.x = tchObj.clientX - rect.left;
            pointer.y = tchObj.clientY - rect.top;
        }
        else {
            var rect = canvas.getBoundingClientRect();
            pointer.x = event.clientX - rect.left;
            pointer.y = event.clientY - rect.top; */
       // }
       // event.preventDefault();
    }
} 

/* 
* This Ball class allows us to create Ball objects...
* We'll have an array of Balls in the game.
* draw() : draws the ball on the screen
* kill() : this is what causes a ball to 'disappear'
* getSpeed() : returns the speed of the ball
* getAngle() : returns the angle the ball is traveling in
* onGround() : returns if the ball is on the ground 
*
*/
class Ball {
    constructor(x, y, vx, vy, b, rad) {         
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.alive = true;
        this.radius = rad;
        this.mass = 6;
        this.started = false;
        this.hits = 10;
        this.isBlue = b;
    }
    kill() {
        this.alive = false;
        this.started = false;
    }
    draw() { 
        this.isBlue ? this.radius = 10 : this.radius = 6;
        if (this.y + this.vy < 6)
            this.vy *= -1;
        if (this.x + this.vx > myGameArea.canvas.width || this.x + this.vx < 0)
            this.vx *= -1;
        if (this.y + this.vy > myGameArea.canvas.height - 6) {
            this.vy *= -1;
            //this.kill();
        }
        ctx.beginPath();
        ctx.fillStyle = this.isBlue == true ? "rgb(102, 153, 255)" : "rgb(240, 150, 0)";
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
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
        var x = (this.y + this.radius >= canvas.height);
        if (x == true && this.started) { this.y -= 20; } 
        return x;
    }
}

canvas.addEventListener("touchstart", pointer.reposition, true);
canvas.addEventListener("touchmove", pointer.reposition, true);
canvas.addEventListener("mousemove", pointer.reposition, true);

var startingvx = 0;
var startingvy = 0;

function shoot(event) {
    if (startingvx == 0 && startingvy == 0) {
        setVariables();
        countDown = new Date().setSeconds(new Date().getSeconds() + 30);
        timr = countDown - new Date().getTime();

        var c = document.getElementById("gameCanvas");
        var rect = c.getBoundingClientRect();
        if (startingvx == 0 && startingvy == 0) {

            var dx = myGameArea.canvas.width / 2  - 6 - (pointer.x);
            var dy = myGameArea.canvas.height - 6 - (pointer.y);
            var angle = Math.atan2(dy, dx);

            startingvx = speed * 2.5 * -Math.cos(angle);
            startingvy = speed * 2.5 * -Math.sin(angle);
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
    if (countDown == null) 
        timr = 30000;
    else
        timr = countDown - new Date().getTime();

    document.getElementById("timeRemaining").innerHTML = "Time: " + (Math.round(((timr) / 1000) * 100) / 100).toFixed(2);

    if (timr < 0) { 
        document.getElementById("timeRemaining").innerHTML = "Time: " + (Math.round(((0) / 1000) * 100) / 100).toFixed(2);
        gameOver(); 
    }

    if (startingvx != 0 || startingvy != 0) {
        if (balls.length == 0) {
            
            for (let i = 0; i < ballCount; i++) {
                if (startingvx != 0 || startingvy != 0) {
                    if (blues) {
                        var isBlue = (Math.round(Math.random() * 75));
                        isBlue = isBlue == 5 ? true : false;
                        if (i == ballCount - 1 && blues_count == 0) {
                            isBlue = true;
                        }
                        if (isBlue)
                            blues_count++;
                    }
                    else 
                        var isBlue = false;
                    var newBall = new Ball(myGameArea.canvas.width / 2 - 6, myGameArea.canvas.height -6, startingvx, startingvy, isBlue, isBlue ? 10 : 6);
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

        document.getElementById("score").innerHTML = "Score: " + parseInt(collisions * (100 / ballCount));
        applyGravity();
        ballCollision();
    }
    pointer.draw();
    if (deadCount + 2 == balls.length) {
        gameOver();
    } 
    if (deadCount == balls.length)
        gameOver();
}

/*
* gameOver is what is called when the game is over! 
* clear the interval, so it stops refreshing at x_fps
* if there are no orange balls, 
*/
function gameOver() {
    myGameArea.clear();
    clearInterval(myGameArea.interval);
    var orangeAlive = false;
    for (b in balls) {
        if ((!b.isBlue) && b.alive && b.started)
            orangeAlive = true;
    }

    if (orangeAlive) {
        collisions *= 1.5;
        document.getElementById("score").innerHTML = "Score: " + parseInt(collisions * (100 / ballCount));
    }
    
    var objArr = getHighScores(collisions);

    if (collisions) { document.getElementById("hScores").style.display = "block"; }
    
    while (nickname = "") {
        console.log("waiting...");
    }

    console.log(nickname);
    var d = new Date();
    var newRecord = { "name" : nickname, "score" : score, "date" : d.getMonth() + "/" + d.getDate() + "/" + d.getFullYear() };

}

function ballCollision() {
    for (var i = 0; i < balls.length; i++) {
        if (balls[i].alive)
            for (var x = 0; x < balls.length; x++) {
                if (balls[x].alive)
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
                                if (balls[i].isBlue && balls[x].isBlue) {
                                    balls[x].kill();
                                } else if (balls[i].isBlue && !balls[x].isBlue) {
                                    balls[x].isBlue = true;
                                } else if (balls[x].isBlue && !balls[i].isBlue) {
                                    balls[i].isBlue = true;
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
            balls[b].vy += 0.01 * gravStrength;
        }   
       // console.log(b, balls[b].y);
        if (balls[b].y > myGameArea.canvas.height) {
            balls[b].y-= 10;
        }
    }
}

function getHighScores() {
    var xhttp = new XMLHttpRequest();
    console.log("getHighScores");
    var file = "gamedata.txt";

    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4) {
            if (xhttp.status == 200 || xhttp.status == 0) {
                var response = xhttp.responseText;
                console.log(response);
                if (response.length > 0)
                    response = JSON.parse(response);
                return response;
            }
        }
    }
    xhttp.open("GET", file, true);
    xhttp.send();
}



function writeToFile(response) {
    console.log(response);
    var fs = require("fs");
    fs.writeFile("gamedata.txt", JSON.stringify(response), (err) => {
        if (err) {
            return;
        };
    });
}


function waiting() { 
    console.log(namesubmitted);
    if (!namesubmitted)
        setTimeout(waiting, 150);
}


/*
* Here is our example of the create / replace child.
* The user has to type in a name to submit their high score. 
*/
var n = document.getElementById("name");    

n.addEventListener("keyup", function () {
    // create a new button to submit our name!
    var replaced = document.getElementById("buttonSubmit");
    var button = document.createElement('button');
    button.innerText = 'Enter';
    button.id = "buttonSubmit";
    button.onclick = function () { 
        // No null names!
        if (n.value != null) {
            namesubmitted = true;
            // And No cheating!
            if (score > 0) { 
                document.getElementById("hScores").style.display = "block";
                nickname = n.value; 
            }
            else
                document.getElementById("hScores").style.display = "block";
        }
    }
    replaced.parentNode.replaceChild(button, replaced);
});



function distanceNextFrame(a, b) {
    return Math.sqrt((a.x + a.vx - b.x - b.vx)**2 + (a.y + a.vy - b.y - b.vy)**2) - a.radius - b.radius;
}
