var totalCircleRadius;

function showCircle(e) {
    var evt = e || window.event;
    e.preventDefault();
    if ("buttons" in evt) {
        if (evt.buttons == 2) {
            // canvasRadius = (configs.addSecondLevel && typeOfMenu == 'regular-menu' ? secondCircleRadius * 2 : firstCircleRadius * 2) + (configs.addCircleOutlines ? 2 : 0);

            totalCircleRadius = 0.0;
            if (typeOfMenu == 'regular-menu')
                for (var i = 0; i < regularMenuButtons.length; i++) {
                    totalCircleRadius += regularMenuButtons[i].width + configs.gapBetweenCircles;
                }
            else totalCircleRadius = configs.circleRadius;
            canvasRadius = totalCircleRadius * 2;
            // canvasRadius = configs.circleRadius * 2 * regularMenuAllButtons.length;

            leftCoord = e.clientX - (canvasRadius / 2);
            topCoord = e.clientY - (canvasRadius / 2) + window.scrollY;

            /// Right button click
            circle = document.createElement('canvas');
            circle.setAttribute('class', 'cmg-circle-canvas');
            circle.setAttribute('width', `${canvasRadius}px !imporant`);
            circle.setAttribute('height', `${canvasRadius}px !imporant`);

            // circle.style.transform = 'scale(0.0) rotate(-180deg)';
            circle.style.transform = 'scale(0.0)';
            circle.style.transition = '';
            circle.style.transition = `opacity ${configs.animationDuration}ms ease-in-out, transform ${configs.animationDuration}ms ease-in-out`;
            circle.style.left = `${leftCoord}px`;
            circle.style.top = `${topCoord}px`;
            circle.style.opacity = configs.circleOpacity;

            circle.style.visibility = 'visible';
            setTimeout(function () {
                // circle.style.transform = 'scale(1.0) rotate(0deg)';
                circle.style.transform = 'scale(1.0)';
            }, 1);

            document.body.appendChild(circle);
            ctx = circle.getContext('2d');

            drawCirclesOnCanvas(false);

            document.onmousemove = function (e) {
                try {
                    drawCirclesOnCanvas(e);
                } catch (error) { console.log(error); }
            }
            circleIsShown = true;
        }
    }
}

function hideCircle() {
    try {
        document.onmousemove = null;
        circleIsShown = false;

        if (hoveredLink !== null && linkTooltip !== null)
            hideLinkTooltip();

        if (rockerCircle !== null)
            hideRockerIcon(rocketButtonPressed !== null);

        if (circle == null || circle == undefined) return;
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
            circle.style.transform = 'scale(0.0)';
        }
        else {
            /// Some action was selected
            circle.style.transform = showRockerActionInCenter ? 'scale(0.0)' : 'scale(1.5)';
            if (rocketButtonPressed == null) {

                console.log('selectedLevel:');
                console.log(selectedLevel);

                // let actionToPerform = shownButtons[selectedButtonSecondLevel ?? selectedButton];

                let shownButtons = typeOfMenu == 'link-menu' ? linkMenuButtons : typeOfMenu == 'image-menu' ? imageMenuButtons : regularMenuButtons[selectedLevel]['buttons'];

                let actionToPerform = shownButtons[selectedButton].id;
                if (configs.debugMode) {
                    console.log('action to perform by CMG:');
                    console.log(actionToPerform);
                }
                triggerButtonAction(actionToPerform);
            }
        }

        setTimeout(function () {
            circle.style.visibility = 'hidden';
            if (circle.parentNode !== null)
                circle.parentNode.removeChild(circle);
            circle = null;
            // selectedButton = null;
            // selectedButtonSecondLevel = null;

            // selectedButtons[level] = null;

            for (i in regularMenuButtons) {
                selectedButtons[i] = null;
            }
        }, 200);
    } catch (e) { console.log(e); }
}


