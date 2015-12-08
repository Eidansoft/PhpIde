var app = angular.module('phpide', ['ui.bootstrap', 'PubSub']);
app.controller('mainController', function($scope, PubSub) {

	$scope.closeAlert = function(index) {
		$scope.alerts.splice(index, 1);
	};

	$scope.displayInfo = function(event, msg) {
		$scope.alerts.push({"mode": "success", "msg": msg});
	};

	$scope.displayWarning = function(event, msg) {
		$scope.alerts.push({"msg": msg});
	};

	$scope.displayError = function(event, msg) {
		$scope.alerts.push({"mode": "danger", "msg": msg});
	};

	// Subscribe to the events to handle
	PubSub.subscribe('display-info', $scope.displayInfo);
	PubSub.subscribe('display-warning', $scope.displayWarning);
	PubSub.subscribe('display-error', $scope.displayError);

	$scope.alerts = [];
});