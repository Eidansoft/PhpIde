<!DOCTYPE html>
<html>
<head>
	<title>IDE test Angular y Code Mirror</title>
	
	<link href="./lib/bootstrap-3.3.6-dist/css/bootstrap.min.css" rel="stylesheet">
	<link href="./lib/CodeMirror-master/lib/codemirror.css" rel="stylesheet">
	<link href="./lib/CodeMirror-master/addon/hint/show-hint.css" rel="stylesheet">
	<link href="./css/styles.css" rel="stylesheet">
</head>
<body ng-app="phpide" ng-controller="mainController">
	<h2>IDE test</h2>
	<div class="container-fluid">
		<div class="row">
			<div id="phpide-fileTree" class="col-xs-2" ng-include="'./partials/filesTree.html'"></div>
			<div id="phpide-editor" class="col-xs-10" ng-include="'./partials/editor.html'"/></div>
		</div>
	</div>

	<script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular.min.js"></script>
	<script src="./lib/angular-PubSub-master/src/angular-pubsub.js"></script>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
    <script src="./lib/bootstrap-3.3.6-dist/js/bootstrap.min.js"></script>

	<script src="./app/controllers/mainController.js"></script>
	<script src="./app/controllers/filesTreeController.js"></script>
	<script src="./app/controllers/editorController.js"></script>
	<script src="./app/services/fileService.js"></script>

	<script src="./lib/CodeMirror-master/lib/codemirror.js"></script>
	<script src="./lib/CodeMirror-master/addon/hint/show-hint.js"></script>
	<script src="./lib/CodeMirror-master/addon/hint/javascript-hint.js"></script>
	<script src="./lib/CodeMirror-master/mode/javascript/javascript.js"></script>
	<script src="./lib/CodeMirror-master/mode/xml/xml.js"></script>	
	<script src="./lib/CodeMirror-master/mode/css/css.js"></script>
	<script src="./lib/CodeMirror-master/mode/clike/clike.js"></script>
	<script src="./lib/CodeMirror-master/mode/htmlmixed/htmlmixed.js"></script>
	<script src="./lib/CodeMirror-master/mode/php/php.js"></script>
	<script src="./lib/CodeMirror-master/mode/sql/sql.js"></script>
</body>
</html>