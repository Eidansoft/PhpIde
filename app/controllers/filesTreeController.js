angular.module('phpide').controller('filesTreeController', function($scope, fileService, PubSub) {
	$scope.project = {};
	$scope.project.name = "Test";
    $scope.project.files = [{nodes: []}];

	$scope.getFiles = function (node, path){
		var promise = fileService.getFiles(path);
		promise.then(function(data) {
			node.nodes = [];
			var filesResponse = data.response.content;
			for (var i = 0; i < filesResponse.length; i++) {
				node.nodes.push({
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

	$scope.openFile = function (file){
		if (file.type == 'folder'){
			if (file.nodes.length > 0){
				file.nodes = [];
			} else {
				$scope.getFiles(file, file.path + "/" + file.name);
			}
		} else if (file.type == 'file'){
			var promise = fileService.getFile(file.path + file.name);
			promise.then(function(response) {
				file.content = response;
				PubSub.publish('display-file', file);
			}, function(reason) {
				alert("Error (" + reason.code + "): " + reason.msg);
			});
		}
	};

	$scope.getFiles($scope.project.files[0], "/");
});