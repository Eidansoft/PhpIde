angular.module('phpide').controller('alertPromptWindowController', function($scope, $uibModalInstance, configurePrompt) {
	$scope.data = configurePrompt;

	$scope.ok = function () {
		$uibModalInstance.close($scope.data.value);
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss($scope.data.value);
	};
	
});
