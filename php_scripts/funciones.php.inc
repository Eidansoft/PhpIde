<?php
/**
 * PHP functions to manage files through a REST+JSON interface
 * @author Alejandro Lorente
 * @author eidansoft at gmail dot com
 * @license GPLv3.0
 * @sources https://github.com/Eidansoft/Phphiles.git
 */

/**
 * Print to the user an error message at the specified format
 * @param string - $type - The format, between XML or JSON. For other values it'll print a generic message
 * @param string - $msg - The message with error info
 * @param int - $cod - Optional. A number to identify the error by the application of the client. 
 */
function endWithError($type, $msg, $cod = 1){

	if ($type == "XML"){
		$dom = new DOMDocument("1.0");

		$node = $dom->createElement("error");
		$parnode = $dom->appendChild($node);

		$nodeMsg = $dom->createElement("msg", $msg);
		$parnode->appendChild($nodeMsg);

		$nodeCod = $dom->createElement("cod", $cod);
		$parnode->appendChild($nodeCod);

		$res = $dom->saveXML();
	} elseif ($type == "JSON"){
		$row = array();
		$row["error"]["msg"] = $msg;
		$row["error"]["code"] = $cod;
		$res = json_encode($row);
	} else {
		$res = $msg . ". Error code " . $cod . ".";
	}

	echo $res;
	die();
}

/**
 * Create a response object with the content, message and code paramenters into the spacified format
 * @param string - $type - The format, between XML or JSON. For other values it'll print a generic message
 * @param string - $msg - The message with error info
 * @param int - $cod - A number to identify the error by the application of the client
 * @param string - $content - Optional. The extra data to send
 */
function createResponse($type, $msg, $cod, $content = false){

	if ($type == "XML"){
		$dom = new DOMDocument("1.0");

		$node = $dom->createElement("response");
		$parnode = $dom->appendChild($node);

		$nodeMsg = $dom->createElement("msg", $msg);
		$parnode->appendChild($nodeMsg);

		$nodeCod = $dom->createElement("code", $cod);
		$parnode->appendChild($nodeCod);

		if ($content !== false){
			$fragment = $dom->createDocumentFragment();
			$fragment->appendXML($content);
			$parnode->appendChild($fragment);
		}

		$res = $dom->saveXML();
	} elseif ($type == "JSON"){
		$row = array();
		$row["response"]["msg"] = $msg;
		$row["response"]["code"] = $cod;
		if ($content !== false){
			$row["response"]["content"] = $content;
		}
		$res = json_encode($row);
	} else {
		$res = "Error";
	}

	return $res;
}

/**
 * Return a response into the selected format. The response depends of the operation requested.
 * The param should contain all the variables with the data needed in order to perform the action,
 * like the operation name, the path, or other data. See the doc for each operation.
 * @param array - $request - request array with all the needed params to performa the operation
 */
function executeFileOperation($request){
	switch ($request['operation']) {
		case "listFiles":
			return listFiles($request['path'], $request['format']);
			break;
		case "createFolder":
			return createFolder($request['path'], $request['format']);
			break;
		case "getFile":
			getFile($request['path'], $request['format']);
			break;
		case "saveFile":
			return checkAndSaveFile($request['path'], $request['content'], $request['format']);
			break;
		case "deleteFile":
			return deleteFile($request['path'], $request['format']);
			break;
		default:
			endWithError($request['format'], "Function not yet implemented", 11);
	}
}

/**
 * Return the content of a file into the format asked by param
 * @param string - $path - The path to look for the files
 * @param string - $format - The format to return the results
 */
function getFile($path, $format){
	global $rootFolder;
	$attachment_location = $rootFolder . $path;
	if ($format == "FILE"){
		if (file_exists($attachment_location)) {
			header($_SERVER["SERVER_PROTOCOL"] . " 200 OK");
			header("Cache-Control: public"); // needed for i.e.
			//header("Content-Type: application/zip");
			header("Content-Transfer-Encoding: Binary");
			header("Content-Length: " . filesize($attachment_location));
			header("Content-Disposition: attachment; filename=" . basename($attachment_location));
			readfile($attachment_location);
			die();        
		} else {
			endWithError($format, "File not found", 12);
		}
	} else {
		endWithError($format, "Format error", 13);
	} 
}

/**
 * Return the list of files at $path into the format asked by param
 * @param string - $path - The path to look for the files
 * @param string - $format - The format to return the results
 */
