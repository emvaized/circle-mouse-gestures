function init() {
    loadUserConfigs(function () {
        if (configs.cmgEnabled)
            setPageListeners();
    })
}

function setPageListeners() {
    /// Page listeners
    document.addEventListener("contextmenu", function (e) {
        if (e.ctrlKey || leftClickIsHolded) return;

        e.preventDefault();
    });

    document.addEventListener("mousedown", function (e) {
        evt = e || window.event;

        if (e.ctrlKey) return;

        if (configs.debugMode)
            if (configs.debugMode) console.log('Pushed button ' + evt.button.toString());

        if ("buttons" in evt) {
            /// Right click
            if (evt.buttons == 2) {
                if (leftClickIsHolded) return;

                if (circle !== null && circle !== undefined) {
                    hideCircle();
                    return;
                }

                e.preventDefault();

                selectedButtons = {};
                rocketButtonPressed = null;

                if (configs.debugMode)
                    if (configs.debugMode) console.log('Showing mouse gestures circle...');
                var el = document.elementFromPoint(e.clientX, e.clientY);

                if (el.tagName == 'IMG') {
                    /// Image is hovered
                    typeOfMenu = 'imageMenu';
                    hoveredLink = el.getAttribute('src');
                }
                else if (el.tagName == 'A' || el.parentNode.tagName == 'A'
                    // || el.firstChild.tagName == 'A'
                ) {
                    /// Link is hovered
                    typeOfMenu = 'linkMenu';
                    hoveredLink = el.getAttribute('href') || el.getAttribute('data-url') || el.parentNode.getAttribute('href') || el.parentNode.getAttribute('data-url')
                        // || el.firstChild.getAttribute('href')
                        ;

                    hoveredLinkTitle = el.textContent.trim();
                } else {

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
                        typeOfMenu = 'regularMenu';
                        hoveredLink = configs.showLinkTooltipForPageItself ? window.location.href : null;
                        hoveredLinkTitle = null;
                    }
                }

                if (configs.debugMode)
                    try {
                        if (configs.debugMode) console.log('hovered element:');
                        if (configs.debugMode) console.log(el.tagName);
                        if (configs.debugMode) console.log('parent element:');
                        if (configs.debugMode) console.log(el.parentNode.tagName);

                    } catch (e) { if (configs.debugMode) console.log(e); }


                if (hoveredLink !== null) {
                    ///  Attach current domain
                    if (!hoveredLink.includes('://')) {
                        let splittedUrl = window.location.href.split('/');
                        hoveredLink = splittedUrl[0] + '/' + splittedUrl[1] + '/' + splittedUrl[2] + '/' + hoveredLink;
                    }
                }

                try {
                    showCircle(e);
                } catch (err) { if (configs.debugMode) if (configs.debugMode) console.log(err); }
            } else if (evt.buttons == 3) {
                rocketButtonPressed = 3;

                /// Left click
                if (configs.debugMode) console.log('Rocker gesture recognized!');
                if (configs.debugMode) console.log('circleIsShown:');
                if (configs.debugMode) console.log(circleIsShown);
                if (circleIsShown) {
                    e.preventDefault();
                    hideCircle();

                    let actionToPerform = configs[typeOfMenu]['rockerAction'];
                    triggerButtonAction(actionToPerform);
                } else {
                    leftClickIsHolded = true;
                }
            } else {
                if (configs.debugMode)
                    if (configs.debugMode) console.log('CMG recognized button action ' + evt.buttons.toString());
            }
        }
    });

    document.addEventListener("mouseup", function (e) {
        // e.preventDefault();
        // hideCircle();

        evt = e || window.event;

        if ("buttons" in evt) {
            if (configs.debugMode)
                if (configs.debugMode) console.log('Released button ' + evt.button.toString());
            /// Right click
            if (evt.button == 0) {
                // if (configs.debugMode) console.log('Selected button is:' + selectedButton.toString());
                leftClickIsHolded = false;
                hideCircle();
            } else if (evt.button == 2) {

                let anyButtonIsSelected = false;
                let keys = Object.keys(selectedButtons);
                for (var i = 0; i < keys.length; i++) {
                    let key = keys[i];
                    if (selectedButtons[key] !== null && selectedButtons[key] !== undefined) {
                        anyButtonIsSelected = true;
                        break;
                    }
                }

                // if (selectedButton == null && selectedButtonSecondLevel == null) {
                if (anyButtonIsSelected == false) {
                    /// Leave circle open (like a context menu), or hide it
                    if (configs.hideCircleIfNoActionSelected)
                        hideCircle();

                } else hideCircle();
            }
        }

    });

    // if (configs.useMouseWheelGestures)
    document.addEventListener('wheel', checkScrollDirection);
}

function checkScrollDirection(event) {
    if (circleIsShown == false) return;

    if (checkScrollDirectionIsUp(event)) {
        triggerButtonAction(configs[typeOfMenu].mouseWheelUpAction);
    } else {
        triggerButtonAction(configs[typeOfMenu].mouseWheelDownAction);
    }
    hideCircle();
}

function checkScrollDirectionIsUp(event) {
    if (event.wheelDelta) {
        return event.wheelDelta > 0;
    }
    return event.deltaY < 0;
}

init();