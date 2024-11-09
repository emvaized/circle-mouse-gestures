var totalCircleRadius;
let enabledLevelsCount;
let deltaX = 0, deltaY = 0;

function showCircle(e) {
    const evt = e || window.event;
    evt.preventDefault();
    if ("buttons" in evt) {
        if ((configs.openCircleOn == 'rightClick' && evt.button == 2) || (configs.openCircleOn == 'longLeftClick' && evt.button == 0)) {
            if (e.clientX == 0 && e.clientY == 0) return;

            preselectedButtons = {};

            totalCircleRadius = 0.0;
            enabledLevelsCount = 0;

            for (let i = 0, len = configs[typeOfMenu].levels.length; i < len; i++) {
                let level = configs[typeOfMenu].levels[i];

                /// Calculate total circle radius with only enabled levels
                if (level.enabled !== false) {
                    totalCircleRadius += (level.levelGap ?? configs.gapBetweenCircles) + (level.width ?? configs.circleRadius);
                    enabledLevelsCount += 1;
                }
            }

            canvasRadius = totalCircleRadius * 2 + 2;

            if (configs.addCircleShadow)
                canvasRadius *= 1.2;

            if (typeOfMenu !== 'regularMenu' && configs.interactiveMenusBehavior == 'combine')
                canvasRadius += (configs.interactiveCircleRadius + configs.gapBeforeInteractiveCircle) * 2;

            leftCoord = e.clientX - (canvasRadius / 2) + 1;
            // topCoord = e.clientY - (canvasRadius / 2) + window.scrollY + 1;
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

    circle.setAttribute('width', `${canvasRadius}px !imporant`);
    circle.setAttribute('height', `${canvasRadius}px !imporant`);
    circle.className = 'cmg-circle-canvas';

    /// Calculate coordinates to show + detect off-screen
    circleShownInCorner = false;
    showMousePointer = false;

    if (configs.circleLocation == 'alwaysCorner') {
        circleShownInCorner = true;
    }
    else if (configs.circleLocation == 'cursorCorner') {
        if (leftCoord < 0 || topCoord < 0 || (leftCoord + canvasRadius) > window.innerWidth || (topCoord + canvasRadius) > window.innerHeight)
            circleShownInCorner = true;
    }

    if (circleShownInCorner) {
        realLeftCoord = window.innerWidth - canvasRadius - cornerSidePadding;
        realTopCoord = window.innerHeight - canvasRadius - cornerSidePadding;
        circleShownInCorner = true;
        showMousePointer = true;
    } else {
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

    if (!configs.addGhostPointer) showMousePointer = false;

    circle.style.left = `${realLeftCoord}px`;
    circle.style.top = `${realTopCoord}px`;

    /// Create ghost mouse pointer (when circle is not under cursor)
    if (showMousePointer) {
        cornerMousePointer = document.createElement('div');
        cornerMousePointer.setAttribute('id', 'cmg-corner-mouse-pointer');
        cornerMousePointer.style.border = `1.5px solid ${configs[typeOfMenu].color}`;
        deltaX = 0; deltaY = 0;
        cornerMousePointer.style.transform = `translate(${(realLeftCoord + (canvasRadius / 2)) - ghostMousePointerRadius}px, ${(realTopCoord + (canvasRadius / 2)) - ghostMousePointerRadius}px)`
        document.body.appendChild(cornerMousePointer);
    }

    /// Add blur
    if (configs.addBlur) {
        blurCircle = document.createElement('div');
        blurCircle.className = 'cmg-blur-circle';

        blurCircle.setAttribute('style', `pointer-events: none !important;
        z-index: 9999998 !important; 
        position: fixed;
        border-radius: 50%;
        left: ${realLeftCoord}px;
        top: ${realTopCoord}px;
        width: ${canvasRadius}px;
        height: ${canvasRadius}px;
        backdrop-filter: blur(${configs.blurRadius}px) !important;
        -webkit-backdrop-filter: blur(${configs.blurRadius}px) !important;`);

        // let precision = 64;
        let precision = 32;
        // let radius = configs.innerCircleRadius / 3;
        let radius = configs.innerCircleRadius / canvasRadius * 100;
        let c = [...Array(precision)].map((_, i) => {
            let a = -i / (precision - 1) * Math.PI * 2;
            let x = Math.cos(a) * radius + 50;
            let y = Math.sin(a) * radius + 50;
            return `${x}% ${y}%`
        })

        blurCircle.style.clipPath =
            `polygon(100% 50%, 100% 100%, 0 100%, 0 0, 100% 0, 100% 50%, ${c.join(',')})`;

        document.body.appendChild(blurCircle);
    }

    /// Set initial stylings
    switch (configs.showCircleAnimation) {
        case 'noAnimation': {
            circle.style.opacity = configs.circleOpacity;
            circle.style.transform = 'scale(1.0)';

            if (configs.addBlur) {
                blurCircle.style.opacity = 1.0;
                blurCircle.style.transform = 'scale(1.0)';
            }
        } break;
        case 'fade': {
            circle.style.opacity = 0.0;
            circle.style.transform = 'scale(1.0)';

            if (configs.addBlur) {
                blurCircle.style.opacity = 0.0;
                blurCircle.style.transform = 'scale(1.0)';
            }
        } break;
        case 'scale': {
            circle.style.opacity = 0.0;
            circle.style.transform = 'scale(0.1)';

            if (configs.addBlur) {
                blurCircle.style.opacity = 0.0;
                blurCircle.style.transform = 'scale(0.1)';
            }
        } break;
    }

    circle.style.transition = `transform ${configs.animationDuration}ms ease-out, opacity ${configs.animationDuration}ms ease-out`;
    if (configs.addBlur)
        blurCircle.style.transition = `transform ${configs.animationDuration}ms ease-out, opacity ${configs.animationDuration}ms ease-out`;

    ctx = circle.getContext('2d');
    drawCircle(false, typeOfMenu);
    document.body.appendChild(circle);

    /// Trigger show up transition
    setTimeout(function () {
        switch (configs.showCircleAnimation) {
            case 'noAnimation': { } break;
            case 'fade': {
                circle.style.opacity = configs.circleOpacity;
                if (configs.addBlur) blurCircle.style.opacity = 1.0;
            } break;
            case 'scale': {
                circle.style.opacity = configs.circleOpacity;
                circle.style.transform = 'scale(1.0)';
                if (configs.addBlur) {
                    blurCircle.style.opacity = 1.0;
                    blurCircle.style.transform = 'scale(1.0)';
                }
            } break;
        }
    }, 5);

    /// Attach mouse listeners
    document.addEventListener('mousemove', mouseMoveListener);
    document.body.addEventListener('mouseleave', mouseLeaveListener);
}

function mouseMoveListener(e) {
    try {
        drawCircle(e, typeOfMenu);
    } catch (error) { if (configs.debugMode) console.log(error); }

    if (showMousePointer) {
        deltaX += e.movementX;
        deltaY += e.movementY;
        cornerMousePointer = document.getElementById('cmg-corner-mouse-pointer');
        if (cornerMousePointer)
            cornerMousePointer.style.transform = `translate(${(realLeftCoord + (canvasRadius / 2)) + deltaX - ghostMousePointerRadius}px, ${(realTopCoord + (canvasRadius / 2)) + deltaY - ghostMousePointerRadius}px)`;
    }
}

function mouseLeaveListener(e) {
    if (circleIsShown) {
        if (rightClickIsHolded) rightClickIsHolded = false;

        switch (configs.mouseLeaveBehavior) {
            case 'doNothing': { } break;
            case 'hideMenu': {
                selectedButtons = {};
                hideCircle();
            } break;
            case 'hideMenuAndSelect': {
                hideCircle();
            } break;
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
        if (showIndexes){
            mx = e.clientX - leftCoord;
            my = e.pageY - topCoord;
        } else {
            mx = e.pageX - leftCoord;
            my = e.pageY - topCoord - (showIndexes ? 0 : window.scrollY);
        }
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

                        /// Ignore pointer over 'no action' segments
                        if (!showIndexes && levelData['buttons'][i]['id'] == 'noAction') continue;

                        if (mradius > (level == 0 ? configs.innerCircleRadius : (configs[typeOfMenu].levels[level - 1].width ?? configs.circleRadius))) {
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
                        totalRadius - (levelData.width ?? configs.circleRadius) + (levelData.levelGap ?? configs.gapBetweenCircles),
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
                        totalRadius - (levelData.width ?? configs.circleRadius) + (levelData.levelGap ?? configs.gapBetweenCircles)) * 0.75, 0, 2 * Math.PI, false);
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
        circleIsShown = false;

        /// Hide circle
        circle.style.pointerEvents = 'none';

        switch (configs.hideCircleAnimation) {
            case 'noAnimation': {
                circle.style.transition = '';
                circle.style.opacity = 0.0;
                if (configs.addBlur) {
                    blurCircle.style.transition = '';
                    blurCircle.style.opacity = 0.0;
                }
            } break;
            case 'fade': {
                circle.style.opacity = 0.0;
                if (configs.addBlur) blurCircle.style.opacity = 0.0;
            } break;
            case 'scale': {
                circle.style.opacity = 0.0;
                if (configs.addBlur) blurCircle.style.opacity = 0.0;
            } break;
        }

        /// Remove ghost pointer when circle is not under cursor
        if (showMousePointer && cornerMousePointer) cornerMousePointer.remove();

        /// Detect and select highlighted action
        const selectedKeys = Object.keys(selectedButtons);

        if (rocketButtonPressed == null && selectedKeys.length == 0) {
            if (configs.hideCircleAnimation == 'scale')
                circle.style.transform = 'scale(0.0)';
        }
        else {
            /// Some action was selected
            if (configs.hideCircleAnimation == 'scale') {
                circle.style.transform = showRockerActionInCenter && rocketButtonPressed !== null ? 'scale(0.0)' : 'scale(1.5)';

                if (!showRockerActionInCenter && !rocketButtonPressed)
                    circle.style.transform = 'scale(1.35)';
            }

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
                let customUrlToOpen;

                if (selectedLevel == configs['regularMenu'].levels.length) {
                    const shownButtons = configs[typeOfMenu]['buttons'];
                    if (shownButtons == undefined) return;
                    actionToPerform = shownButtons[selectedButton].id;
                    if (actionToPerform == 'openUrl') customUrlToOpen = shownButtons[selectedButton].url;
                } else {
                    const shownButtons = configs[typeOfMenu].levels[selectedLevel]['buttons'];
                    if (shownButtons == undefined) return;
                    actionToPerform = shownButtons[selectedButton].id;
                    if (actionToPerform == 'openUrl') customUrlToOpen = shownButtons[selectedButton].url;
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
                    triggerButtonAction(actionToPerform, customUrlToOpen);
            }
        }

        /// Set timeout to remove circle from DOM
        setTimeout(function () {
            textSelection = null;

            if (circle !== null && circle.parentNode !== null) {
                // circle.parentNode.removeChild(circle);
                circle.remove();
                circle = null;
            }

            if (configs.addBlur && blurCircle) {
                blurCircle.remove();
                blurCircle = null;
            }

            selectedButtons = {};

            /// Hide all ghost images for website favicons
            document.querySelectorAll(`[id^='cmg-ghost-favicon']`).forEach(function (favicon) {
                favicon.remove();
            })
        }, configs.hideCircleAnimation == 'noAnimation' ? 0 : configs.animationDuration);

        buttonsAvailability = {};
        buttonsStatuses = {};
        document.removeEventListener('mousemove', mouseMoveListener);
        document.body.removeEventListener('mousemove', mouseLeaveListener);
        scrollingElementUnderCursor = null;

        hideHintTooltip();

        if (configs.dimBackground) hideBackgroundDimmer();

        if (hoveredLink !== null && linkTooltip !== null)
            hideLinkTooltip();

        if (rockerCircle !== null)
            hideRockerIcon(rocketButtonPressed !== null);

        /// Remove outline of the hovered element
        if (configs.addBorderToHoveredElement && elementUnderCursor){
            elementUnderCursor.classList.remove('cmg-hovered-element-border')
        }

    } catch (e) { if (configs.debugMode) console.log(e); }
}