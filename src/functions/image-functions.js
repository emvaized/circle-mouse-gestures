///  Copy image methods
function copyImg(src) {
    if (configs.debugMode) {
        console.log('image source:');
        console.log(src);
    }

    let errors = false;

    if (configs.debugMode) console.log('trying to copy image...');
    getBase64Image(elementUnderCursor, function (base64) {
        // base64 gere
        if (configs.debugMode)
            console.log(base64);
        copyPngFromSource(base64);
    }, function (e) {

        /// Error callback
        if (configs.debugMode) console.log('trying method 2...');

        try {
            /// Trying to use proxy to bypass CORS
            getDataUri(src, function (base64) {
                if (configs.debugMode) {
                    console.log('received response: ');
                    console.log(base64);
                }
                if (base64 !== null && base64 !== undefined && !base64.includes('data:text/xml'))
                    copyPngFromSource(base64);
                else
                    fallbackCopyImg(src);

            }, fallbackCopyImg)
        } catch (e) {

            /// Fallback method
            try {
                fallbackCopyImg(src);
            } catch (e) {
                if (configs.debugMode) console.log('failed to copy image');
                errors = true;
            }
        }
    });


    /// Print success notification
    if (errors) {
        chrome.runtime.sendMessage(
            {
                actionToDo: 'showBrowserNotification',
                title: chrome.i18n.getMessage('imageCopyFailTitle'),
                message: chrome.i18n.getMessage('imageCopyFailMessage'),
                image: '../../icons/success/block.svg'
            });
    } else {
        chrome.runtime.sendMessage(
            {
                actionToDo: 'showBrowserNotification',
                title: chrome.i18n.getMessage('copied'),
                message: chrome.i18n.getMessage('imageCopySuccessMessage'),
                image: src
            });
    }
}

/// First method to get image - tries to draw it on canvas
function convert(oldImag, callback, errorCallback) {
    var img = new Image();
    img.onload = function () {
        callback(img)
    }
    img.onerror = function (e) {
        errorCallback()
    }
    img.setAttribute('crossorigin', 'anonymous');
    img.crossOrigin = 'Anonymous';
    img.src = oldImag.src;
}

function getBase64Image(img, callback, errorCallback) {
    convert(img, function (newImg) {
        var canvas = document.createElement("canvas");
        canvas.width = newImg.width;
        canvas.height = newImg.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(newImg, 0, 0);
        var base64 = canvas.toDataURL("image/png");
        callback(base64)

    }, errorCallback)
}

/// Second method to get base64 image from url source - tries to bypass CORS error with proxy
/// Source: https://stackoverflow.com/a/44199382/11381400
var getDataUri = function (targetUrl, callback, errorCallback) {
    let xhr = new XMLHttpRequest();
    xhr.onload = function () {
        var reader = new FileReader();
        reader.onloadend = function () {
            callback(reader.result);
        };
        reader.readAsDataURL(xhr.response);
    };
    xhr.onerror = function (e) {
        if (configs.debugMode) {
            console.log("received error:");
            console.log(e);
        }
        // errorCallback(targetUrl)
        throw new Error(e);
    };
    var proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    xhr.open('GET', proxyUrl + targetUrl);
    xhr.responseType = 'blob';
    xhr.send();
};


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
        canvas.toBlob(copyImageToClipboard, "image/png", 1);
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


function copyPngFromSource(src) {
    const imageUrl = src;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const imageEl = createImage({ src: imageUrl });
    imageEl.onload = (e) => {
        canvas.width = e.target.width;
        canvas.height = e.target.height;
        ctx.drawImage(e.target, 0, 0, e.target.width, e.target.height);
        canvas.toBlob(copyImageToClipboard, "image/png", 1);
    };
}

/// Fallback method - affected by CORS-issue, but why not to try?
async function fallbackCopyImg(src) {
    if (configs.debugMode) console.log('trying method 3...');

    // const img = await fetch(src);
    const img = await fetch(src).then((response) => {
        if (response.status >= 400 && response.status < 600) throw new Error("Bad response from server");
        return response;
    }).catch((error) => {
        // Your error is here!
        throw new Error("Bad response from server");
    });
    const imgBlob = await img.blob();

    if (src.endsWith(".png")) {
        copyImageToClipboard(imgBlob);
    } else {
        convertToPng(imgBlob);
    }
}



