

function displayScores() {
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
}
