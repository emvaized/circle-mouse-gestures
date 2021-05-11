function triggerButtonAction(actionToPerform) {
    if (configs.debugMode) {
        if (configs.debugMode) console.log('Action to perform: ');
        if (configs.debugMode) console.log(actionToPerform);
    }

    if (actionToPerform == 'scrollToTop') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (actionToPerform == 'scrollToBottom') {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    } else if (actionToPerform == 'scrollPageUp') {
        window.scrollTo({ top: window.scrollY - window.innerHeight * .9, behavior: 'smooth' });
    } else if (actionToPerform == 'scrollPageDown') {
        window.scrollTo({ top: window.scrollY + window.innerHeight * .9, behavior: 'smooth' });
    } else if (actionToPerform == 'undoAction') {

        document.execCommand('undo');
        // doUndo(elementUnderCursor)
    } else if (actionToPerform == 'redoAction') {
        document.execCommand('redo');
        // doRedo(elementUnderCursor)
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
    } else if (actionToPerform == 'copyAllText') {
        if (elementUnderCursor !== null) {
            elementUnderCursor.focus({ preventScroll: true });
            elementUnderCursor.select();
            document.execCommand('copy');
        }
    }
    else if (actionToPerform == 'copyImage') {
        copyImg(hoveredLink);

    } else if (actionToPerform == 'downloadVideoSavefromNet') {
        chrome.runtime.sendMessage({ actionToDo: 'openInFgTab', url: `https://en.savefrom.net/20/#url=${window.location.href}` });
    } else if (actionToPerform == 'replayVideo') {
        if (elementUnderCursor !== null) {
            elementUnderCursor.load();
            elementUnderCursor.play();
        }
    } else if (actionToPerform == 'rewindVideo') {
        if (elementUnderCursor !== null) {
            let currentTime = elementUnderCursor.currentTime;;
            seekPlayerToTime(elementUnderCursor, currentTime - 10)
        }
    } else if (actionToPerform == 'fastForwardVideo') {
        if (elementUnderCursor !== null) {
            let currentTime = elementUnderCursor.currentTime;;
            seekPlayerToTime(elementUnderCursor, currentTime + 10)
        }
    }
    else if (actionToPerform == 'playPauseVideo') {
        if (elementUnderCursor !== null) {
            if (elementUnderCursor.paused)
                elementUnderCursor.play();
            else elementUnderCursor.pause();
        }
    }
    else if (actionToPerform == 'moveCaretToEnd') {
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
    } else if (actionToPerform !== null && actionToPerform !== undefined) {
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


async function getCurrentClipboard() {
    try {

        const text = await navigator.clipboard.readText();
        currentClipboardContent = text;
        return text;

    } catch (e) {
        if (configs.debugMode) console.log(e);
        return '';
    }
}


/// Player methods
function seekPlayerToTime(video_element, ts) {
    // try and avoid pauses after seeking
    video_element.pause();
    video_element.currentTime = ts; // if this is far enough away from current, it implies a "play" call as well...oddly. I mean seriously that is junk.
    // however if it close enough, then we need to call play manually
    // some shenanigans to try and work around this:
    var timer = setInterval(function () {
        if (video_element.paused && video_element.readyState == 4 || !video_element.paused) {
            video_element.play();
            clearInterval(timer);
        }
    }, 50);
}


///  Copy image methods

async function copyImg(src) {
    try {

        if (elementUnderCursor !== null) {
            base64(elementUnderCursor, function (data) {
                console.log(data);
                copyPngFromSource(data);
            })
        } else

            /// New method - relies on proxy to bypass CORS
            getDataUri(src, function (base64) {
                if (base64 !== null && base64 !== undefined && !base64.includes('data:text/xml')) {
                    copyPngFromSource(base64);
                } else {
                    fallbackCopyImg(src);
                }
            }, fallbackCopyImg)

    } catch (e) {
        if (configs.debugMode)
            console.log(e);

        fallbackCopyImg(src);
    }
}

async function fallbackCopyImg(src) {
    /// Old method - affected by CORS-issue
    if (configs.debugMode) console.log('Using old method to copy image...');

    const img = await fetch(src);
    const imgBlob = await img.blob();

    if (src.endsWith(".png")) {
        copyToClipboard(imgBlob);
    } else {
        convertToPng(imgBlob);
    }
}

/// Source: https://stackoverflow.com/a/59183698/11381400
function convertToPng(imgBlob) {
    const imageUrl = window.URL.createObjectURL(imgBlob);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const imageEl = createImage({ src: imageUrl });
    imageEl.onload = (e) => {
        canvas.width = e.target.width;
        canvas.height = e.target.height;
        ctx.drawImage(e.target, 0, 0, e.target.width, e.target.height);
        canvas.toBlob(copyToClipboard, "image/png", 1);
    };
}

function createImage(options) {
    options = options || {};
    const img = (Image) ? new Image() : document.createElement("img");
    img.crossOrigin = "anonymous";
    if (options.src) {
        img.src = options.src;
    }
    return img;
}

/// Method to get base64 image from url source
/// Source: https://stackoverflow.com/a/44199382/11381400
var getDataUri = function (targetUrl, callback, errorCallback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        var reader = new FileReader();
        reader.onloadend = function () {
            console.log('loaded!');
            callback(reader.result);
        };
        reader.readAsDataURL(xhr.response);
    };
    xhr.onerror = function (e) {
        console.log('ERRRRROR!');
        return null;
    };
    var proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    xhr.open('GET', proxyUrl + targetUrl);
    xhr.responseType = 'blob';
    xhr.send();
};


function base64(file, callback) {
    var imageFile = file;
    var fileReader = new FileReader();
    fileReader.onload = function (fileLoadedEvent) {
        var srcData = fileLoadedEvent.target.result;
        var newImage = document.createElement('img');
        newImage.src = srcData;
        callback(srcData);
    }
    fileReader.readAsDataURL(imageFile);
}


function copyPngFromSource(src) {
    const imageUrl = src;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const imageEl = createImage({ src: imageUrl });
    imageEl.onload = (e) => {
        canvas.width = e.target.width;
        canvas.height = e.target.height;
        ctx.drawImage(e.target, 0, 0, e.target.width, e.target.height);
        canvas.toBlob(copyToClipboard, "image/png", 1);
    };
}

async function copyToClipboard(pngBlob) {
    try {
        await navigator.clipboard.write([
            new ClipboardItem({
                [pngBlob.type]: pngBlob
            })
        ]);
        if (configs.debugMode)
            console.log("Image copied");
    } catch (error) {
        if (configs.debugMode)
            console.error(error);
    }
}