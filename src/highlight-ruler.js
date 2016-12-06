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
      $.extend( true, this, {
          // internal state properties
          viewer:                  null,
          color:                   '#FFFF00',
          opacity:                 '0.5',
          rect:                    null
      }, options );
    
      if (!this.rect) {
        this.rect = new OpenSeadragon.Rect(-5.0, 0.0, 10, 0.03);
      }
      
      if (!this.element) {
        this.element = $.makeNeutralElement('div');
        this.element.style.backgroundColor = this.color;
        this.element.style.opacity = this.opacity;
        this.element.id = 'highlight-ruler';
      }
      
      if (!this.overlay) {

        this.overlay = new $.RulerOverlay(this.element, this.rect);
      }
    
      this.enable = function() {
        this.element.style.display = 'block';
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

      this.innerTracker = new $.MouseTracker({
        element:            this.element,
        dragHandler:        $.delegate( this, onInsideDrag ),
        dragEndHandler:     $.delegate( this, onInsideDragEnd )
      });
    
              
      function onInsideDrag(e) {
        $.addClass(this.element, 'highlight-ruler-dragging');
        var delta = this.viewer.viewport.deltaPointsFromPixels(e.delta, true);
        var bounds = this.viewer.world.getHomeBounds();
        var newY = this.rect.y + delta.y;
        if (newY < bounds.height && newY > 0) {
          this.rect.y += delta.y;
        }
        this.draw();
      }

      function onInsideDragEnd() {
        $.removeClass(this.element, 'highlight-ruler-dragging');
        this.viewer.raiseEvent('highlight-ruler-drag-end', {rect: this.rect});
      }

      this.viewer.addHandler('open', this.draw.bind(this));
      this.viewer.addHandler('animation', this.draw.bind(this));
      this.viewer.addHandler('resize', this.draw.bind(this));
      this.viewer.addHandler('rotate', this.draw.bind(this));
  };
  
  $.extend( $.Ruler.prototype, $.ControlDock.prototype, {

    destroy: function() {
      this.undraw();
      return this;
    },
    
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
