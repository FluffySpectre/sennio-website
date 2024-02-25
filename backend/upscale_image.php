<?php

function upscaleImage($gameIcon, $targetPath, $scaleFactorPercentage = 400) {
    $img = imagecreatefromjpeg($gameIcon);
    $width = imagesx($img);
    $height = imagesy($img);
    $newWidth = $width * $scaleFactorPercentage / 100;
    $newHeight = $height * $scaleFactorPercentage / 100;
    $scaledImg = imagescale($img, $newWidth, $newHeight, IMG_NEAREST_NEIGHBOUR);
    imagejpeg($scaledImg, $targetPath . "/" . basename($gameIcon), 100);
}
