/*
  Get conten from wikipedia
*/

// $.ajax({
//   url: 'http://en.wikipedia.org/w/api.php',
//   data: {
//     // section: 0,
//     action:'parse',
//     prop:'text',
//     format:'json',
//     pageid:<?php echo $this->data['article']['pageid']; ?>
//   },
//   dataType:'jsonp',
//   success: function(data) {
//     if (data.parse && data.parse.text && data.parse.text['*']) {
//       var content = data.parse.text['*'];
//       LL.wiki.clean(
//         content,
//         $('.b-wikipedia-article .content')
//       );
//     }
//   }
// });

LL.wiki = {

  $content: null,
  $destination: null,
  to_remove: '.infobox, .vcard, .hatnote, #toc, .toc, .reflist, .navbox',

  /**
   * Celans and appends content to page
   * @param  {[type]} content     [description]
   * @param  {[type]} destination [description]
   * @return {[type]}             [description]
   */
  clean: function(content, destination) {

    this.$destination = destination;

    this.$content = $(content);
    this.$content.find(this.to_remove).remove();

    // Clean comments
    // $('*').contents().each(function() {
    //     if(this.nodeType == 8) {
    //         $(this).remove()
    //     }
    // });

    this.appendToDestination();

  },

  /* Fixes URLs to point to wikipedia */
  fixLinks: function() {
    //
  },

  /* Apends to destination */
  appendToDestination: function() {
    this.$content.appendTo(this.$destination);
  }

};
