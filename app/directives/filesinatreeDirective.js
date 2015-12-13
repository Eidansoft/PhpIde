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
			}

			if (typeof scope.control.selectitemfunction != 'undefined') {
				scope.control.selectitemfunction(file);
			}
		};

		var setNoFileSelected = function (fileNode){
			if (typeof fileNode == 'undefined') {
				setNoFileSelected(scope.control.files);
			} else {
				for (var i = 0; i < fileNode.length; i++) {
					if (fileNode[i].type == 'folder') {
						setNoFileSelected(fileNode[i].nodes);
					} else {
						fileNode[i].editing = "selected";
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

		scope.selectfilefunction = function (file){
			// un set any previous selected file
			setNoFileSelected();
			// look for the file at the array and set it as selected
			var nodeFound = lookForFile(file.name, scope.control.files);
			if (nodeFound){
				nodeFound.editing = "notSelected";
			}
		};

		scope.updatefunction = function (){
			scope.control.files = [];
			getFiles(scope.control.files, "/");
		};

		scope.updatefunction();
	}

	return {
		restrict: 'E',
		scope: {
			control: '=',
			updatefunction: '=',
			selectfilefunction: '=',
			onlyfolders: '=onlyfolders',
		},
		templateUrl: './partials/generic/filesinatree.html',
		link: link,
	};
}]);