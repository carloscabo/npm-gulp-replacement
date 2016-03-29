var
  fs      = require('fs'),
  sass    = require('node-sass'),
  uglify  = require('uglify-js'),
  pkg     = require('./package.json'),
  extend  = require('util')._extend,
  is_win  = /^win/.test(process.platform);

// Functions container
var
  fn = {};

// --------------------------------------
// SASS Compilation
fn.build_css = function () {

  for (var i = 0, len = pkg.ngr_options.styles.length; i < len; i++) {
    var
      stylesheet = pkg.ngr_options.styles[i],
      default_settings = {
        file: stylesheet.src,
        outputStyle: 'compressed',
      },
      settings = {};
    if (typeof stylesheet.options !== 'undefined') {
      settings = extend( default_settings, stylesheet.options );
    }

    sass.render( settings, function(err, result) {
      // console.log(result);
      if ( err ) {
        console.log('\u0007'+"\033[31m"+err);
      } else {
        fs.writeFile(stylesheet.dest, result.css, function(f_err){
          if(f_err){
            console.log('\u0007'+"\033[31m"+f_err);
          } else {
            console.log("\033[33m", "---> Stylesheet generated and saved:", stylesheet.dest, Math.round(result.css.length / 1024), "kbs.");
          }
        });
        // Save sourcemap if present
        if (typeof result.map !== 'undefined') {
          fs.writeFile(settings.outFile, result.map, function(f_err){
            if(f_err){
              console.log('\u0007'+"\033[31m"+f_err);
            } else {
              console.log("\033[33m", "---> SourceMap for", stylesheet.dest, "generated and saved:\n", settings.outFile);
            }
          });
        }

      }
    });
  }
}; // fn.build_css

// --------------------------------------
// JS Uglify

fn.ourUglify = function ( dest_path, files, settings ) {
  var
    uglified;
  try {
    uglified = uglify.minify( files, settings );
  } catch(ex) {
    console.log('\u0007'+"\033[31mJS UGLIFY ERROR:");
    for (var prop in ex) {
      if (ex.hasOwnProperty(prop) && prop !== 'stack') {
        console.log(prop, ':', ex[prop]);
      }
    }
    // console.log(ex.toString());
  }
  if (typeof uglified === 'undefined') {
    return;
  }

  fs.writeFile( dest_path , uglified.code, function (err){
    if(err) {
      console.log('\u0007'+"\033[31m"+err);
    } else {
      console.log("\033[33m", "---> Script generated and saved:", dest_path, Math.round(uglified.code.length / 1024), "kbs.");
    }
  });
  // Sourcemap if available
  if (settings.outSourceMap && typeof uglified.map !== 'undefined') {
    fs.writeFile( settings.outSourceMap , uglified.map, function (err){
      // console.log(settings);
      if(err) {
        console.log('\u0007'+"\033[31m"+err);
      } else {
        console.log("\033[33m", "---> SourceMap for", dest_path ,"generated and saved:", settings.outSourceMap);
      }
    });
  }
};

fn.build_js = function () {
  for (var i = 0, len = pkg.ngr_options.scripts.length; i < len; i++) {
    var
      script = pkg.ngr_options.scripts[i],
      files = script.files,
      dest = script.dest,
      settings = {},
      default_settings = {};
    if (typeof script.options !== 'undefined') {
      settings = extend( default_settings, script.options );
    }
    fn.ourUglify( dest, files, settings );
  }
};

// --------------------------------------
// Call function depending on parameters passed
var
  args = process.argv.slice(2);
fn[args[0]]();
