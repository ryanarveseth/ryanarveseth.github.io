<?php 
$file = 'gamedata.txt';

$gameData = file_get_contents($file);

$myJSON = json_decode($gameData);
if ($myJSON == null) {
    echo null;
} 
else {
    echo $myJSON;
}
?>