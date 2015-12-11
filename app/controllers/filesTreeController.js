angular.module('phpide').controller('filesTreeController', function($scope, fileService, PubSub) {
	$scope.project = {};
	$scope.project.name = "Test";
	$scope.project.files = [];

	$scope.selectitem = function(fileSelected) {
		if (fileSelected.type == 'file'){
			var promise = fileService.getFile(fileSelected.path + fileSelected.name);
			promise.then(function(response) {
				fileSelected.content = response;
				PubSub.publish('display-file', fileSelected);
			}, function(reason) {
				PubSub.publish('display-error', "Error (" + reason.code + "): " + reason.msg);
			});
		}
	};
	
	// $scope.setNoFileSelected = function (fileNode){
	// 	if (typeof fileNode == 'undefined') {
	// 		$scope.setNoFileSelected($scope.project.files[0]);
	// 	} else {
	// 		for (var i = 0; i < fileNode.nodes.length; i++) {
	// 			if (fileNode.nodes[i].type == 'folder') {
	// 				$scope.setNoFileSelected(fileNode.nodes[i]);
	// 			} else {
	// 				fileNode.nodes[i].editing = false;
	// 			}
	// 		}
	// 	}
	// };

	// $scope.lookForFile = function (fileName, fileNode){
	// 	var res = false;
	// 	for (var i = 0; i < fileNode.nodes.length && !res; i++) {
	// 		if (fileNode.nodes[i].name == fileName){
	// 			res = fileNode.nodes[i];
	// 		} else if (fileNode.nodes[i].type == 'folder'){
	// 			res = $scope.lookForFile(fileName, fileNode.nodes[i]);
	// 		}
	// 	}
	// 	return res;
	// };

	// $scope.setFileLoaded = function (event, file){
	// 	// un set any previous selected file
	// 	$scope.setNoFileSelected();
	// 	// look for the file at the array and set it as selected
	// 	var nodeFound = $scope.lookForFile(file.name, $scope.project.files[0]);
	// 	if (nodeFound){
	// 		nodeFound.editing = true;
	// 	}
	// };

	// $scope.refreshFileTree = function(event) {
	// 	$scope.getFiles($scope.project.files[0], "/");
	// };

	// Subscribe to file-loaded event
	//PubSub.subscribe('file-loaded', $scope.setFileLoaded);
	//PubSub.subscribe('refresh-fileTree', $scope.refreshFileTree);

	//$scope.refreshFileTree(null);
});