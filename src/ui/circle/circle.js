var totalCircleRadius;

function showCircle(e) {
    var evt = e || window.event;
    e.preventDefault();
    if ("buttons" in evt) {
        if (evt.buttons == 2) {
            preselectedButtons = {};
            totalCircleRadius = 0.0;

            for (var i = 0; i < configs[typeOfMenu].levels.length; i++) {
                if (configs[typeOfMenu].levels[i].enabled !== false)
                    totalCircleRadius += configs.gapBetweenCircles + (configs[typeOfMenu].levels[i].width ?? configs.circleRadius);
            }

            // if (configs.interactiveMenusBehavior == 'combine' || typeOfMenu == 'regularMenu') {
            // for (var i = 0; i < configs['regularMenu'].levels.length; i++) {
            //     if (configs['regularMenu'].levels[i].enabled !== false)
            //         totalCircleRadius += configs.gapBetweenCircles + (configs['regularMenu'].levels[i].width ?? configs.circleRadius);
            // }
            canvasRadius = totalCircleRadius * 2 + 2;
            // }
            // else {
            //     totalCircleRadius = configs.gapBetweenCircles + (configs[typeOfMenu].levels[0].width ?? configs.circleRadius);
            //     canvasRadius = totalCircleRadius * 2;
            // }

            if (typeOfMenu !== 'regularMenu' && configs.interactiveMenusBehavior == 'combine') {
                canvasRadius += (configs.interactiveCircleRadius + configs.gapBeforeInteractiveCircle) * 2;
            }

            leftCoord = e.clientX - (canvasRadius / 2) + 1;
            topCoord = e.clientY - (canvasRadius / 2) + window.scrollY + 1;

            circleIsShown = true;
            setCanvas(e);

            if (configs.dimBackground)
                showBackgroundDimmer();
        }
    }
}

function setCanvas(e) {
    circle = document.createElement('canvas');
    circle.setAttribute('class', 'cmg-circle-canvas');
    circle.setAttribute('width', `${canvasRadius}px !imporant`);
    circle.setAttribute('height', `${canvasRadius}px !imporant`);

    // circle.style.opacity = 0.0;
    circle.style.opacity = configs.circleOpacity;

    circle.style.transform = 'scale(0.0)';
    circle.style.transition = '';
    circle.style.transition = `opacity ${configs.animationDuration}ms ease-in-out, transform ${configs.animationDuration}ms ease-in-out`;
    circle.style.left = `${leftCoord}px`;
    circle.style.top = `${topCoord}px`;
    circle.style.visibility = 'visible';

    setTimeout(function () {
        circle.style.transform = 'scale(1.0)';
        // circle.style.opacity = configs.circleOpacity;
    }, 1);

    document.body.appendChild(circle);
    ctx = circle.getContext('2d');

    drawCircle(false, typeOfMenu);
    document.onmousemove = function (e) {
        try {
            drawCircle(e, typeOfMenu);
        } catch (error) { if (configs.debugMode) console.log(error); }
    }
}


function drawCircle(e, typeOfMenu, showIndexes = false, shouldCheckButtonsAvailability = true, shouldRespectBoundaries) {
    ctx.clearRect(0, 0, canvasRadius, canvasRadius);
    let totalRadius = totalCircleRadius;

    /// Draw outer circle with interactive buttons
    // if (typeOfMenu !== 'regularMenu') {
    //     /// Interactive menu replaces the regular menu
    //     if (configs.interactiveMenusBehavior == 'replace') {

    //         // let firstCircleRadius = configs[typeOfMenu].levels[0].width ?? configs.circleRadius;
    //         // let firstCircleInnerRadius = configs.innerCircleRadius;

    //         // let buttonsToShow = configs[typeOfMenu].levels[0].buttons;
    //         // drawCircleLevel(typeOfMenu, e,
    //         //     buttonsToShow,
    //         //     firstCircleRadius,
    //         //     firstCircleInnerRadius,
    //         //     // configs['regularMenu'].levels.length,
    //         //     0,
    //         //     false, showIndexes, shouldCheckButtonsAvailability);
    //         // return;
    //     } else {
    //         /// Interactive menu is added as outer level for regular circle
    //         drawCircleLevel(
    //             typeOfMenu, e,
    //             /// buttonsToShow
    //             configs[typeOfMenu].buttons,
    //             /// circleRadius
    //             totalRadius + configs.interactiveCircleRadius,
    //             /// innerCircleRadius
    //             totalRadius + configs.gapBeforeInteractiveCircle,
    //             ///level
    //             configs['regularMenu'].levels.length,
    //             /// shouldRespectBoundary
    //             false,
    //             showIndexes,
    //             shouldCheckButtonsAvailability

    //         );
    //     }
    // }

    let enabledLevelsCount = 0;

    for (var i = 0; i < configs[typeOfMenu].levels.length; i++) {
        if (configs[typeOfMenu].levels[i].enabled !== false) enabledLevelsCount += 1;
    }

    // let typeToDisplay = configs.interactiveMenusBehavior == 'combine' ? 'regularMenu' : typeOfMenu;

    for (var i = configs[typeOfMenu].levels.length - 1; i > -1; i--) {
        if (configs[typeOfMenu].levels[i].enabled !== false) {
            drawCircleLevel(
                typeOfMenu, e,
                /// buttonsToShow
                configs[typeOfMenu].levels[i].buttons,
                /// circleRadius
                totalRadius,
                /// innerCircleRadius
                i == 0 ? configs.innerCircleRadius :
                    totalRadius - (configs[typeOfMenu].levels[i].width ?? configs.circleRadius) + configs.gapBetweenCircles,
                ///level
                i,
                /// shouldRespectBoundary
                // typeOfMenu !== 'regularMenu' ? true : shouldRespectBoundaries || i !== configs['regularMenu'].levels.length - 1,
                typeOfMenu !== typeOfMenu ? true : shouldRespectBoundaries || i !== enabledLevelsCount - 1,
                showIndexes,
                shouldCheckButtonsAvailability
            );
            totalRadius -= configs[typeOfMenu].levels[i].width ?? configs.circleRadius;
        }
    }
}

