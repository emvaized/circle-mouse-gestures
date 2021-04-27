var totalCircleRadius;

function showCircle(e) {
    var evt = e || window.event;
    e.preventDefault();
    if ("buttons" in evt) {
        if (evt.buttons == 2) {

            totalCircleRadius = 0.0;

            if (configs.interactiveMenusBehavior == 'combine' || typeOfMenu == 'regularMenu') {
                for (var i = 0; i < configs['regularMenu'].levels.length; i++) {
                    totalCircleRadius += configs.gapBetweenCircles + (configs['regularMenu'].levels[i].width ?? configs.circleRadius);
                }
                canvasRadius = totalCircleRadius * 2 + 2;
            }
            else {
                totalCircleRadius = configs.gapBetweenCircles + configs.circleRadius;
                canvasRadius = totalCircleRadius * 2;
            }

            if (typeOfMenu !== 'regularMenu' && configs.interactiveMenusBehavior == 'combine') {
                canvasRadius += (configs.interactiveCircleRadius + configs.gapBeforeInteractiveCircle) * 2;
            }

            leftCoord = e.clientX - (canvasRadius / 2) + 1;
            topCoord = e.clientY - (canvasRadius / 2) + window.scrollY + 1;

            circleIsShown = true;
            setCanvas(e);

            // if (configs.dimBackground)
            //     setBackgroundDimmer();
        }
    }
}

function setCanvas(e) {
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
        // circle.style.transform = 'scale(1.0) rotate(0deg)'; /// rotating animation on reveal
        circle.style.transform = 'scale(1.0)';
    }, 1);

    document.body.appendChild(circle);
    ctx = circle.getContext('2d');

    drawCircle(false);
    document.onmousemove = function (e) {
        try {
            drawCircle(e);
        } catch (error) { console.log(error); }
    }
}

function setBackgroundDimmer() {
    let dimmer = document.createElement('div');
    dimmer.setAttribute('width', `${window.screen.width}px !imporant`);
    dimmer.setAttribute('height', `${window.screen.height}px !imporant`);
    dimmer.setAttribute('style', `opacity: 0.0; transition opacity ${configs.animationDuration}ms ease-in-out; position:absolute; background: black !important; top: 0px; left: 0px;`);
    document.body.appendChild(dimmer);

    // let dimmerCtx = dimmer.getContext('2d');
    // dimmerCtx.fillStyle = 'black';
    // dimmerCtx.fill();
    setTimeout(function () {
        dimmer.style.opacity = 0.5;
    }, 1);

}


function drawCircle(e, showIndexes = false) {
    ctx.clearRect(0, 0, canvasRadius, canvasRadius);
    let totalRadius = totalCircleRadius;

    /// Draw outer circle with interactive buttons
    if (typeOfMenu !== 'regularMenu') {
        /// Interactive menu replaces the regular menu
        if (configs.interactiveMenusBehavior == 'replace') {
            let firstCircleRadius = configs.circleRadius;
            let firstCircleInnerRadius = configs.innerCircleRadius;

            let buttonsToShow = configs[typeOfMenu].buttons;
            drawCircleLevel(typeOfMenu, e, buttonsToShow, firstCircleRadius, firstCircleInnerRadius, configs['regularMenu'].levels.length, false, showIndexes);
            return;
        } else {
            /// Interactive menu is added as outer level for regular circle
            drawCircleLevel(
                typeOfMenu, e,
                /// buttonsToShow
                configs[typeOfMenu].buttons,
                /// circleRadius
                totalRadius + configs.interactiveCircleRadius,
                /// innerCircleRadius
                totalRadius + configs.gapBeforeInteractiveCircle,
                ///level
                configs['regularMenu'].levels.length,
                /// shouldRespectBoundary
                false,
                showIndexes
            );
        }
    }


    for (var i = configs['regularMenu'].levels.length - 1; i > -1; i--) {
        drawCircleLevel(
            'regularMenu', e,
            /// buttonsToShow
            configs['regularMenu'].levels[i].buttons,
            /// circleRadius
            totalRadius,
            /// innerCircleRadius
            i == 0 ? configs.innerCircleRadius :
                //     totalRadius - (configs['regularMenu'].levels[i].width ?? configs.circleRadius) + configs.gapBetweenCircles,
                totalRadius - (configs['regularMenu'].levels[i].width ?? configs.circleRadius) + configs.gapBetweenCircles,
            ///level
            i,
            /// shouldRespectBoundary
            typeOfMenu !== 'regularMenu' ? true : i !== configs['regularMenu'].levels.length - 1,
            showIndexes
        );
        totalRadius -= configs['regularMenu'].levels[i].width ?? configs.circleRadius;
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
            circle.style.transform = showRockerActionInCenter && rocketButtonPressed !== null ? 'scale(0.0)' : 'scale(1.5)';
            // circle.style.transform = 'scale(1.5)';

            if (rocketButtonPressed == null && typeOfMenu !== null) {
                var actionToPerform;

                if (selectedLevel == configs['regularMenu'].levels.length) {
                    let shownButtons = configs[typeOfMenu]['buttons'];
                    if (shownButtons == undefined) return;
                    actionToPerform = shownButtons[selectedButton].id;
                } else {
                    let shownButtons = configs['regularMenu'].levels[selectedLevel]['buttons'];
                    if (shownButtons == undefined) return;
                    actionToPerform = shownButtons[selectedButton].id;
                }

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

            for (i in configs.regularMenu.levels) {
                selectedButtons[i] = null;
            }
        }, 200);
    } catch (e) { console.log(e); }
}


