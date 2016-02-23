# npm-gulp-replacement
*Node npm assets compilation without Gulp / Grunt*

Tired of `gulp` bloatted dependencies, `node_modules` folders filled with thousands of files just for minify JS / CSS?  
*We too*. This is out humble (and much lighter) alternative to `gulp` and `grunt`.

# Installation

## 1. Install node + npm
Probably you have node already installed, you can simply check it by typing in your terminal:
````
$ node -v
v5.1.1
$ npm -v
3.3.12
````
Your don't hve node installed? Just [follow this easy steps](https://nodejs.org/en/download/).

## 2. Copy the npm-gulp-replacement files
Copy the following files to the root folder of your project _(later you'll need to customize some path for fitting your project's structure)_
````
package.json
assets-compiler.config.json
assets-js-compiler.js
assets-scss-compiler.js
````

## 3. Install some node.js packges *globally*
At this moment `npm-gulp-replacement` uses this four packages:
````
node-sass
uglify-js
nodemon
npm-run-all <--- this is for Windows compatibillity :)
````
Install all of them *globally* from your terminal as follow:
````
npm install node-sass -g
npm install uglify-js -g
npm install nodemon -g
npm install npm-run-all -g
````

## 4. Symlink to your local project
Sometimes seems that some of this packages are not available inside the node scripts if they are not installed locally (we still don't know the reason). As installing crap locally to every project is one of the main things we want to avoid with this project, we recomend you to *make a symbolic link to the global packages instead of duplicate them locally every tme*. This can be done with the `npm link` command, as follows:
````
npm link node-sass --save-dev
npm link uglify-js --save-dev
````
This will create a `node_modules` folder in your project with two symbolic links inside...

## 5. Customize the paths
Open `assets-compiler.config.json`, take a look around and customize the path for your project's assets, destination files, etc. A little in-depth explanation of some of the options:
````javascript
{
  // npm-gulp-replacement options
  "ngr_options": {
    // JS files section --------------------------------------------------------
    "scripts": [
      {
        // Uglified JS destination file
        "dest": "tests/dest/js/application.min.js",
        // Source JS files, array
        "files": [
          "tests/src/js/lib/json2.js",
          // ...
          "tests/src/js/ready.js"
        ],
        // Avaliable options for uglify-js
        // Take a look in-depth here:
        // https://github.com/mishoo/UglifyJS
        "options": {
          // This is important if you want SourceMaps !!!
          "outSourceMap": "tests/dest/maps/application.js.map",
          "sourceRoot": null,
          "warnings": false,
          "mangle": {
            "screw_ie8": false,
            "cache": null,
            "except": [ ],
            "eval": false,
            "sort": false,
            "toplevel": false,
            "keep_fnames": false
          },
          "mangleProperties": false
        }
      },
      // You can specify several sets of JS files
      // In this sample we 'uglify' a second set of files with default settings
      // and no SourceMaps into another destination file
      {
        // Destination
        "dest": "tests/dest/js/LL.lib.min.js",
        // Second set of files to be 'uglified'
        "files": [
          "tests/src/js/LL/LL.js",
          // ...
        ]
      }
    ],
    // The SASS / CSS compilation section --------------------------------------
    "styles": [
      {
        // Our SASS source file
        // Take a look to /tests/src/css/application.scss
        "src": "tests/src/css/application.scss",
        // Final destination file
        "dest": "tests/dest/css/application.min.css",
        // node-sass options
        "options": {
          "outputStyle": "compressed",
          "outFile": "tests/dest/maps/application.css.map",
          "sourceMap": true
        }
      }
      // Same as with JSs you could specify another set of SCSSs with
      // another destination, and options here...
    ]
  }
}
````

## 6. The npm scripts
There are 5 command you can start from your terminal:
````javascript
$> npn run build:css // Compiles all the SCSSs ans exits
$> npn run build:js  // Same with JSs

// The 'watch' scripts. The 'watch' scripts monitorize the folders
// indicated in the 'package.json' file, and when changes are detected launch
// the corresponding 'build' task
$> npn run watch:css
$> npn run watch:js
$> npn run watch:all // Both JS an SCSS
````

### Authors
[Carlos Cabo](https://github.com/carloscabo) ( aka @putuko )  
[Víctor Ortíz](https://github.com/vortizhe) ( aka @vortizhe )  
Contributions are welcome ;)

### TO-DO
- Add livereload

### Changelog
- 2016 / 02 / 23 V.0.0.1 First release!
