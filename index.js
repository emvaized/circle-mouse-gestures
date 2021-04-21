/// Page listeners
document.addEventListener("contextmenu", function (e) {
    if (e.ctrlKey || leftClickIsHolded) return;

    e.preventDefault();
});

document.addEventListener("mousedown", function (e) {
    evt = e || window.event;

    if (e.ctrlKey) return;

    if ("buttons" in evt) {
        /// Right click
        if (evt.buttons == 2) {
            if (leftClickIsHolded) return;

            e.preventDefault();

            rocketButtonPressed = null;

            if (debugMode)
                console.log('Showing mouse gestures circle...');
            var el = document.elementFromPoint(e.clientX, e.clientY);

            if (el.tagName == 'IMG') {
                /// Image is hovered
                typeOfMenu = 'image-menu';
                hoveredLink = el.getAttribute('src');
            }
            else if (el.tagName == 'A' || el.parentNode.tagName == 'A'
                // || el.firstChild.tagName == 'A'
            ) {
                /// Link is hovered
                typeOfMenu = 'link-menu';
                hoveredLink = el.getAttribute('href') || el.getAttribute('data-url') || el.parentNode.getAttribute('href') || el.parentNode.getAttribute('data-url')
                    // || el.firstChild.getAttribute('href')
                    ;

                hoveredLinkTitle = el.textContent.trim();
            } else {
                typeOfMenu = 'regular-menu';
                hoveredLink = null;
                hoveredLinkTitle = null;
            }

            if (debugMode)
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

            showCircle(e);
        } else if (evt.buttons == 3) {
            rocketButtonPressed = 3;

            /// Left click
            console.log('Rocker gesture recognized!');
            console.log('circleIsShown:');
            console.log(circleIsShown);
            if (circleIsShown) {
                e.preventDefault();
                hideCircle();

                let actionToPerform = typeOfMenu == 'link-menu' ? linkRockerAction : typeOfMenu == 'image-menu' ? imageRockerAction : regularRockerAction;
                triggerButtonAction(actionToPerform);
                // chrome.runtime.sendMessage({ actionToDo: typeOfMenu == 'link-menu' ? linkRockerAction : typeOfMenu == 'image-menu' ? imageRockerAction : regularRockerAction })
            } else {
                leftClickIsHolded = true;
            }
        } else {
            if (debugMode)
                console.log('CMG recognized button action ' + evt.buttons.toString());
        }
    }
});

document.addEventListener("mouseup", function (e) {
    // e.preventDefault();
    hideCircle();

    evt = e || window.event;

    if ("buttons" in evt) {
        if (debugMode)
            console.log('Released button ' + evt.button.toString());
        /// Right click
        if (evt.buttons == 0) {
            leftClickIsHolded = false;
        }
    }

});

if (useMouseWheelGestures)
    document.addEventListener('wheel', checkScrollDirection);

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