function listFiles($path, $format){
	global $rootFolder;
	if (is_dir($rootFolder . $path)) {
		$files  = scandir($rootFolder . $path);

		// remove . and .. files
		$filters = array('..', '.');
		$files = array_diff($files, $filters);

		// Fill the array with all the properties for each file
		$filesInfo = array();
		foreach ($files as $key => $value){
			$filePath = $rootFolder . $path . "/" . $value;
			$filesInfo[$value]['name'] = $value;
			$filesInfo[$value]['size'] = 0;
			if (is_dir($filePath)){
				$filesInfo[$value]['type'] = 'folder';
			} else if (is_file($filePath)){
				$filesInfo[$value]['size'] = filesize($filePath);
				$filesInfo[$value]['type'] = 'file';
			} else if (is_link($filePath)){
				$filesInfo[$value]['type'] = 'link';
			} else {
				$filesInfo[$value]['type'] = 'unknown';
			}
			$filesInfo[$value]['path'] = $path . (substr($path, strlen($path)-1, 1) == "/" ? "" : "/");
		}

		if ($format == "JSON"){
			return listFilesJSON($filesInfo);
		} else if ($format == "XML"){
			return listFilesXML($filesInfo);
		}
	} else {
		endWithError($format, "Path not found", 14);
	} 
}

/**
 * Return the list of files into XML format
 * @param array - $files - array with the files and its info
 */
function listFilesXML($files){
	$dom = new DOMDocument("1.0");
	$node = $dom->createElement("content");
	$res = $parnode = $dom->appendChild($node);

	foreach ($files as $key => $value){
		$nodeFile = $dom->createElement("file");
		$parnode->appendChild($nodeFile);

		$nodeName = $dom->createElement("name", $value['name']);
		$nodeFile->appendChild($nodeName);

		$nodeName = $dom->createElement("type", $value['type']);
		$nodeFile->appendChild($nodeName);

		$nodeName = $dom->createElement("size", $value['size']);
		$nodeFile->appendChild($nodeName);

		$nodeName = $dom->createElement("path", $value['path']);
		$nodeFile->appendChild($nodeName);
	}
	return createResponse("XML", "Success", 0, $dom->saveXML($res));
}

/**
 * Return the list of files into JSON format
 * @param array - $files - array with the files and its info
 */
function listFilesJSON($files){
	$res = array();
	foreach ($files as $key => $value){
		$file = array();
		$file['name'] = $value['name'];
		$file['size'] = $value['size'];
		$file['path'] = $value['path'];
		$file['type'] = $value['type'];
		$res[] = $file;
	}
	return createResponse("JSON", "Success", 0, $res);
}

/**
 * Save into a file the content param and return a response to inform the client into the responseFormat format
 * @param string - $path - The path to look for the files
 * @param string - $content - The text to save into the file
 * @param string - $responseFormat - The format to return the results
 */
function checkAndSaveFile($path, $content, $responseFormat){
	global $rootFolder;
	$filePath = $rootFolder . $path;
	$writeSuccess = false;
	if (file_exists($filePath)) {
		if (is_file($filePath)) {
			$writeSuccess = saveFile($filePath, $content, $responseFormat);
		} else {
			endWithError($responseFormat, "Error saving file", 15);
		}
	} else {
		$writeSuccess = saveFile($filePath, $content, $responseFormat);
	}

	if ($writeSuccess) {
		$res = createResponse($responseFormat, "Success", 0);
	} else {
		endWithError($responseFormat, "Error saving file", 16);
	}

	return $res;
}

/**
 * Save into a file the content param and return a response to inform the client into the responseFormat format
 * @param string - $path - The path to look for the files
 * @param string - $content - The text to save into the file
 * @param string - $responseFormat - The format to return the results
 */
function saveFile($path, $content, $responseFormat){
	$myfile = fopen($path, "w") or endWithError($responseFormat, "Error saving file", 17);
	$res = fwrite($myfile, $content);
	fclose($myfile);
	return ($res === false ? $res : true);
}

/**
 * Delete file and return a response to inform the client into the responseFormat format
 * @param string - $path - The path to the file
 * @param string - $responseFormat - The format to return the results
 */
function deleteFile($path, $responseFormat){
	global $rootFolder;
	$filePath = $rootFolder . $path;
	$writeSuccess = false;
	if (file_exists($filePath)) {
		if (is_file($filePath)) {
			if (unlink ( $filePath )){
				$res = createResponse($responseFormat, "Success", 0);
			} else {
				endWithError($responseFormat, "Error deleting file '" . $path . "'" , 18);
			}
		} else {
			endWithError($responseFormat, "File not found", 19);
		}
	} else {
		endWithError($responseFormat, "File not found", 20);
	}

	return $res;
}

/**
 * Create a new folder and return a response to inform the client into the responseFormat format
 * @param string - $path - The path for the new folder
 * @param string - $responseFormat - The format to return the results
 */
function createFolder($path, $responseFormat){
	global $rootFolder;
	$filePath = $rootFolder . $path;
	if (file_exists($filePath)) {
		endWithError($responseFormat, "Wrong path", 21);
	} else {
		$res = mkdir($path, 0777);
	}

	if ($res) {
		$res = createResponse($responseFormat, "Success", 0);
	} else {
		endWithError($responseFormat, "Error creating folder '" . $path . "'", 22);
	}
	return $res;
}

function debug($msg, $variable){
	echo $msg . "\n";
	var_dump($variable);
	die();
}
?>
