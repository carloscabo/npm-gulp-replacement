var
  fs     = require('fs'),
  sass   = require('node-sass'),
  pkg    = require('./package.json'),
  config = require('./assets-compiler.config.json'),
  extend = require('util')._extend,
  is_win = /^win/.test(process.platform);

// console.log(config);
for (var i = 0, len = config.ngr_options.styles.length; i < len; i++) {
  var
    stylesheet = config.ngr_options.styles[i],
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
