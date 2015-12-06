<!DOCTYPE html>
<html>
<head>
	<title>IDE test Code-Mirror</title>
	<link rel="stylesheet" href="./lib/codemirror/lib/codemirror.css">
	<link rel="stylesheet" href="./lib/codemirror/addon/hint/show-hint.css">
	<script src="./lib/codemirror/lib/codemirror.js"></script>
	<script src="./lib/codemirror/addon/hint/show-hint.js"></script>
	<script src="./lib/codemirror/addon/hint/javascript-hint.js"></script>
	<script src="./lib/codemirror/mode/javascript/javascript.js"></script>
</head>
<body>
	<form><textarea id="code" name="code">
	//Este seria el codigo fuente
	function test {
      alert ("Hola mundo");
    }
	</textarea></form>
	<script>
		var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
			lineNumbers: true,
			extraKeys: {"Ctrl-Space": "autocomplete"},
			mode: {name: "javascript", globalVars: true}
		});
    </script>
</body>
</html>