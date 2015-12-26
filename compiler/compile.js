// Show a error menssage
var showError = function(msg){
	console.log("ERROR: " + msg);
	process.exit(1);
};

// Method to process the arguments for the script
var processArguments = function() {
	process.argv.forEach(function (val, index, array) {
		if ( val == '--indexfile'){
			configuration.indexfile = process.argv[index+1];
		}
	});

	// check for mandatory parameters to exit
	if (typeof configuration.indexfile == 'undefined') showError("--indexfile parameter is mandatory");
};

// Method to print and array in order to debug it
//printArray(process.argv);
var printArray = function(array) {
	array.forEach(function (val, index, array) {
		console.log(index + ': ' + val);
	});
};

// initialize dependencies
var glob = require("glob")

// initialize variables
var configuration = {};

processArguments();
glob(configuration.indexfile, null, function (er, files) {
  // files is an array of filenames.
  // If the `nonull` option is set, and nothing
  // was found, then files is ["**/*.js"]
  // er is an error object or null.
  if (er != null) showError("--indexfile value is not correct" + er);
  configuration.headerfiles = files;
  printArray(configuration.headerfiles);
});

console.log("Hello World "+ configuration.indexfile);
//printArray(configuration.headerfiles);