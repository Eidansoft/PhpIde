angular.module('phpide').controller('selectFolderController', function($scope, fileService, PubSub) {

	$scope.ok = function () {
		$scope.hide();
		if (typeof $scope.config.success != 'undefined') {
			$scope.config.success($scope.selected);
		}
	};

	$scope.cancel = function () {
		$scope.hide();
		if (typeof $scope.config.cancelled != 'undefined') {
			$scope.config.cancelled();
		}
	};

	$scope.selectitem = function(fileSelected) {
		$scope.selected = fileSelected;
	};

	$scope.displayFileContent = function(event, configureWindow) {
		$scope.config = configureWindow;
		//$scope.files = [{name: "prueba", type: "file", size: 40}];
		$scope.selected = {"name": "none"};

		$scope.show();
	};

	$scope.show = function() {
		$scope.showWindow = true;
	};

	$scope.hide = function() {
		$scope.showWindow = false;
	};

	// Subscribe to the events to handle
	PubSub.subscribe('open-modal-select-file', $scope.displayFileContent);

	$scope.files = [];
});
