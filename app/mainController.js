// configure the URL for the phphile module
angular.module('phphile.service').value('API_URL', './php_scripts/phphile.php');

var app = angular.module('phpide', ['ui.bootstrap', 'PubSub', 'phphile']);
app.controller('mainController', function($scope) {
	// This is MainController for phpide
});