(function($, window, undefined) {
  //regex
  var rtextshadow = /([\d+.\-]+[a-z%]*)\s*([\d+.\-]+[a-z%]*)\s*([\d+.\-]+[a-z%]*)?\s*([#a-z]*.*)?/, 
      rcolor= /(rgb|hsl)a?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\.\d]+))?/,
      filter = "progid:DXImageTransform.Microsoft.";
  
  // create a plugin
  $.fn.textshadow = function(value) {
    var values = rtextshadow.exec(value),
        x, y, blur, color, opacity;
                
    // capture the values
    x = parseFloat(values[1]); // TODO: handle units
    y = parseFloat(values[2]); // TODO: handle units
    blur = values[3] !== undefined ? parseFloat(values[3]) : 0; // TODO: handle units
    color = values[4] !== undefined ? toHex(values[4]) : 'inherit';
    opacity = getAlpha(values[4]);
    
    // loop the found items
    return this.each(function() {
      var $elem = $(this), $orig, $copy, copy;
      
      // skip already converted items
      if (!$elem.hasClass('ui-text-shadow')) {
        // create all of the elements
        $elem.addClass('ui-text-shadow')
          .wrapInner('<span class="ui-text-shadow-original" />');
        $orig = $elem.find('.ui-text-shadow-original');
        $copy = $orig.clone()
          .addClass('ui-text-shadow-copy')
          .removeClass('ui-text-shadow-original')
          .appendTo($elem);
      } else {
        $copy = $elem.find('.ui-text-shadow-copy');
      }
      
      // style the elements
      $copy.css({
        color: color,
        left: (x - blur) + 'px',
        top: (y - blur) + 'px'
      });
      
      copy = $copy[0];
            
      // try to prevent selection
      copy.unselectable = "on";
      copy.onselectstart = function(){return false;};
      
      // add in the filters
      copy.style.filter = [
        filter + "Alpha(",
          "opacity=" + parseInt(opacity * 100, 10),
        ") ",
        filter + "Blur(",
          "pixelRadius=" + blur,
        ")"
      ].join('');
    });
  };
  
  // http://haacked.com/archive/2009/12/29/convert-rgb-to-hex.aspx
  
  function toHex(color) {
    // handle rgb
    var matches = rcolor.exec(color), rgb;
    
    // handle hsl
    if (matches && matches[1] === 'hsla') {
      rgb = hsl2rgb(matches[2], matches[3], matches[4]);
      matches[2] = rgb[0];
      matches[3] = rgb[1];
      matches[4] = rgb[2];
    }
    
    // convert to hex
    return matches ? '#' + (1 << 24 | matches[2] << 16 | matches[3] << 8 | matches[4]).toString(16).substr(1) : color;
  }
  
  function getAlpha(color) {
    var matches = rcolor.exec(color);
    if (matches) {
      return matches[5] !== undefined ? matches[5] : 1; 
    }
    return 1;
  }
  
  // http://www.codingforums.com/showthread.php?t=11156
  function hsl2rgb(h, s, l) {
    var m1, m2, hue, r, g, b;
    s /=100;
    l /= 100;
    if (s === 0) {
      r = g = b = (l * 255);
    } else {
      if (l <= 0.5) {
        m2 = l * (s + 1);
      } else {
        m2 = l + s - l * s;
      }
      m1 = l * 2 - m2;
      hue = h / 360;
      r = hue2rgb(m1, m2, hue + 1/3);
      g = hue2rgb(m1, m2, hue);
      b = hue2rgb(m1, m2, hue - 1/3);
    }
    return [r, g, b];
  }
  
  function hue2rgb(m1, m2, hue) {
    var v;
    if (hue < 0) {
      hue += 1;
    } else if (hue > 1) {
      hue -= 1;
    }

    if (6 * hue < 1) {
      v = m1 + (m2 - m1) * hue * 6;
    } else if (2 * hue < 1) {
      v = m2;
    } else if (3 * hue < 2) {
      v = m1 + (m2 - m1) * (2/3 - hue) * 6;
    } else {
      v = m1;
    }

    return 255 * v;
  }
})(jQuery, this);