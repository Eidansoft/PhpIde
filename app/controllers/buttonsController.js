angular.module('phpide').controller('buttonsController', function($scope, PubSub, fileService) {

	$scope.saveFile = function (){
		PubSub.publish('button-save-pressed');
	};
	
});