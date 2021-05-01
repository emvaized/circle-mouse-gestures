function drawCircleLevel(typeOfMenu, E, buttonsToShow, circleRadius, innerCircleRadius, level = 0, shouldRespectBoundary = false, showIndexes = false, shouldCheckButtonsAvailability = true) {

    if (E === false) {
        mx = (canvasRadius / 2);
        my = (canvasRadius / 2);
    } else {
        mx = E.pageX - leftCoord;
        my = E.pageY - topCoord;
    }

    var segmentsCount = buttonsToShow.length;
    var segmentColor = configs[typeOfMenu].color;
    var outlineColorRgb = getTextColorForBackground(segmentColor, 0.5);
    var outlineColor = `rgba(${outlineColorRgb.red}, ${outlineColorRgb.green}, ${outlineColorRgb.blue}, 0.5)`;

    var hoveredOverlayOpacity = 0.3;

    let mangle = (-Math.atan2(mx - (canvasRadius / 2), my - (canvasRadius / 2)) + Math.PI * 2.5) % (Math.PI * 2);
    let mradius = Math.sqrt(Math.pow(mx - (canvasRadius / 2), 2) + Math.pow(my - (canvasRadius / 2), 2));

    /// Toggle rocker icon view
    if (showRockerActionInCenter && scaleDownRockerIconWhenNonHovered && rockerCircle !== null && rockerCircle !== undefined) {
        let rockerIconText = rockerCircle.querySelector('#cmg-rocker-icon-text');
        if (level == 0 && mradius < innerCircleRadius) {
            rockerIconText.style.transform = 'scale(1.0)';
        } else {
            rockerIconText.style.transform = 'scale(0.75)';
        }
    }

    selectedButtons[level] = null;

    /// Draw segments
    for (i = 0; i < segmentsCount; i++) {
        if (actionIcons[buttonsToShow[i].id] == undefined) continue;

        /// Rotate the circle a bit when buttons count is not even
        var angle = (segmentsCount % 2 == 0.0 ?
            (-Math.PI / segmentsCount) :
            (-Math.PI / segmentsCount) / 2) + i * (Math.PI / (segmentsCount / 2));

        // var angle = (
        //     (-Math.PI / segmentsCount)) + i * (Math.PI / (segmentsCount / 2));

        if (shouldRespectBoundary && mradius > circleRadius + configs.gapBetweenCircles) {
            /// Segment is not hovered

            ctx.fillStyle = segmentColor;

        } else
            if (preselectedButtons[level] == i || (((mangle > angle && mangle < (angle + Math.PI / (segmentsCount / 2)))
                // || (mangle > (Math.PI * 15 / 8) && i == 0))
                // || (mangle > (Math.PI * (segmentsCount * 2 - 1) / segmentsCount) && i == 0))
                || (mangle > (Math.PI * (segmentsCount * 2 - (segmentsCount % 2 == 0.0 ? 1 : 0.5)) / segmentsCount) && i == 0))

                && mradius >= innerCircleRadius)) {
                /// Segment is hovered

                selectedButtons[level] = i;

                /// Combine main color with hovered color overlay
                try {
                    let rgbColor = hexToRgb(segmentColor);
                    var base = [rgbColor.red, rgbColor.green, rgbColor.blue, 1.0];
                    var added = [outlineColorRgb.red, outlineColorRgb.green, outlineColorRgb.blue, hoveredOverlayOpacity];
                    var mix = [];
                    mix[3] = 1 - (1 - added[3]) * (1 - base[3]); // alpha
                    mix[0] = Math.round((added[0] * added[3] / mix[3]) + (base[0] * base[3] * (1 - added[3]) / mix[3])); // red
                    mix[1] = Math.round((added[1] * added[3] / mix[3]) + (base[1] * base[3] * (1 - added[3]) / mix[3])); // green
                    mix[2] = Math.round((added[2] * added[3] / mix[3]) + (base[2] * base[3] * (1 - added[3]) / mix[3])); // blue

                    ctx.fillStyle = `rgb(${mix[0]},${mix[1]},${mix[2]})`;
                } catch (error) {
                    if (configs.debugMode) console.log(error);
                }

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
            ctx.arc(canvasRadius / 2, canvasRadius / 2, circleRadius, angle, angle + (Math.PI / (segmentsCount / 2)) * 0.996, false);
        }

        ctx.lineTo(canvasRadius / 2, canvasRadius / 2);

        if (configs.addCircleOutlines) {
            ctx.strokeStyle = outlineColor;
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
        ctx.strokeStyle = outlineColor;
        ctx.stroke();
    }

    /// Draw labels
    drawLabels(segmentsCount, circleRadius, innerCircleRadius, buttonsToShow, segmentColor, showIndexes, shouldCheckButtonsAvailability);

    try {
        /// Show link tooltip
        if (configs.addLinkTooltip && hoveredLink !== null && linkTooltip == null) {
            showLinkTooltip();
        }

        /// Draw rocker gesture icon in center
        if (showRockerActionInCenter && rockerCircle == null)
            drawRockerIconInCenter();
    } catch (e) { }

}


function drawLabels(segmentsCount, circleRadius, innerCircleRadius, buttonsToShow, segmentColor, showIndexes = false, shouldCheckButtonsAvailability = true) {

    let textColorRgb = getTextColorForBackground(segmentColor);
    let iconColorRgb = getTextColorForBackground(segmentColor);

    for (i = 0; i < segmentsCount; i++) {
        if (actionIcons[buttonsToShow[i].id] == undefined) continue;

        var buttonIsAvailable = true;
        if (shouldCheckButtonsAvailability) {
            try {
                buttonIsAvailable = checkButtonAvailability(buttonsToShow[i].id);
            } catch (e) {
                if (configs.debugMode)
                    console.log(e);
                // buttonIsAvailable = true;
            }
        }

        let textColor = `rgba(${textColorRgb.red}, ${textColorRgb.green}, ${textColorRgb.blue}, ${configs.labelOpacity / (buttonIsAvailable ? 1 : 2)})`;
        let iconColor = `rgba(${iconColorRgb.red}, ${iconColorRgb.green}, ${iconColorRgb.blue}, ${configs.iconOpacity / (buttonIsAvailable ? 1 : 2)})`;

        ctx.textBaseline = 'middle';
        ctx.textAlign = "center";
        ctx.fillStyle = "white";

        var centerDx = canvasRadius / 2;
        var centerDy = canvasRadius / 2;
        // let textRadius = (circleRadius + innerCircleRadius) * 0.5;
        let textRadius = useRectangularShape ? innerCircleRadius + ((circleRadius - innerCircleRadius / 2) / (segmentsCount < 5 ? 3 : 5)) : (circleRadius + innerCircleRadius) * 0.5;
        let angle = (segmentsCount % 2 == 0.0 ? 0.0 : (Math.PI / segmentsCount) / 2) + i * (Math.PI / (segmentsCount / 2));

        // angle -= Math.PI / 2;

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
        if (textToDraw.length >= 21) {
            /// Obfuscate shortened label with '...'
            textToDraw = textToDraw.substring(0, 17) + '...';
        }

        var verticalShiftForIcon = 0.0;

        ctx.fillStyle = textColor;
        if (configs.addTextLabels && circleRadius - innerCircleRadius > iconSize * 2.5) {
            verticalShiftForIcon = wrapLabel(ctx, textToDraw, dxForText, dyForText + 15, segmentLength * 0.4, labelSize);
        }

        /// Draw icon    
        ctx.fillStyle = iconColor;
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
            ctx.fillStyle = textColor;
            ctx.font = `12px sans-serif`;
            ctx.fillText((i + 1).toString(), dxForText, dyForText);
        }
    }
}


function checkButtonAvailability(id) {
    // if (checkAvailabilityForButtons == false) return true;
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