function hideCircle() {
    try {
        document.onmousemove = null;
        circleIsShown = false;
        buttonsAvailability = {};

        if (hoveredLink !== null && linkTooltip !== null)
            hideLinkTooltip();

        if (rockerCircle !== null)
            hideRockerIcon(rocketButtonPressed !== null);

        if (configs.dimBackground) hideBackgroundDimmer();

        if (circle == null || circle == undefined) return;

        if (configs.circleHideAnimation)
            circle.style.opacity = 0.0;

        let anyButtonIsSelected = false;
        let selectedButton;
        let selectedLevel;

        let keys = Object.keys(selectedButtons);

        for (var i = 0; i < keys.length; i++) {
            let key = keys[i];
            if (selectedButtons[key] !== null && selectedButtons[key] !== undefined) {
                anyButtonIsSelected = true;
                selectedButton = selectedButtons[key];
                selectedLevel = key;
                break;
            }
        }

        if (rocketButtonPressed == null && anyButtonIsSelected == false) {
            if (configs.circleHideAnimation)
                circle.style.transform = 'scale(0.0)';
        }
        else {
            /// Some action was selected
            if (configs.circleHideAnimation)
                circle.style.transform = showRockerActionInCenter && rocketButtonPressed !== null ? 'scale(0.0)' : 'scale(1.5)';
            // circle.style.transform = 'scale(1.5)';

            if (rocketButtonPressed == null && typeOfMenu !== null) {
                var actionToPerform;

                if (selectedLevel == configs['regularMenu'].levels.length) {
                    let shownButtons = configs[typeOfMenu]['buttons'];
                    if (shownButtons == undefined) return;
                    actionToPerform = shownButtons[selectedButton].id;
                } else {
                    // let shownButtons = configs['regularMenu'].levels[selectedLevel]['buttons'];
                    let shownButtons = configs[typeOfMenu].levels[selectedLevel]['buttons'];
                    if (shownButtons == undefined) return;
                    actionToPerform = shownButtons[selectedButton].id;
                }

                if (configs.debugMode) {
                    if (configs.debugMode) console.log('action to perform by CMG:');
                    if (configs.debugMode) console.log(actionToPerform);
                }
                if (actionToPerform !== 'noAction')
                    triggerButtonAction(actionToPerform);
            }
        }

        setTimeout(function () {

            textSelection = null;

            if (circle !== null)
                circle.style.visibility = 'hidden';
            if (circle.parentNode !== null)
                circle.parentNode.removeChild(circle);
            circle = null;

            for (i in configs.regularMenu.levels) {
                selectedButtons[i] = null;
            }

        }, configs.circleHideAnimation ? configs.animationDuration : 0);
    } catch (e) { if (configs.debugMode) console.log(e); }
}


function showBackgroundDimmer() {
    backgroundDimmer = document.createElement('div');
    backgroundDimmer.setAttribute('style', ` z-index: 9999; width:${document.body.clientWidth}px;height: ${document.body.scrollHeight}px;  opacity: 0.0; transition: opacity ${configs.animationDuration}ms ease-in-out; position:absolute; background: black !important; top: 0px; left: 0px;`);
    document.body.appendChild(backgroundDimmer);

    setTimeout(function () {
        backgroundDimmer.style.opacity = configs.backgroundDimmerOpacity;
    }, 1);
}

function hideBackgroundDimmer() {
    if (backgroundDimmer !== null && backgroundDimmer !== undefined) {
        backgroundDimmer.style.opacity = 0.0;
        setTimeout(function () {
            backgroundDimmer.parentNode.removeChild(backgroundDimmer);
            backgroundDimmer = null;
        }, configs.animationDuration);
    }
}


