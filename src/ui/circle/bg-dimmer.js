function showBackgroundDimmer() {
    backgroundDimmer = document.createElement('div');
    backgroundDimmer.setAttribute('id', 'cmg-page-dimmer');
    backgroundDimmer.style.opacity = 0.0;
    backgroundDimmer.style.transition = `opacity ${configs.animationDuration}ms ease-out`;
    // backgroundDimmer.setAttribute('style', `overflow: hidden; z-index: 9999; width:${document.documentElement.clientWidth}px; height: ${document.documentElement.clientHeight}px;  opacity: 0.0; transition: opacity ${configs.animationDuration}ms ease-out; position:fixed; background: black !important; top: 0px; left: 0px;`);
    document.body.appendChild(backgroundDimmer);

    setTimeout(function () {
        backgroundDimmer.style.opacity = configs.backgroundDimmerOpacity;
    }, 3);
}

function hideBackgroundDimmer() {
    if (backgroundDimmer !== null && backgroundDimmer !== undefined) {
        backgroundDimmer.style.opacity = 0.0;
        setTimeout(function () {
            if (backgroundDimmer !== null)
                backgroundDimmer.parentNode.removeChild(backgroundDimmer);
            backgroundDimmer = null;
        }, configs.animationDuration);
    }
}