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
			lineNumbers: true,
			indentWithTabs: true,
		});
		$scope.myCodeMirror.setValue(extension.toUpperCase() === "JSON" ? JSON.stringify($scope.actualfile.content, null, "\t") : $scope.actualfile.content);
	};

	$scope.saveFileContent = function(event) {
		var path = $scope.actualfile.path + $scope.actualfile.name;
		saveFile(path, $scope.myCodeMirror.getValue())
		.then(reportSuccess.bind(this, "File successfully saved at '" + path + "'"))
		.catch( reportProblems );
	};

	$scope.openSaveFileAsWindow = function(event) {
		var configSelectFolder = {
			title: "Destination",
			msg: "Select destination folder:",
			type: "file",
			editable: true,
			okButton: "Ok",
			cancelButton: "Cancel",
			success: function(folderSelected) {
				saveFile(folderSelected, $scope.myCodeMirror.getValue())
				.then(reportSuccess.bind(this, "File successfully saved at '" + folderSelected + "'"))
				.catch( reportProblems );
			},
			// cancelled: function() {
			// 	PubSub.publish('display-error', "No folder selected");
			// },
		};
		PubSub.publish('open-modal-select-file', configSelectFolder);
	};

	$scope.openConfirmDeleteWindow = function() {
		var configConfirm = {
			title: "Delete",
			msg: "Are you sure you want to delete '" + $scope.actualfile.name + "'?. This operation cannot be undone",
			type: "confirm",
			okButton: "Yes, delete it!",
			cancelButton: "Cancel",
			success: function() {
				var path = $scope.actualfile.path + $scope.actualfile.name;
				deleteFile(path)
				.then(reportSuccess.bind(this, "File '" + path + "' successfully deleted"))
				.catch( reportProblems );
			},
			// cancelled: function() {
			// 	PubSub.publish('display-error', "No folder selected");
			// },
		};
		PubSub.publish('open-modal-select-file', configConfirm);
	};

	$scope.openRenameWindow = function () {
		var configSelectFolder = {
			title: "Rename",
			msg: "Write the new name for the file:",
			type: "file",
			editable: true,
			okButton: "Ok",
			cancelButton: "Cancel",
			success: function(folderSelected) {
				saveFile(folderSelected, $scope.myCodeMirror.getValue())
				.then(deleteFile.bind(this, $scope.actualfile.path + $scope.actualfile.name))
				.then(reportSuccess.bind(this, "File successfully saved at '" + folderSelected + "'"))
				.catch( reportProblems );
			},
			// cancelled: function() {
			// 	PubSub.publish('display-error', "No folder selected");
			// },
		};
		PubSub.publish('open-modal-select-file', configSelectFolder);
	};

	var deleteFile = function(path) {
		var promise = fileService.deleteFile(path);
		return promise.then(
			function(response) {
				return response
			},
			function(reason) {
				throw( reason );
			}
		);
	};

	var saveFile = function(path, content) {
		var promise = fileService.saveFile(path, content);
		return promise.then(
			function(response) {
				return response
			},
			function(reason) {
				throw( reason );
			}
		);
	};

	var reportProblems = function( reason ) {
		PubSub.publish('display-error', "Error (" + reason.code + "): " + reason.msg);
	};

	var reportSuccess = function( msg ) {
		PubSub.publish('refresh-filetree');
		PubSub.publish('display-info', msg);
	};

	var loadNewEmptyFile = function() {
		//Create the initial default file content
		$scope.initialFile = {};
		$scope.initialFile.name = "initFile.txt";
		$scope.initialFile.type = "file";
		$scope.initialFile.path = "/";
		$scope.initialFile.content = "Initial content to show at phpide. Enjoy ;-)\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n";

		$scope.actualfile = $scope.initialFile;

		// Call to show the initial code
		$scope.displayFileContent("", $scope.actualfile);
	}

	// Subscribe to the events to handle
	PubSub.subscribe('display-file', $scope.displayFileContent);
	PubSub.subscribe('button-save-pressed', $scope.saveFileContent);
	PubSub.subscribe('button-rename-pressed', $scope.openRenameWindow);
	PubSub.subscribe('button-delete-pressed', $scope.openConfirmDeleteWindow);
	PubSub.subscribe('button-save-as-pressed', $scope.openSaveFileAsWindow);
	PubSub.subscribe('button-new-pressed', loadNewEmptyFile);

	loadNewEmptyFile();
});