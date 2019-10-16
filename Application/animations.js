var gravSlide = document.getElementById("gravRange");
var gravOut = document.getElementById("gravStrength");

var ballSlide = document.getElementById("ballCountSlide");
var ballOut = document.getElementById("ballCount");

var bSpeedSlide = document.getElementById("ballSpeedSlide");
var bSpeedOut = document.getElementById("ballSpeed");


//var slider = document.getElementById("gravRange");
//var output = document.getElementById("gravStrength");
gravOut.innerHTML = gravSlide.value; // Display the default slider value
ballOut.innerHTML = ballSlide.value; // Display the default slider value
bSpeedOut.innerHTML = bSpeedSlide.value;
//output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
gravSlide.oninput = function() {
    gravOut.innerHTML = this.value;
}

ballSlide.oninput = function() {
    ballOut.innerHTML = this.value;
}

bSpeedSlide.oninput = function() {
    bSpeedOut.innerHTML = this.value;
}


function openMods() {
    var x = document.getElementById("overlay");

    if (localStorage.getItem("speed") === null) {
        // SKIP
    }
    else {
        // set blues to the local storage variable
        document.getElementById("killer-blues").checked = localStorage.getItem("blues") == "true" ? true : false;
        // Set the gravity amount
        document.getElementById("gravRange").value = localStorage.getItem("gravity");
        gravOut.innerHTML = localStorage.getItem("gravity");
        // set the ball count
        document.getElementById("ballCountSlide").value = localStorage.getItem("balls");
        ballOut.innerHTML = localStorage.getItem("balls");
        // set the ball speed
        document.getElementById("ballSpeedSlide").value = localStorage.getItem("speed");
        bSpeedOut.innerHTML = localStorage.getItem("speed");
    }
       

    if (x.style.display === "none") {
        
    
        x.style.display = "block";
    }
    else 
       x.style.display = "none";


}

function submitMods() {
    var blues = document.getElementById("killer-blues").checked ? true : false;
    var gravity = document.getElementById("gravRange").value;
    var balls = document.getElementById("ballCountSlide").value;
    var speed = document.getElementById("ballSpeedSlide").value;

    localStorage.setItem("blues", blues);
    localStorage.setItem("gravity", gravity);
    localStorage.setItem("balls", balls);
    localStorage.setItem("speed", speed);
    openMods();
}

function cancelMods() {
    document.getElementById("overlay").style.display = "none";
}