function drawCirclesOnCanvas(e, showIndexes = false) {
    ctx.clearRect(0, 0, canvasRadius, canvasRadius);

    let totalRadius = totalCircleRadius;

    if (typeOfMenu == 'regular-menu') {
        for (var i = regularMenuButtons.length - 1; i > -1; i--) {
            drawCircleContent(
                typeOfMenu, e,
                /// buttonsToShow
                typeOfMenu == 'link-menu' ? linkMenuButtons : typeOfMenu == 'image-menu' ? imageMenuButtons : regularMenuButtons[i].buttons,
                /// circleRadius
                totalRadius,
                /// innerCircleRadius
                i == 0 ? configs.innerCircleRadius : totalRadius - regularMenuButtons[i].width + configs.gapBetweenCircles,
                ///level
                i,
                /// shouldRespectBoundary
                i !== regularMenuButtons.length - 1,
                showIndexes
            );
            totalRadius -= regularMenuButtons[i].width;
        }
    } else {
        let firstCircleRadius = configs.circleRadius;
        let firstCircleInnerRadius = configs.innerCircleRadius;

        let buttonsToShow = typeOfMenu == 'link-menu' ? linkMenuButtons : imageMenuButtons;
        drawCircleContent(typeOfMenu, e, buttonsToShow, firstCircleRadius, firstCircleInnerRadius, 0, false, showIndexes);
    }



    // if (configs.addSecondLevel && typeOfMenu == 'regular-menu') {
    //     /// Draw 2 levels
    //     let buttonsToShow2 = typeOfMenu == 'link-menu' ? linkMenuButtons : typeOfMenu == 'image-menu' ? imageMenuButtons : regularMenuButtonsLevelTwo;
    //     drawCircleContent(typeOfMenu, e, buttonsToShow2, secondCircleRadius, secondCircleInnerRadius, 1, false, showIndexes);
    //     let buttonsToShow1 = typeOfMenu == 'link-menu' ? linkMenuButtons : typeOfMenu == 'image-menu' ? imageMenuButtons : regularMenuButtons;
    //     drawCircleContent(typeOfMenu, e, buttonsToShow1, firstCircleRadius, firstCircleInnerRadius, 0, true, showIndexes);
    // } else {
    //     /// Draw 1 level
    //     let firstCircleRadius = configs.circleRadius;
    //     let firstCircleInnerRadius = configs.innerCircleRadius;

    //     let buttonsToShow = typeOfMenu == 'link-menu' ? linkMenuButtons : typeOfMenu == 'image-menu' ? imageMenuButtons : regularMenuButtons;
    //     drawCircleContent(typeOfMenu, e, buttonsToShow, firstCircleRadius, firstCircleInnerRadius, false, showIndexes);
    // }
}


