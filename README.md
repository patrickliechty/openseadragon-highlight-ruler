# OpenSeadragon Highlight Ruler

An OpenSeadragon plugin that provides functionality for highlighting a horizontal area across the image

## Demo

https://patrickliechty.github.io/openseadragon-highlight-ruler/

## Usage

Include `src/highlight-ruler.js` and `src/highlight-ruler-overlay.js` after OpenSeadragon in your html. Then after you create a viewer:

var ruler = viewer.highlightRuler(options);

Then you can alter the selection state with any of these:

    ruler.enable(bool);

## Options

    var ruler = viewer.highlightRuler({
      color: '#FFFF00',                                     //Color of ruler
      opacity: '0.5',                                       //Opacity of ruler
      rect: new OpenSeadragon.Rect(-5.0, 0.1, 10, 0.03)     //Initial rectangle size
    });

## To do

    - Generate dist files

