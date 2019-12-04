
function displayScores() {

var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var myObj = JSON.parse(this.responseText);
        //if (localStorage.getItem("scores") == null)
        //    var scoresObj = [];
        //else
        //    var scoresObj = JSON.parse(localStorage.getItem("scores"));

        var txt = "";
        var t = "<tr><th> </th><th>Name</th><th>Score</th><th>Date</th></tr>";

        for (var i = 0; i < scoresObj.length; i++) {
        if (scoresObj[i]) {
            txt += "<tr><td>" + (i + 1) + "</td><td>" + scoresObj[i].name +
                "</td><td>" + scoresObj[i].score + "</td><td>" + scoresObj[i].date + "</td></tr>";
            }
        }
        if (txt != "") { 
            document.getElementById("highScoreTable").innerHTML = t + txt;
        }
    }
};
    xmlhttp.open("GET", "getHighScores.php", true);
    xmlhttp.send();





/*
    if (localStorage.getItem("scores") == null)
        var scoresObj = [];
    else
        var scoresObj = JSON.parse(localStorage.getItem("scores"));

    var txt = "";
    var t = "<tr><th> </th><th>Name</th><th>Score</th><th>Date</th></tr>";
    for (var i = 0; i < scoresObj.length; i++) {
        if (scoresObj[i]) {
            txt += "<tr><td>" + (i + 1) + "</td><td>" + scoresObj[i].name +
                "</td><td>" + scoresObj[i].score + "</td><td>" + scoresObj[i].date + "</td></tr>";
        }
    }
    if (txt != "") { 
        document.getElementById("highScoreTable").innerHTML = t + txt;
    }
    */
}
