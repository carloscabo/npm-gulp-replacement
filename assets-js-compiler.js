var
  fs     = require('fs'),
  uglify = require('uglify-js'),
  pkg    = require('./package.json'),
  config = require('./assets-compiler.config.json'),
  extend = require('util')._extend,
  is_win = /^win/.test(process.platform);

// console.log(config);
for (var i = 0, len = config.ngr_options.scripts.length; i < len; i++) {
  var
    script = config.ngr_options.scripts[i],
    files = script.files,
    dest = script.dest,
    settings = {},
    default_settings = {};
  if (typeof script.options !== 'undefined') {
    settings = extend( default_settings, script.options );
  }
  ourUglify( dest, files, settings );
}

function ourUglify( dest_path, files, settings ) {
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
}
