function triggerButtonAction(actionToPerform) {
    if (configs.debugMode) {
        console.log('Action to perform: ');
        console.log(actionToPerform);
    }

    if (actionToPerform == 'scrollToTop') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (actionToPerform == 'scrollToBottom') {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    } else if (actionToPerform == 'scrollPageUp') {
        window.scrollTo({ top: window.scrollY - window.innerHeight * .9, behavior: 'smooth' });
    } else if (actionToPerform == 'scrollPageDown') {
        window.scrollTo({ top: window.scrollY + window.innerHeight * .9, behavior: 'smooth' });
    } else

        if (actionToPerform !== null && actionToPerform !== undefined) {
            if (typeOfMenu !== 'regularMenu') {
                let link = hoveredLink;

                if (configs.debugMode) {
                    console.log('link:');
                    console.log(link);
                }

                if (typeOfMenu == 'selectionMenu')
                    chrome.runtime.sendMessage({ actionToDo: actionToPerform, url: textSelection.toString().trim(), selectedText: textSelection.toString() });
                else
                    chrome.runtime.sendMessage({ actionToDo: actionToPerform, url: link, linkText: hoveredLinkTitle })
            } else {
                chrome.runtime.sendMessage({ actionToDo: actionToPerform, url: window.location.href })
            }
        }
}

function wrapLabel(context, text, x, y, maxWidth, lineHeight) {
    var words = text.split(' ');
    var line = '';
    var verticallyShiftedAmount = 0;

    for (var n = 0; n < words.length; n++) {
        var testLine = line + words[n] + ' ';
        var metrics = context.measureText(testLine);
        var testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0 && verticallyShiftedAmount < 1) {
            verticallyShiftedAmount += 1;
            context.fillText(line, x, y - ((lineHeight / 2)));
            // context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight / 2;
        }
        else {
            line = testLine;
        }
    }
    context.fillText(line, x, y);
    return verticallyShiftedAmount * (lineHeight);
}



/// Returns white for dark background, and black for bright
function getTextColorForBackground(color) {
    var c = hexToRgb(color);

    var d = 0;
    var luminance =
        (0.299 * c.red + 0.587 * c.green + 0.114 * c.blue) / 255;
    if (luminance > 0.5) {
        isDarkBackground = false;
        d = 0; // bright colors - black font
    }
    else {
        d = 255; // dark colors - white font
        isDarkBackground = true;
    }

    return { red: d, green: d, blue: d };
    // return `rgba(${d}, ${d}, ${d}, ${desiredOpacity})`;
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



function isCoordinateWithinTextSelection(dx, dy) {
    let textSelectionData = getSelectionRectDimensions();

    if (dx > textSelectionData.dx && dx < textSelectionData.dx + textSelectionData.width
        && dy > textSelectionData.dy && dy < textSelectionData.dy + textSelectionData.height) {
        return true;
    } else {
        return false;
    }

}

/// Returns data for text selection rect
function getSelectionRectDimensions() {
    var sel = document.selection, range;
    var width = 0, height = 0;
    var dx = 0, dy = 0;
    if (sel) {
        if (sel.type != "Control") {
            range = sel.createRange();
            var rect = range.getBoundingClientRect();
            width = range.boundingWidth;
            height = range.boundingHeight;
            dx = rect.left;
            dy = rect.top;
        }
    } else if (window.getSelection) {
        sel = window.getSelection();
        if (sel.rangeCount) {
            range = sel.getRangeAt(0).cloneRange();
            if (range.getBoundingClientRect) {
                var rect = range.getBoundingClientRect();
                width = rect.right - rect.left;
                height = rect.bottom - rect.top;
                dx = rect.left;
                dy = rect.top;
            }
        }
    }
    return { width: width, height: height, dx: dx, dy: dy };
}