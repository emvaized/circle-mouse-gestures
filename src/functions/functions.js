function triggerButtonAction(actionToPerform) {
    if (configs.debugMode) {
        if (configs.debugMode) console.log('Action to perform: ');
        if (configs.debugMode) console.log(actionToPerform);
    }

    if (actionToPerform == 'findOnPage') {
        try {
            window.find('dialog', true, false, false, false, false, true);
        } catch (e) { console.log(e); }
    } else
        if (actionToPerform == 'scrollToTop') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (actionToPerform == 'scrollToBottom') {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        } else if (actionToPerform == 'scrollPageUp') {
            window.scrollTo({ top: window.scrollY - window.innerHeight * .9, behavior: 'smooth' });
        } else if (actionToPerform == 'scrollPageDown') {
            window.scrollTo({ top: window.scrollY + window.innerHeight * .9, behavior: 'smooth' });
        } else if (actionToPerform == 'undoAction') {
            document.execCommand('Undo');
        } else if (actionToPerform == 'redoAction') {
            document.execCommand('redo');
        } else if (actionToPerform == 'pasteText') {
            if (elementUnderCursor !== null)
                elementUnderCursor.focus({ preventScroll: true });
            document.execCommand('paste');
        } else if (actionToPerform == 'cutText') {
            if (elementUnderCursor !== null)
                elementUnderCursor.focus({ preventScroll: true });
            document.execCommand('cut');
        } else if (actionToPerform == 'clearInputField') {
            if (elementUnderCursor !== null) {
                elementUnderCursor.focus({ preventScroll: true });
                elementUnderCursor.value = '';
            }
        } else if (actionToPerform == 'selectAllText') {
            if (elementUnderCursor !== null) {
                elementUnderCursor.focus({ preventScroll: true });
                elementUnderCursor.select();
            }
        } else if (actionToPerform == 'moveCaretToEnd') {
            if (elementUnderCursor !== null) {
                elementUnderCursor.focus({ preventScroll: true });
                let val = elementUnderCursor.value; //store the value of the element
                elementUnderCursor.value = ''; //clear the value of the element
                elementUnderCursor.value = val; //set that value back.
            }
        } else if (actionToPerform == 'moveCaretToStart') {
            if (elementUnderCursor !== null) {

                if (elementUnderCursor.createTextRange) {
                    var range = elementUnderCursor.createTextRange();
                    range.move('character', 0);
                    range.select();
                }
                else {
                    if (elementUnderCursor.selectionStart) {
                        elementUnderCursor.focus();
                        elementUnderCursor.setSelectionRange(0, 0);
                    }
                    else
                        elementUnderCursor.focus();
                }

            }
        } else

            if (actionToPerform !== null && actionToPerform !== undefined) {
                if (typeOfMenu !== 'regularMenu') {
                    let link = hoveredLink;

                    if (configs.debugMode) {
                        if (configs.debugMode) console.log('link:');
                        if (configs.debugMode) console.log(link);
                    }

                    if (typeOfMenu == 'selectionMenu' || typeOfMenu == 'textFieldMenu')
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


function getCurrentClipboard() {
    try {
        var t = document.createElement("input");
        /// Some styling to remove scroll shifting
        t.setAttribute('style', `top: ${window.scrollY}px;max-width: 1px; max-height: 1px;position: absolute;opacity: 0.0;pointer-events: none; transform: scale(0.00000001, 0.00000001)`);
        document.body.appendChild(t);
        t.focus({ preventScroll: true });
        document.execCommand("paste");
        let clipboardText = t.value; //this is your clipboard data
        document.body.removeChild(t);
        return clipboardText;
    } catch (e) {
        if (configs.debugMode) console.log(e);
        return '';
    }
}
