/*
folding-content.js
v1.1
by Samuel Palpant - http://samuel.palpant.com
MIT License
*/

jQuery.fn.foldingContent = function( Args ) {
  jQuery( document ).ready( function() {
    // build variables from on-page script init
    _args = Args;
    var menuSelector          = _args.menuSelector;
    var menuItemSelector      = _args.menuItemSelector;
    var menuItemLink          = menuItemSelector + ' > a';
    var contentSelector       = _args.contentSelector;
    var unfoldedContentBefore = _args.unfoldBeforeMarkup;
    var unfoldedContentAfter  = _args.unfoldAfterMarkup;
    var closeButtonMarkup     = '';
    if ( _args.closeMarkup ) {
      closeButtonMarkup       = _args.closeMarkup;
    }

    // catch class name conflicts if someone used one of the script's classes in their document
    if ( jQuery( '.folding-parent' ).length || jQuery( '.active-item' ).length || jQuery( '.unfolded-content' ).length ){
      console.error( 'Class name conflict. Don\'t use any of these classes in your document: folding-parent, active-item, unfolded-content.' );
    }

    // set up folding parent menu items
    jQuery( menuItemSelector, menuSelector ).each( function() {
      if ( jQuery( this ).children( contentSelector ).length ) {
        // this is a folding parent item so add a class
        jQuery( this ).addClass( 'folding-parent' );
        // and set href to void on immediate children a tags
        jQuery( this ).children( 'a' ).attr( 'href', 'javascript:' );
      }
    });

    // get the 1 based index of the last item in the row of the thing that was clicked on
    // get number of items in the row of the thing that was clicked on
    function activeItemRow( $foldingActiveItem ) {
      // need to get things relative to the active item to support multiple folding menus on same page
      var $activeParent = jQuery('.active-item').parent( menuSelector );
      var $activeChildren = $activeParent.children();

      var $currentItem = $activeChildren.first();
      var $nextItem = {};
      var containerWidth = $activeParent.width();
      var widthCounter = $currentItem.outerWidth( true );
      var rowEndNumber = 0;
      var numberInThisRow = 0;
      var activeRow = false;
      var endPosition = false;
      while( false === endPosition ) {
        // loop through menu items to find the end of the active row and
        // how many items are in the active row
        $nextItem = $currentItem.next();

        if ( false === activeRow && $currentItem.hasClass( 'active-item' ) ) {
          // the active item is in this row
          activeRow = true;
        }

        if ( $nextItem.hasClass( 'unfolded-content' ) ) {
          // next item is the unfolded content, so skip an iteration
          $currentItem = $nextItem;
        } else {
          if ( $nextItem.length > 0 ) {
            // this is not the last item in the menu
            nextItemWidth = $nextItem.outerWidth( true );
            //nextItemWidth = Math.ceil( $nextItem[0].getBoundingClientRect().width );
            if ( widthCounter + nextItemWidth <= containerWidth ) {
              // the next item isn't on a new row, so add the width and keep going
              widthCounter += nextItemWidth;
            } else {
              // this is the last item in the row, so start counting the width over again
              widthCounter = nextItemWidth;
              endPosition = true;
            }

            if ( true === endPosition && false === activeRow ) {
              // it's the end of an inactive row, so keep looping
              endPosition = false;
              numberInThisRow = 0;
            }

            $currentItem = $nextItem;
          } else {
            // this is the last item in the menu, so end everything
            endPosition = true;
          }

          rowEndNumber ++;
          numberInThisRow ++;
        } // if unfolded-content else

        if ( rowEndNumber > 500 ) {
          // something is wrong, so stop
          endPosition = true;
          console.error( 'stopping before infinite loop' );
        }
      } // while

      return [rowEndNumber, numberInThisRow];
    }

    function cleanUpActiveFoldingMenu(){
      jQuery( '.end-of-row' ).removeClass( 'end-of-row' );
      jQuery( '.active-item' ).css( 'height', '' );
      jQuery( '.active-item' ).removeClass( 'active-item' );
      jQuery( '.unfolded-content' ).slideUp( 400, function() {
        jQuery( this ).remove();
      });
    }

    // add class end-of-row to specified position
    function labelEndPosition( $children, endPosition) {
      if ( $children.length > endPosition ) {
        // add class to last item in complete row
        $children.eq( endPosition - 1 ).addClass( 'end-of-row' );
      } else {
        // not a complete row, so add class to last item
        $children.eq( $children.length - 1 ).addClass( 'end-of-row' );
      }
    }

    // equalize height of active item with height of tallest item in row
    function equalizeItemHeight( $parentElement, endPosition, numberInRow ) {
      var $children = $parentElement.children( menuItemSelector );
      var maxHeight = 0;

      // find the tallest item in the row
      for ( var i = endPosition; i > endPosition - numberInRow; i-- ) {
        if ( maxHeight < $children.eq( i - 1 ).outerHeight() ) {
          maxHeight = $children.eq( i - 1 ).outerHeight();
        }
      }

      // set active item equal to tallest item
      if ( jQuery( '.active-item' ).outerHeight() < maxHeight ) {
        // reset the height on .active-item
        jQuery('.active-item').css('height', '');
        // outerHeight() can only find the height
        // we care about outer height, but need to set the inner height with height()
        heightDifference = jQuery( '.active-item' ).outerHeight() - jQuery( '.active-item' ).height();
        var newHeight = maxHeight - heightDifference;
        // set the height
        jQuery( '.active-item' ).height( newHeight );
      }
    }

    // open or close folding menu when parent clicked
    jQuery( '.folding-parent' ).click( function() {
      if ( jQuery( this ).hasClass( 'active-item' ) ) {
        // this menu is already open so close it
        cleanUpActiveFoldingMenu();
        return;
      }

      cleanUpActiveFoldingMenu();

      var $activeItem = jQuery( this );
      var $parent = jQuery( this ).parent();
      var $children = jQuery( this ).parent().children( menuItemSelector );

      $activeItem.addClass( 'active-item' );

      var rowData = activeItemRow( $activeItem );
      var endPosition = rowData[0];
      var numberInRow = rowData[1];
      labelEndPosition( $children, endPosition );
      equalizeItemHeight( $parent, endPosition, numberInRow );

      var wrapper = '<div class="close-unfolded-content">' + closeButtonMarkup + '</div>';
      wrapper = unfoldedContentBefore + wrapper + unfoldedContentAfter;
      jQuery( wrapper ).insertAfter( '.end-of-row' );
      jQuery( '.end-of-row' ).next().addClass( 'unfolded-content' );
      jQuery( '.active-item > ' + contentSelector ).clone().appendTo( '.unfolded-content' );
      jQuery( '.unfolded-content' ).slideDown( 400 );
    });

    // reposition menu on window resize
    jQuery( window ).resize( debounce( function() {
      jQuery( '.end-of-row' ).removeClass( 'end-of-row' );

      var $activeItem = jQuery( '.active-item' );
      var $parent = jQuery( $activeItem ).parent();
      var $children = jQuery( $activeItem ).parent().children( menuItemSelector );

      var rowData = activeItemRow( $activeItem );
      var endPosition = rowData[0];
      var numberInRow = rowData[1];

      labelEndPosition( $children, endPosition );
      jQuery( '.active-item' ).css( 'height', '' );
      equalizeItemHeight( $parent, endPosition, numberInRow );
      jQuery( '.unfolded-content' ).insertAfter( '.end-of-row' );
    }, 200 ));

    // close folding menu when X clicked
    // click() doesn't work on dynamically added elements
    jQuery( menuSelector ).on( 'click', '.close-unfolded-content', function() {
      cleanUpActiveFoldingMenu();
    });
  }); // document ready
};

// Debounce function from Underscore.js
function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
}