function drawCircleContent(typeOfMenu, E, buttonsToShow, circleRadius, innerCircleRadius, level = 0, shouldRespectBoundary = false, showIndexes = false) {
    if (E === false) {
        mx = (canvasRadius / 2);
        my = (canvasRadius / 2);
    } else {
        mx = E.pageX - leftCoord;
        my = E.pageY - topCoord;
    }

    var segmentColor = typeOfMenu == 'link-menu' ? linkSegmentColor : typeOfMenu == 'image-menu' ? imageSegmentColor : regularSegmentColor;
    var hoveredSegmentColor = typeOfMenu == 'link-menu' ? hoveredLinkSegmentColor : typeOfMenu == 'image-menu' ? hoveredImageSegmentColor : hoveredRegularSegmentColor;

    // mangle = (-Math.atan2(mx - circleRadius, my - circleRadius) + Math.PI * 2.5) % (Math.PI * 2);
    // mradius = Math.sqrt(Math.pow(mx - circleRadius, 2) + Math.pow(my - circleRadius, 2));
    mangle = (-Math.atan2(mx - (canvasRadius / 2), my - (canvasRadius / 2)) + Math.PI * 2.5) % (Math.PI * 2);
    mradius = Math.sqrt(Math.pow(mx - (canvasRadius / 2), 2) + Math.pow(my - (canvasRadius / 2), 2));

    /// Toggle rocker icon view
    if (showRockerActionInCenter && scaleDownRockerIconWhenNonHovered && rockerCircle !== null && rockerCircle !== undefined) {
        let rockerIconText = rockerCircle.querySelector('#cmg-rocker-icon-text');
        if (level == 0 && mradius < innerCircleRadius) {
            rockerIconText.style.transform = 'scale(1.0)';
        } else {
            rockerIconText.style.transform = 'scale(0.75)';
        }
    }

    /// Configs
    // var buttonsToShow = typeOfMenu == 'link-menu' ? linkMenuButtons : typeOfMenu == 'image-menu' ? imageMenuButtons : level == 0 ? regularMenuButtons : regularMenuButtonsLevelTwo;
    segmentsCount = buttonsToShow.length; /// Only numbers dividable by 4

    // if (level == 0)
    //     selectedButton = null;
    // else
    //     selectedButtonSecondLevel = null;

    selectedButtons[level] = null;

    /// Draw segments
    for (i = 0; i < segmentsCount; i++) {
        if (actionIcons[buttonsToShow[i].id] == undefined) continue;

        /// Rotate the circle a bit when buttons count is not even
        angle = (segmentsCount % 2 == 0.0 ?
            (-Math.PI / segmentsCount) :
            (-Math.PI / segmentsCount) / 2) + i * (Math.PI / (segmentsCount / 2));

        // if (shouldRespectBoundary && mradius > (configs.addSecondLevel ? secondCircleInnerRadius : circleRadius)) {
        if (shouldRespectBoundary && mradius > circleRadius + configs.gapBetweenCircles) {
            /// Segment is not hovered

            ctx.fillStyle = segmentColor;
        } else
            if (((mangle > angle && mangle < (angle + Math.PI / (segmentsCount / 2))) || (mangle > Math.PI * 15 / 8 && i == 0))
                && mradius >= innerCircleRadius) {

                /// Segment is hovered
                ctx.fillStyle = hoveredSegmentColor;

                // if (level == 0)
                //     selectedButton = i;
                // else
                //     selectedButtonSecondLevel = i;

                selectedButtons[level] = i;
            } else {
                /// Segment is not hovered
                ctx.fillStyle = segmentColor;
            }
        ctx.globalCompositeOperation = 'source-over';

        ctx.beginPath();
        ctx.moveTo(canvasRadius / 2, canvasRadius / 2);

        if (useRectangularShape) {
            if (segmentsCount < 5) {
                let radiusDivider = segmentsCount == 4 ? Math.sqrt(2) : Math.sqrt(4);
                let dxForTextStart = canvasRadius / 2 + Math.cos(angle) * (circleRadius) / radiusDivider;
                let dyForTextStart = canvasRadius / 2 + Math.sin(angle) * (circleRadius) / radiusDivider;
                let dxForTextMiddle = canvasRadius / 2 + Math.cos(angle + (Math.PI / (segmentsCount / 2) * 0.996 / 2)) * circleRadius;
                let dyForTextMiddle = canvasRadius / 2 + Math.sin(angle + (Math.PI / (segmentsCount / 2) * 0.996 / 2)) * circleRadius;
                let dxForTextEnd = canvasRadius / 2 + Math.cos(angle + Math.PI / (segmentsCount / 2) * 0.996) * (circleRadius) / radiusDivider;
                let dyForTextEnd = canvasRadius / 2 + Math.sin(angle + Math.PI / (segmentsCount / 2) * 0.996) * (circleRadius) / radiusDivider;

                ctx.lineTo(dxForTextStart, dyForTextStart);
                ctx.lineTo(dxForTextMiddle, dyForTextMiddle);
                ctx.lineTo(dxForTextEnd, dyForTextEnd);
            } else {
                let dxForTextStart = canvasRadius / 2 + Math.cos(angle) * circleRadius;
                let dyForTextStart = canvasRadius / 2 + Math.sin(angle) * circleRadius;
                let dxForTextEnd = canvasRadius / 2 + Math.cos(angle + Math.PI / (segmentsCount / 2) * 0.996) * circleRadius;
                let dyForTextEnd = canvasRadius / 2 + Math.sin(angle + Math.PI / (segmentsCount / 2) * 0.996) * circleRadius;

                ctx.lineTo(dxForTextStart, dyForTextStart);
                ctx.lineTo(dxForTextEnd, dyForTextEnd);
            }


        } else {
            ctx.arc(canvasRadius / 2, canvasRadius / 2, circleRadius, angle, angle + Math.PI / (segmentsCount / 2) * 0.996, false);
        }

        ctx.lineTo(canvasRadius / 2, canvasRadius / 2);

        if (configs.addCircleOutlines) {
            ctx.strokeStyle = configs.circleOutlinesColor;
            ctx.stroke();
        }

        if (addShadows) {
            ctx.shadowColor = 'black';
            ctx.shadowBlur = 12;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 5;
        }

        /// if (addNeonEffect) {
        // ctx.shadowColor = "red";
        // ctx.globalCompositeOperation = "lighter";
        // ctx.shadowBlur = 10;
        // }

        ctx.fill();
    }

    if (addShadows) {
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
    }

    /// Cut off circle in center
    ctx.save();
    ctx.beginPath();
    ctx.globalCompositeOperation = 'destination-out';

    if (useRectangularShape && level !== 0) {
        // if (useRectangularShape) {
        ctx.moveTo(canvasRadius / 2, canvasRadius / 2 - (innerCircleRadius / 2));

        for (i = 0; i < segmentsCount; i++) {
            let segmentAngle = (segmentsCount % 2 == 0.0 ? (-Math.PI / segmentsCount) : (-Math.PI / segmentsCount) / 2) + i * (Math.PI / (segmentsCount / 2));

            let dxForTextStart = canvasRadius / 2 + Math.cos(segmentAngle) * innerCircleRadius;
            let dyForTextStart = canvasRadius / 2 + Math.sin(segmentAngle) * innerCircleRadius;
            ctx.moveTo(dxForTextStart, dyForTextStart);

            let dxForTextEnd = canvasRadius / 2 + Math.cos(segmentAngle + Math.PI / (segmentsCount / 2) * 0.996) * innerCircleRadius;
            let dyForTextEnd = canvasRadius / 2 + Math.sin(segmentAngle + Math.PI / (segmentsCount / 2) * 0.996) * innerCircleRadius;

            ctx.lineTo(dxForTextEnd, dyForTextEnd);
            ctx.lineTo(canvasRadius / 2, canvasRadius / 2);
            ctx.fill();
        }

    } else {
        ctx.arc(canvasRadius / 2, canvasRadius / 2, innerCircleRadius, 0, 2 * Math.PI, false);
        ctx.fill();
    }

    ctx.restore();


    if (configs.addCircleOutlines) {
        ctx.strokeStyle = configs.circleOutlinesColor;
        ctx.stroke();
    }

    /// Draw labels
    if (configs.addTextLabels)
        drawLabels(segmentsCount, circleRadius, innerCircleRadius, buttonsToShow, segmentColor, showIndexes);

    /// Show link tooltip
    if (configs.addLinkTooltip && hoveredLink !== null && linkTooltip == null) {
        showLinkTooltip();
    }

    /// Draw rocker gesture icon in center
    if (showRockerActionInCenter && rockerCircle == null)
        drawRockerIconInCenter();
}


