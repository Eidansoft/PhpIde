angular.module('phpide').controller('selectFolderController', function($scope, PubSub) {

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

	$scope.selectitemfunction = function(fileSelected) {
		$scope.selected = fileSelected.path + fileSelected.name;
	};

	$scope.displayFileContent = function(event, configureWindow) {
		$scope.config = configureWindow;
		// configure default return values depending the type of window
		if ($scope.config.type == 'confirm') {
			$scope.selected = "ok";
		} else if ($scope.config.type == 'prompt') {
			$scope.selected = "";
		} else if ($scope.config.type == 'file') {
			$scope.selected = "/";
		}

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
