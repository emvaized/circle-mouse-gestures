function showCircle(e) {
    var evt = e || window.event;
    e.preventDefault();
    if ("buttons" in evt) {
        if (evt.buttons == 2) {
            canvasRadius = addSecondLevel && typeOfMenu == 'regular-menu' ? secondCircleRadius * 2 : firstCircleRadius * 2;

            leftCoord = e.clientX - (canvasRadius / 2);
            topCoord = e.clientY - (canvasRadius / 2) + window.scrollY;

            /// Right button click
            circle = document.createElement('canvas');
            circle.setAttribute('class', 'cmg-circle-canvas');
            circle.setAttribute('width', canvasRadius);
            circle.setAttribute('height', canvasRadius);

            // circle.style.transform = 'scale(0.0) rotate(-180deg)';
            circle.style.transform = 'scale(0.0)';
            circle.style.transition = '';
            circle.style.transition = `opacity ${animationDuration}ms ease-in-out, transform ${animationDuration}ms ease-in-out`;
            circle.style.left = `${leftCoord}px`;
            circle.style.top = `${topCoord}px`;
            circle.style.opacity = circleOpacity;

            circle.style.visibility = 'visible';
            setTimeout(function () {
                // circle.style.transform = 'scale(1.0) rotate(0deg)';
                circle.style.transform = 'scale(1.0)';
            }, 1);

            document.body.appendChild(circle);
            ctx = circle.getContext('2d');

            drawCirclesOnCanvas(false);

            document.onmousemove = function (e) {
                drawCirclesOnCanvas(e);
            }
            circleIsShown = true;
        }
    }
}

