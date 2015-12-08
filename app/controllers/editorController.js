angular.module('phpide').controller('editorController', function($scope, PubSub, fileService) {

	$scope.displayFileContent = function (topic, data) {
		$scope.actualfile = data;

		var extensionRegex = /(?:\.([^.]+))?$/;
		var extension = extensionRegex.exec($scope.actualfile.name)[1];
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
		$scope.myCodeMirror.setValue(extension.toUpperCase() === "JSON" ? JSON.stringify($scope.actualfile.content, null, "\t") : $scope.actualfile.content);
		PubSub.publish('file-loaded', $scope.actualfile);
	};

	$scope.saveFileContent = function(event) {
		var promise = fileService.saveFile($scope.actualfile.path + $scope.actualfile.name, $scope.myCodeMirror.getValue());
		promise.then(function(response) {
			PubSub.publish('display-info', "File '" + $scope.actualfile.name + "' saved successfully");
		}, function(reason) {
			PubSub.publish('display-error', "Error (" + reason.code + "): " + reason.msg);
		});
	};

	// Subscribe to the events to handle
	PubSub.subscribe('display-file', $scope.displayFileContent);
	PubSub.subscribe('button-save-pressed', $scope.saveFileContent);

	//Create the initial default file content
	$scope.actualfile = {};
	$scope.actualfile.name = "initFile.txt";
	$scope.actualfile.type = "file";
	$scope.actualfile.content = "Initial content to show at phpide. Enjoy ;-)";
	// Call to show the initial code
	$scope.displayFileContent("", $scope.actualfile);
});