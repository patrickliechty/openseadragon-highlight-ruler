(function( $ ){
    'use strict';

    /**
     * @class Overlay
     */
    $.RulerOverlay = function( element, location) {
        $.Overlay.apply( this, arguments );
    };

    $.RulerOverlay.prototype = $.extend( Object.create($.Overlay.prototype), {

        /**
         * @function
         * @param {Element} container
         */
        drawHTML: function() {
          $.Overlay.prototype.drawHTML.apply( this, arguments );
        },

        /**
         * @function
         * @param {OpenSeadragon.Point|OpenSeadragon.Rect} location
         * @param {OpenSeadragon.OverlayPlacement} position
         */
        update: function( location ) {
            $.Overlay.prototype.update.apply( this, arguments );
        }
    });

}( OpenSeadragon ));