function hideCircle() {
    try {
        document.onmousemove = null;
        circleIsShown = false;
        scaleForSecondLevel = 0.0;

        if (hoveredLink !== null && linkTooltip !== null)
            hideLinkTooltip();

        if (rockerCircle !== null)
            hideRockerIcon(rocketButtonPressed !== null);

        if (circle == null) return;
        circle.style.opacity = 0.0;

        var shownButtons = typeOfMenu == 'link-menu' ? linkMenuButtons : typeOfMenu == 'image-menu' ? imageMenuButtons : selectedButtonSecondLevel == null ? regularMenuButtons : regularMenuButtonsLevelTwo;

        if (debugMode) {
            console.log('Selected button is:');
            console.log(selectedButton);

            console.log('Selected button on 2nd level is:');
            console.log(selectedButtonSecondLevel);
        }

        if (rocketButtonPressed == null && selectedButton == null && selectedButtonSecondLevel == null) {
            circle.style.transform = 'scale(0.0)';
        }
        else {
            /// Some action was selected
            circle.style.transform = showRockerActionInCenter ? 'scale(0.0)' : 'scale(1.5)';
            if (rocketButtonPressed == null) {
                let actionToPerform = shownButtons[selectedButtonSecondLevel ?? selectedButton];
                if (debugMode) {
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
            selectedButton = null;
            selectedButtonSecondLevel = null;
        }, 200);
    } catch (e) { console.log(e); }
}

var scaleForSecondLevel = 0.0;

function drawCirclesOnCanvas(e) {
    ctx.clearRect(0, 0, canvasRadius, canvasRadius);

    if (addSecondLevel && typeOfMenu == 'regular-menu') {
        /// Draw 2 levels
        drawCircleContent(e, secondCircleRadius, secondCircleInnerRadius, 1, false);
        drawCircleContent(e, firstCircleRadius, firstCircleInnerRadius, 0, true);

        // setTimeout(function () {
        //     // request another loop
        //     requestAnimationFrame(drawCirclesOnCanvas);


        //     // animate the control point
        //     if (scaleForSecondLevel < 1.0)
        //         scaleForSecondLevel += 0.05;

        //     // request another loop
        //     ctx.clearRect(0, 0, canvasRadius, canvasRadius);
        //     drawCircleContent(e, secondCircleRadius * scaleForSecondLevel, secondCircleInnerRadius * scaleForSecondLevel, 1, false);
        //     drawCircleContent(e, firstCircleRadius, firstCircleInnerRadius, 0, true);

        // }, 1000 / 60);



    } else {
        /// Draw 1 level
        let firstCircleRadius = circleRadius;
        let firstCircleInnerRadius = innerCircleRadius;

        drawCircleContent(e, firstCircleRadius, firstCircleInnerRadius, false);
    }
}


function drawCircleContent(E, circleRadius, innerCircleRadius, level = 0, shouldRespectBoundary = false) {
    if (E === false) {
        mx = (canvasRadius / 2);
        my = (canvasRadius / 2);
    } else {
        mx = E.pageX - leftCoord;
        my = E.pageY - topCoord;
    }

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
    var buttonsToShow = typeOfMenu == 'link-menu' ? linkMenuButtons : typeOfMenu == 'image-menu' ? imageMenuButtons : level == 0 ? regularMenuButtons : regularMenuButtonsLevelTwo;
    segmentsCount = buttonsToShow.length; /// Only numbers dividable by 4

    if (level == 0)
        selectedButton = null;
    else
        selectedButtonSecondLevel = null;

    /// Draw segments
    for (i = 0; i < segmentsCount; i++) {
        if (actionIcons[buttonsToShow[i]] == undefined) continue;

        /// Rotate the circle a bit when buttons count is not even
        angle = (segmentsCount % 2 == 0.0 ? (-Math.PI / segmentsCount) : (-Math.PI / segmentsCount) / 2) + i * (Math.PI / (segmentsCount / 2));

        if (shouldRespectBoundary && mradius > (addSecondLevel ? secondCircleInnerRadius : circleRadius)) {
            // if (mradius > circleRadius) {
            /// Segment is not hovered

            ctx.fillStyle = typeOfMenu == 'link-menu' ? linkSegmentColor : typeOfMenu == 'image-menu' ? imageSegmentColor : regularSegmentColor;
        } else
            if (((mangle > angle && mangle < (angle + Math.PI / (segmentsCount / 2))) || (mangle > Math.PI * 15 / 8 && i == 0))
                && mradius >= innerCircleRadius) {

                /// Segment is hovered
                ctx.fillStyle = typeOfMenu == 'link-menu' ? hoveredLinkSegmentColor : typeOfMenu == 'image-menu' ? hoveredImageSegmentColor : hoveredRegularSegmentColor;

                if (level == 0)
                    selectedButton = i;
                else
                    selectedButtonSecondLevel = i;
            } else {
                /// Segment is not hovered
                ctx.fillStyle = typeOfMenu == 'link-menu' ? linkSegmentColor : typeOfMenu == 'image-menu' ? imageSegmentColor : regularSegmentColor;
            }

        ctx.beginPath();
        ctx.moveTo(canvasRadius / 2, canvasRadius / 2);
        ctx.arc(canvasRadius / 2, canvasRadius / 2, circleRadius, angle, angle + Math.PI / (segmentsCount / 2) * 0.996, false);
        ctx.lineTo(canvasRadius / 2, canvasRadius / 2);

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
    // ctx.arc(circleRadius, circleRadius, innerCircleRadius, 0, 2 * Math.PI, false);
    ctx.arc(canvasRadius / 2, canvasRadius / 2, innerCircleRadius, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.restore();

    /// Draw texts
    for (i = 0; i < segmentsCount; i++) {
        if (actionIcons[buttonsToShow[i]] == undefined) continue;

        ctx.textBaseline = 'middle';
        ctx.textAlign = "center";
        ctx.fillStyle = "white";

        var centerDx = canvasRadius / 2;
        var centerDy = canvasRadius / 2;
        let textRadius = (circleRadius + innerCircleRadius) * 0.5;

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

        // var textToDraw = buttonsToShow[i]['label'];
        var textToDraw = chrome.i18n.getMessage(buttonsToShow[i]);


        /// Obfuscate shortened label with '...'
        if (textToDraw.length >= 21) {
            textToDraw = textToDraw.substring(0, 17) + '...';
        }

        var verticalShiftForIcon = 0.0;

        // if (actionIcons[i] == undefined) {
        //     /// Inactive label
        //     ctx.fillStyle = "rgba(256,256,256,0.5)";
        //     ctx.fillText(textToDraw, dxForText, dyForText - 15, (textRadius));

        //     if (hoveredLink !== null) {
        //         ctx.fillStyle = "rgba(256,256,256,0.75)";
        //         // ctx.fillText(hoveredLink.substring(0, 15) + '...', dxForText, dyForText + 3);
        //         ctx.fillText(hoveredLink.substring(0, maxCharacters) + '...', dxForText, dyForText + 3);

        //         /// Add underline, and shift it by 1 symbol left
        //         ctx.fillText("______________________________________".substring(0, maxCharacters - 3), dxForText - 6.5, dyForText + 3);
        //     }
        // } else {
        ctx.fillStyle = "rgba(256,256,256,0.75)";

        if (circleRadius - innerCircleRadius > iconSize * 2.5)
            verticalShiftForIcon = wrapLabel(ctx, textToDraw, dxForText, dyForText + 15, segmentLength * 0.4, labelSize);


        if (addLinkTooltip && hoveredLink !== null && linkTooltip == null) {
            showLinkTooltip();
        }
        /// Draw unicode icon    
        ctx.fillStyle = "rgba(256,256,256,1.0)";
        ctx.font = `${iconSize}px sans-serif`;
        ctx.fillText(actionIcons[buttonsToShow[i]], dxForText, dyForText - (circleRadius - innerCircleRadius > iconSize * 2.5 ? 4 : -4) - verticalShiftForIcon);
        // }
    }

    /// Draw rocker gesture icon in center
    if (showRockerActionInCenter && rockerCircle == null)
        drawRockerIconInCenter();
}



function drawTextAlongArc(context, str, centerX, centerY, radius, angle) {
    context.save();
    context.translate(centerX, centerY);
    context.rotate(-1 * angle / 2);
    context.rotate(-1 * (angle / str.length) / 2);
    for (var n = 0; n < str.length; n++) {
        context.rotate(angle / str.length);
        context.save();
        context.translate(0, -1 * radius);
        var char = str[n];
        context.fillText(char, 0, 0);
        context.restore();
    }
    context.restore();
}