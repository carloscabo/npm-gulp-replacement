<script>
.markdown-body pre {
  background-color: rgba(108, 198, 68, 0.2);
}
</script>

# npm-gulp-replacement
**Node npm assets compilation without Gulp / Grunt**

Tired of `gulp` bloatted dependencies, `node_modules` folders filled with thousands of files just for minifying JS / CSS?  
**We too**. This is out humble (_and much lighter_) alternative to `gulp` and `grunt`.

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
ngr-assets-compiler.js
````

## 3A. Install the required node.js packges automatically
To install all the needed packages just type on your terminal:

`npm run ngr:install`

(this will take a while)

This will install 4 packages _globally_ and link them to you local project `node_modules` folder (creating some symbolic links).

## 3B. Install node.js packges manually
If the previous process fails you may need to install the required node packages by hand, don't worry, it's an easy procedure.

At this moment `npm-gulp-replacement` uses this four packages:
````
node-sass
uglify-js
nodemon
npm-run-all <--- this is for Windows compatibillity :)
````

Install them **globally** from your terminal with the followin command lines:
````
npm install node-sass -g
npm install uglify-js -g
npm install nodemon -g
npm install npm-run-all -g
````

The node packages are not available inside the node scripts if they are not installed locally. As **installing crap locally to every project is one of the main things we want to avoid with npm-gulp-replacement**, we can avoid this **making a symbolic link to the global packages instead of duplicate them locally every time**. This can be done with the `npm link` command, as follows:
````
npm link node-sass --save-dev
npm link uglify-js --save-dev
````
This will create a `node_modules` folder in your project with two symbolic links inside... **;)**

## 5. Do a fast test
<mark>You can do a fast test at this point to see that everything is installed properlly, and that the scripts run fine in your system, we recommend you to **run a fast test with the files included in this repository**.</mark>

Type in your terminal:
````
npm run watch:all
````

And the output must be something as follows:
![Sample output screenshot](https://raw.githubusercontent.com/carloscabo/npm-gulp-replacement/master/sample-output-screenshot.png)

## 6. Customize the paths
Open `package.json`, take a look around and **customize the paths for your project's assets, destination files, etc.** A little in-depth explanation of some of the options:
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

## 7. The npm scripts
There are 5 commands / scripts you can start from your terminal:
````javascript
$> npn run build:css // Compiles all the SCSSs ans exits
$> npn run build:js  // Same with JSs

// The 'watch' scripts.
// The 'watch' scripts monitorize the folders configured in the 'package.json'
// file, and when changes are detected they launch the corresponding 'build'
// task
$> npn run watch:css
$> npn run watch:js
$> npn run watch:all // Both JS an SCSS
````

### Authors
[Carlos Cabo](https://github.com/carloscabo) ( aka @putuko )  
[Víctor Ortíz](https://github.com/vortizhe) ( aka @vortizhe )  
Contributions are welcome ;)

### TO-DO
- Pass the watcher config to the assets-compiler.config.json
- Merge both compiler script in one... (?)
- Add livereload

### Changelog
- 2016 / 02 / 23 V.0.0.1 First release!
