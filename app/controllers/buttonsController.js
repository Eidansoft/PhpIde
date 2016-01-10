angular.module('phpide').controller('buttonsController', function($scope, PubSub) {

	$scope.saveFile = function (){
		PubSub.publish('button-save-pressed');
	};

	$scope.saveFileAs = function (){
		PubSub.publish('button-save-as-pressed');
	};
	
	$scope.renameFile = function (){
		PubSub.publish('button-rename-pressed');
	};

	$scope.newFile = function (){
		PubSub.publish('button-new-pressed');
	};
	
	$scope.deleteFile = function (){
		PubSub.publish('button-delete-pressed');
	};
});