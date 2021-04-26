function init() {
    loadUserConfigs(function () {
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
            console.log('Pushed button ' + evt.button.toString());

        if ("buttons" in evt) {
            /// Right click
            if (evt.buttons == 2) {
                if (leftClickIsHolded) return;

                if (circle !== null && circle !== undefined) {
                    hideCircle();
                    console.log('circle:');
                    console.log(circle);
                    return;
                }

                e.preventDefault();

                rocketButtonPressed = null;

                if (configs.debugMode)
                    console.log('Showing mouse gestures circle...');
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
                    typeOfMenu = 'regularMenu';
                    // hoveredLink = null;
                    hoveredLink = configs.showLinkTooltipForPageItself ? window.location.href : null;
                    hoveredLinkTitle = null;
                }

                if (configs.debugMode)
                    try {
                        console.log('hovered element:');
                        console.log(el.tagName);
                        console.log('parent element:');
                        console.log(el.parentNode.tagName);

                    } catch (e) { console.log(e); }


                if (hoveredLink !== null) {
                    ///  Attach current domain
                    if (!hoveredLink.includes('://')) {
                        let splittedUrl = window.location.href.split('/');
                        hoveredLink = splittedUrl[0] + '/' + splittedUrl[1] + '/' + splittedUrl[2] + '/' + hoveredLink;
                    }
                }

                try {
                    showCircle(e);
                } catch (err) { if (configs.debugMode) console.log(err); }
            } else if (evt.buttons == 3) {
                rocketButtonPressed = 3;

                /// Left click
                console.log('Rocker gesture recognized!');
                console.log('circleIsShown:');
                console.log(circleIsShown);
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
                    console.log('CMG recognized button action ' + evt.buttons.toString());
            }
        }
    });

    document.addEventListener("mouseup", function (e) {
        // e.preventDefault();
        // hideCircle();

        evt = e || window.event;



        if ("buttons" in evt) {
            if (configs.debugMode)
                console.log('Released button ' + evt.button.toString());
            /// Right click
            if (evt.button == 0) {
                // console.log('Selected button is:' + selectedButton.toString());
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

    if (configs.useMouseWheelGestures)
        document.addEventListener('wheel', checkScrollDirection);
}

function checkScrollDirection(event) {
    if (circleIsShown == false) return;
    if (checkScrollDirectionIsUp(event)) {
        triggerButtonAction(mouseWheelUpAction);
    } else {
        triggerButtonAction(mouseWheelDownAction);
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