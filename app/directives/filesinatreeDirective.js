angular.module('phpide').directive('filesinatree', ['fileService', function(fileService) {

	var link = function (scope, element, attrs) {

		var getFiles = function (nodes, path){
			var promise = fileService.getFiles(path);
			promise.then(function(data) {
				var filesResponse = data.response.content;
				for (var i = 0; i < filesResponse.length; i++) {
					nodes.push({
						name: filesResponse[i].name,
						size: filesResponse[i].size,
						path: filesResponse[i].path,
						type: filesResponse[i].type,
						nodes: [],
					});
				};
			}, function(reason) {
				alert("Error (" + reason.code + "): " + reason.msg);
			});
		};

		scope.selectItem = function (file){
			if (file.type == 'folder'){
				if (file.nodes.length > 0){
					file.nodes = [];
				} else {
					getFiles(file.nodes, file.path + file.name);
				}
			} else if (file.type == 'file'){
				scope.markonefilefunction(file);
			}

			if (typeof scope.onclickfunction != 'undefined') {
				scope.onclickfunction(file);
			}
		};

		var setNoFileSelected = function (fileNode){
			if (typeof fileNode == 'undefined') {
				setNoFileSelected(scope.files);
			} else {
				for (var i = 0; i < fileNode.length; i++) {
					if (fileNode[i].type == 'folder') {
						setNoFileSelected(fileNode[i].nodes);
					} else {
						fileNode[i].editing = "notSelected";
					}
				}
			}
		};

		var lookForFile = function (fileName, fileNode){
			var res = false;
			for (var i = 0; i < fileNode.length && !res; i++) {
				if (fileNode[i].name == fileName){
					res = fileNode[i];
				} else if (fileNode[i].type == 'folder'){
					res = lookForFile(fileName, fileNode[i].nodes);
				}
			}
			return res;
		};

		scope.markonefilefunction = function (file){
			// un set any previous selected file
			setNoFileSelected();
			// look for the file at the array and set it as selected
			var nodeFound = lookForFile(file.name, scope.files);
			if (nodeFound){
				nodeFound.editing = "selected";
			}
		};

		var updateOpenedFolders = function (oldFilesList, newFilesList){
			for (var i = 0; i < oldFilesList.length; i++) {
				if (oldFilesList[i].type == 'folder' && oldFilesList[i].nodes.length > 0) {
					getFiles(newFilesList[i].nodes, newFilesList[i].path + newFilesList[i].name);
					updateOpenedFolders(oldFilesList[i].nodes, newFilesList[i].nodes);
				}
			};
		};

		scope.refreshfiletreefunction = function (){
			var oldFilesList = scope.files;
			scope.files = [];
			getFiles(scope.files, "/");

			updateOpenedFolders(oldFilesList, scope.files);
		};

		scope.refreshfiletreefunction();
	}

	return {
		restrict: 'E',
		scope: {
			files: '=',
			onclickfunction: '=',
			refreshfiletreefunction: '=',
			markonefilefunction: '=',
			onlyfolders: '=onlyfolders',
		},
		templateUrl: './partials/generic/filesinatree.html',
		link: link,
	};
}]);