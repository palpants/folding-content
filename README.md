# folding-content.js
v1.1  
by Samuel Palpant - http://samuel.palpant.com  
MIT License  

## How to use it
0 Requires jQuery  
1 Include folding-content.js  
2 Create compatible markup  
3 Init at bottom of page  
4 Add required CSS  

## Example setup
### Example markup
    <ul class="folding-menu">
      <li class="menu-item">
        <a href="#">
          <h3>Folding Menu Item</h3>
        </a>
        <div class="folding-content">
          <h3>Great clicking!</h3>
        </div>
      </li>
    </ul>

Note that the entire .menu-item will be clickable, and any immediate child `<a>` tags will have their href voided.

There's no reason you couldn't use divs for the hierarchy, or a ul/other content for the folding content. Just make sure the init matches your markup.

Want multiple folding content menus on the same page? Give them all the same class, and use that as your menu selector in the init below.

### Corresponding init
    <script type="text/javascript">
      jQuery( '.folding-menu' ).foldingContent({ // called on your menu selector
        menuSelector: '.folding-menu', // (required) menu selector
        menuItemSelector: '.menu-item', // (required) menu item selector
        contentSelector: '.folding-content', // (required) folding content selector
        unfoldBeforeMarkup: '<li>', // (required) unfolded content wrapper before
        unfoldAfterMarkup: '</li>', // (required) unfolded content wrapper after
        closeMarkup: '<span class="your-icon-class">X</span>' // (optional) markup to put inside close button
      });
    </script>

### Minimum corresponding CSS
    .folding-content,
    .unfolded-content {
      display: none;
    }

    .unfolded-content {
      width: 100%;
    }

    .unfolded-content .folding-content {
      display: block;
    }

    .menu-item:hover,
    .close-unfolded-content:hover {
      cursor: pointer;
    }

You will need lots more CSS to make things look good and animate well, but this is what affects functionality.

### Resulting example markup

After .menu-item is clicked, the markup will look like this:

    <ul class="folding-menu">
      <li class="menu-item">
        <a href="#">
          <h3>Folding Menu Item</h3>
        </a>
        <div class="folding-content">
          <h3>Great clicking!</h3>
        </div>
      </li>
      <li class="unfolded-content">
        <div class="close-unfolded-content">
          <span class="your-icon-class">X</span>
        </div>
        <div class="folding-content">
          <h3>Great clicking!</h3>
        </div>
      </li>        
    </ul>

The .unfolded-content wrapper comes from your unfoldMarkupeBefore/After (the unfolded-content class gets added by the script later).

### Recommended additional CSS

TODO

Check out the demo for now.

## TODO
  - Make demo prettier

## Changelog

### 1.1
  - Change name to folding-content.js
  - Transition to jQuery.fn
  - Pass parameters as an object
  - Add debounce to window resize
  - Class name collision catching
  - Fix sliding animations

### 1.0
  - Made the thing
