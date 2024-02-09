<?php

// max games in list
$maxGames = 18;

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

// apply blacklist filter
$blacklistFile = __DIR__ . "/blacklist.json";
if (file_exists($blacklistFile)) {
    $blacklistData = json_decode(file_get_contents($blacklistFile), true);
    $blacklist = $blacklistData["blacklist"];
    $lastPlayedGames = array_filter($lastPlayedGames, function ($g) use ($blacklist) {
        return array_search($g["appID"], $blacklist) === false;
    });
}

// limit the array to $maxGames
if (count($lastPlayedGames) > $maxGames) {
    array_splice($lastPlayedGames, $maxGames);
}

// Return the response in JSON format
header("Content-Type: application/json");
echo json_encode(["games" => array_values($lastPlayedGames)]);
