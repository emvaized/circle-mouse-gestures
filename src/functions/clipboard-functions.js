async function getCurrentClipboard() {
    let clipboardContent;
    let input = document.createElement('input');
    input.setAttribute('style', `position: absolute; top: ${window.scrollY}px; left: 0px; opacity: 0;`)
    document.body.appendChild(input);
    input.focus();
    document.execCommand('paste');
    clipboardContent = input.value;
    document.execCommand('undo');
    input.blur();
    document.body.removeChild(input);
    elementUnderCursor.focus();

    if (clipboardContent == null || clipboardContent == undefined || clipboardContent == '') {
        let res = await chrome.runtime.sendMessage({ actionToDo: 'getCurrentClipboardContent' });
        return res;
    } else
        return clipboardContent;

}

function copyToClipboard(text) {
    try {
        let input = document.createElement('input');
        input.setAttribute('style', `position: absolute; top: ${window.scrollY}px; left: 0px; opacity: 0;`)
        document.body.appendChild(input);
        input.value = text;
        input.focus();
        input.select();
        document.execCommand('Copy');
        // input.remove();
        document.body.removeChild(input);
    } catch (e) {
        navigator.clipboard.writeText(text);
    }
}

async function copyImageToClipboard(pngBlob) {
    if (configs.debugMode) {
        console.log('trying to copy image to clipboard:');
        console.log(pngBlob);
    }
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