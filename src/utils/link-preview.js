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

    const linkElement = elementUnderCursor;
    const linkRect = elementUnderCursor.getBoundingClientRect();

    /// Size calculations
    const desiredHeight = window.innerHeight * (screenHeightToTakeInitially);
    const desiredWidth = window.innerWidth * (screenHeightToTakeInitially / 1.25);

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
    const buttonSize = 24;
    const btnInnerPadding = 15;
    const topControlsContainer = document.createElement('div');
    topControlsContainer.setAttribute('class', 'cmg-link-preview-buttons-wrapper');
    // topControlsContainer.style.right = `${headerTopPadding}px`;
    // topControlsContainer.style.top = `${headerTopPadding - (buttonSize / 2)}px`;
    topControlsContainer.style.left = `${dxToShow + desiredWidth + headerTopPadding}px`;
    topControlsContainer.style.top = `${dyToShow}px`;

    /// Add close button
    const closeButton = document.createElement('div');
    closeButton.setAttribute('title', chrome.i18n.getMessage("closeLabel") ? chrome.i18n.getMessage("closeLabel") : 'Close');
    closeButton.setAttribute('class', 'cmg-link-preview-button');
    closeButton.style.width = `${buttonSize + btnInnerPadding}px`;
    closeButton.style.height = `${buttonSize + btnInnerPadding}px`;
    closeButton.style.fontSize = `${buttonSize}px`;

    const iconCLoseTab = createSvgIconFromPath(actionIcons['closeCurrentTab'], buttonSize, `padding: ${btnInnerPadding / 2}px !important;`);
    closeButton.appendChild(iconCLoseTab);
    topControlsContainer.appendChild(closeButton);

    closeButton.addEventListener('mousedown', function () {
        closeFullscreenView();
    });

    /// Add open in background tab button
    const openInBgTabButton = document.createElement('div');
    openInBgTabButton.setAttribute('class', 'cmg-link-preview-button');
    openInBgTabButton.setAttribute('title', chrome.i18n.getMessage("openInBgTab") ? chrome.i18n.getMessage("openInBgTab") : 'Open in background');
    // openInBgTabButton.setAttribute('style', `all:revert;cursor: pointer; padding: ${btnInnerPadding}px !important; text-align: center;width: ${buttonSize + btnInnerPadding}px; height: ${buttonSize + btnInnerPadding}px; border-radius: 50%; color: rgba(256,256,256,0.7);font-size: ${buttonSize}px; line-height: 1.2;`);
    openInBgTabButton.style.width = `${buttonSize + btnInnerPadding}px`;
    openInBgTabButton.style.height = `${buttonSize + btnInnerPadding}px`;

    /// Add icon
    const iconBgTab = createSvgIconFromPath(actionIcons['openInBgTab'], buttonSize, `padding: ${btnInnerPadding / 2}px !important;`);
    openInBgTabButton.appendChild(iconBgTab);
    topControlsContainer.appendChild(openInBgTabButton);

    openInBgTabButton.addEventListener('mousedown', function () {
        closeFullscreenView();
        chrome.runtime.sendMessage({ actionToDo: 'openInBgTab', url: url });
    })

    /// Add open in new tab button
    let openInNewTabButton = document.createElement('div');
    openInNewTabButton.setAttribute('class', 'cmg-link-preview-button');
    openInNewTabButton.setAttribute('title', chrome.i18n.getMessage("openInFgTab") ? chrome.i18n.getMessage("openInFgTab") : 'Open in new tab');
    // openInNewTabButton.setAttribute('style', `all:revert;cursor: pointer; padding: ${btnInnerPadding}px !important; text-align: center;width: ${buttonSize + btnInnerPadding}px; height: ${buttonSize + btnInnerPadding}px; border-radius: 50%; color: rgba(256,256,256,0.7);font-size: ${buttonSize}px; line-height: 1.2;`);
    openInNewTabButton.style.width = `${buttonSize + btnInnerPadding}px`;
    openInNewTabButton.style.height = `${buttonSize + btnInnerPadding}px`;

    const iconFgTab = createSvgIconFromPath(actionIcons['openInFgTab'], buttonSize, `padding: ${btnInnerPadding / 2}px !important;`);
    openInNewTabButton.appendChild(iconFgTab);
    topControlsContainer.appendChild(openInNewTabButton);

    openInNewTabButton.addEventListener('mousedown', function () {
        closeFullscreenView();
        chrome.runtime.sendMessage({ actionToDo: 'openInFgTab', url: url });
    });

    document.body.appendChild(topControlsContainer);


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

    const iframe = document.createElement('iframe');
    iframe.setAttribute('src', url);
    iframe.setAttribute('id', 'cmg-link-preview');
    iframe.setAttribute('resize', 'both');
    iframe.setAttribute('overflow', 'auto');
    iframe.setAttribute('frameBorder', '0');
    iframe.setAttribute('referrerpolicy', 'no-referrer');

    // iframe.setAttribute('style', `background-color: transparent; border-radius: ${borderRadius}px; position: fixed; z-index: 999999 !important; `);
    // iframe.style.top = '0px';
    // iframe.style.left = '0px';
    // iframe.style.transformOrigin = '50% 50%';

    // iframe.style.transform = `translate(${dxToShow}px, ${window.screen.height}px)`; /// Slide up transition
    // iframe.style.transform = `scale(0.0) translate(${dxToShow}px, ${dyToShow}px)`; /// Scale up transition
    // iframe.style.transform = `scale(0.0) translate(${linkRect.left}px, ${linkRect.top}px)`; /// From link
    iframe.style.transform = `translate(${linkRect.left + (linkRect.width / 2) - (desiredWidth / 2)}px, ${linkRect.top + (linkRect.height / 2) - (desiredHeight / 2)}px) scale(0.0)`; /// From link 2

    iframe.style.opacity = 0.0;
    // iframe.style.transition = `opacity ${transitionDuration}ms ease-out, transform ${transitionDuration}ms ease-out, background-color ${transitionDuration}ms ease-out`;

    iframe.setAttribute('height', desiredHeight);
    iframe.setAttribute('width', desiredWidth);

    document.body.appendChild(iframe);

    /// Show fullscreen image
    setTimeout(function () {

        // fullscreenImageIsOpen = true;
        // iframe.style.backgroundColor = 'white';
        // iframe.style.opacity = 1.0;
        iframe.style.transform = `translate(${dxToShow}px, ${dyToShow}px) scale(1.0) `;

        // document.addEventListener('wheel', preventPageScroll, { passive: false });
        // document.addEventListener('scroll', preventPageScroll, { passive: false });
        // document.addEventListener('keydown', keyboardListener);
    }, 50);

    setTimeout(function () {

        fullscreenImageIsOpen = true;
        iframe.style.backgroundColor = 'white';
        iframe.style.opacity = 1.0;

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
        iframe.style.opacity = 0.0;

        // iframe.style.transform = `scale(0.0) translate(${linkRect.left}px, ${linkRect.top}px)`; /// To link transition (incorrect coordinates)
        iframe.style.transform = `translate(${linkRect.left + (linkRect.width / 2) - (desiredWidth / 2)}px, ${linkRect.top + (linkRect.height / 2) - (desiredHeight / 2)}px) scale(0.0)`; /// To link transition 2
        // iframe.style.transform = `translate(${dxToShow}px, ${window.screen.height}px)`; /// Slide down transition
        // iframe.style.transform = `translate(${dxToShow}px, ${dyToShow}px) scale(0.0)`; /// Scale down transition

        setTimeout(function () {
            // document.body.removeChild(iframeElement);
            iframe.remove();
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
                // backgroundDimmer.parentNode.removeChild(backgroundDimmer);
                // topControlsContainer.parentNode.removeChild(topControlsContainer);
                backgroundDimmer.remove();
                topControlsContainer.remove();
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