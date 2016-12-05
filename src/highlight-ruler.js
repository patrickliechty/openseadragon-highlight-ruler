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
    
      this.enabled = function(enable) {
        enable ? this.element.style.display = 'block' : this.element.style.display = 'none';
      }
    
      this.innerTracker = new $.MouseTracker({
        element:            this.element,
        dragHandler:        $.delegate( this, onInsideDrag ),
        dragEndHandler:     $.delegate( this, onInsideDragEnd )
      });
    
              
      function onInsideDrag(e) {
        $.addClass(this.element, 'highlight-ruler-dragging');
        var delta = this.viewer.viewport.deltaPointsFromPixels(e.delta, true);
        this.rect.x += delta.x;
        this.rect.y += delta.y;
        var bounds = this.viewer.world.getHomeBounds();
        if (this.restrictToImage && !this.rect.fitsIn(new $.Rect(0, 0, bounds.width, bounds.height))) {
          this.rect.x -= delta.x;
          this.rect.y -= delta.y;
        }
        this.draw();
      }

      function onInsideDragEnd() {
        $.removeClass(this.element, 'highlight-ruler-dragging');
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
