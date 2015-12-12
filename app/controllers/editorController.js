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

	$scope.openSaveFileAsWindow = function(event) {
		var configureWindow = {
			title: "Destination",
			msg: "Select destination folder:",
			showFolders: true,
			showFiles: false,
			okButton: "Ok",
			cancelButton: "Cancel",
			rootFolder: "/",
			success: function(folderSelected) {
				PubSub.publish('display-info', "Folder selected:" + folderSelected.path + folderSelected.name);
			},
			// cancelled: function() {
			// 	PubSub.publish('display-error', "No folder selected");
			// },
		};
		PubSub.publish('open-modal-select-file', configureWindow);
	};

	$scope.openConfirmDeleteWindow = function() {
		// var modalInstance = $uibModal.open({
		// 	animation: true,
		// 	templateUrl: 'prompt.html',
		// 	controller: 'alertPromptWindowController',
		// 	resolve: {
		// 		configurePrompt: {
		// 			title: "Delete",
		// 			msg: "Are you sure you want to delete '" + $scope.actualfile.name + "'?. This operation cannot be undone",
		// 			prompt: false,
		// 			value: $scope.actualfile.name,
		// 			okButton: "Ok",
		// 			cancelButton: "Cancel",
		// 		},
		// 	}
		// });
		// modalInstance.result.then(function () {
		// 	var promiseDelete = fileService.deleteFile($scope.actualfile.path + $scope.actualfile.name);
		// 	promiseDelete.then(function(response) {
		// 		$scope.actualfile = $scope.initialFile;
		// 		$scope.displayFileContent(null, $scope.actualfile);
		// 		PubSub.publish('display-info', "File successfully deleted");
		// 		PubSub.publish('refresh-fileTree', $scope.actualfile);
		// 	}, function(reason) {
		// 		PubSub.publish('display-error', "Error (" + reason.code + "): " + reason.msg);
		// 	});
		// });
	};

	$scope.openRenameWindow = function () {
		// var modalInstance = $uibModal.open({
		// 	animation: true,
		// 	templateUrl: 'prompt.html',
		// 	controller: 'alertPromptWindowController',
		// 	resolve: {
		// 		configurePrompt: {
		// 			title: "Rename",
		// 			msg: "Write the new name for the file:",
		// 			prompt: true,
		// 			value: $scope.actualfile.name,
		// 			okButton: "Ok",
		// 			cancelButton: "Cancel",
		// 		},
		// 	}
		// });
		// modalInstance.result.then(function (newName) {
		// 	var promiseCopyNew = fileService.saveFile($scope.actualfile.path + newName, $scope.actualfile.content);
		// 	promiseCopyNew.then(function(response) {
		// 		var promiseDeleteOld = fileService.deleteFile($scope.actualfile.path + $scope.actualfile.name);
		// 		promiseDeleteOld.then(function(response) {
		// 			$scope.actualfile.name = newName;
		// 			PubSub.publish('display-info', "File successfully renamed to " + newName);
		// 		}, function(reason) {
		// 			PubSub.publish('display-error', "Error (" + reason.code + "): " + reason.msg);
		// 		});
		// 	}, function(reason) {
		// 		PubSub.publish('display-error', "Error (" + reason.code + "): " + reason.msg);
		// 	});
		// });
	};

	// Subscribe to the events to handle
	PubSub.subscribe('display-file', $scope.displayFileContent);
	PubSub.subscribe('button-save-pressed', $scope.saveFileContent);
	PubSub.subscribe('button-rename-pressed', $scope.openRenameWindow);
	PubSub.subscribe('button-delete-pressed', $scope.openConfirmDeleteWindow);
	PubSub.subscribe('button-save-as-pressed', $scope.openSaveFileAsWindow);

	//Create the initial default file content
	$scope.initialFile = {};
	$scope.initialFile.name = "initFile.txt";
	$scope.initialFile.type = "file";
	$scope.initialFile.path = "/";
	$scope.initialFile.content = "Initial content to show at phpide. Enjoy ;-)\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n";

	$scope.actualfile = $scope.initialFile;

	// Call to show the initial code
	$scope.displayFileContent("", $scope.actualfile);
});