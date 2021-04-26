function drawRockerIconInCenter() {
    if (configs.debugMode)
        console.log('Drawing rocker circle icon...');

    let rockerCircleRadius = configs.innerCircleRadius * 1.5;

    rockerCircle = document.createElement('div');
    rockerCircle.setAttribute('class', 'cmg-rocker-icon');

    let bgColor = typeOfMenu == 'linkMenu' ? configs.linkMenu.color : typeOfMenu == 'imageMenu' ? configs.imageMenu.color : configs.regularMenu.color;
    rockerCircle.style.background = bgColor;
    rockerCircle.style.opacity = 0.0;
    rockerCircle.style.width = `${rockerCircleRadius}px`;
    rockerCircle.style.height = `${rockerCircleRadius}px`;
    rockerCircle.style.transform = `scale(0.0)`;
    rockerCircle.style.left = `${leftCoord + (canvasRadius / 2) - (rockerCircleRadius / 2)}px`;
    rockerCircle.style.top = `${topCoord + (canvasRadius / 2) - (rockerCircleRadius / 2)}px`;
    rockerCircle.style.transition = `opacity ${configs.animationDuration}ms ease-in-out, transform ${configs.animationDuration}ms ease-in-out`;

    /// Draw icon
    let icon = document.createElement('span');
    icon.setAttribute('id', 'cmg-rocker-icon-text');
    icon.setAttribute('style', `color: rgba(256,256,256,0.7); font-size: ${rockerCircleRadius * 0.75}px !important;padding: ${rockerCircleRadius * 0.125}px !important;display: inline-block;transition: transform 50ms ease-out;`);
    icon.textContent = actionIcons[typeOfMenu == 'imageMenu' ? imageRockerAction : typeOfMenu == 'linkMenu' ? linkRockerAction : regularRockerAction];
    rockerCircle.appendChild(icon);

    document.body.appendChild(rockerCircle);

    setTimeout(function () {
        rockerCircle.style.opacity = 1.0;
        rockerCircle.style.transform = `scale(1.0)`;
    }, 1);
}

function hideRockerIcon(selected = false) {
    if (rockerCircle == null) return;
    rockerCircle.style.opacity = 0.0;
    rockerCircle.style.transform = selected ? 'scale(3.0)' : 'scale(0.0)';

    setTimeout(function () {
        rockerCircle = null;
        rockerCircle.parentNode.removeChild(rockerCircle);
    }, configs.animationDuration);
}