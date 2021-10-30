///  Copy image methods
let copiedImageSrc;

async function copyImg(src) {
    if (configs.debugMode) {
        console.log('image source:');
        console.log(src);
    }

    copiedImageSrc = src;

    if (configs.debugMode) console.log('trying to copy image...');

    /// Chrome-bases methods
    getBase64Image(elementUnderCursor, function (base64) {
        copyPngFromSource(base64);
    }, function (e) {
        /// Error callback
        showNotification(false);
    });
}

function showNotification(result = true) {
    if (configs.copyNotification)
        if (result == false) {
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
                    image: copiedImageSrc
                });
        }
}

/// First method to get image - tries to draw it on canvas
function convert(oldImag, callback, errorCallback) {
    let img = new Image();
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
        callback(base64);

    }, errorCallback)
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

async function copyImageToClipboard(pngBlob) {
    if (configs.debugMode) {
        console.log('trying to copy fetched image to clipboard:');
        console.log(pngBlob);
    }

    let isFirefox = navigator.userAgent.indexOf("Firefox") > -1;

    if (isFirefox) {
        chrome.runtime.sendMessage({ actionToDo: 'copyPrefetchedImageFirefox', blob: pngBlob }, (response) => {
            let imageCopyError = response ? !response : true;

            if (configs.copyNotification)
                showNotification(!imageCopyError);
        });
    }
    else
        try {
            await navigator.clipboard.write([
                new ClipboardItem({
                    [pngBlob.type]: pngBlob
                })
            ]);
            if (configs.debugMode)
                console.log("Image copied");

            showNotification(true);
        } catch (error) {
            if (configs.debugMode)
                console.error(error);

            showNotification(false);
        }
}
