angular.module('phpide').directive('filesinatree', ['fileService', function(fileService) {

	var link = function (scope, element, attrs) {

		var getFiles = function (nodes, path){
			var promise = fileService.getFiles(path);
			promise.then(function(data) {
				var filesResponse = data.response.content;
				for (var i = 0; i < filesResponse.length; i++) {
					nodes.push({
						name: filesResponse[i].name,
						size: filesResponse[i].size,
						path: filesResponse[i].path,
						type: filesResponse[i].type,
						nodes: [],
					});
				};
			}, function(reason) {
				alert("Error (" + reason.code + "): " + reason.msg);
			});
		};

		scope.selectItem = function (file){
			if (file.type == 'folder'){
				if (file.nodes.length > 0){
					file.nodes = [];
				} else {
					getFiles(file.nodes, file.path + file.name);
				}
			}

			if (typeof scope.selectitemfunction != 'undefined') {
				scope.selectitemfunction(file);
			}
		};

		getFiles(scope.files, "/");
	}

	return {
		restrict: 'E',
		scope: {
			files: '=files',
			selectitemfunction: '=selectitemfunction',
		},
		templateUrl: './partials/generic/filesinatree.html',
		link: link,
	};
}]);