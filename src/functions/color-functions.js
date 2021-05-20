/// Returns white for dark background, and black for bright
function getTextColorForBackground(hexColor) {
    var c = hexToRgb(hexColor);

    var d = 0;
    var luminance =
        (0.299 * c.red + 0.587 * c.green + 0.114 * c.blue) / 255;
    if (luminance > 0.5) {
        d = 0; // bright colors - black font
    }
    else {
        d = 255; // dark colors - white font
    }

    return { red: d, green: d, blue: d };
    // return `rgba(${d}, ${d}, ${d}, ${desiredOpacity})`;
}

function isColorDark(hexColor) {
    var c = hexToRgb(hexColor);
    let isDarkBackground = false;

    var luminance =
        (0.299 * c.red + 0.587 * c.green + 0.114 * c.blue) / 255;
    if (luminance > 0.5) {
        isDarkBackground = false;
    }
    else {
        isDarkBackground = true;
    }

    return isDarkBackground;
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        red: parseInt(result[1], 16),
        green: parseInt(result[2], 16),
        blue: parseInt(result[3], 16)
    } : null;
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function mixColors(hexFirst, hexSecond, opacityOfOverlay) {
    let rgbColorFirst = hexToRgb(hexFirst);
    var base = [rgbColorFirst.red, rgbColorFirst.green, rgbColorFirst.blue, 1.0];

    let rgbColorSecond = hexToRgb(hexSecond);
    var added = [rgbColorSecond.red, rgbColorSecond.green, rgbColorSecond.blue, opacityOfOverlay];

    var mix = [];
    mix[3] = 1 - (1 - added[3]) * (1 - base[3]); // alpha
    mix[0] = Math.round((added[0] * added[3] / mix[3]) + (base[0] * base[3] * (1 - added[3]) / mix[3])); // red
    mix[1] = Math.round((added[1] * added[3] / mix[3]) + (base[1] * base[3] * (1 - added[3]) / mix[3])); // green
    mix[2] = Math.round((added[2] * added[3] / mix[3]) + (base[2] * base[3] * (1 - added[3]) / mix[3])); // blue

    return rgbToHex(mix[0], mix[1], mix[2]);
    // return `rgb(${mix[0]},${mix[1]},${mix[2]})`;
}