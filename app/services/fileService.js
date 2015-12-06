angular.module('phpide').factory('fileService', function($http, $q){

	var processRequest = function(request){
		return $q(function(resolve, reject) {
			$http(request).then(function successCallback(response) {
				var data = response.data;
				if (typeof data.error != 'undefined') {
					var error = {};
					error.code = data.error.code;
					error.msg = data.error.msg;
					reject(error);
				} else {
					resolve(data);
				}
			}, function errorCallback(response) {
				var error = {};
				error.code = response.status;
				error.msg = response.statusText;
				reject(error);
			});
		});
	};

	var getFiles = function(path){
		return processRequest({
			method: 'GET',
			//url: './mocks/files.json'
			url: './php_scripts/phphile.php?format=JSON&path='+path+'&operation=listFiles'
		});
	};

	var getFile = function(path){
		return processRequest({
			method: 'GET',
			//url: './mocks/sql.php.txt'
			url: './php_scripts/phphile.php?format=JSON&path='+path+'&operation=getFile'
		});
	};

    return {
    	"getFiles": getFiles,
    	"getFile": getFile,
    };               
});