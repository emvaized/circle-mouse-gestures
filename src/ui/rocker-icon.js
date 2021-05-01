function drawRockerIconInCenter() {
    if (configs.debugMode)
        console.log('Drawing rocker circle icon...');

    let rockerCircleRadius = configs.innerCircleRadius * 1.5;

    rockerCircle = document.createElement('div');
    rockerCircle.setAttribute('class', 'cmg-rocker-icon');

    let bgColor = configs[typeOfMenu].color;
    // let bgColor = mixColors(configs[typeOfMenu].color, '#000000', 0.25);

    rockerCircle.style.background = bgColor;
    rockerCircle.style.opacity = 0.0;
    rockerCircle.style.width = `${rockerCircleRadius}px`;
    rockerCircle.style.height = `${rockerCircleRadius}px`;
    rockerCircle.style.transform = `scale(0.0)`;
    rockerCircle.style.left = `${leftCoord + (canvasRadius / 2) - (rockerCircleRadius / 2)}px`;
    rockerCircle.style.top = `${topCoord + (canvasRadius / 2) - (rockerCircleRadius / 2)}px`;
    rockerCircle.style.transition = `opacity ${configs.animationDuration}ms ease-in-out, transform ${configs.animationDuration}ms ease-in-out`;

    /// Draw icon
    var icon = document.createElement('div');
    icon.setAttribute('id', 'cmg-rocker-icon-text');
    icon.setAttribute('style', `color: rgba(256,256,256,0.7); font-size: ${rockerCircleRadius * 0.75}px !important;padding: ${rockerCircleRadius * 0.15}px !important;display: inline-block;transition: transform 50ms ease-out;`);

    let iconData = actionIcons[configs[typeOfMenu].rockerAction];
    if (iconData.length <= 3) {
        /// Show unicode icon
        icon.textContent = actionIcons[configs[typeOfMenu].rockerAction];

    } else {
        /// Show SVG icon
        // let svgIcon = document.createElement('svg');
        // svgIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        // svgIcon.setAttribute('height', `${rockerCircleRadius * 0.75}px`);
        // svgIcon.setAttribute('width', `${rockerCircleRadius * 0.75}px`);
        // svgIcon.setAttribute('viewBox', `0 0 ${rockerCircleRadius * 0.75} ${rockerCircleRadius * 0.75}`);
        // svgIcon.setAttribute('fill', `#ffffff`);
        // svgIcon.innerHTML = `<path d="${iconData}"/>`;

        let svgIcon = document.createElement('canvas');
        icon.appendChild(svgIcon);

        let svgCanvasContext = svgIcon.getContext('2d');
        svgCanvasContext.save();

        /// Set color
        let iconColorRgb = getTextColorForBackground(bgColor);
        svgCanvasContext.fillStyle = `rgba(${iconColorRgb.red}, ${iconColorRgb.green}, ${iconColorRgb.blue}, ${configs.iconOpacity})`;

        let p = new Path2D(iconData);
        // svgCanvasContext.translate(dxForText - (iconSize / 2), dyForText - verticalShiftForIcon - (iconSize / (circleRadius - innerCircleRadius > iconSize * 2.5 ? 1.5 : 2)));
        let scale = rockerCircleRadius * 0.7 / 24;
        svgCanvasContext.scale(scale, scale);
        svgCanvasContext.fill(p);
        svgCanvasContext.restore();
    }

    rockerCircle.appendChild(icon);
    document.body.appendChild(rockerCircle);

    setTimeout(function () {
        rockerCircle.style.opacity = rockerCircleOpacity;
        rockerCircle.style.transform = `scale(1.0)`;
    }, 1);
}

function hideRockerIcon(selected = false) {
    if (rockerCircle == null) return;

    // if (configs.circleHideAnimation) {
    rockerCircle.style.opacity = 0.0;
    rockerCircle.style.transform = selected ? 'scale(3.0)' : 'scale(0.0)';
    // }

    setTimeout(function () {
        rockerCircle.parentNode.removeChild(rockerCircle);
        rockerCircle = null;
        // }, configs.circleHideAnimation ? configs.animationDuration : 0);
    }, configs.animationDuration);
}