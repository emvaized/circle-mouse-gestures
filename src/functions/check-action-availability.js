function checkButtonAvailability(e, id) {
    switch (id) {
        case 'scrollToTop': return canScrollTop(elementUnderCursor);
        case 'scrollToBottom': return canScrollBottom(elementUnderCursor);
        case 'scrollPageUp': return window.scrollY !== 0.0;
        case 'scrollPageDown': {
            return window.screen.height + window.scrollY < document.documentElement.scrollHeight;
        }
        case 'goBack': {
            return window.history.length !== 1;
        };
        case 'goForward': return window.history.length !== 1;

        case 'downloadUrlAs': {
            if (typeOfMenu == 'playerMenu') {
                if (elementUnderCursor == null) return false;
                let videoControls = elementUnderCursor.getAttribute('controlslist');
                if (videoControls !== null && videoControls !== undefined && videoControls.includes('nodownload')) return false;
                else return true;
            } else return true;
        }

        case 'cutText': {
            try {
                if (textSelection == null || textSelection == undefined || textSelection.toString() == '') {
                    return false;
                }
                else {
                    return true;
                }
            } catch (e) { console.log(e); return true; }

        }
        case 'copyText': {
            if ((typeOfMenu == 'textFieldMenu' || typeOfMenu == 'selectionMenu') && (textSelection == null || textSelection == undefined || textSelection.toString() == ''))
                return false;
            else return true;
        }

        case 'switchToNextTab': {
            chrome.runtime.sendMessage({ actionToDo: 'checkNextTabAvailability' }, (response) => {
                updateButtonAvailability(e, 'switchToNextTab', !response);
            });
            return true;
        }

        case 'switchToPreviousTab': {
            chrome.runtime.sendMessage({ actionToDo: 'checkPrevTabAvailability' }, (response) => {
                updateButtonAvailability(e, 'switchToPreviousTab', !response);
            });
            return true;
        }

        case 'closeCurrentTab': {
            chrome.runtime.sendMessage({ actionToDo: 'checkPinTabStatus' }, (response) => {
                updateButtonAvailability(e, 'closeCurrentTab', !response);
            }
            );
            return true;
        }

        case 'copyImage': {
            // fetchHoveredImage(e, hoveredLink);
            return true;
        }

        case 'undoAction': {
            let isFirefox = navigator.userAgent.indexOf("Firefox") > -1;
            if (isFirefox && document.activeElement.getAttribute('contenteditable') == null) return false;
            else
                return true;
        }

        case 'redoAction': {
            let isFirefox = navigator.userAgent.indexOf("Firefox") > -1;
            if (isFirefox && document.activeElement.getAttribute('contenteditable') == undefined) return false;
            else
                return true;
        }

        case 'normalPlaybackSpeed': {
            if (elementUnderCursor !== null) {
                return elementUnderCursor.playbackRate !== 1;
            } else return false;
        } break;

        case 'slowerPlaybackSpeed': {
            if (elementUnderCursor !== null) {
                return elementUnderCursor.playbackRate !== 0.5;
            } else return false;
        } break;

        case 'fasterPlaybackSpeed': {
            if (elementUnderCursor !== null) {
                return elementUnderCursor.playbackRate !== 1.5;
            } else return false;
        } break;

        case 'boldText': {
            const cyrillicPattern = /^[\u0400-\u04FF]+$/;
            return textSelection.toString() !== '' && !cyrillicPattern.test(textSelection.toString().replaceAll(' ', ''));
        } break;

        case 'italicText': {
            const cyrillicPattern = /^[\u0400-\u04FF]+$/;
            return textSelection.toString() !== '' && !cyrillicPattern.test(textSelection.toString().replaceAll(' ', ''));
        } break;

        case 'underlineText': {
            const cyrillicPattern = /^[\u0400-\u04FF]+$/;
            return textSelection.toString() !== '' && !cyrillicPattern.test(textSelection.toString().replaceAll(' ', ''));
        } break;

        case 'strikeText': {
            const cyrillicPattern = /^[\u0400-\u04FF]+$/;
            return textSelection.toString() !== '' && !cyrillicPattern.test(textSelection.toString().replaceAll(' ', ''));
        } break;

        default: return true;
    }
}

/// Used for async change of button's availability

function updateButtonAvailability(e, id, value) {
    if (configs.debugMode) console.log('updating button availability for: ' + id);

    buttonsAvailability[id] = value;

    if (timerToRedrawCircleOnAsyncUpdate == null) {
        timerToRedrawCircleOnAsyncUpdate = setTimeout(function () {
            try {
                drawCircle(e, typeOfMenu);
                timerToRedrawCircleOnAsyncUpdate = null;
            } catch (error) { if (configs.debugMode) console.log(error); }
        }, timerToRedrawCircleOnAsyncUpdateDelay);
    }
}