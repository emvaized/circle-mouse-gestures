var totalCircleRadius;
let enabledLevelsCount = 0;

function showCircle(e) {
    var evt = e || window.event;
    e.preventDefault();
    if ("buttons" in evt) {
        if (evt.buttons == 2) {
            preselectedButtons = {};
            totalCircleRadius = 0.0;

            for (var i = 0; i < configs[typeOfMenu].levels.length; i++) {

                /// Calculate total circle radius with only enabled levels
                if (configs[typeOfMenu].levels[i].enabled !== false) {
                    totalCircleRadius += configs.gapBetweenCircles + (configs[typeOfMenu].levels[i].width ?? configs.circleRadius);
                    enabledLevelsCount += 1;
                }
            }

            canvasRadius = totalCircleRadius * 2 + 2;

            if (configs.addCircleShadow)
                canvasRadius *= 1.2;

            if (typeOfMenu !== 'regularMenu' && configs.interactiveMenusBehavior == 'combine') {
                canvasRadius += (configs.interactiveCircleRadius + configs.gapBeforeInteractiveCircle) * 2;
            }

            leftCoord = e.clientX - (canvasRadius / 2) + 1;
            topCoord = e.clientY - (canvasRadius / 2) + window.scrollY + 1;

            topCoord = e.pageY - (canvasRadius / 2) - window.scrollY + 1;
            // topCoord = e.pageY - (canvasRadius / 2) + 1;

            circleIsShown = true;
            setCanvas();

            if (configs.dimBackground)
                showBackgroundDimmer();
        }
    }
}

