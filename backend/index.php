<?php

// Load save file infos
$saveFile = __DIR__ . "/save.json";
if (file_exists($saveFile)) {
    $saveFileContent = json_decode(file_get_contents($saveFile), true);
    $lastPlayedGames = $saveFileContent["lastPlayedGames"];
    $lastUpdateTimestamp = $saveFileContent["lastUpdateTimestamp"];
}

// Check if an update is needed
if (!isset($lastPlayedGames)) {
    $lastPlayedGames = [];
}

// Return the response in JSON format
header('Content-Type: application/json');
echo json_encode(["games" => array_values($lastPlayedGames)]);
