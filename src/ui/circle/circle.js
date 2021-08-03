var totalCircleRadius;
let enabledLevelsCount;

function showCircle(e) {
    var evt = e || window.event;
    e.preventDefault();
    if ("buttons" in evt) {
        console.log(evt.button);
        // if (evt.buttons == 2) {
        if ((configs.openCircleOn == 'rightClick' && evt.button == 2) || (configs.openCircleOn == 'longLeftClick' && evt.button == 0)) {
            preselectedButtons = {};
            totalCircleRadius = 0.0;
            enabledLevelsCount = 0;

            for (let i = 0, len = configs[typeOfMenu].levels.length; i < len; i++) {

                let level = configs[typeOfMenu].levels[i];

                /// Calculate total circle radius with only enabled levels
                if (level.enabled !== false) {
                    totalCircleRadius += configs.gapBetweenCircles + (level.width ?? configs.circleRadius);
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
    circle.className = 'cmg-circle-canvas';
    circle.setAttribute('width', `${canvasRadius}px !imporant`);
    circle.setAttribute('height', `${canvasRadius}px !imporant`);

    circle.style.opacity = 0.0;
    circle.style.transform = 'scale(0.0)';
    circle.style.transition = `opacity ${configs.animationDuration}ms ease, transform ${configs.animationDuration}ms ease`;
    circle.style.visibility = 'visible';
    circle.style.left = `${leftCoord}px`;
    circle.style.top = `${topCoord}px`;

    setTimeout(function () {
        circle.style.transform = 'scale(1.0)';
        circle.style.opacity = configs.circleOpacity;
    }, 2);

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
        my = e.pageY - topCoord - window.scrollY;
    }

    let mangle = (-Math.atan2(mx - (canvasRadius / 2), my - (canvasRadius / 2)) + Math.PI * 2.5) % (Math.PI * 2);
    let mradius = Math.sqrt(Math.pow(mx - (canvasRadius / 2), 2) + Math.pow(my - (canvasRadius / 2), 2));

    /// Toggle rocker icon view
    if (showRockerActionInCenter && scaleDownRockerIconWhenNonHovered && rockerCircle !== null && rockerCircle !== undefined) {
        let rockerIconText = rockerCircle.querySelector('#cmg-rocker-icon-text');
        if (mradius < innerCircleRadius) {
            rockerIconText.style.transform = 'scale(1.0)';
        } else {
            rockerIconText.style.transform = 'scale(0.75)';
        }
    }

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

            let levelsLength = configs[typeOfMenu].levels.length;

            // for (var level = 0; level < levelsLength; level++) {
            for (let level = levelsLength - 1; level > -1; level--) {

                let levelData = configs[typeOfMenu].levels[level],
                    segmentsCount = levelData.buttons.length;

                if (levelData.enabled !== false) {
                    for (let i = 0; i < segmentsCount; i++) {

                        let angle = (segmentsCount % 2 == 0.0 ?
                            (-Math.PI / segmentsCount) :
                            (-Math.PI / segmentsCount) / 2) + i * (Math.PI / (segmentsCount / 2));

                        // if (mradius > totalRadius1 && level !== levelsLength - 1) continue;
                        if (mradius > totalRadius1 && level !== enabledLevelsCount - 1) continue;

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

                    totalRadius1 -= levelData.width ?? configs.circleRadius;
                }

            }
        }
    }

    if (shouldRedraw) {
        ctx.clearRect(0, 0, canvasRadius, canvasRadius);

        if (configs.debugMode)
            console.log('CMG circle redrawn');

        let totalRadius = totalCircleRadius;

        for (let i = configs[typeOfMenu].levels.length - 1; i > -1; i--) {
            let levelData = configs[typeOfMenu].levels[i];
            if (levelData.enabled !== false) {

                drawCircleLevel(
                    typeOfMenu, e,
                    mangle, mradius,
                    /// buttonsToShow
                    levelData.buttons,
                    /// circleRadius
                    totalRadius,
                    /// innerCircleRadius
                    i == 0 ? configs.innerCircleRadius :
                        totalRadius - (levelData.width ?? configs.circleRadius) + configs.gapBetweenCircles,
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
                        totalRadius - (levelData.width ?? configs.circleRadius) + configs.gapBetweenCircles) * 0.75, 0, 2 * Math.PI, false);
                    ctx.filter = 'blur(6px)';
                    ctx.fill();
                    ctx.restore();
                }

                totalRadius -= levelData.width ?? configs.circleRadius;
            }
        }
    }
}

function hideCircle() {
    try {
        if (circle == null || circle == undefined) return;

        if (configs.circleHideAnimation)
            circle.style.opacity = 0.0;

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

            circle.style.transform = showRockerActionInCenter && rocketButtonPressed !== null ? 'scale(0.0)' : 'scale(1.5)';

            let selectedButton;
            let selectedLevel;

            for (let i = 0, keysLength = selectedKeys.length; i < keysLength; i++) {
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
                    console.log('action to perform by CMG:');
                    console.log(actionToPerform);
                }
                if (actionToPerform !== 'noAction')
                    triggerButtonAction(actionToPerform);
            }
        }

        setTimeout(function () {

            textSelection = null;

            if (circle !== null && circle.parentNode !== null) {
                circle.parentNode.removeChild(circle);
                circle = null;
            }

            // for (let i = 0, l = configs.regularMenu.levels.length; i < l; i++) {
            //     selectedButtons[i] = null;
            // }
            selectedButtons = {};

        }, configs.circleHideAnimation ? configs.animationDuration : 0);


        if (hoveredLink !== null && linkTooltip !== null)
            hideLinkTooltip();

        if (rockerCircle !== null)
            hideRockerIcon(rocketButtonPressed !== null);

        /// Reset variables
        circleIsShown = false;
        buttonsAvailability = {};
        buttonsStatuses = {};
        document.onmousemove = null;
        scrollingElementUnderCursor = null;

    } catch (e) { if (configs.debugMode) console.log(e); }
}