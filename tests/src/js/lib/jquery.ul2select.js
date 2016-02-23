/**
 * jquery.ul2select
 * Converts an UL list into a SELECT (and back)
 * by Carlos Cabo
 * https://github.com/carloscabo/ul2select
*/
;(function($) {

  $.fn.ul2select = function(options) {
    return this.each(function() {
      if (typeof options == 'string' && options == 'revert' ) {
        u2s_revert(this);
      } else {
        new u2s_convert(this, options);
      }
    });

    //
    // Core functionallity, converts
    //
    function u2s_convert (ul, options) {

      // Check if element is allready converted
      if($(ul).hasClass('u2s-converted')) {
        return false;
      }

      var
        u2s_settings = $.extend({
          active_class: 'active',
          select_wrapper: '<div class="u2s-wrapper">',
          copy_attributes: true,
          default_text: 'Select an option…',
          add_empty_option: false,
          custom_events: null
        }, options );

      // Main select
      var
        $wra = $(u2s_settings.select_wrapper),
        $sel = $('<select>'),
        $spa = $('<span class="u2s-current">');

      if(u2s_settings.default_text) {
        $spa.text(u2s_settings.default_text);
      }

      // Copy attr from ul to select
      if(u2s_settings.copy_attributes) {
        $.each(ul.attributes, function() {
          $sel.attr(this.name, this.value);
        });
      }

      // Store settings in element
      $sel[0].u2s_settings = u2s_settings;

      // Parse UL tree
      u2s_parse_ul(ul, $sel, $spa, 0);

      // Store original UL
      $sel[0].u2s_revert = $(ul).clone();

      // On change select event
      $sel.on('change', function(e) {
        $(this).prev('.u2s-current').text($(this).find('option:selected').text());
      });

      // Add custom events
      if (u2s_settings.custom_events) {
        $.each(u2s_settings.custom_events, function(eve, fn){
          $sel.on(eve, fn);
        });
      }

      // Mark as 'allready converted'
      $sel.addClass('u2s-converted');

      // Append
      if ($wra.length) {
        $wra.append($spa).append($sel).insertBefore($(ul));
      } else {
        $sel.insertBefore($(ul));
      }

      // Delete original <ul>
      $(ul).remove();

    };

    //
    // Parse the UL LI
    //
    function u2s_parse_ul(ul, $sel, $spa, deep) {

      if ($sel[0].u2s_settings.add_empty_option === true) {
        $op = $('<option value="0">'+$sel[0].u2s_settings.default_text+'</option>');
        $op.appendTo($sel);
      }

      // Copy lis to options
      $(ul).find('> li').each(function(idx, li) {
        var
          $op   = $('<option>'),
          $a    = $(li).find('> a'),
          u2sid = Math.random().toString(36).slice(2),
          text  = $(li).clone().children('ul').remove().end().text();
        $(li).attr('data-u2sid', u2sid);

        if ($(li).hasClass($sel[0].u2s_settings.active_class)) {
          $op.prop('selected', 'selected');
          $spa.text(text);
        }
        $op.attr('data-u2sid',u2sid).val($a.attr('href')).html(Array(deep*4).join('&nbsp;')+text).appendTo($sel);

        $nested_ul = $(li).find('> ul');
        if($nested_ul.length) {
          u2s_parse_ul($nested_ul, $sel, $spa, deep+1);
        }
      });
    }

    //
    // Destroy SELECT and revert to original UL
    //
    function u2s_revert(el) {
      var
        $sel = $(el),
        $ul  = $sel[0].u2s_revert,
        set  = $sel[0].u2s_settings;

      // If converted
      if($ul && set) {
        // Map current selected option
        $selected_option = $sel.find('option:selected');
        if ($selected_option.length) {
          var
            u2sid = $selected_option.attr('data-u2sid'),
            $lis = $ul.find('li');

          $lis.removeClass(set.active_class).filter('[data-u2sid='+u2sid+']').addClass(set.active_class);
          $lis.removeAttr('data-u2sid');
        }
        if(set.select_wrapper === null && typeof set.select_wrapper === 'object') {
          // Has NO wrapper
          $ul.insertBefore($sel);
          $sel.remove();
        } else {
          $ul.insertBefore($sel.parent());
          $sel.parent().remove();
        }
      }
    };

  };


}(jQuery));
