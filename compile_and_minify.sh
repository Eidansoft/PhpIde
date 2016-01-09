#!/bin/bash
#set -x
htmlFile=$1
outputFolder=$2
fileName=$3

function exitWithError {
	msg=$1
	code=$2
	if [ "$msg" == "" ]; then
		exitWithError "Unspecified"
	else
		echo "Error $code: $msg"
	fi
	exit 1
}

function endWithSlash {
	str=$1
	res="false"
	echo $str | grep "/$" > /dev/null
	if [ "$?" == "0" ]; then
		res="true"
	fi
	echo $res
}

function checkDependencyExists {
	file=$1
	dependency=$2
	res="false"
	cat $file | grep "$dependency" > /dev/null
	if [ "$?" == "0" ]; then
		res="true"
	fi
	echo $res
}

function concatenateFiles {
	listOfFiles=$1
	concatenatedFile=$2

	[ -f $concatenatedFile ] && rm $concatenatedFile
	while read file
	do
		cat $file >> $concatenatedFile
		echo "" >> $concatenatedFile
	done < $listOfFiles
}

function substituteHtmlDependencies {
	listOfFiles=$1
	htmlFileName=$2
	finalDependencyFileName=$3

	htmlTempFile=${htmlFileName}.tmp
	while read file
	do
		escapedCssFileName=$(echo "$file" | sed -e 's/\./\\./g')
		if [ "$(checkDependencyExists $htmlFileName $finalDependencyFileName)" == "false" ]; then
			# Substitute by the new dependency
			cat ${htmlFileName} | sed -e "s#$escapedCssFileName#$finalDependencyFileName#" > ${htmlTempFile}
		else
			# Remove the old dependency
			cat ${htmlFileName} | grep -v "${file}" > ${htmlTempFile}
		fi
		mv $htmlTempFile $htmlFileName
	done < $listOfFiles
}

function copyDependenciesOfEachCss {
	listOfCssFiles=$1
	listOfCssDependencies=$2
	destinationFolderForDependencies=$3

	[ -f $listOfCssDependencies ] && rm $listOfCssDependencies
	while read -u5 cssfile
	do
		actualPath=$(echo $cssfile | sed -e 's/^\(.*\)\/.*$/\1\//')
		actualFile=$(echo $cssfile | sed -e 's/^\(.*\)\///')
		dependenciesOfActualCss=${destinationFolderForDependencies}${actualFile}.dependencies.tmp
		# read css
		#				| split by (,)			| get the url field										| get the path to the dependency inside the url field
		#																																	| clean all after the ? character	| clean all after the # character
		cat $cssfile	| sed -e 's/, /,\n/g'	| awk '{for(i=1;i<=NF;i++){if($i ~ /url/){print $i}}}'	| sed -e "s/^url('\(.*\)'.*$/\1/"	| sed -e 's/^\(.*\)\(?\).*$/\1/'	| sed -e 's/^\(.*\)\(#\).*$/\1/' >> $dependenciesOfActualCss
		cat $dependenciesOfActualCss >> $listOfCssDependencies
		while read -u6 cssDependency
		do
			cp ${actualPath}${cssDependency} $destinationFolderForDependencies
		done 6< $dependenciesOfActualCss
		rm $dependenciesOfActualCss
	done 5< $listOfCssFiles
}

function replaceCssDependencies {
	cssFile=$1
	listOfCssDependencies=$2
	cssDependencyFolder=$3

	cssTempFile=${cssDependencyFolder}css.tmp
	while read -u5 cssDependency
	do
		escapedCssFileName=$(echo "$cssDependency" | sed -e 's/\./\\./g')
		actualPath=$(echo $cssDependency | sed -e 's/^\(.*\)\/.*$/\1\//')
		actualFile=$(echo $cssDependency | sed -e 's/^\(.*\)\///')
		
		cat $cssFile | sed -e "s#$escapedCssFileName#$cssDependencyFolder$actualFile#g" > $cssTempFile
		mv $cssTempFile $cssFile
	done 5< $listOfCssDependencies
}

# Check params
[ ! -f "$htmlFile" ] && exitWithError "Wrong HTML file" 1
[ ! -d "$outputFolder" ] && exitWithError "Wrong output folder" 2

# Check the outputFolder had slash-ending
[ "$(endWithSlash $outputFolder)" == "false" ] && outputFolder=${outputFolder}/

# Configure global variables
htmlEndFile=${outputFolder}${htmlFile}
htmlTempFile=${outputFolder}${htmlFile}.tmp

cssDependenciesFolder=css/
[ ! -d "${outputFolder}$cssDependenciesFolder" ] && mkdir ${outputFolder}$cssDependenciesFolder
cssFiles=${outputFolder}${cssDependenciesFolder}cssFiles.tmp
cssDependenciesList=${outputFolder}${cssDependenciesFolder}cssDependencies.tmp
cssEndFileName=${fileName}.css
cssMinFileName=${fileName}-min.css

jsFiles=${outputFolder}jsFiles.tmp
jsEndFileName=${fileName}.js
jsMinFileName=${fileName}-min.js

# Create the HTML end file
cp $htmlFile $htmlEndFile

# Get the list of local CSS dependencies
cat $htmlFile | grep -v '<!--.*-->' | grep rel=\"stylesheet\" | grep -v "http.\{0,1\}://" | sed -e 's/rel="stylesheet"//' | sed -e 's/link//' | sed -e 's/^\(.*\)href="\(.*\)"\(.*\)$/\2/' > $cssFiles
# Copy and list dependencies of each local css
copyDependenciesOfEachCss $cssFiles $cssDependenciesList ${outputFolder}$cssDependenciesFolder
# Get the list of local JS dependencies
cat $htmlFile | grep -v '<!--.*-->' | grep "script src" | grep -v "http.\{0,1\}://" | sed -e 's/^\(.*\)src="\(.*\)"\(.*\)$/\2/' > $jsFiles

# Concatenate all CSS files into a single file
concatenateFiles $cssFiles ${outputFolder}$cssEndFileName

# Replace css internal dependencies (urls) by the copied resources
replaceCssDependencies ${outputFolder}$cssEndFileName $cssDependenciesList $cssDependenciesFolder

# Concatenate all JS files into a single file
concatenateFiles $jsFiles ${outputFolder}$jsEndFileName

# Minify CSS file
./node_modules/.bin/cleancss -o ${outputFolder}$cssMinFileName ${outputFolder}$cssEndFileName
rm ${outputFolder}$cssEndFileName

# Minify JS file
./node_modules/.bin/uglifyjs ${outputFolder}$jsEndFileName -o ${outputFolder}$jsMinFileName -c
rm ${outputFolder}$jsEndFileName

# Substitute old CSS dependencies by the new one
substituteHtmlDependencies $cssFiles $htmlEndFile $cssMinFileName

# Substitute old JS dependencies by the new one
substituteHtmlDependencies $jsFiles $htmlEndFile $jsMinFileName

# Clean temp files
rm $cssFiles
rm $cssDependenciesList
rm $jsFiles
