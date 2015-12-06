<!DOCTYPE html>
<html>
<head>
	<title>IDE test Angular</title>
	<script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular.min.js"></script>
	<script src="./mainController.js"></script>
	
</head>
<body ng-app="phpide" ng-controller="mainController">
	<form><textarea id="code" name="code">{{file.content}}
	</textarea></form>
</body>
</html>