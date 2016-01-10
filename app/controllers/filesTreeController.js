angular.module('phpide').controller('filesTreeController', function($scope, phphileService, PubSub) {
	$scope.project = {};
	$scope.project.name = "Test";
	$scope.project.filetree = {};
	$scope.project.filetree.files = [];
	$scope.project.filetree.updatefiletree = {};
	$scope.project.filetree.selectfile = {};

	$scope.project.filetree.selectitemfunction = function(fileSelected) {
		if (fileSelected.type == 'file'){
			var promise = phphileService.getFile(fileSelected.path + fileSelected.name);
			promise.then(function(response) {
				fileSelected.content = response;
				PubSub.publish('display-file', fileSelected);
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