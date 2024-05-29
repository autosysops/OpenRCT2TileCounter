// Globals
var invert = false;

var main = function () {
    // Add a menu item under the map icon on the top toolbar
    ui.registerMenuItem("Count Tiles", function () {
        count_window();
    });
};

function calc_tiles() {
    // var to return
    var numtiles = 0;

    // Get all settings from the window
    var window = ui.getWindow("Count Tiles");var window = ui.getWindow("Count Tiles");
    var lands = context.getAllObjects("terrain_surface");
    var settings = null;
    var surfaceStyles = []
    for (var i = 0; i < lands.length; i++) {
        settings = window.findWidget('landtype'+i);
        surfaceStyles[lands[i].index] = settings.isChecked
    }

    // Loop through all tiles except the outer ring of the map as this is just used to show sides.
    var tile = null;
    var element = null;
    for (var i = 1; i < (map.size.x-1); i++) { //X
        for (var j = 1; j < (map.size.y-1); j++) { //Y
            // Check if the type of land is checked
            tile = map.getTile(i,j);
            for (var k = 0; k < tile.numElements; k ++) {
                element = tile.getElement(k);
                if(element.type == 'surface' && surfaceStyles[element.surfaceStyle] == invert) {
                    numtiles++
                }
            }
        }
    }

    // Set the value in the window
    var text = window.findWidget("numtiles");
    text.text = "Number of tiles is: "+numtiles
}

function count_window() {
    widgets = []

    // Get all land types
    var lands = context.getAllObjects("terrain_surface")
    var landspercolumn = 27

    // Lay-out
    widgets.push({
        type: 'groupbox',
        name: 'box1',
        x: 5,
        y: 20,
        width: 690,
        height: 40,
        text: "Amount of Tiles"
    });

    widgets.push({
        type: 'groupbox',
        name: 'box1',
        x: 5,
        y: 70,
        width: 690,
        height: 425,
        text: "Exclude landtype"
    });

    // Num of tiles
    widgets.push({
        type: 'label',
        name: 'numtiles',
        x: 15,
        y: 40,
        width: 300,
        height: 20,
        text: "Number of tiles is: "
    });

    widgets.push({
        type: 'checkbox',
        name: 'invert',
        x: 200,
        y: 38,
        width: 15,
        height: 15,
        isChecked: false,
        text: "",
        onChange: function onChange(e) {
            invert = !invert
            calc_tiles();
        }
    });

    widgets.push({
        type: 'label',
        name: 'invert_label',
        x: 213,
        y: 40,
        width: 180,
        height: 20,
        text: "count excluded landtiles instead"
    });

    // Add all the land types
    column = 0
    row = 0
    for (var i = 0; i < lands.length; i++) {

        widgets.push({
            type: 'checkbox',
            name: 'landtype'+i,
            x: 30 + (column*200),
            y: 85 + (row*15),
            width: 15,
            height: 15,
            isChecked: false,
            text: "",
            onChange: function onChange(e) {
                calc_tiles();
            }
        });

        widgets.push({
            type: 'label',
            name: 'landtype_label'+i,
            x: 43 + (column*200),
            y: 87 + (row*15),
            width: 180,
            height: 20,
            text: lands[i].installedObject.name
        });

        // Increase the row
        row++

        if((i+1)%landspercolumn == 0) {
            column++
            row = 0
        }
    }

    // Create the window
    window = ui.openWindow({
        classification: 'Count Tiles',
        title: "Count Tiles 1.0 (by Levis)",
        width: 700,
        height: 500,
        x: 100,
        y: 100,
        colours: [26, 26],
        widgets: widgets
    });

    // Update the counter
    calc_tiles()
}

registerPlugin({
    name: 'TileCounter',
    version: '1.0',
    authors: ['AutoSysOps (Levis)'],
    type: 'remote',
    licence: 'MIT',
    targetApiVersion: 34,
    main: main
});