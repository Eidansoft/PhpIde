<?php
/**
 * PHP functions to manage files through a REST+JSON interface
 * @author Alejandro Lorente
 * @author eidansoft at gmail dot com
 * @license GPLv3.0
 * @sources https://github.com/Eidansoft/Phphiles.git
 */

$validOperations = array();
$validOperations[] = "listFiles";
$validOperations[] = "getFile";
$validOperations[] = "createFolder";
$validOperations[] = "saveFile";
$validOperations[] = "deleteFile";

$rootFolder = getcwd() . "/..";
?>