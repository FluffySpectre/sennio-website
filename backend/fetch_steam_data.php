<?php

// steam api key
$apiKey = "STEAM_API_KEY";
// steam id
$steamId = "STEAM_ID";

// try to fetch the last played games from steam
try {
    $lastPlayedGames = getLastPlayedGames($apiKey, $steamId);
} catch (Exception $e) {
    die($e);
}

// if there are already saved games, check for new games, removed games
// and sort the list
$lastPlayedGames = updateLastPlayedGames($lastPlayedGames);

// add a percentage playtime value to each game entry
$lastPlayedGames = calculatePlaytimePercentage($lastPlayedGames, "recentPlaytime");
$lastPlayedGames = calculatePlaytimePercentage($lastPlayedGames, "totalPlaytime");

// save the list to disk
save($lastPlayedGames);


// FUNCTIONS
function getLastPlayedGames($apiKey, $steamId) {
    // the URL for the request to the Steam Web API for recently played games
    $url = "https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=$apiKey&steamid=$steamId&format=json";

    $response = fetchData($url);

    // convert from JSON to object
    $jsonResponse = json_decode($response, true);
    if (!is_array($jsonResponse)) {
        throw new Exception("No steam data");
    }

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
        return [
            "appID" => $appId,
            "name" => $g["name"],
            "imageURL" => $steamImageURL,
            "totalPlaytime" => $g["playtime_forever"],
            "recentPlaytime" => $g["playtime_2weeks"]
        ];
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
        throw new Exception("CURL Error: " . curl_error($ch));
    }

    // close the CURL session
    curl_close($ch);

    return $response;
}

function updateLastPlayedGames($lastPlayedGames) {
    // load the saved games list from disk
    $saveFile = __DIR__ . "/save.json";
    if (!file_exists($saveFile)) {
        return $lastPlayedGames;
    }
    $savedLastPlayedGames = json_decode(file_get_contents($saveFile), true);
    $savedLastPlayedGames = $savedLastPlayedGames["lastPlayedGames"];

    // add every game from the saved
    $finalLastPlayedGames = [];
    $finalLastPlayedGames = array_merge($finalLastPlayedGames, $savedLastPlayedGames);

    // iterate over the lastPlayedGames array and add any new game
    foreach ($lastPlayedGames as $recentGame) {
        $exists = false;
        foreach ($finalLastPlayedGames as $savedGame) {
            if ($savedGame["appID"] === $recentGame["appID"]) {
                $exists = true;

                // check if the total playtime has changed
                if ($recentGame["totalPlaytime"] > $savedGame["totalPlaytime"]) {
                    // remove the old game info
                    array_splice($finalLastPlayedGames, array_search($savedGame, $finalLastPlayedGames), 1);

                    // add the updated game info at the top
                    array_unshift($finalLastPlayedGames, $recentGame);
                }
                break;
            }
        }
        if (!$exists) {
            // add new game to the top of the $finalLastPlayedGames array
            array_unshift($finalLastPlayedGames, $recentGame);
        }
    }

    return $finalLastPlayedGames;
}

function calculatePlaytimePercentage($lastPlayedGames, $playtimeProperty) {
    $totalPlaytime = 0;
    foreach ($lastPlayedGames as $game) {
        $totalPlaytime += $game[$playtimeProperty];
    }

    foreach ($lastPlayedGames as &$game) {
        $game[$playtimeProperty . "Percentage"] = number_format(($game[$playtimeProperty] / $totalPlaytime) * 100, 2, ".", "");
    }

    return $lastPlayedGames;
}

function save($lastPlayedGames) {
    $saveFile = __DIR__ . "/save.json";
    $saveData = ["lastUpdateTimestamp" => time(), "lastPlayedGames" => array_values($lastPlayedGames)];
    file_put_contents($saveFile, json_encode($saveData, JSON_PRETTY_PRINT));
}
