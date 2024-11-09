function init() {
    loadUserConfigs(function () {
        if (configs.cmgEnabled) {
            document.documentElement.style.setProperty('--cmg-link-prevew-anim-duration', `300ms`);
            document.documentElement.style.setProperty('--cmg-ghost-mouse-pointer-size', `${ghostMousePointerRadius * 2}px`);
            document.documentElement.style.setProperty('--cmg-fullscreen-overlays-shadow', '0px 10px 50px rgba(0,0,0,0.25)');
            document.documentElement.style.setProperty('--cmg-page-dimmer-opacity', configs.backgroundDimmerOpacity);

            setPageListeners();
        }
    })

    /// Fix for older browsers which don't support String.replaceAll (used here in a lot of places)
    if (!String.prototype.replaceAll) {
        String.prototype.replaceAll = function (find, replace) {
            return this.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
        };
    }

    /// Update on settings change
    chrome.storage.onChanged.addListener((c) => loadUserConfigs());
}

let anyButtonIsSelected = false;
var timerForLongLeftClick;
var lastMouseDownEvent;
var longPressTimerInitEvent;
var rockerActionToPerform;

function setPageListeners() {
    /// Page listeners

    document.addEventListener("contextmenu", function (e) {
        if (e.ctrlKey || e.metaKey || leftClickIsHolded) return;
        if (typeOfMenu == '') return;

        if (configs.showRegularMenuIfNoAction && configs.hideCircleIfNoActionSelected == true
            && anyButtonIsSelected == false && rockerActionToPerform == undefined && circleIsShown == false && fullscreenImageIsOpen == false) {
            if (rightClickIsHolded) rightClickIsHolded = false;
            return;
        }

        e.preventDefault();
    });

    document.addEventListener("mousedown", function (e) {
        if (e.ctrlKey || e.metaKey) return;
        if (fullscreenImageIsOpen == true) return;

        if (configs.debugMode)
            console.log('Pushed button ' + e.button.toString());

        rockerActionToPerform = undefined;

        if (configs.openCircleOn == 'longLeftClick') {
            if (e.button == 0) {
                lastMouseDownEvent = e;
                longPressTimerInitEvent = { 'dx': e.clientX, 'dy': e.clientY };

                timerForLongLeftClick = setTimeout(function () {
                    /// Distance of cursor move during timeout, after which menu will not be opened
                    const thresholdToNotRegister = configs.longLeftClickThreshold ?? configs.innerCircleRadius;

                    if (
                        Math.abs(lastMouseDownEvent.clientX - longPressTimerInitEvent.dx) < thresholdToNotRegister &&
                        Math.abs(lastMouseDownEvent.clientY - longPressTimerInitEvent.dy) < thresholdToNotRegister
                    )
                        processAndShowCircle(lastMouseDownEvent);
                }, configs.delayForLongLeftClick);
            } else return;
        } else if ("buttons" in e) {

            /// Right click
            if (e.buttons == 2) {
                rightClickIsHolded = true;
                if (leftClickIsHolded) return;
                lastMouseDownEvent = e;

                processAndShowCircle(e);
            } else if (e.buttons == 3) {
                rocketButtonPressed = 0;

                /// Left click
                if (circleIsShown) {
                    e.preventDefault();

                    const keys = Object.keys(selectedButtons);
                for (let i = 0, l = keys.length; i < l; i++) {
                    const key = keys[i];
                    if (selectedButtons[key]) {
                        anyButtonIsSelected = true;
                        break;
                    }
                }

                if (anyButtonIsSelected == false) {
                    if (configs.debugMode) console.log('Rocker gesture recognized!');
                    rockerActionToPerform = configs[typeOfMenu]['rockerLeftClick'];
                    triggerButtonAction(rockerActionToPerform);
                }

                hideCircle();
                   
                } else {
                    leftClickIsHolded = true;
                }
            } else if (e.buttons == 6) {
                rocketButtonPressed = 6;

                /// Middle click
                if (circleIsShown) {
                    e.preventDefault();
                    hideCircle();

                    if (configs.debugMode) console.log('Rocker gesture recognized!');
                    rockerActionToPerform = configs[typeOfMenu]['rockerMiddleClick'];
                    triggerButtonAction(rockerActionToPerform);
                } else {
                    leftClickIsHolded = true;
                }
            } else {
                // if (configs.debugMode) console.log('CMG recognized button action ' + evt.buttons.toString());
            }
        }
    });


    document.addEventListener("mouseup", function (evt) {
        if (configs.openCircleOn == 'longLeftClick') {
            if (evt.button == 0) {
                if (circleIsShown == true)
                    hideCircle();
                else
                    try {
                        clearTimeout(timerForLongLeftClick);
                    } catch (err) {
                        if (configs.debugMode) console.log(err);
                    }
            } else return;
        } else if ("buttons" in evt) {
            if (evt.button == 0) {
                leftClickIsHolded = false;
                if (circleIsShown == false) return;
                if (lastMouseDownEvent !== null) lastMouseDownEvent = null;
                hideCircle();
            } else if (evt.button == 2) {
                rightClickIsHolded = false;
                /// Right click

                if (circleIsShown == false) return;
                const keys = Object.keys(selectedButtons);
                for (let i = 0, l = keys.length; i < l; i++) {
                    const key = keys[i];
                    if (selectedButtons[key]) {
                        anyButtonIsSelected = true;
                        break;
                    }
                }

                if (anyButtonIsSelected == false) {
                    /// Leave circle open (like a context menu) - or hide it
                    if (configs.hideCircleIfNoActionSelected)
                        hideCircle();

                } else {
                    // if (configs.animateHideRelativeToSelected) {
                    //     let xPercent = (e.clientX - leftCoord) / (canvasRadius);
                    //     if (xPercent < 0) xPercent = 0.0;
                    //     if (xPercent > 1) xPercent = 1.0;

                    //     let yPercent = (e.clientY - topCoord) / (canvasRadius);
                    //     if (yPercent < 0) yPercent = 0.0;
                    //     if (yPercent > 1) yPercent = 1.0;

                    //     circle.style.transformOrigin = `${xPercent * 100}% ${yPercent * 100}%`;
                    // }

                    hideCircle();
                }
            }
        }
    });


    if (configs.openCircleOn == 'longLeftClick') {
        document.addEventListener('mousemove', function (e) {
            if (e.button == 0) {

                if (circleIsShown) {
                    e.preventDefault();
                } else {
                    if (lastMouseDownEvent !== null)
                        lastMouseDownEvent = e;
                    // clearTimeout(timerForLongLeftClick);
                }
            }
        });

        /// Discard circle appear timer for following events
        document.addEventListener("dragstart", function (event) {
            if (circleIsShown) event.preventDefault();
            clearTimeout(timerForLongLeftClick);
        }, false);

        window.addEventListener('scroll', function () {
            clearTimeout(timerForLongLeftClick);
        }, true);

        document.addEventListener('selectstart', function (e) {
            if (circleIsShown) e.preventDefault();
        });

        document.addEventListener('selectionchange', function (e) {
            if (window.getSelection().toString() !== '')
                clearTimeout(timerForLongLeftClick);
        });

        document.addEventListener("webkitmouseforcedown", function (event) {
            if (circleIsShown) hideCircle();
            else clearTimeout(timerForLongLeftClick);
        });

        document.addEventListener("visibilitychange", function (event) {
            clearTimeout(timerForLongLeftClick);
        });
    }

    document.addEventListener('wheel', checkScrollDirection, 
        { passive: configs.continiousVerticalScrollDetection || configs.continiousHorizontalScrollDetection ? false : true }
    );

    document.addEventListener("visibilitychange", function (event) {
        /// When tab lost or regained focus, release the right mouse key
        if (rightClickIsHolded) rightClickIsHolded = false;
        if (circleIsShown) hideCircle();
    });
}

