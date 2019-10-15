var gravSlide = document.getElementById("gravRange");
var gravOut = document.getElementById("gravStrength");
var ballSlide = document.getElementById("ballCountSlide");
var ballOut = document.getElementById("ballCount");

//var slider = document.getElementById("gravRange");
//var output = document.getElementById("gravStrength");
gravOut.innerHTML = gravSlide.value; // Display the default slider value
ballOut.innerHTML = ballSlide.value; // Display the default slider value
//output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
gravSlide.oninput = function() {
    gravOut.innerHTML = this.value;
}

ballSlide.oninput = function() {
    ballOut.innerHTML = this.value;
}

