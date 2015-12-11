angular.module('phpide').controller('buttonsController', function($scope, PubSub, fileService) {

	$scope.saveFile = function (){
		PubSub.publish('button-save-pressed');
	};

	$scope.saveFileAs = function (){
		PubSub.publish('button-save-as-pressed');
	};
	
	$scope.renameFile = function (){
		PubSub.publish('button-rename-pressed');
	};
	
	$scope.deleteFile = function (){
		PubSub.publish('button-delete-pressed');
	};
});