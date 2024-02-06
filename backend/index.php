<?php

// Steam API key
$apiKey = '<STEAM_API_KEY>';
// Steam ID
$steamId = '<STEAM_ID>';
// Check interval (in seconds)
$checkInterval = 60;

// Load save file infos
$saveFile = __DIR__ . "/save.json";
if (file_exists($saveFile)) {
    $saveFileContent = json_decode(file_get_contents($saveFile), true);
    $lastPlayedGames = $saveFileContent["lastPlayedGames"];
    $lastUpdateTimestamp = $saveFileContent["lastUpdateTimestamp"];
}

// Check if an update is needed
if (!isset($lastPlayedGames) || count($lastPlayedGames) === 0 || time() > $lastUpdateTimestamp + $checkInterval) {
    $lastPlayedGames = getLastPlayedGames($apiKey, $steamId);
    save($lastPlayedGames);
}

// Return the response in JSON format
header('Content-Type: application/json');
echo json_encode(["games" => array_values($lastPlayedGames)]);



// FUNCTIONS
function getLastPlayedGames($apiKey, $steamId) {
    // The URL for the request to the Steam Web API for recently played games
    $url = "http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=$apiKey&steamid=$steamId&format=json";

    // Initialize a CURL session
    $ch = curl_init();

    // Set the URL and other appropriate options
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

    // Execute the CURL session and store the response
    $response = curl_exec($ch);

    // Check for errors in the CURL execution
    if (curl_errno($ch)) {
        echo 'CURL Error: ' . curl_error($ch);
    }

    // Close the CURL session
    curl_close($ch);

    // Convert from JSON to object
    $jsonResponse = json_decode($response, true);

    // Add the URL to the games image
    $games = $jsonResponse["response"]["games"];

    // Filter out empty elements
    $games = array_filter($games, function ($g) {
        if (isset($g) && isset($g["name"]))
            return true;
        return false;
    });

    $games = array_reverse($games);

    $gamesResult = array_map(function ($g) {
        $appId = $g["appid"];
        $hash = $g["img_icon_url"];
        $steamImageURL = "http://media.steampowered.com/steamcommunity/public/images/apps/$appId/$hash.jpg";
        return ["name" => $g["name"], "imageURL" => $steamImageURL];
    }, $games);

    //DEBUG
    // for ($i = 0; $i < 10; $i++) {
    //     array_push($gamesResult, ["name" => "App $i", "imageURL" => ""]);
    // }

    return $gamesResult;
}

function save($lastPlayedGames) {
    $saveFile = __DIR__ . "/save.json";
    $saveData = ["lastUpdateTimestamp" => time(), "lastPlayedGames" => $lastPlayedGames];
    file_put_contents($saveFile, json_encode($saveData, JSON_PRETTY_PRINT));
}
