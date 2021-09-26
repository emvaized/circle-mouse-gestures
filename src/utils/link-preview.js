function openLinkPreview(elementUnderCursor) {
    let transitionDuration = 300;
    let bgOpacity = 0.5;
    let screenHeightToTakeInitially = 0.75;
    let headerTopPadding = 30;
    let borderRadius = 2;
    let clickOutsideToExit = true;
    let reduceDimmerOpacityOnHover = false;
    let multiplierToReduceBgOpacityOnHover = 0.85;
    let regulateDimmerOpacityByScroll = false;
    let preventScrollOnPage = false;

    const linkElement = elementUnderCursor;
    const linkRect = elementUnderCursor.getBoundingClientRect();

    /// Size calculations
    const desiredHeight = window.innerHeight * (screenHeightToTakeInitially);
    const desiredWidth = window.innerWidth * (screenHeightToTakeInitially / 1.25);

    /// dx/dy calculation
    let dxToShow = window.innerWidth / 2 - (desiredWidth / 2);
    let dyToShow = window.innerHeight / 2 - (desiredHeight / 2);

    /// Background dimmer
    const backgroundDimmer = document.createElement('div');
    backgroundDimmer.setAttribute('class', 'cmg-link-preview-bg-dimmer');
    // backgroundDimmer.setAttribute('style', `${clickOutsideToExit ? 'cursor: pointer;' : ''}z-index: 99999; width:${document.documentElement.clientWidth}px;height: ${document.documentElement.scrollHeight}px;  opacity: 0.0; transition: opacity ${transitionDuration}ms ease-in-out; position:fixed; background: black !important; top: 0px; left: 0px;`);
    // backgroundDimmer.setAttribute('style', `width:${document.documentElement.clientWidth}px;height: ${document.documentElement.scrollHeight}px;  `);
    backgroundDimmer.style.width = '100%';
    backgroundDimmer.style.height = '100%';
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

    /// Create iframe
    let url = linkElement.getAttribute('href') || linkElement.getAttribute('data-url') || linkElement.parentNode.getAttribute('href') || linkElement.parentNode.getAttribute('data-url');
    if (configs.debugMode) {
        console.log('url for preview:');
        console.log(url);
    }

    if (url == null || url == undefined) return;
    if (url[0] == '/' || url[0] == '#') {
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

        document.addEventListener('keydown', keyboardListener);

        if (preventScrollOnPage) {
            document.addEventListener('wheel', preventPageScroll, { passive: false });
            document.addEventListener('scroll', preventPageScroll, { passive: false });
        }

    }, 1);


    /// Create title
    const hintSpan = document.createElement('span');
    hintSpan.setAttribute('class', 'cmg-link-preview-title')
    hintSpan.innerText = url;

    document.body.appendChild(hintSpan);
    hintSpan.style.transform = `translate(${dxToShow + (desiredWidth / 2) - (hintSpan.clientWidth / 2)}px, ${dyToShow - (headerTopPadding * 1.3)}px)`;

    // setTimeout(function () {
    //     hintSpan.style.opacity = 1.0;
    // }, 1);

    iframe.onload = function () {
        if (iframe.contentDocument == null) {
            hintSpan.style.opacity = 1.0;
            return;
        }

        url = iframe.contentDocument.location.href;
        hintSpan.style.opacity = 0.0;
        setTimeout(function () {
            if (hintSpan == null) return;

            hintSpan.innerText = iframe.contentDocument.title;
            hintSpan.style.transform = `translate(${dxToShow + (desiredWidth / 2) - (hintSpan.clientWidth / 2)}px, ${dyToShow - (headerTopPadding * 1.3)}px)`;
            hintSpan.style.opacity = 1.0;
        }, 300);
    }


    /// Create buttons in top right corner
    const buttonSize = 24;
    const btnInnerPadding = 15;
    const topControlsContainer = document.createElement('div');
    topControlsContainer.setAttribute('class', 'cmg-link-preview-buttons-wrapper');
    // topControlsContainer.style.left = `${dxToShow + desiredWidth + headerTopPadding}px`;
    // topControlsContainer.style.top = `${dyToShow}px`;
    topControlsContainer.style.transform = `translate(${dxToShow + desiredWidth + headerTopPadding}px,${dyToShow}px)`;

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
    openInBgTabButton.style.width = `${buttonSize + btnInnerPadding}px`;
    openInBgTabButton.style.height = `${buttonSize + btnInnerPadding}px`;

    const iconBgTab = createSvgIconFromPath(actionIcons['openInBgTab'], buttonSize, `padding: ${btnInnerPadding / 2}px !important;`);
    openInBgTabButton.appendChild(iconBgTab);
    topControlsContainer.appendChild(openInBgTabButton);

    openInBgTabButton.addEventListener('mousedown', function () {
        closeFullscreenView();
        chrome.runtime.sendMessage({ actionToDo: 'openInBgTab', url: url });
    });

    /// Add open in new tab button
    const openInNewTabButton = document.createElement('div');
    openInNewTabButton.setAttribute('class', 'cmg-link-preview-button');
    openInNewTabButton.setAttribute('title', chrome.i18n.getMessage("openInFgTab") ? chrome.i18n.getMessage("openInFgTab") : 'Open in new tab');
    openInNewTabButton.style.width = `${buttonSize + btnInnerPadding}px`;
    openInNewTabButton.style.height = `${buttonSize + btnInnerPadding}px`;

    const iconFgTab = createSvgIconFromPath(actionIcons['openInFgTab'], buttonSize, `padding: ${btnInnerPadding / 2}px !important;`);
    openInNewTabButton.appendChild(iconFgTab);
    topControlsContainer.appendChild(openInNewTabButton);

    openInNewTabButton.addEventListener('mousedown', function () {
        closeFullscreenView();
        chrome.runtime.sendMessage({ actionToDo: 'openInFgTab', url: url });
    });

    /// Add copy url button
    const copyUrlButton = document.createElement('div');
    copyUrlButton.setAttribute('class', 'cmg-link-preview-button');
    copyUrlButton.setAttribute('title', chrome.i18n.getMessage("copyUrl") ? chrome.i18n.getMessage("copyUrl") : 'Copy URL');
    copyUrlButton.style.width = `${buttonSize + btnInnerPadding}px`;
    copyUrlButton.style.height = `${buttonSize + btnInnerPadding}px`;

    const copyURlIcon = createSvgIconFromPath(actionIcons['copyUrl'], buttonSize, `padding: ${btnInnerPadding / 2}px !important;`);
    copyUrlButton.appendChild(copyURlIcon);
    topControlsContainer.appendChild(copyUrlButton);

    copyUrlButton.addEventListener('mousedown', function () {
        copyToClipboard(url);
        // chrome.runtime.sendMessage({
        //     actionToDo: 'showBrowserNotification',
        //     title: chrome.i18n.getMessage("copied") ?? 'Copied URL',
        //     message: url,
        // });
    });

    /// Move preview button
    const movePreviewButton = document.createElement('div');
    movePreviewButton.setAttribute('class', 'cmg-link-preview-button');
    movePreviewButton.setAttribute('title', 'Move preview');
    movePreviewButton.style.width = `${buttonSize + btnInnerPadding}px`;
    movePreviewButton.style.height = `${buttonSize + btnInnerPadding}px`;
    movePreviewButton.style.cursor = 'grab';

    const iconMovePreview = createSvgIconFromPath(actionIcons['toggleFullscreen'], buttonSize, `padding: ${btnInnerPadding / 2}px !important;`);
    movePreviewButton.appendChild(iconMovePreview);
    movePreviewButton.style.transform = 'rotate(45deg)'
    topControlsContainer.appendChild(movePreviewButton);

    movePreviewButton.addEventListener('mousedown', function () {
        iframe.classList.add('cmg-link-preview-dragged');
        movePreviewButton.style.cursor = 'grabbing';

        function movePreviewOnDrag(e) {
            dxToShow = dxToShow + e.movementX;
            dyToShow = dyToShow + e.movementY;
            iframe.style.transform = `translate(${dxToShow}px, ${dyToShow}px) scale(1.0) `;
            topControlsContainer.style.transform = `translate(${dxToShow + desiredWidth + headerTopPadding}px,${dyToShow}px)`;
            hintSpan.style.transform = `translate(${dxToShow + (desiredWidth / 2) - (hintSpan.clientWidth / 2)}px, ${dyToShow - (headerTopPadding * 1.3)}px)`;
        }

        function removeMovePreviewListeners() {
            document.removeEventListener('mousemove', movePreviewOnDrag);
            document.removeEventListener('mouseup', removeMovePreviewListeners);
            movePreviewButton.style.cursor = 'grab';
            iframe.classList.remove('cmg-link-preview-dragged');
        }

        document.addEventListener('mousemove', movePreviewOnDrag);
        document.addEventListener('mouseup', removeMovePreviewListeners);
    });


    document.body.appendChild(topControlsContainer);


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

        document.removeEventListener('keydown', keyboardListener);
        if (preventScrollOnPage) {
            document.removeEventListener('wheel', preventPageScroll, { passive: false });
            document.removeEventListener('scroll', preventPageScroll, { passive: false });
        }

    }

    function hidePreview() {
        iframe.style.opacity = 0.0;

        const updatedlinkRect = elementUnderCursor.getBoundingClientRect();
        const shouldUseScaleAnimation = updatedlinkRect.top < 0 || updatedlinkRect.top > window.innerHeight;

        iframe.style.transform = shouldUseScaleAnimation ?
            `translate(${dxToShow}px, ${dyToShow}px) scale(0.0)` :
            `translate(${updatedlinkRect.left + (updatedlinkRect.width / 2) - (desiredWidth / 2)}px, ${updatedlinkRect.top + (updatedlinkRect.height / 2) - (desiredHeight / 2)}px) scale(0.0)`; /// To link transition 2
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
            hintSpan.style.opacity = 0.0;

            backgroundDimmer.onmousedown = null;
            backgroundDimmer.onmouseover = null;
            backgroundDimmer.onmouseout = null;

            setTimeout(function () {
                // backgroundDimmer.parentNode.removeChild(backgroundDimmer);
                // topControlsContainer.parentNode.removeChild(topControlsContainer);
                backgroundDimmer.remove();
                topControlsContainer.remove();
                hintSpan.remove();
                // backgroundDimmer = null;
                // topControlsContainer = null;
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