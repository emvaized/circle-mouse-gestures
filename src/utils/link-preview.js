function openLinkPreview(elementUnderCursor) {
    let transitionDuration = 300;
    let bgOpacity = 0.5;
    let screenHeightToTakeInitially = 0.75;
    let headerTopPadding = 30;
    let borderRadius = 2;
    let clickOutsideToExit = true;
    let reduceDimmerOpacityOnHover = true;
    let multiplierToReduceBgOpacityOnHover = 0.85;
    let regulateDimmerOpacityByScroll = true;

    let linkElement = elementUnderCursor;
    let linkRect = elementUnderCursor.getBoundingClientRect();
    console.log(linkRect);

    /// Size calculations
    let desiredHeight = window.innerHeight * (screenHeightToTakeInitially);
    let desiredWidth = window.innerWidth * (screenHeightToTakeInitially / 1.25);

    /// dx/dy calculation
    const dxToShow = window.innerWidth / 2 - (desiredWidth / 2);
    const dyToShow = window.innerHeight / 2 - (desiredHeight / 2);

    /// Background dimmer
    let backgroundDimmer = document.createElement('div');
    backgroundDimmer.setAttribute('style', `${clickOutsideToExit ? 'cursor: pointer;' : ''}z-index: 99999; width:${document.documentElement.clientWidth}px;height: ${document.documentElement.scrollHeight}px;  opacity: 0.0; transition: opacity ${transitionDuration}ms ease-in-out; position:fixed; background: black !important; top: 0px; left: 0px;`);
    document.body.appendChild(backgroundDimmer);

    /// Add dimmer listeners
    setTimeout(function () {
        backgroundDimmer.style.opacity = bgOpacity;
        if (clickOutsideToExit)
            backgroundDimmer.onmousedown = function () {
                closeFullscreenView();
            }

        if (reduceDimmerOpacityOnHover) {
            backgroundDimmer.onmouseover = function () {
                if (backgroundDimmer !== null && backgroundDimmer !== undefined) {
                    if (backgroundDimmer.style.transition == '')
                        backgroundDimmer.style.transition = `opacity ${transitionDuration}ms ease-in-out`;
                    backgroundDimmer.style.opacity = bgOpacity * multiplierToReduceBgOpacityOnHover;
                }
            }

            backgroundDimmer.onmouseout = function () {
                if (backgroundDimmer !== null && backgroundDimmer !== undefined) {
                    if (backgroundDimmer.style.transition == '')
                        backgroundDimmer.style.transition = `opacity ${transitionDuration}ms ease-in-out`;
                    backgroundDimmer.style.opacity = bgOpacity;
                }
            }
        }

        if (regulateDimmerOpacityByScroll) {
            backgroundDimmer.onwheel = function (e) {
                if (backgroundDimmer.style.transition !== '')
                    backgroundDimmer.style.transition = '';
                let wheelDelta = e.wheelDelta ?? -e.deltaY;
                bgOpacity += wheelDelta / 2000;
                if (bgOpacity > 1) bgOpacity = 1;
                if (bgOpacity < 0.2) bgOpacity = 0.2;
                backgroundDimmer.style.opacity = bgOpacity;
            }
        }

    }, 1);

    /// Buttons in top right corner
    let buttonSize = 24;
    let btnInnerPadding = 15;
    let topControlsContainer = document.createElement('div');
    topControlsContainer.setAttribute('style', `all:revert; position: fixed; z-index:100003; right: ${headerTopPadding}px; top: ${headerTopPadding - (buttonSize / 2)}px; transition: opacity ${transitionDuration}ms ease-in-out`);
    document.body.appendChild(topControlsContainer);

    /// Add close button
    let closeButton = document.createElement('div');
    closeButton.setAttribute('title', chrome.i18n.getMessage("closeLabel") ? chrome.i18n.getMessage("closeLabel") : 'Close');
    closeButton.setAttribute('style', `all:revert;cursor: pointer; padding: ${btnInnerPadding}px; text-align: center;width: ${buttonSize + btnInnerPadding}px; height: ${buttonSize + btnInnerPadding}px; border-radius: 50%; color: rgba(256,256,256,0.7);font-size: ${buttonSize}px;`);
    let btnLabel = document.createElement('span');
    btnLabel.setAttribute('style', 'vertical-align: middle');
    btnLabel.innerText = '✕';
    closeButton.appendChild(btnLabel);
    topControlsContainer.appendChild(closeButton);

    closeButton.addEventListener('mousedown', function () {
        closeFullscreenView();
    });

    closeButton.addEventListener('mouseover', function () {
        closeButton.style.background = 'rgba(256,256,256,0.35)'
        closeButton.style.color = 'rgba(256,256,256,1.0)'
    })

    closeButton.addEventListener('mouseout', function () {
        closeButton.style.background = 'transparent'
        closeButton.style.color = 'rgba(256,256,256,0.7)'
    })

    /// Add open in background tab button
    let openInBgTabButton = document.createElement('div');
    openInBgTabButton.setAttribute('title', chrome.i18n.getMessage("openInBgTab") ? chrome.i18n.getMessage("openInBgTab") : 'Open in background');
    openInBgTabButton.setAttribute('style', `all:revert;cursor: pointer; padding: ${btnInnerPadding}px !important; text-align: center;width: ${buttonSize + btnInnerPadding}px; height: ${buttonSize + btnInnerPadding}px; border-radius: 50%; color: rgba(256,256,256,0.7);font-size: ${buttonSize}px; line-height: 1.2;`);

    /// Add icon
    let iconBgTab = createSvgIconFromPath(actionIcons['openInBgTab'], buttonSize, `padding: ${btnInnerPadding / 2}px !important;`);
    openInBgTabButton.appendChild(iconBgTab);
    topControlsContainer.appendChild(openInBgTabButton);

    openInBgTabButton.addEventListener('mousedown', function () {
        closeFullscreenView();
        chrome.runtime.sendMessage({ actionToDo: 'openInBgTab', url: url });
    })

    openInBgTabButton.addEventListener('mouseover', function () {
        openInBgTabButton.style.background = 'rgba(256,256,256,0.35)'
        openInBgTabButton.style.color = 'rgba(256,256,256,1.0)'
    })

    openInBgTabButton.addEventListener('mouseout', function () {
        openInBgTabButton.style.background = 'transparent'
        openInBgTabButton.style.color = 'rgba(256,256,256,0.7)'
    })

    /// Add open in new tab button
    let openInNewTabButton = document.createElement('div');
    openInNewTabButton.setAttribute('title', chrome.i18n.getMessage("openInFgTab") ? chrome.i18n.getMessage("openInFgTab") : 'Open in new tab');
    openInNewTabButton.setAttribute('style', `all:revert;cursor: pointer; padding: ${btnInnerPadding}px !important; text-align: center;width: ${buttonSize + btnInnerPadding}px; height: ${buttonSize + btnInnerPadding}px; border-radius: 50%; color: rgba(256,256,256,0.7);font-size: ${buttonSize}px; line-height: 1.2;`);

    let iconFgTab = createSvgIconFromPath(actionIcons['openInFgTab'], buttonSize, `padding: ${btnInnerPadding / 2}px !important;`);
    openInNewTabButton.appendChild(iconFgTab);
    topControlsContainer.appendChild(openInNewTabButton);

    openInNewTabButton.addEventListener('mousedown', function () {
        closeFullscreenView();
        chrome.runtime.sendMessage({ actionToDo: 'openInFgTab', url: url });
    })

    openInNewTabButton.addEventListener('mouseover', function () {
        openInNewTabButton.style.background = 'rgba(256,256,256,0.35)'
        openInNewTabButton.style.color = 'rgba(256,256,256,1.0)'
    })

    openInNewTabButton.addEventListener('mouseout', function () {
        openInNewTabButton.style.background = 'transparent'
        openInNewTabButton.style.color = 'rgba(256,256,256,0.7)'
    })

    /// Create iframe
    let url = linkElement.getAttribute('href') || linkElement.getAttribute('data-url') || linkElement.parentNode.getAttribute('href') || linkElement.parentNode.getAttribute('data-url');
    if (configs.debugMode) {
        console.log('url for preview:');
        console.log(url);
    }

    if (url == null || url == undefined) return;

    if (url[0] == '/') {
        url = url.substring(1);
        url = 'https://' + window.location.href.split('/')[2] + '/' + url;
    }

    let idForIframe = 'cmg-link-preview';
    let iframe = document.createElement('iframe');
    iframe.setAttribute('src', url);
    iframe.setAttribute('id', idForIframe);
    iframe.setAttribute('resize', 'both');
    iframe.setAttribute('overflow', 'auto');
    iframe.setAttribute('frameBorder', '0');
    iframe.setAttribute('referrerpolicy', 'no-referrer');
    // iframe.style.opacity = 0.0;
    iframe.setAttribute('style', `background-color: transparent; border-radius: ${borderRadius}px; position: fixed; z-index: 999999 !important; `);
    iframe.style.transformOrigin = '50% 50%';

    iframe.style.transform = `translate(${dxToShow}px, ${window.screen.height}px)`; /// Slide up transition
    // iframe.style.transform = `scale(0.0) translate(${dxToShow}px, ${dyToShow}px)`; /// Scale up transition
    // iframe.style.transform = `scale(0.0) translate(${linkRect.left}px, ${linkRect.top}px)`; /// From link
    iframe.style.transition = `opacity ${transitionDuration}ms ease-out, transform ${transitionDuration}ms ease-out, background-color ${transitionDuration}ms ease-out`;
    iframe.style.top = '0px';
    iframe.style.left = '0px';
    iframe.setAttribute('height', desiredHeight);
    iframe.setAttribute('width', desiredWidth);

    document.body.appendChild(iframe);

    /// Show fullscreen image
    setTimeout(function () {

        fullscreenImageIsOpen = true;
        let iframe = document.getElementById(idForIframe);
        // iframe.style.opacity = 1.0;
        iframe.style.backgroundColor = 'white';
        iframe.style.transform = `scale(1.0) translate(${dxToShow}px, ${dyToShow}px)`;

        document.addEventListener('wheel', preventPageScroll, { passive: false });
        document.addEventListener('scroll', preventPageScroll, { passive: false });
        document.addEventListener('keydown', keyboardListener);
    }, 1);


    function keyboardListener(e) {
        if (e.key === "Escape") { // escape key maps to keycode `27`
            e.preventDefault();
            closeFullscreenView();
        }
    }

    function preventPageScroll(e) {
        e.preventDefault();
    }

    function closeFullscreenView() {
        hideBgDimmer();
        hidePreview();
        document.removeEventListener('wheel', preventPageScroll, { passive: false });
        document.removeEventListener('scroll', preventPageScroll, { passive: false });
        document.removeEventListener('keydown', keyboardListener);
    }

    function hidePreview() {
        let iframeElement = document.getElementById(idForIframe);
        iframeElement.style.opacity = 0.0;
        // iframe.style.transform = `scale(0.0) translate(${linkRect.left}px, ${linkRect.top}px)`; /// To link transition (incorrect coordinates)
        iframe.style.transform = `translate(${dxToShow}px, ${window.screen.height}px)`; /// Slide down transition

        setTimeout(function () {
            document.body.removeChild(iframeElement);
            fullscreenImageIsOpen = false;
        }, transitionDuration);
    }

    function hideBgDimmer() {
        if (backgroundDimmer !== null && backgroundDimmer !== undefined) {
            if (backgroundDimmer.style.transition == '')
                backgroundDimmer.style.transition = `opacity ${transitionDuration}ms ease-in-out`;
            backgroundDimmer.style.opacity = 0.0;
            topControlsContainer.style.opacity = 0.0;
            backgroundDimmer.onmousedown = null;
            backgroundDimmer.onmouseover = null;
            backgroundDimmer.onmouseout = null;

            setTimeout(function () {
                backgroundDimmer.parentNode.removeChild(backgroundDimmer);
                topControlsContainer.parentNode.removeChild(topControlsContainer);
                backgroundDimmer = null;
                topControlsContainer = null;
            }, transitionDuration);
        }
    }
}

function createSvgIconFromPath(path, radius, style) {
    let canvas = document.createElement('canvas');
    canvas.setAttribute('width', radius);
    canvas.setAttribute('height', radius);
    canvas.setAttribute('style', style);
    let canvasContext = canvas.getContext('2d');
    canvasContext.save();
    canvasContext.fillStyle = `white`;
    let pathBg = new Path2D(path);
    canvasContext.fill(pathBg);
    canvasContext.restore();
    return canvas;
}