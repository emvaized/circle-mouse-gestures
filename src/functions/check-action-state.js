function returnActionIconPath(e, id) {
    let p;

    function setDefaultPath() {
        p = new Path2D(actionIcons[id]);
    }

    function setScrollIconsPath() {
        let previousPosition = previousScrollPosition[id];

        if (configs.storeCurrentScrollPosition && previousPosition !== null && previousPosition !== undefined)
            p = new Path2D(actionIcons[id == 'scrollToTop' ? 'scrollBackTop' : 'scrollBackBottom']);
        else
            setDefaultPath();
    }

    switch (id) {
        case 'playPauseVideo': {
            p = new Path2D(actionIcons[elementUnderCursor == null || elementUnderCursor == undefined ? 'playPauseVideo' : elementUnderCursor.paused ? 'playVideo' : 'pauseVideo']);
        } break;

        case 'textTooLong': {
            p = new Path2D(actionIcons[document.querySelector('.ttl-drag-handle') !== null ? 'textTooLongReverse' : 'textTooLong']);
        } break;

        case 'scrollToTop': {
            setScrollIconsPath();
        } break;

        case 'scrollToBottom': {
            setScrollIconsPath();
        } break;

        case 'toggleFullscreen': {
            if (buttonsStatuses[id] !== null && buttonsStatuses[id] !== undefined) {
                p = new Path2D(actionIcons[buttonsStatuses[id] ? 'toggleFullscreen' : 'untoggleFullscreen']);
                // buttonsStatuses[id] = null;
            } else {
                /// Set default value just for sure
                p = new Path2D(actionIcons['toggleFullscreen']);

                /// Request to background script to check if opened window is in fullscreen
                chrome.runtime.sendMessage({ actionToDo: 'checkFullscreenToggleStatus' }, (response) => {
                    /// Redraw screen with updated icon
                    updateButtonStatus(e, 'toggleFullscreen', !response);
                });
            }

        } break;

        case 'pinTab': {
            /// Same logic as for 'toggleFullscreen
            if (buttonsStatuses[id] !== null && buttonsStatuses[id] !== undefined) {
                p = new Path2D(actionIcons[buttonsStatuses[id] ? 'pinTab' : 'unpinTab']);
            } else {
                p = new Path2D(actionIcons['pinTab']);
                chrome.runtime.sendMessage({ actionToDo: 'checkPinTabStatus' }, (response) => {
                    updateButtonStatus(e, 'pinTab', !response);
                });
            }
        } break;

        default: {
            setDefaultPath();
        }
    }

    return p;
}


function returnActionLabel(id) {

    let textToDraw;

    function setDefaultPath() {
        textToDraw = chrome.i18n.getMessage(id);
    }

    function setScrollIconsPath() {
        let previousPosition = previousScrollPosition[id];

        if (configs.storeCurrentScrollPosition && previousPosition !== null && previousPosition !== undefined)
            textToDraw = chrome.i18n.getMessage('scrollBack');
        else
            setDefaultPath();
    }


    switch (id) {
        case 'playPauseVideo': {
            textToDraw = chrome.i18n.getMessage(elementUnderCursor == null || elementUnderCursor == undefined ? 'playPauseVideo' : elementUnderCursor.paused ? 'playVideo' : 'pauseVideo');
        } break;

        case 'textTooLong': {
            textToDraw = chrome.i18n.getMessage(document.querySelector('.ttl-drag-handle') !== null ? 'restore' : 'textTooLong');

        } break;

        case 'scrollToTop': {
            setScrollIconsPath();
        } break;

        case 'scrollToBottom': {
            setScrollIconsPath();
        } break;

        case 'toggleFullscreen': {
            if (buttonsStatuses[id] !== null && buttonsStatuses[id] !== undefined) {
                textToDraw = chrome.i18n.getMessage(buttonsStatuses[id] ? 'toggleFullscreen' : 'untoggleFullscreen');
            } else {
                textToDraw = chrome.i18n.getMessage('toggleFullscreen');
            }

        } break;

        case 'pinTab': {
            if (buttonsStatuses[id] !== null && buttonsStatuses[id] !== undefined) {
                textToDraw = chrome.i18n.getMessage(buttonsStatuses[id] ? 'pinTab' : 'unpinTab');
            } else {
                textToDraw = chrome.i18n.getMessage('pinTab');
            }
        } break;

        default: {
            setDefaultPath();
        }
    }

    return textToDraw;

}


function updateButtonStatus(e, id, activated) {
    buttonsStatuses[id] = activated;

    if (timerToRedrawCircleOnAsyncUpdate == null) {
        timerToRedrawCircleOnAsyncUpdate = setTimeout(function () {
            try {
                drawCircle(e, typeOfMenu);
                timerToRedrawCircleOnAsyncUpdate = null;
            } catch (error) { if (configs.debugMode) console.log(error); }
        }, timerToRedrawCircleOnAsyncUpdateDelay);
    }
}