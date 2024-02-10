<?php

// routing
get("/website-backend/last-played-games", "getLastPlayedGames");



// route handler
function getLastPlayedGames() {
    // max games in list
    $maxGames = 18;

    // load save file infos
    $saveFile = __DIR__ . "/save.json";
    if (file_exists($saveFile)) {
        $saveFileContent = json_decode(file_get_contents($saveFile), true);
        $lastPlayedGames = $saveFileContent["lastPlayedGames"];
    }

    // check if an update is needed
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

    // return the response in JSON format
    jsonResponse(["games" => array_values($lastPlayedGames)]);
}

// functions
function get($route, $callback) {
    $reqMethod = $_SERVER["REQUEST_METHOD"];
    $reqURI = $_SERVER["REQUEST_URI"];

    if ($reqMethod === "GET" && $reqURI === $route) {
        call_user_func($callback);
    }
}

function jsonResponse($data) {
    header("Content-Type: application/json");
    echo json_encode($data);
}