<!DOCTYPE html>
<html>
<head>
	<title>Web-IDE with Angular &amp; Code Mirror</title>
	
	<link href="phpide-1.3.0-min.css" rel="stylesheet">
</head>
<body ng-app="phpide" ng-controller="mainController">
	<div class="container-fluid">
		<div class="row">
			<div id="phpide-title" class="col-xs-2"><h2>PhpIDE</h2></div>
			<div id="phpide-buttonbar" class="col-xs-10" ng-include="'./partials/buttons.html'"/></div>
		</div>
		<div class="row">
			<div id="phpide-fileTree" class="col-xs-2" ng-include="'./partials/filesTree.html'"></div>
			<div id="phpide-editor" class="col-xs-10" ng-include="'./partials/editor.html'"/></div>
		</div>
	</div>

	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
	<script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular.min.js"></script>
	<script src="phpide-1.3.0-min.js"></script>



	<div ng-include="'./partials/generic/alerts.html'"></div>
	<div ng-include="'./partials/generic/selectFolder.html'"></div>
</body>
</html>