function checkScrollDirection(event) {

    /// Reset stored previous scroll position
    if (configs.storeCurrentScrollPosition && Object.keys(previousScrollPosition).length > 0)
        previousScrollPosition = {};

    if (circleIsShown == false && rightClickIsHolded == false) return;
    if (configs.openCircleOn !== 'rightClick') return;

    if (event.deltaY != 0) {
        /// Vertical scroll
        if (!configs.continiousVerticalScrollDetection) return;

        if (event.deltaY < 0) {
            event.preventDefault();
            const mouseWheelUpAction = configs[typeOfMenu].mouseWheelUpAction;
            if (!circleIsShown && actionShouldBreakScrollListener(mouseWheelUpAction)) return;
            triggerButtonAction(mouseWheelUpAction, undefined, 'up');
            anyButtonIsSelected = true;
            
        } else if (event.deltaY > 0) {
            event.preventDefault();
            const mouseWheelDownAction = configs[typeOfMenu].mouseWheelDownAction;
            if (!circleIsShown && actionShouldBreakScrollListener(mouseWheelDownAction)) return;
            triggerButtonAction(mouseWheelDownAction, undefined, 'down');
            anyButtonIsSelected = true;
        }
    } else {

        /// Horizontal scroll
        if (configs.horizontalWheelActionsEnabled) {
            if (!configs.continiousHorizontalScrollDetection) return;

            if (event.deltaX < 0) {
                event.preventDefault();
                const mouseWheelLeftAction = configs[typeOfMenu].mouseWheelLeftAction;
                if (!circleIsShown && actionShouldBreakScrollListener(mouseWheelLeftAction)) return;
                triggerButtonAction(mouseWheelLeftAction, undefined, 'up');
                anyButtonIsSelected = true;
            } else if (event.deltaX > 0) {
                event.preventDefault();
                const mouseWheelRightAction = configs[typeOfMenu].mouseWheelRightAction;
                if (!circleIsShown && actionShouldBreakScrollListener(mouseWheelRightAction)) return;
                triggerButtonAction(mouseWheelRightAction, undefined, 'down');
                anyButtonIsSelected = true;
            }
        }
    }

    hideCircle();
}

