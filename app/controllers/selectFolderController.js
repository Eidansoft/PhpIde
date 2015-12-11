angular.module('phpide').controller('selectFolderController', function($scope, fileService, PubSub) {
	$scope.data = {};

	$scope.ok = function () {
		$scope.hide();
		if (typeof $scope.data.success != 'undefined') {
			$scope.data.success($scope.data.selected);
		}
	};

	$scope.cancel = function () {
		$scope.hide();
		if (typeof $scope.data.cancelled != 'undefined') {
			$scope.data.cancelled();
		}
	};

	$scope.displayFileContent = function(event, configureWindow) {
		$scope.data = configureWindow;
		$scope.data.selected = {"name": "none"};

		var configureTree = {
			rootFolder: "/",
			onClick: function(fileSelected) {
				$scope.data.selected = fileSelected;
			},
		};
		PubSub.publish('configure-file-tree', configureTree);
		
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
});
