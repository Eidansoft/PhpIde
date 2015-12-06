angular.module('phpide').controller('editorController', function($scope, PubSub) {

	$scope.displayFileContent = function (topic, data) {
		$scope.myCodeMirror.setValue(data.content);
	}

	// Subscribe to event
	PubSub.subscribe('display-file', $scope.displayFileContent);

	$scope.myCodeMirror = CodeMirror.fromTextArea(document.getElementById("code"), {
		extraKeys: {"Ctrl-Space": "autocomplete"},
		mode: {name: "php", globalVars: true},
		//mode: {name: "javascript", globalVars: true},
		lineNumbers: true,
	});

	$scope.myCodeMirror.setValue("function myScript(){return 100;}\n");
});