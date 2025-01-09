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

// save the complete list to disk
save($lastPlayedGames, "save.json");

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
$maxGames = 21;
if (count($lastPlayedGames) > $maxGames) {
    array_splice($lastPlayedGames, $maxGames);
}

// strip the games information
$lastPlayedGames = array_map(function ($g) {
    $mostPlayedRecently = (int)$g["recentPlaytimePercentage"] >= 5;
    return [
        "name" => $g["name"],
        "imageURL" => getLocalGameIconURL($g["appID"]),
        "mostPlayedRecently" => $mostPlayedRecently
        // "playtimePercentage" => $g["recentPlaytimePercentage"]
    ];
}, $lastPlayedGames);

// save the final filtered list
save($lastPlayedGames, "last_played_games.json");

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
        return isset($g) && isset($g["name"]);
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
    $response = file_get_contents($url);
    if (!$response) {
        throw new Exception("Fetch Error!");
    }
    return $response;
}

function downloadFile($url, $localFilePath) {
    $response = fetchData($url);
    $fp = fopen($localFilePath, "w");
    fwrite($fp, $response);
    fclose($fp);
}

// UPDATED FUNCTION
function updateLastPlayedGames($lastPlayedGames) {
    // load the saved games list from disk
    $saveFile = __DIR__ . "/save.json";
    if (!file_exists($saveFile)) {
        return array_filter($lastPlayedGames, function ($g) {
            return $g["recentPlaytime"] > 15;
        });
    }
    $savedLastPlayedGames = json_decode(file_get_contents($saveFile), true);
    $savedLastPlayedGames = $savedLastPlayedGames["lastPlayedGames"];

    // merge saved games into the final array first
    $finalLastPlayedGames = [];
    $finalLastPlayedGames = array_merge($finalLastPlayedGames, $savedLastPlayedGames);

    // For each game recently fetched from the API
    foreach ($lastPlayedGames as $recentGame) {
        // only update/add if recentPlaytime > 15
        if ($recentGame["recentPlaytime"] <= 15) {
            continue;
        }

        // check if the game already exists
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

        // if it's a brand new game and passes the 15-min filter, add to the top
        if (!$exists) {
            array_unshift($finalLastPlayedGames, $recentGame);
        }
    }

    // download game icons for all games in the final array (old + newly updated)
    foreach ($finalLastPlayedGames as $game) {
        downloadGameIcon($game);
    }

    return $finalLastPlayedGames;
}

function downloadGameIcon($game) {
    if (!file_exists(__DIR__ . "/icons/")) {
        mkdir(__DIR__ . "/icons/", 0705);
    }
    if (!file_exists(__DIR__ . "/icons_original/")) {
        mkdir(__DIR__ . "/icons_original/", 0705);
    }
    $gameIcon = __DIR__ . "/icons_original/" . $game["appID"] . ".jpg";
    $targetPath = __DIR__ . "/icons";
    if (!file_exists($gameIcon)) {
        downloadFile($game["imageURL"], $gameIcon);
        upscaleIcon($gameIcon, $targetPath);
    }
}

function upscaleIcon($gameIcon, $targetPath) {
    require_once __DIR__ . "/upscale_image.php";
    upscaleImage($gameIcon, $targetPath, 400);
}

function calculatePlaytimePercentage($lastPlayedGames, $playtimeProperty) {
    $totalPlaytime = 0;
    foreach ($lastPlayedGames as $game) {
        $totalPlaytime += $game[$playtimeProperty];
    }

    // avoid division-by-zero if no games or totalPlaytime is 0
    if ($totalPlaytime <= 0) {
        foreach ($lastPlayedGames as &$game) {
            $game[$playtimeProperty . "Percentage"] = 0;
        }
        return $lastPlayedGames;
    }

    foreach ($lastPlayedGames as &$game) {
        $game[$playtimeProperty . "Percentage"] = number_format(
            ($game[$playtimeProperty] / $totalPlaytime) * 100,
            2,
            ".",
            ""
        );
    }

    return $lastPlayedGames;
}

function save($lastPlayedGames, $filename) {
    $saveFile = __DIR__ . "/$filename";
    $saveData = [
        "lastUpdateTimestamp" => time(),
        "lastPlayedGames" => array_values($lastPlayedGames)
    ];
    file_put_contents($saveFile, json_encode($saveData, JSON_PRETTY_PRINT));
}

function getLocalGameIconURL($appID) {
    return "/website-backend/icons/$appID.jpg";
}
