function showBackgroundDimmer() {
    backgroundDimmer = document.createElement('div');
    backgroundDimmer.setAttribute('id', 'cmg-page-dimmer');
    // backgroundDimmer.style.opacity = 0.0;
    // backgroundDimmer.style.transition = `opacity ${configs.animationDuration}ms ease-out`;
    backgroundDimmer.style.transition = `background ${configs.animationDuration}ms ease-out`;
    backgroundDimmer.style.background = `rgba(0,0,0,0)`;
    document.body.appendChild(backgroundDimmer);

    setTimeout(function () {
        // backgroundDimmer.style.opacity = configs.backgroundDimmerOpacity;
        backgroundDimmer.style.background = `rgba(0,0,0,${configs.backgroundDimmerOpacity})`;
    }, 3);
}

function hideBackgroundDimmer() {
    if (backgroundDimmer !== null && backgroundDimmer !== undefined) {
        // backgroundDimmer.style.opacity = 0.0;
        backgroundDimmer.style.background = `rgba(0,0,0,0)`;
        setTimeout(function () {
            if (backgroundDimmer !== null)
                backgroundDimmer.parentNode.removeChild(backgroundDimmer);
            backgroundDimmer = null;
        }, configs.animationDuration);
    }
}