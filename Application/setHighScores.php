<?php
    $scores = stripslashes($_POST['data']);
    echo file_put_contents("gameData.txt",$scores);

?>