function setCanvas() {

    if (configs.debugMode) console.log('setting up canvas...');

    circle = document.createElement('canvas');
    circle.setAttribute('class', 'cmg-circle-canvas');
    circle.setAttribute('width', `${canvasRadius}px !imporant`);
    circle.setAttribute('height', `${canvasRadius}px !imporant`);

    circle.style.opacity = 0.0;
    circle.style.transform = 'scale(0.0)';
    circle.style.transition = `opacity ${configs.animationDuration}ms ease-out, transform ${configs.animationDuration}ms ease-out`;
    circle.style.visibility = 'visible';
    circle.style.left = `${leftCoord}px`;
    circle.style.top = `${topCoord}px`;

    setTimeout(function () {
        circle.style.transform = 'scale(1.0)';
        circle.style.opacity = configs.circleOpacity;
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

    /// Mouse coordinates calculations
    let mx, my;
    if (e === false) {
        mx = (canvasRadius / 2);
        my = (canvasRadius / 2);
    } else {
        mx = e.pageX - leftCoord;
        // my = e.pageY - topCoord;
        my = e.pageY - topCoord - window.scrollY;
    }

    let mangle = (-Math.atan2(mx - (canvasRadius / 2), my - (canvasRadius / 2)) + Math.PI * 2.5) % (Math.PI * 2);
    let mradius = Math.sqrt(Math.pow(mx - (canvasRadius / 2), 2) + Math.pow(my - (canvasRadius / 2), 2));

    /// Determine if it's needed to redraw circle
    let shouldRedraw = false;

    // let selectedButtonsBeforeCheck = selectedButtons;
    if (e == false) shouldRedraw = true;
    else {

        if (mradius < configs.innerCircleRadius) {
            if (Object.keys(selectedButtons).length !== 0) {
                selectedButtons = {};
                shouldRedraw = true;
            }

        } else {
            let totalRadius1 = totalCircleRadius;

            // for (var level = 0; level < configs[typeOfMenu].levels.length; level++) {
            for (let level = configs[typeOfMenu].levels.length - 1; level > -1; level--) {
                let segmentsCount = configs[typeOfMenu].levels[level].buttons.length;

                for (let i = 0; i < segmentsCount; i++) {

                    let angle = (segmentsCount % 2 == 0.0 ?
                        (-Math.PI / segmentsCount) :
                        (-Math.PI / segmentsCount) / 2) + i * (Math.PI / (segmentsCount / 2));

                    // if (mradius > totalCircleRadius && level !== configs[typeOfMenu].levels.length - 1) continue;
                    if (mradius > totalRadius1 && level !== configs[typeOfMenu].levels.length - 1) continue;

                    if (mradius > (level == 0 ? configs.innerCircleRadius : (configs[typeOfMenu].levels[level - 1].width ?? configs.circleRadius)))
                        if (((mangle > angle && mangle < (angle + Math.PI / (segmentsCount / 2)))
                            || (mangle > (Math.PI * (segmentsCount * 2 - (segmentsCount % 2 == 0.0 ? 1 : 0.5)) / segmentsCount) && i == 0))
                        ) {

                            if (selectedButtons[level] !== i) {

                                selectedButtons = {};
                                selectedButtons[level] = i;
                                shouldRedraw = true;
                                break;
                            }
                        }
                }
                totalRadius1 -= configs[typeOfMenu].levels[level].width ?? configs.circleRadius;
            }
        }
    }

    if (shouldRedraw) {
        ctx.clearRect(0, 0, canvasRadius, canvasRadius);

        if (configs.debugMode)
            console.log('CMG circle redrawn');

        let totalRadius = totalCircleRadius;

        for (var i = configs[typeOfMenu].levels.length - 1; i > -1; i--) {
            if (configs[typeOfMenu].levels[i].enabled !== false) {

                drawCircleLevel(
                    typeOfMenu, e,
                    mangle, mradius,
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


                /// Add shadow
                if (configs.addCircleShadow) {
                    let shadowOffsetDy = 5;
                    ctx.save();
                    ctx.beginPath();
                    ctx.globalCompositeOperation = 'destination-over';
                    ctx.fillStyle = `rgba(0,0,0,${configs.circleShadowOpacity})`

                    ctx.arc(canvasRadius / 2, canvasRadius / 2 + shadowOffsetDy, totalRadius + 2, 0, 2 * Math.PI, false);
                    ctx.filter = 'blur(12px)';
                    ctx.fill();

                    ctx.restore();

                    ctx.save();
                    ctx.beginPath();
                    ctx.globalCompositeOperation = 'destination-out';
                    ctx.arc(canvasRadius / 2, canvasRadius / 2, (i == 0 ? configs.innerCircleRadius :
                        totalRadius - (configs[typeOfMenu].levels[i].width ?? configs.circleRadius) + configs.gapBetweenCircles) * 0.75, 0, 2 * Math.PI, false);
                    ctx.filter = 'blur(6px)';
                    ctx.fill();
                    ctx.restore();
                }

                totalRadius -= configs[typeOfMenu].levels[i].width ?? configs.circleRadius;
            }
        }
    }
}

function hideCircle() {
    try {
        if (circle == null || circle == undefined) return;

        if (configs.circleHideAnimation)
            circle.style.opacity = 0.0;

        circleIsShown = false;
        buttonsAvailability = {};
        buttonsStatuses = {};
        document.onmousemove = null;

        if (hoveredLink !== null && linkTooltip !== null)
            hideLinkTooltip();

        if (rockerCircle !== null)
            hideRockerIcon(rocketButtonPressed !== null);

        if (configs.dimBackground) hideBackgroundDimmer();

        circle.style.pointerEvents = 'none';

        let selectedKeys = Object.keys(selectedButtons);

        // if (rocketButtonPressed == null && anyButtonIsSelected == false) {
        if (rocketButtonPressed == null && selectedKeys.length == 0) {
            if (configs.circleHideAnimation)
                circle.style.transform = 'scale(0.0)';
        }
        else {
            /// Some action was selected
            if (configs.circleHideAnimation == false)
                circle.style.transition = '';

            console.log('circle transition:');
            console.log(circle.style.transition);

            circle.style.transform = showRockerActionInCenter && rocketButtonPressed !== null ? 'scale(0.0)' : 'scale(1.5)';

            let selectedButton;
            let selectedLevel;

            for (var i = 0; i < selectedKeys.length; i++) {
                let key = selectedKeys[i];
                if (selectedButtons[key] !== null && selectedButtons[key] !== undefined) {
                    selectedButton = selectedButtons[key];
                    selectedLevel = key;
                    break;
                }
            }

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

                if (configs.storeCurrentScrollPosition && (actionToPerform == 'scrollToTop' || actionToPerform == 'scrollToBottom')) {
                    let previousPosition = previousScrollPosition[actionToPerform];
                    if (previousPosition !== null && previousPosition !== undefined) {
                        if (configs.debugMode) {
                            console.log('found previous scroll position:');
                            console.log(previousPosition);
                        }
                        actionToPerform = actionToPerform == 'scrollToBottom' ? 'scrollBackBottom' : 'scrollBackTop';
                    }
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
            if (circle !== null && circle.parentNode !== null)
                circle.parentNode.removeChild(circle);
            circle = null;

            for (i in configs.regularMenu.levels) {
                selectedButtons[i] = null;
            }

        }, configs.circleHideAnimation ? configs.animationDuration : 0);
    } catch (e) { if (configs.debugMode) console.log(e); }
}


// function showBackgroundDimmer() {
//     backgroundDimmer = document.createElement('div');
//     backgroundDimmer.setAttribute('style', ` z-index: 9999; width:${document.body.clientWidth}px;height: ${document.body.scrollHeight}px;  opacity: 0.0; transition: opacity ${configs.animationDuration}ms ease-in-out; position:absolute; background: black !important; top: 0px; left: 0px;`);
//     document.body.appendChild(backgroundDimmer);

//     setTimeout(function () {
//         backgroundDimmer.style.opacity = configs.backgroundDimmerOpacity;
//     }, 1);
// }

// function hideBackgroundDimmer() {
//     if (backgroundDimmer !== null && backgroundDimmer !== undefined) {
//         backgroundDimmer.style.opacity = 0.0;
//         setTimeout(function () {
//             backgroundDimmer.parentNode.removeChild(backgroundDimmer);
//             backgroundDimmer = null;
//         }, configs.animationDuration);
//     }
// }


