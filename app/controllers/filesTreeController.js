angular.module('phpide').controller('filesTreeController', function($scope, fileService, PubSub) {
	$scope.project = {};
	$scope.project.name = "Test";
	$scope.project.filetree = {};
	$scope.project.filetree.files = [];
	$scope.project.filetree.updatefiletree = {};
	$scope.project.filetree.selectfile = {};

	$scope.project.filetree.selectitemfunction = function(fileSelected) {
		if (fileSelected.type == 'file'){
			var promise = fileService.getFile(fileSelected.path + fileSelected.name);
			promise.then(function(response) {
				fileSelected.content = response;
				PubSub.publish('display-file', fileSelected);
				$scope.project.filetree.selectfile(fileSelected);
			}, function(reason) {
				PubSub.publish('display-error', "Error (" + reason.code + "): " + reason.msg);
			});
		}
	};

	var updatefiletree = function (event){
		$scope.project.filetree.updatefiletree();
	};

	// Subscribe to file-loaded event
	PubSub.subscribe('refresh-filetree', updatefiletree);
});