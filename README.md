# PhpIde
PHPIde is a cloud IDE (Integrated Development Environment) solution created just for fun :-)
This application has been developed by [my-self](https://www.linkedin.com/in/alejandro-d%C3%A9cimo-8b91b672) at my spare time. All sources are available at the [GIT repository](https://github.com/Eidansoft/PhpIde) on Github. Please feel free to try it out or giving me your feedback. I hope you enjoy.

# Description
The code is composed by a frontend developed as a web application with angular; and a backend developed as a PHP api.

# Demo
You can test a demo of this project with some limits at the available functions (cannot modify or delete the files). Test it at http://www.eidansoft.com/desarrollos/phpide/

# Compilation
This application uses Node.js. To build it you need to run:
 - Install Node.js dependencies: ```npm install```
 - Create your compiled version: ```npm run compile```

# Changelog
V1.1 Added authentication with Google using the https://github.com/opauth/opauth library

V1.0 First working version:
 - Create new files
 - Modify files
 - Delete files
 - Rename files

# Dependencies
 - CodeMirror library for the editor of code: https://github.com/codemirror/CodeMirror
 - UI Bootstrap for some components at the webapp: https://angular-ui.github.io/bootstrap/
 - Bootstrap for the style at the webapp: http://getbootstrap.com/
 - Angular PubSub library to improve comunication between components at webapp: https://github.com/georapbox/angular-PubSub
 - OpAuth authentication library to the authentication system with Google: https://github.com/opauth/opauth

# License
GPLv3
This code is [GPLv3](http://www.gnu.org/licenses/gpl-3.0.en.html) licenced:

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.