function actionShouldBreakScrollListener(action) {
    return action.includes('showTabSwitcher') || action.includes('showBookmarks');
}

function processAndShowCircle(e) {
    anyButtonIsSelected = false;

    if (circle !== null && circle !== undefined) {
        hideCircle();
        return;
    }

    e.preventDefault();

    selectedButtons = {};
    rocketButtonPressed = null;

    if (configs.debugMode) console.log('Showing mouse gestures circle...');
    const el = document.elementFromPoint(e.clientX, e.clientY);
    elementUnderCursor = el;
    const elStyle = window.getComputedStyle(el);

    if ((el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.getAttribute('contenteditable') !== null)
        && el.getAttribute('type') !== 'checkbox'
        && el.getAttribute('type') !== 'range'
        && el.getAttribute('type') !== 'color') {
        /// Text field is hovered
        if (window.getSelection) {
            textSelection = window.getSelection();
        } else if (document.selection) {
            textSelection = document.selection.createRange();
        } else {
            textSelection = null;
        }

        /// Special handling for Firefox (https://stackoverflow.com/questions/20419515/window-getselection-of-textarea-not-working-in-firefox)
        try {
            if (textSelection.toString() == '') {
                var ta = document.querySelector(':focus');
                if (ta !== null && ta.value !== undefined)
                    textSelection = ta.value.substring(ta.selectionStart, ta.selectionEnd);
            }
        } catch (e) { if (configs.debugMode) console.log(e) }

        typeOfMenu = 'textFieldMenu';
        hoveredLink = window.location.href;
        hoveredLinkTitle = null;

        el.focus({ preventScroll: false });
    } else if (el.tagName == 'IMG' ||
        (el.tagName !== 'HTML' && elStyle.backgroundImage && elStyle.backgroundImage.includes('url(') && !elStyle.background.includes(' repeat'))) {
        /// Image is hovered

        const imageUrl = el.getAttribute('src') ?? elStyle.backgroundImage.replace('url("', '').replace('")', '');
        let parentLink, parentLinkUrl;

        if (el.parentNode && el.parentNode.tagName == 'A') {
            parentLink = el.parentNode;
            parentLinkUrl = parentLink.getAttribute('href') || parentLink.getAttribute('data-url') || parentLink.parentNode.getAttribute('href') || parentLink.parentNode.getAttribute('data-url')
        } 
        
        if (parentLinkUrl && parentLinkUrl !== imageUrl){
            typeOfMenu = 'imageLinkMenu';
            hoveredLink = parentLinkUrl;
            hoveredLinkTitle = parentLink.textContent.trim();
            hoveredImageLink = imageUrl;
        } else {
            typeOfMenu = 'imageMenu';
            hoveredLink = imageUrl;
        }
    } else if (el.tagName == 'VIDEO' || el.tagName == 'AUDIO') {
        /// Html-5 player is hovered
        typeOfMenu = 'playerMenu';
        let fileLink = el.getAttribute('src');
        if (fileLink == null) {
            try {
                fileLink = el.querySelector('source').getAttribute('src');
            } catch (e) { if (configs.debugMode) console.log(e); }
        }
        hoveredLink = fileLink.replace('blob:', '');
    } else if (el.tagName == 'A' || el.parentNode.tagName == 'A') {
        /// Link is hovered
        typeOfMenu = 'linkMenu';
        hoveredLink = el.getAttribute('href') || el.getAttribute('data-url') || el.parentNode.getAttribute('href') || el.parentNode.getAttribute('data-url');
        hoveredLinkTitle = el.textContent.trim();
    } else {
        /// Maybe text selection is hovered?
        if (window.getSelection) {
            textSelection = window.getSelection();
        } else if (document.selection) {
            textSelection = document.selection.createRange();
        } else {
            textSelection = null;
        }

        if (configs.debugMode) console.log('text selection:');
        if (configs.debugMode) console.log(textSelection.toString());

        if (textSelection.toString() !== '' && isCoordinateWithinTextSelection(e.clientX, e.clientY)) {
            typeOfMenu = 'selectionMenu';
            hoveredLink = window.location.href;
            hoveredLinkTitle = null;
        } else {
            /// Show regular menu
            if (configs.openCircleOn == 'longLeftClick' && (el.tagName === "SELECT" || el.tagName === "BUTTON")) return;

            typeOfMenu = 'regularMenu';
            hoveredLink = configs.showLinkTooltipForPageItself ? window.location.href : null;
            hoveredLinkTitle = null;
        }
    }

    /// Show regular menu if no modifier key is pressed (when enabled in settings)
    if (configs.requireModifierForSpecificMenus && !e.shiftKey && !e.metaKey && !e.ctrlKey && !e.altKey) {
        /// Show regular menu
        if (configs.openCircleOn == 'longLeftClick' && (el.tagName === "SELECT" || el.tagName === "BUTTON")) return;

        typeOfMenu = 'regularMenu';
        hoveredLink = configs.showLinkTooltipForPageItself ? window.location.href : null;
        hoveredLinkTitle = null;
    }

    /// Behavior when no levels added or available
    let enabledLevelsCount = 0;
    for (var i = 0; i < configs[typeOfMenu].levels.length; i++) {
        if (configs[typeOfMenu].levels[i].enabled !== false) enabledLevelsCount += 1;
    }

    if (configs[typeOfMenu].levels == null || configs[typeOfMenu].levels.undefined || configs[typeOfMenu].levels.length == 0 || enabledLevelsCount == 0) {
        /// Fallback to regular menu

        if (configs.inactiveMenuBehavior == 'regularMenuFallback') {
            typeOfMenu = 'regularMenu';
            enabledLevelsCount = 0;
            for (var i = 0; i < configs[typeOfMenu].levels.length; i++) {
                if (configs[typeOfMenu].levels[i].enabled !== false) enabledLevelsCount += 1;
            }
            if (configs[typeOfMenu].levels == null || configs[typeOfMenu].levels.undefined || configs[typeOfMenu].levels.length == 0 || enabledLevelsCount == 0) {
                typeOfMenu = '';
            }
        } else {
            /// Do nothing
            typeOfMenu = '';
        }
    }

    if (configs.debugMode)
        try {
            if (configs.debugMode) console.log('hovered element:');
            if (configs.debugMode) console.log(el.tagName);
            if (configs.debugMode) console.log('parent element:');
            if (configs.debugMode) console.log(el.parentNode.tagName);
            if (configs.debugMode) console.log('child element:');
            if (configs.debugMode) console.log(el.firstChild);

        } catch (e) { if (configs.debugMode) console.log(e); }


    if (hoveredLink !== null) {
        ///  Attach current domain
        if (!hoveredLink.includes('://') && !hoveredLink.includes('data:image/') && !hoveredLink.includes('mailto:')) {
            if (hoveredLink[0] == '/' && hoveredLink[1] == '/') {
                /// special handling for links like "//lh3.googleusercontent.com/..." 
                hoveredLink = 'https:' + hoveredLink;
            } else {
                let splittedUrl = window.location.href.split('/');
                hoveredLink = splittedUrl[0] + '/' + splittedUrl[1] + '/' + splittedUrl[2] + hoveredLink;
            }
        }
    }

    /// Add outline to the hovered element
    if (configs.addBorderToHoveredElement && elementUnderCursor && typeOfMenu !== 'regularMenu'){
        document.documentElement.style.setProperty('--cmg-hovered-element-border-color', configs[typeOfMenu].levels[0].color ?? configs[typeOfMenu].color);
        elementUnderCursor.classList.add('cmg-hovered-element-border')
    }

    try {
        showCircle(e);
    } catch (err) { if (configs.debugMode) console.log(err); }
}

init();