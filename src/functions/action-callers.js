let playerVolumeStep = 0.1;
let lastPlayerVolume;


function triggerButtonAction(actionToPerform, urlToOpen) {
    if (configs.debugMode) {
        if (configs.debugMode) console.log('Action to perform: ');
        if (configs.debugMode) console.log(actionToPerform);
    }

    switch (actionToPerform) {

        case 'openUrl': {
            if (urlToOpen == null || urlToOpen == undefined) return;
            if (!urlToOpen.includes('://')) urlToOpen = 'https://' + urlToOpen;
            chrome.runtime.sendMessage({ actionToDo: 'openInFgTab', url: urlToOpen });
        } break;

        case 'copyLinkText': {
            copyToClipboard(hoveredLinkTitle);
        } break;

        case 'copyText': {
            copyToClipboard(textSelection.toString().trim());
        } break;

        case 'copyUrl': {
            if (hoveredLink && hoveredLink.includes('mailto:')) hoveredLink = hoveredLink.replaceAll('mailto:', '');
            copyToClipboard(typeOfMenu == 'regularMenu' ? window.location.href : hoveredLink);
        } break;

        case 'scrollToTop': {
            scrollElementToTop(elementUnderCursor);
        } break;

        case 'scrollToBottom': {
            scrollElementToBottom(elementUnderCursor);
        } break;

        case 'scrollBackTop': {
            // window.scrollTo({ top: previousScrollPosition['scrollToTop'], behavior: 'smooth' });
            scrollElementToAmount(elementUnderCursor, previousScrollPosition['scrollToTop'])
            previousScrollPosition = {};
        } break;

        case 'scrollBackBottom': {
            // window.scrollTo({ top: previousScrollPosition['scrollToBottom'], behavior: 'smooth' });
            scrollElementToAmount(elementUnderCursor, previousScrollPosition['scrollToBottom'])
            previousScrollPosition = {};
        } break;

        case 'scrollPageUp': {
            // window.scrollTo({ top: window.scrollY - window.innerHeight * .9, behavior: 'smooth' });
            scrollElementToAmount(elementUnderCursor, null, true)
        } break;

        case 'scrollPageDown': {
            // window.scrollTo({ top: window.scrollY + window.innerHeight * .9, behavior: 'smooth' });
            scrollElementToAmount(elementUnderCursor, null, false)
        } break;

        case 'undoAction': {
            document.execCommand('undo');
            // doUndo(elementUnderCursor)
        } break;

        case 'redoAction': {
            document.execCommand('redo');
            // doRedo(elementUnderCursor)
        } break;

        case 'boldText': {
            formatSelectedTextForInput(elementUnderCursor, textSelection, 'bold');
        } break;

        case 'italicText': {
            formatSelectedTextForInput(elementUnderCursor, textSelection, 'italic');
        } break;

        case 'underlineText': {
            formatSelectedTextForInput(elementUnderCursor, textSelection, 'underline');
        } break;

        case 'strikeText': {
            formatSelectedTextForInput(elementUnderCursor, textSelection, 'strike');
        } break;

        case 'pasteText': {
            if (elementUnderCursor !== null)
                elementUnderCursor.focus({ preventScroll: true });

            if (currentClipboardContent !== null && currentClipboardContent !== undefined && elementUnderCursor.getAttribute('contenteditable') !== null)
                document.execCommand("insertHTML", false, currentClipboardContent);
            else
                document.execCommand('paste');
        } break;

        case 'cutText': {
            if (elementUnderCursor !== null && elementUnderCursor.getAttribute('contenteditable') == null)
                elementUnderCursor.focus({ preventScroll: true });
            document.execCommand('cut');
        } break;

        case 'clearInputField': {
            if (elementUnderCursor !== null) {
                if (elementUnderCursor.getAttribute('contenteditable') !== null)
                    elementUnderCursor.innerHTML = '';
                else {
                    elementUnderCursor.focus({ preventScroll: true });
                    elementUnderCursor.value = '';
                }
            }
        } break;

        case 'selectAllText': {
            if (elementUnderCursor !== null) {
                if (elementUnderCursor.getAttribute('contenteditable') !== null)
                    document.execCommand('selectAll', false, null);
                else {
                    elementUnderCursor.focus({ preventScroll: true });
                    elementUnderCursor.select();
                }
            }
        } break;

        case 'copyAllText': {
            if (elementUnderCursor !== null) {
                if (elementUnderCursor.getAttribute('contenteditable') !== null)
                    document.execCommand('selectAll', false, null);
                else {
                    elementUnderCursor.focus({ preventScroll: true });
                    elementUnderCursor.select();
                }
                document.execCommand('copy');
            }
        } break;

        case 'copyImage': {
            copyImg(hoveredLink);
        } break;

        case 'openImageFullscreen': {
            try {
                openImageFullscreen(elementUnderCursor);
            } catch (e) { if (configs.debugMode) console.log(e); }
        } break;

        case 'openLinkPreview': {
            try {
                openLinkPreview(elementUnderCursor);
            } catch (e) { if (configs.debugMode) console.log(e); }
        } break;

        case 'textTooLong': {
            try {
                trimPage();
            } catch (e) { if (configs.debugMode) console.log(e); }

        } break;

        case 'downloadVideoSavefromNet': {
            chrome.runtime.sendMessage({ actionToDo: 'openInFgTab', url: `https://en.savefrom.net/20/#url=${window.location.href}` });
        } break;

        case 'replayVideo': {
            if (elementUnderCursor !== null) {
                elementUnderCursor.load();
                elementUnderCursor.play();
            }
        } break;

        case 'playerFullScreen': {
            if (elementUnderCursor !== null) {
                elementUnderCursor.requestFullscreen();

                let elem = elementUnderCursor;
                if (elem.requestFullscreen) {
                    elem.requestFullscreen();
                } else if (elem.mozRequestFullScreen) {
                    elem.mozRequestFullScreen();
                } else if (elem.webkitRequestFullscreen) {
                    elem.webkitRequestFullscreen();
                } else if (elem.msRequestFullscreen) {
                    elem.msRequestFullscreen();
                }

            }
        } break;

        case 'rewindVideo': {
            if (elementUnderCursor !== null) {
                let currentTime = elementUnderCursor.currentTime;;
                seekPlayerToTime(elementUnderCursor, currentTime - 10)
            }

        } break;

        case 'fastForwardVideo': {
            if (elementUnderCursor !== null) {
                let currentTime = elementUnderCursor.currentTime;;
                seekPlayerToTime(elementUnderCursor, currentTime + 10)
            }

        } break;

        case 'playPauseVideo': {
            if (elementUnderCursor !== null) {
                elementUnderCursor.enableContextMenu = false;
                if (elementUnderCursor.paused)
                    elementUnderCursor.play();
                else elementUnderCursor.pause();
            }

        } break;

        case 'increasePlayerVolume': {
            if (elementUnderCursor !== null) {
                elementUnderCursor.enableContextMenu = false;

                let newVolume = elementUnderCursor.volume + playerVolumeStep;
                if (newVolume > 1.0) newVolume = 1.0
                elementUnderCursor.volume = newVolume;
            }
        } break;

        case 'decreasePlayerVolume': {
            if (elementUnderCursor !== null) {
                elementUnderCursor.enableContextMenu = false;

                let newVolume = elementUnderCursor.volume - playerVolumeStep;
                if (newVolume < 0.0) newVolume = 0.0
                elementUnderCursor.volume = newVolume;
            }
        } break;

        case 'mutePlayer': {
            if (elementUnderCursor !== null) {
                elementUnderCursor.enableContextMenu = false;

                if (elementUnderCursor.volume == 0.0) {
                    elementUnderCursor.volume = lastPlayerVolume ?? 0.5;
                } else {
                    lastPlayerVolume = elementUnderCursor.volume;
                    elementUnderCursor.volume = 0.0;
                }
            }
        } break;

        case 'moveCaretToEnd': {
            if (elementUnderCursor !== null) {
                elementUnderCursor.focus({ preventScroll: true });
                let val = elementUnderCursor.value; //store the value of the element
                elementUnderCursor.value = ''; //clear the value of the element
                elementUnderCursor.value = val; //set that value back.
            }

        } break;
        case 'moveCaretToStart': {
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
                    } else elementUnderCursor.focus();
                }
            }

        } break;

        case 'selectMore': {
            selectAllText();
        } break;

        case 'selectAll': {
            selectAllText(document.body);
        } break;

        case 'print': {
            window.print();
        } break;

        case 'normalPlaybackSpeed': {
            if (elementUnderCursor !== null) {
                elementUnderCursor.playbackRate = 1;
            }
        } break;

        case 'slowerPlaybackSpeed': {
            if (elementUnderCursor !== null) {
                elementUnderCursor.playbackRate = 0.5;
            }
        } break;

        case 'fasterPlaybackSpeed': {
            if (elementUnderCursor !== null) {
                elementUnderCursor.playbackRate = 1.5;
            }
        } break;

        default: {
            /// Some action requre functions to be run in background.js, so we pass the action there
            if (actionToPerform !== null && actionToPerform !== undefined) {
                if (typeOfMenu !== 'regularMenu') {
                    let link = hoveredLink;

                    if (configs.debugMode) {
                        console.log('link:');
                        console.log(link);
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