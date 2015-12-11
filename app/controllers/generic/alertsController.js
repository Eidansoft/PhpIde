angular.module('phpide').controller('alertsController', function($scope, PubSub, $timeout) {
	$scope.closeAlert = function(index) {
		$scope.alerts.splice(index, 1);
	};

	$scope.displayInfo = function(event, msg) {
		$scope.alerts.push({"mode": "success", "msg": msg});
		var autoClose = $scope.alerts.length - 1;
		$timeout(function(){
			$scope.closeAlert( autoClose );
			//$scope.$apply();
		}, 4000);
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