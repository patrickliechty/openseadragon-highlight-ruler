(function($) {
  'use strict';

  if (!$.version || $.version.major < 2) {
      throw new Error('This version of OpenSeadragonHighlightRuler requires OpenSeadragon version 2.0.0+');
  }

  $.Viewer.prototype.highlightRuler = function(options) {
      if (!this.rulerInstance || options) {
          options = options || {};
          options.viewer = this;
          this.rulerInstance = new $.Ruler(options);
      }
      return this.rulerInstance;
  };

  /**
  * @class Ruler
  * @classdesc Provides functionality for highlighting a horizontal area across the image
  * @memberof OpenSeadragon
  * @param {Object} options
  */
  $.Ruler = function ( options ) {
      var self = this;
      $.extend( true, this, {
          // internal state properties
          viewer:                  null,
          color:                   '#FFFF00',
          opacity:                 '0.5',
          rect:                    null,
          elementId:               'highlight-ruler'
      }, options );
    
      if (!this.rect) {
        this.rect = new OpenSeadragon.Rect(-5.0, 0.0, 10, 0.03);
      }
      
      if (!this.element) {
        this.element = $.makeNeutralElement('div');
        $.addClass(this.element, this.elementId);
        this.element.style.backgroundColor = this.color;
        this.element.style.opacity = this.opacity;
        this.element.id = this.elementId;
      }      
      if (!this.overlay) {
        this.overlay = new $.RulerOverlay(this.element, this.rect);
      }
    
      this.enable = function() {
        this.element.style.display = 'block';
        self.ensureVisible();
      }
    
      this.disable = function() {
        this.element.style.display = 'none';
      }

      this.getRect = function() {
        return this.rect;
      }

      this.setColor = function(color) {
        this.element.style.backgroundColor = color;
      }

      this.setOpacity = function(opacity) {
        this.element.style.opacity = opacity;
      }

      this.destroy = function() {
        this.undraw();
      }

      this.innerTracker = new $.MouseTracker({
        element:            this.element,
        dragHandler:        $.delegate( this, onInsideDrag ),
        dragEndHandler:     $.delegate( this, onInsideDragEnd )
      });
              
      function onInsideDrag(e) {
        $.addClass(this.element, 'highlight-ruler-dragging');
        var delta = this.viewer.viewport.deltaPointsFromPixels(e.delta, true);
        this.rect.y += delta.y;
        this.draw();
      }

      function onInsideDragEnd() {
        $.removeClass(this.element, 'highlight-ruler-dragging');
        this.viewer.raiseEvent('highlight-ruler-drag-end', {rect: this.rect});
      }

      this.ensureVisible = function() {
        var top = self.element.offsetTop;
        var height = self.element.offsetHeight;

        var viewerElement = document.getElementsByClassName('openseadragon-canvas');
        var viewerHeight = viewerElement[0].offsetHeight;

        console.log("ensureVisible top: ", top, " height: ", height + " windowSize.height: ", viewerHeight);
        if (top < 0) {
          self.rect.y = 0;
          console.log("Move to be visible new Y: " + self.rect.y);
          self.draw();
        }
        if (top + height > viewerHeight) {
          self.rect.y = viewerHeight - height;
          console.log("Move to be visible new Y: " + self.rect.y);
          self.draw();
        }
      }

      this.viewer.addHandler('open', this.draw.bind(this));
      this.viewer.addHandler('animation', this.draw.bind(this));
      this.viewer.addHandler('resize', this.draw.bind(this));
      var initialized = false;
      this.viewer.addHandler('tile-drawn', function() {
        if (!initialized) {
          self.ensureVisible();
        }
        initialized = true;
      });
  };
  
  $.extend( $.Ruler.prototype, $.ControlDock.prototype, {
    
    draw: function() {
      if (this.rect) {
        this.overlay.update(this.rect);
        this.overlay.drawHTML(this.viewer.drawer.container, this.viewer.viewport);
      }
      return this;
    },

    undraw: function() {
      this.overlay.destroy();
      this.rect = null;
      return this;
    },

  });

})(OpenSeadragon);