function drawLabels(segmentsCount, circleRadius, innerCircleRadius, buttonsToShow, segmentColor, showIndexes = false) {
    for (i = 0; i < segmentsCount; i++) {
        if (actionIcons[buttonsToShow[i].id] == undefined) continue;

        var buttonIsAvailable;
        try {
            buttonIsAvailable = checkButtonAvailability(buttonsToShow[i].id);
        } catch (e) {
            if (configs.debugMode)
                console.log(e);
            buttonIsAvailable = true;
        }

        // if (configs.debugMode)
        //     console.log(buttonsToShow[i] + ' is available: ' + buttonIsAvailable.toString());

        ctx.textBaseline = 'middle';
        ctx.textAlign = "center";
        ctx.fillStyle = "white";

        var centerDx = canvasRadius / 2;
        var centerDy = canvasRadius / 2;
        // let textRadius = (circleRadius + innerCircleRadius) * 0.5;
        let textRadius = useRectangularShape ? innerCircleRadius + ((circleRadius - innerCircleRadius / 2) / (segmentsCount < 5 ? 3 : 5)) : (circleRadius + innerCircleRadius) * 0.5;
        let angle = (segmentsCount % 2 == 0.0 ? 0.0 : (Math.PI / segmentsCount) / 2) + i * (Math.PI / (segmentsCount / 2));
        var dxForText = centerDx + Math.cos(angle) * textRadius;
        var dyForText = centerDy + Math.sin(angle) * textRadius;

        /// Calculate icon and text size
        let iconSize = 27;
        let labelSize = 13;
        let maxCharacters = 13;

        let circleLength = 2 * circleRadius * Math.PI;
        let segmentLength = circleLength / segmentsCount;
        iconSize = segmentLength / 4;

        if (iconSize > 30) iconSize = 30;
        labelSize = iconSize / 2.5;

        /// Calculate max characters length
        maxCharacters = Math.floor(segmentLength / labelSize);

        /// Draw text label underneath
        ctx.font = `${labelSize}px sans-serif`;
        var textToDraw = chrome.i18n.getMessage(buttonsToShow[i].id);
        /// Obfuscate shortened label with '...'
        if (textToDraw.length >= 21) {
            textToDraw = textToDraw.substring(0, 17) + '...';
        }

        var verticalShiftForIcon = 0.0;

        segmentColor == '#c69a15' ? segmentColor :
            ctx.fillStyle = getTextColorForBackground(segmentColor, configs.labelOpacity / (buttonIsAvailable ? 1 : 2));

        if (circleRadius - innerCircleRadius > iconSize * 2.5) {
            verticalShiftForIcon = wrapLabel(ctx, textToDraw, dxForText, dyForText + 15, segmentLength * 0.4, labelSize);
        }

        /// Draw icon    
        segmentColor == '#c69a15' ? segmentColor :
            ctx.fillStyle = getTextColorForBackground(segmentColor, configs.iconOpacity / (buttonIsAvailable ? 1 : 2)) ?? '';
        ctx.font = `${iconSize}px sans-serif`;

        if (actionIcons[buttonsToShow[i].id].length <= 3) {
            /// Draw unicode icon
            ctx.fillText(actionIcons[buttonsToShow[i].id], dxForText, dyForText - (circleRadius - innerCircleRadius > iconSize * 2.5 ? 4 : -4) - verticalShiftForIcon);
        } else {
            /// Draw SVG icon
            try {
                ctx.save();
                let p = new Path2D(actionIcons[buttonsToShow[i].id]);
                ctx.translate(dxForText - (iconSize / 2), dyForText - verticalShiftForIcon - (iconSize / (circleRadius - innerCircleRadius > iconSize * 2.5 ? 1.5 : 2)));
                let scale = iconSize / 24;
                ctx.scale(scale, scale);
                ctx.fill(p);
                ctx.restore();
            } catch (e) {
                if (configs.debugMode)
                    console.log(e);
            }
        }

        /// Draw indexes
        if (showIndexes) {
            let textRadius = innerCircleRadius + 6;
            let dxForText = centerDx + Math.cos(angle) * textRadius;
            let dyForText = centerDy + Math.sin(angle) * textRadius;
            ctx.fillStyle = getTextColorForBackground(segmentColor, 0.5) ?? '';
            ctx.font = `12px sans-serif`;
            ctx.fillText(i.toString(), dxForText, dyForText);
        }
    }
}


function checkButtonAvailability(id) {
    if (checkAvailabilityForButtons == false) return true;
    switch (id) {
        case 'scrollToTop': return window.scrollY !== 0.0;
        case 'scrollToBottom': {
            return window.screen.height + window.scrollY < document.documentElement.scrollHeight;
        }
        case 'scrollPageUp': return window.scrollY !== 0.0;
        case 'scrollPageDown': {
            return window.screen.height + window.scrollY < document.documentElement.scrollHeight;
        }
        case 'goBack': {
            return window.history.length !== 1;
        };
        case 'goForward': return window.history.length !== 1;

        // case 'switchToNextTab': {
        //     await chrome.runtime.sendMessage({ actionToDo: 'checkNextTabAvailability' }
        //         , function (result) {
        //             console.log('result:');
        //             console.log(result);
        //             return result;
        //         }
        //     );
        // } break;

        // case 'switchToPreviousTab': {
        //     return await chrome.runtime.sendMessage({ actionToDo: 'checkPrevTabAvailability' });
        // } break;

        default: return true;

    }
}