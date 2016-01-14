# folding-menu.js
v1.0
by Samuel Palpant - http://samuel.palpant.com
MIT License

## How to use it
0 Requires jQuery
1 Include folding-menu.js
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

Note that the entire .menu-item will be clickable, and any immediate child <a> tags will have their href voided.

There's no reason you couldn't use divs for the hierarchy, or a ul/other content for the folding content. Just make sure the init matches your markup.

### Corresponding init
    <script type="text/javascript">
      FOLDINGMENU.init([
        '.folding-menu', // (required) menu selector - supports multiple folding menus on the same page - give them all the same class
        '.menu-item', // (required) menu item selector
        '.folding-content', // (required) folding content selector
        '<li>', // (required) unfolded content wrapper before
        '</li>', // (required) unfolded content wrapper after
        '<span class="your-icon-class"></span>' // (optional) markup to put inside close button
      ]);
    </script>

### Minimum corresponding CSS
    .folding-content {
      display: none;
    }

    .unfolded-content {
      width: 100%;
    }

    .unfolded-content .folding-content {
      display: block;
    }

    .close-unfolded-content:hover {
      cursor: pointer;
    }

You will need lots more CSS to make things look good and animate well, but this is what effects functionality.

### Recommended additional CSS

TODO

Check out the demo for now.

## TODO
  - Make demo prettier
  - Fix sliding animations
  - Add limiter to window resize function
  - class name collision catching with console.error
  - transition to jQuery.fn
  - pass parameters as an object
  - jquery arg to limit scope to menu object - jQuery( '.some-selector', this )

## Changelog

### 1.0
  - Made the thing
