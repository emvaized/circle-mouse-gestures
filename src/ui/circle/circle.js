var totalCircleRadius;
let enabledLevelsCount;
let deltaX = 0, deltaY = 0;

function showCircle(e) {
    const evt = e || window.event;
    evt.preventDefault();
    if ("buttons" in evt) {
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

    // circle.style.left = `${leftCoord}px`;
    // circle.style.top = `${topCoord}px`;
    circle.style.opacity = 0.0;
    circle.style.transform = 'scale(0.0)';
    circle.style.transition = `transform ${configs.animationDuration}ms ease-out, opacity ${configs.animationDuration}ms ease-out`;

    circleShownInCorner = false;
    showMousePointer = false;

    if (configs.circleLocation == 'alwaysCorner') {
        circleShownInCorner = true;
    }
    else if (configs.circleLocation == 'cursorCorner') {
        if (leftCoord < 0 || topCoord < 0 || (leftCoord + canvasRadius) > window.innerWidth || (topCoord + canvasRadius) > window.innerHeight)
            circleShownInCorner = true;
    }

    /// Handle off-screen case
    if (circleShownInCorner) {
        realLeftCoord = window.innerWidth - canvasRadius - cornerSidePadding;
        realTopCoord = window.innerHeight - canvasRadius - cornerSidePadding;
        // circle.style.left = `${window.innerWidth - canvasRadius - cornerSidePadding}px`;
        // circle.style.top = `${window.innerHeight - canvasRadius - cornerSidePadding}px`;
        circleShownInCorner = true;
        showMousePointer = true;

    } else {
        // circle.style.left = `${leftCoord}px`;
        // circle.style.top = `${topCoord}px`;

        realLeftCoord = leftCoord;
        realTopCoord = topCoord;

        if (configs.circleLocation == 'cursorOverflow') {
            if (leftCoord < 0) {
                realLeftCoord = 0; showMousePointer = true;
            } else if ((leftCoord + canvasRadius) > window.innerWidth) {
                realLeftCoord = leftCoord - ((leftCoord + canvasRadius) - window.innerWidth);
                showMousePointer = true;
            }

            if (topCoord < 0) {
                realTopCoord = 0; showMousePointer = true;
            } else if ((topCoord + canvasRadius) > window.innerHeight) {
                realTopCoord = topCoord - ((topCoord + canvasRadius) - window.innerHeight);
                showMousePointer = true;
            }
        }
    }

    circle.style.left = `${realLeftCoord}px`;
    circle.style.top = `${realTopCoord}px`;

    if (showMousePointer) {
        /// create mouse pointer
        cornerMousePointer = document.createElement('div');
        cornerMousePointer.setAttribute('id', 'cmg-corner-mouse-pointer');
        cornerMousePointer.style.border = `1.5px solid ${configs[typeOfMenu].color}`;
        deltaX = 0; deltaY = 0;
        cornerMousePointer.style.transform = `translate(${(realLeftCoord + (canvasRadius / 2)) + deltaX}px, ${(realTopCoord + (canvasRadius / 2)) + deltaY}px)`
        document.body.appendChild(cornerMousePointer);
    }

    ctx = circle.getContext('2d');
    drawCircle(false, typeOfMenu);
    document.body.appendChild(circle);

    setTimeout(function () {
        // circle.classList.add('cmg-circle-visible');
        circle.style.opacity = configs.circleOpacity;
        circle.style.transform = 'scale(1.0)';
    }, 3);

    document.addEventListener('mousemove', mouseMoveListener);
}

function mouseMoveListener(e) {
    try {
        drawCircle(e, typeOfMenu);
    } catch (error) { if (configs.debugMode) console.log(error); }

    if (showMousePointer) {
        deltaX += e.movementX;
        deltaY += e.movementY;
        cornerMousePointer = document.getElementById('cmg-corner-mouse-pointer');
        if (cornerMousePointer) {
            cornerMousePointer.style.transform = `translate(${(realLeftCoord + (canvasRadius / 2)) + deltaX}px, ${(realTopCoord + (canvasRadius / 2)) + deltaY}px)`
        }
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

    const levelsLength = configs[typeOfMenu].levels.length;

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


            for (let level = levelsLength - 1; level > -1; level--) {

                let levelData = configs[typeOfMenu].levels[level],
                    segmentsCount = levelData.buttons.length;

                if (levelData.enabled !== false) {
                    for (let i = 0; i < segmentsCount; i++) {

                        let angle = (segmentsCount % 2 == 0.0 ?
                            (-Math.PI / segmentsCount) :
                            (-Math.PI / segmentsCount) / 2) + i * (Math.PI / (segmentsCount / 2));

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

        hideHintTooltip();

        if (configs.debugMode)
            console.log('CMG circle redrawn');

        let totalRadius = totalCircleRadius;

        for (let i = levelsLength - 1; i > -1; i--) {
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

        if (configs.circleHideAnimation) {
            circle.style.opacity = 0.0;
            circle.style.pointerEvents = 'none';
            // circle.classList.remove('cmg-circle-visible');
        }

        const selectedKeys = Object.keys(selectedButtons);

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

            if (!showRockerActionInCenter && !rocketButtonPressed)
                // circle.classList.add('cmg-circle-scale-up');
                circle.style.transform = 'scale(1.35)';

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
                let actionToPerform;

                if (selectedLevel == configs['regularMenu'].levels.length) {
                    const shownButtons = configs[typeOfMenu]['buttons'];
                    if (shownButtons == undefined) return;
                    actionToPerform = shownButtons[selectedButton].id;
                } else {
                    const shownButtons = configs[typeOfMenu].levels[selectedLevel]['buttons'];
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

        if (configs.dimBackground) hideBackgroundDimmer();

        setTimeout(function () {
            textSelection = null;

            if (circle !== null && circle.parentNode !== null) {
                // circle.parentNode.removeChild(circle);
                circle.remove();
                circle = null;
            }

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
        document.removeEventListener('mousemove', mouseMoveListener);
        scrollingElementUnderCursor = null;

        hideHintTooltip();
        if (showMousePointer) cornerMousePointer.remove();

    } catch (e) { if (configs.debugMode) console.log(e); }
}