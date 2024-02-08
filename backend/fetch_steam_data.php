<?php

// steam api key
$apiKey = '<STEAM_API_KEY>';
// steam id
$steamId = '<STEAM_ID>';

// fetch the last played games from steam
$lastPlayedGames = getLastPlayedGames($apiKey, $steamId);

// if there are already saved games, check for new games, removed games
// and sort the list
$lastPlayedGames = updateLastPlayedGames($lastPlayedGames);

// save the list to disk
save($lastPlayedGames);


// FUNCTIONS
function getLastPlayedGames($apiKey, $steamId) {
    // the URL for the request to the Steam Web API for recently played games
    $url = "https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=$apiKey&steamid=$steamId&format=json";

    $response = fetchData($url);

    // convert from JSON to object
    $jsonResponse = json_decode($response, true);

    // add the URL to the games image
    $games = $jsonResponse["response"]["games"];

    // filter out empty elements
    $games = array_filter($games, function ($g) {
        if (isset($g) && isset($g["name"]))
            return true;
        return false;
    });

    $games = array_map(function ($g) {
        $appId = $g["appid"];
        $hash = $g["img_icon_url"];
        $steamImageURL = "https://media.steampowered.com/steamcommunity/public/images/apps/$appId/$hash.jpg";
        return ["appID" => $appId, "name" => $g["name"], "imageURL" => $steamImageURL, "totalPlaytime" => $g["playtime_forever"]];
    }, $games);

    return $games;
}

function fetchData($url) {
    // initialize a CURL session
    $ch = curl_init();

    // set the URL and other appropriate options
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

    // execute the CURL session and store the response
    $response = curl_exec($ch);

    // check for errors in the CURL execution
    if (curl_errno($ch)) {
        echo 'CURL Error: ' . curl_error($ch);
    }

    // close the CURL session
    curl_close($ch);

    return $response;
}

function updateLastPlayedGames($newLastPlayedGames) {
    // load the saved games list from disk
    $saveFile = __DIR__ . "/save.json";
    if (!file_exists($saveFile)) {
        return $newLastPlayedGames;
    }
    $oldLastPlayedGames = json_decode(file_get_contents($saveFile), true);
    $oldLastPlayedGames = $oldLastPlayedGames["lastPlayedGames"];

    // temporary storage for games that are updated or added
    $updatedOrNewGames = [];

    // iterate through the updated list and update or add games
    foreach ($newLastPlayedGames as $game) {
        $updatedOrNewGames[$game["appID"]] = $game;
    }

    // remove games that are not in the updated list and prepare the final list
    $finalList = [];

    foreach ($oldLastPlayedGames as $oldGame) {
        if (isset($updatedOrNewGames[$oldGame["appID"]])) {
            // add the updated game
            $finalList[] = $updatedOrNewGames[$oldGame["appID"]];
            // remove the game from $updatedOrNewGames to avoid duplicates
            unset($updatedOrNewGames[$oldGame["appID"]]);
        }
    }

    // add new games that are only in the updated list
    foreach ($updatedOrNewGames as $newGame) {
        $finalList[] = $newGame;
    }

    // sort based on the change in playtime
    usort($finalList, function ($a, $b) use ($oldLastPlayedGames) {
        $aOldValue = 0;
        $bOldValue = 0;
        foreach ($oldLastPlayedGames as $oldGame) {
            if ($oldGame["appID"] === $a["appID"]) {
                $aOldValue = $oldGame["totalPlaytime"];
            }
            if ($oldGame["appID"] === $b["appID"]) {
                $bOldValue = $oldGame["totalPlaytime"];
            }
        }
        return ($b["totalPlaytime"] - $bOldValue) - ($a["totalPlaytime"] - $aOldValue);
    });

    // output the final updated list
    return $finalList;
}

function save($lastPlayedGames) {
    $saveFile = __DIR__ . "/save.json";
    $saveData = ["lastUpdateTimestamp" => time(), "lastPlayedGames" => array_values($lastPlayedGames)];
    file_put_contents($saveFile, json_encode($saveData, JSON_PRETTY_PRINT));
}
