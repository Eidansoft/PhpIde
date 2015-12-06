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
} else {
	header ("Content-Type: text/plain");
	endWithError("TXT", "Invalid format");
}

// Check for mandatory params
if ( ! isset($_REQUEST['path']) || ! isset($_REQUEST['operation']) ) { 
	endWithError($_REQUEST['format'], "Invalid request");
}

// Test the operation variable, must be a valid operation
$error = true;
for ($i=0; $i < sizeof($validOperations) && $error; $i++) { 
	if ($validOperations[$i] == $_REQUEST['operation']){
		$error = false;
	}
}
if ($error){
	endWithError($_REQUEST['format'], "Invalid request");
}

// Check the path param. Must not contain ".." to avoid to get any directory at the system
if (strpos($_REQUEST['path'], "..")){
	endWithError($_REQUEST['format'], "Invalid request");
}

//Call the function to get the results in format requested by parameter
$res = executeFileOperation($_REQUEST);

//Send the results
echo $res;
?>

