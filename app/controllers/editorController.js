angular.module('phpide').controller('editorController', function($scope, PubSub) {

	$scope.displayFileContent = function (topic, data) {
		var extensionRegex = /(?:\.([^.]+))?$/;
		var extension = extensionRegex.exec(data.name)[1];
		// if the file has no extension, then I set one by default
		extension = (typeof extension == 'undefined' ? "js" : extension);
		var extensions2mode = {
			'php': {name: "php", 			globalVars: true},
			'inc': {name: "php", 			globalVars: true},
			'js':  {name: "javascript", 	globalVars: true},
			'sql': {name: "sql"},
			'json':{name: "javascript", 	json: true},
			'html':{name: "htmlmixed"},
			'htm': {name: "htmlmixed"},
			'css': {name: "css"},
		};
		// If there is a previous instance for codeMirror, I clean it
		if (typeof $scope.myCodeMirror != 'undefined'){
			$scope.myCodeMirror.toTextArea();
		}
		// I create the new Codemirror instance
		$scope.myCodeMirror = CodeMirror.fromTextArea(document.getElementById("code"), {
			extraKeys: {"Ctrl-Space": "autocomplete"},
			mode: extensions2mode[extension],
			//mode: {name: "javascript", globalVars: true},
			lineNumbers: true,
		});
		$scope.myCodeMirror.setValue(extension.toUpperCase() === "JSON" ? JSON.stringify(data.content, null, "\t") : data.content);
		PubSub.publish('file-loaded', data);
	}

	// Subscribe to event to load a new file
	PubSub.subscribe('display-file', $scope.displayFileContent);

	//Create the initial default file content
	var initFile = {};
	initFile.name = "initFile.txt";
	initFile.type = "file";
	initFile.content = "Initial content to show at phpide. Enjoy ;-)";
	// Call to show the initial code
	$scope.displayFileContent("", initFile);
});