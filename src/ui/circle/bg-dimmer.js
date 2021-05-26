function showBackgroundDimmer() {
    backgroundDimmer = document.createElement('div');
    backgroundDimmer.setAttribute('id', 'cmg-page-dimmer');
    backgroundDimmer.setAttribute('style', `overflow: hidden; z-index: 9999; width:${document.documentElement.clientWidth}px; height: ${document.documentElement.scrollHeight}px;  opacity: 0.0; transition: opacity ${configs.animationDuration}ms ease-out; position:absolute; background: black !important; top: 0px; left: 0px;`);
    document.body.appendChild(backgroundDimmer);

    setTimeout(function () {
        backgroundDimmer.style.opacity = configs.backgroundDimmerOpacity;
    }, 1);
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