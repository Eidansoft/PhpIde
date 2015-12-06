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
function createResponse($type, $msg, $cod, $content){

	if ($type == "XML"){
		$dom = new DOMDocument("1.0");

		$node = $dom->createElement("response");
		$parnode = $dom->appendChild($node);

		$nodeMsg = $dom->createElement("msg", $msg);
		$parnode->appendChild($nodeMsg);

		$nodeCod = $dom->createElement("code", $cod);
		$parnode->appendChild($nodeCod);

		$fragment = $dom->createDocumentFragment();
		$fragment->appendXML($content);
		$parnode->appendChild($fragment);

		$res = $dom->saveXML();
	} elseif ($type == "JSON"){
		$row = array();
		$row["response"]["msg"] = $msg;
		$row["response"]["code"] = $cod;
		$row["response"]["content"] = $content;
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
			//createFolder($request['path']);
			endWithError($request['format'], "Not yet implemented", 1);
			break;
		case "getFile":
			getFile($request['path'], $request['format']);
			break;
		case "saveFile":
			//saveFile($request['path'], $request['content']);
			endWithError($request['format'], "Not yet implemented", 1);
			break;
		case "deleteFile":
			//deleteFile($request['path']);
			endWithError($request['format'], "Not yet implemented", 1);
			break;
		default:
			endWithError($request['format'], "Function not yet implemented", 1);
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
		endWithError($format, "File not found", 1);
	} 
}

/**
 * Return the list of files at $path into the format asked by param
 * @param string - $path - The path to look for the files
 * @param string - $format - The format to return the results
 */
function listFiles($path, $format){
	global $rootFolder;
	if (file_exists($rootFolder . $path)) {
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
			$filesInfo[$value]['path'] = $path;
		}

		if ($format == "JSON"){
			return listFilesJSON($filesInfo);
		} else if ($format == "XML"){
			return listFilesXML($filesInfo);
		}
	} else {
		endWithError($format, "File not found", 1);
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
 * Return a DOM object with the contents of execute the SQL at a XML format
 * @param mysqli - $connection - mysql Connection
 * @param string - $rootElementName - root element name
 * @param string - $childElementName - each child element name
 * @param string - $sql - SQL sentence
 * @param boolean - $withNullValues - If true, for empty values, the DOM will contain the "null" string
 */
function sqlToXmlObj($connection, $rootElementName, $childElementName, $sql, $withNullValues=true){
	global $maxResults;
	// Select all the rows in the query
	$result = $connection->query($sql);
	if (!$result) { endWithError("XML", 'Invalid query (' . $sql . '): ' . $connection->connect_error); }
	$numRegistros = $result->num_rows;
	
	$dom = new DOMDocument("1.0");
	$node = $dom->createElement($rootElementName);
	$parnode = $dom->appendChild($node);
	$parnode->setAttribute("sql", $sql);
	$parnode->setAttribute("total", $numRegistros);
	//$parnode->setAttribute("limit", $maxResults);

	$counter = 0;
	while( ($counter < $maxResults) && $registro = $result->fetch_row()){
		$counter++;
		// ADD TO XML DOCUMENT NODE
		$node = $dom->createElement($childElementName);
		$newnode = $parnode->appendChild($node);
		
		for ($i=0; $i < $connection->field_count; $i++)
		{
			$fieldMetadata = $result->fetch_field_direct($i);
			$fieldName = $fieldMetadata->name;
			 // We set empty columns with NULL
			 if( $withNullValues && empty( $registro[$i] ) ) {
				 $fieldValue = "null";
			 } else {
				 $fieldValue = $registro[$i];
			 }

			 try{
				// The child will take the name of the table column
				$field = $dom->createElement($fieldName, $fieldValue);
				$newfield = $newnode->appendChild($field);
			} catch (DOMException $e) {
				endWithError("XML", 'It seems you have not valid characters at columns names');
			}
		}
	}
	$parnode->setAttribute("totalReturned", $counter);

	$result->close();
	return $dom;
}

/**
 * Return a XML string with the contents of execute the SQL
 * @param mysqli - $connection - mysql Connection
 * @param string - $sql - SQL sentence
 * @param boolean - $withNullValues - If true, for empty values, the XML correspondant values will contain the "null" string
 */
function sqlToXml($connection, $sql, $withNullValues=true){
	$dom = sqlToXmlObj($connection, "query", "resultado", $sql, $withNullValues);
	return $dom->saveXML();
}

/**
 * Return a JSON string with the contents of execute the SQL
 * @param mysqli - $connection - mysql Connection
 * @param string - $sql - SQL sentence
 * @param boolean - $withNullValues - If true, for empty values, the JSON correspondant values will contain the "null" string
 */
function sqlToJson($connection, $sql, $withNullValues=true){
	global $maxResults;
	// Select all the rows in the query
	$result = $connection->query($sql);
	if (!$result) { endWithError("JSON", 'Invalid query (' . $sql . '): ' . $connection->connect_error); }
	$numRegistros = $result->num_rows;

	$rows = array();
	while( (count($rows) < $maxResults) && $registro = $result->fetch_row()){
		$row = array();
		for ($i=0; $i < $connection->field_count; $i++)
		{
			$fieldMetadata = $result->fetch_field_direct($i);
			$fieldName = $fieldMetadata->name;
			// We set empty columns with NULL
			if( $withNullValues && empty( $registro[$i] ) ) {
				$fieldValue = "null";
			} else {
				$fieldValue = $registro[$i];
			}

			$row[$fieldName] = $fieldValue;
		}
		$rows[] = $row;
	}
	
	$result->close();
	return json_encode($rows);
}

/** DEPRECATED Old function to create the XML manually. Now use "sqlToXmlObj" instead.
 * @param mysql_resource - $queryResult - mysql query result
 * @param string - $rootElementName - root element name
 * @param string - $childElementName - each child element name

function sqlToXml($queryResult, $rootElementName, $childElementName)
{ 
	$xmlData = "<?xml version=\"1.0\" encoding=\"ISO-8859-1\" ?>\n"; 
	$xmlData .= "<" . $rootElementName . ">";
 
	while($record = mysql_fetch_object($queryResult))
	{ 
		// Create the first child element
		$xmlData .= "<" . $childElementName . ">";
 
		for ($i = 0; $i < mysql_num_fields($queryResult); $i++)
		{ 
			$fieldName = mysql_field_name($queryResult, $i); 
 
			// The child will take the name of the table column
			$xmlData .= "<" . $fieldName . ">";
 
			// We set empty columns with NULL, or you could set it to '0' or a blank.
			if(!empty($record->$fieldName))
				$xmlData .= $record->$fieldName; 
			else
				$xmlData .= "null"; 
 
			$xmlData .= "</" . $fieldName . ">"; 
		} 
		$xmlData .= "</" . $childElementName . ">"; 
	} 
	$xmlData .= "</" . $rootElementName . ">"; 
 
	return $xmlData; 
} */

function debug($msg){
	echo $msg;
	die();
}
?>
