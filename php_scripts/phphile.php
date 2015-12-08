<?php
/**
 * PHP functions to manage files through a REST+JSON interface
 * @author Alejandro Lorente
 * @author eidansoft at gmail dot com
 * @license GPLv3.0
 * @sources https://github.com/Eidansoft/Phphiles.git
 */

include_once "./configuration.php.inc";
include_once "./funciones.php.inc";

// Check for format param
if ($_REQUEST['format'] == "XML"){
	header ("Content-Type: application/xml");
} elseif ($_REQUEST['format'] == "JSON"){
	header ("Content-Type: application/json");
} elseif ($_REQUEST['format'] == "FILE"){
	header ("application/octet-stream");
} else {
	header ("Content-Type: text/plain");
	endWithError("TXT", "Invalid format", 1);
}

// Check for mandatory params
if ( ! isset($_REQUEST['path']) || ! isset($_REQUEST['operation']) ) { 
	endWithError($_REQUEST['format'], "Invalid request", 2);
}

// Test the operation variable, must be a valid operation
$error = true;
for ($i=0; $i < sizeof($validOperations) && $error; $i++) { 
	if ($validOperations[$i] == $_REQUEST['operation']){
		$error = false;
	}
}
if ($error){
	endWithError($_REQUEST['format'], "Invalid operation", 3);
}

// Check the path param. Must not contain ".." to avoid to get any directory at the system
// and double slash //
if ( strpos($_REQUEST['path'], "..") !== false || strpos($_REQUEST['path'], "//") !== false ){
	endWithError($_REQUEST['format'], "Invalid path", 4);
}
// Check that the first character for the path must be a slash
if (strpos($_REQUEST['path'], 0, 1) == "/"){
	endWithError($_REQUEST['format'], "Invalid path", 5);
}

//Call the function to get the results in format requested by parameter
$res = executeFileOperation($_REQUEST);

//Send the results
echo $res;
?>

