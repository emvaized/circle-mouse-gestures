async function showLinkTooltip() {
    if (configs.debugMode) console.log('showing link tooltip...');

    const fgColorRgb = getTextColorForBackground(configs[typeOfMenu].levels[0].color ?? configs[typeOfMenu].color);

    linkTooltip = document.createElement('div');
    linkTooltip.setAttribute('class', 'cmg-link-tooltip');
    linkTooltip.style.maxWidth = `${configs.circleRadius * 2}px`;
    linkTooltip.style.background =  configs[typeOfMenu].levels[0].color ?? configs[typeOfMenu].color;

    if (configs.addCircleShadow)
        linkTooltip.style.boxShadow = `0px 5px 12px 0 rgba(0,0,0,${configs.circleShadowOpacity})`;

    // if (configs.addBlur)
    //     linkTooltip.style.backdropFilter = `blur(${configs.blurRadius}px)`;

    let linkToDisplay = hoveredLink.replaceAll('http://', '').replaceAll('https://', '').replaceAll('www.', '').trim();
    if (linkToDisplay[linkToDisplay.length - 1] == '/') linkToDisplay = linkToDisplay.slice(0, -1);

    /// Draw type icon
    if (configs.showCategoryIconInTooltip) addTypeIcon(typeOfMenu, linkTooltip);
    function addTypeIcon(typeOfMenu, linkTooltip){
        const typeIcon = document.createElement('div');
        typeIcon.setAttribute('style', `color: rgba(256,256,256,0.7); font-size: 12px !important;display: inline-block; margin-right: 3px;`);

        let iconData = helperTooltipIcons[typeOfMenu];
        if (iconData.length <= 3) {
            /// Show unicode icon
            typeIcon.textContent = iconData;

        } else {
            /// Show SVG icon
            const svgIcon = document.createElement('canvas');
            svgIcon.setAttribute('height', '12px');
            svgIcon.setAttribute('width', '12px');
            svgIcon.style.transform = 'translate(0, 1.5px)';
            typeIcon.appendChild(svgIcon);
            const svgCanvasContext = svgIcon.getContext('2d');
            svgCanvasContext.save();

            /// Set color
            svgCanvasContext.fillStyle = `rgba(${fgColorRgb.red}, ${fgColorRgb.green}, ${fgColorRgb.blue}, 0.85)`;
            svgCanvasContext.scale(0.5, 0.5);

            const p = new Path2D(iconData);
            svgCanvasContext.fill(p);
            svgCanvasContext.restore();
        }

        linkTooltip.appendChild(typeIcon);
    }

    /// Add type label
    addTypeLabel(typeOfMenu, linkTooltip);
    function addTypeLabel(type, parent){
        const label = document.createElement('span');
        label.setAttribute('class', 'cmg-helper-tooltip-label');
        label.innerText = type == 'linkMenu' ?
            // configs.showLinkTextInTooltip && hoveredLinkTitle !== null && hoveredLinkTitle !== undefined && hoveredLinkTitle !== ''
            //     && hoveredLinkTitle !== hoveredLink && hoveredLinkTitle !== linkToDisplay
            //     ? (hoveredLinkTitle.length > 24 ? hoveredLinkTitle.substring(0, 24) + '...' : hoveredLinkTitle)
            //     : 
                chrome.i18n.getMessage('link')
            : (type == 'imageMenu' || type == 'imageLinkMenu') ? chrome.i18n.getMessage('image')
                : typeOfMenu == 'playerMenu' ? chrome.i18n.getMessage('player')
                    : type == 'selectionMenu' || (type == 'textFieldMenu' && textSelection.toString() !== '') ? chrome.i18n.getMessage('selectedText') :
                    type == 'textFieldMenu' ? chrome.i18n.getMessage('inputField') : chrome.i18n.getMessage('page');
    
        label.innerHTML += '<br />';
        label.style.color = `rgba(${fgColorRgb.red}, ${fgColorRgb.green}, ${fgColorRgb.blue}, 0.85)`;
        parent.appendChild(label);
    }

    /// Set body
    addContents(typeOfMenu, linkTooltip)
    async function addContents(typeOfMenu, linkTooltip){
        const text = document.createElement('span');
        text.id = 'cmg-helper-tooltip-body';
        const maxSymbolsInBody = 33;

        if (typeOfMenu == 'imageMenu' || typeOfMenu == 'playerMenu' || typeOfMenu == 'imageLinkMenu') {
            let fileName;
            let link = typeOfMenu == 'imageLinkMenu' ? hoveredImageLink : hoveredLink;
            try {
                fileName = link.split('#').shift().split('?').shift().split('/').pop();
            } catch (e) { if (configs.debugMode) console.log(e); }
            text.innerText = fileName && fileName.includes('.') ? fileName : link;
        } else {
            if (typeOfMenu == 'selectionMenu' || (typeOfMenu == 'textFieldMenu' && textSelection.toString() !== '')) {
                const textSelectionString = textSelection.toString();
                // text.innerText = textSelectionString;
                text.innerText = `${textSelectionString.length} ${chrome.i18n.getMessage('symbolsCount').toLowerCase()}, ${textSelectionString.split(' ').length} ${chrome.i18n.getMessage('wordsCount').toLowerCase()}`;
            } else if (typeOfMenu == 'textFieldMenu') {

                /// Set tooltip body to display current clipboard content
                const result = await getCurrentClipboard();
                currentClipboardContent = result;

                if (configs.debugMode) {
                    console.log('current clipboard content:');
                    console.log(currentClipboardContent);
                }

                if (currentClipboardContent !== null && currentClipboardContent !== undefined && currentClipboardContent !== '') {
                    if (text !== null)
                        text.innerText = currentClipboardContent.length > maxSymbolsInBody ? currentClipboardContent.substring(0, maxSymbolsInBody - 3) + '...' : currentClipboardContent;
                    if (label !== null)
                        label.innerHTML = chrome.i18n.getMessage('clipboard') + '<br />';

                    const dxToShow = realLeftCoord + (canvasRadius / 2) - (linkTooltip.clientWidth / 2);
                    const dyToShow = realTopCoord - (linkTooltip.clientHeight) - 8;
                    linkTooltip.style.transform = `translate(${dxToShow}px, ${dyToShow}px)`;
                }

            } else {
                // text.innerText = configs.showFullLinkInTooltip ? linkToDisplay : linkToDisplay.length > maxSymbolsInBody ? linkToDisplay.substring(0, maxSymbolsInBody - 3) + '...' : linkToDisplay;
                text.innerText = linkToDisplay;
            }
        }

        text.setAttribute('style', `
            color: rgba(${fgColorRgb.red}, ${fgColorRgb.green}, ${fgColorRgb.blue}, 1.0);
            word-break:break-all;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            overflow: hidden !important;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            `);
        linkTooltip.appendChild(text);
    }


    /// Add second line for link+image menu
    if (typeOfMenu == 'imageLinkMenu'){
        // text.innerHTML += '<br>';

        addTypeIcon('linkMenu', linkTooltip)
        addTypeLabel('linkMenu', linkTooltip);
        addContents('linkMenu', linkTooltip)
    }

    
    document.body.appendChild(linkTooltip);

    const linkTooltipHeight = linkTooltip.clientHeight;
    let dxToShow = realLeftCoord + (canvasRadius / 2) - (linkTooltip.clientWidth / 2);
    let dyToShow = realTopCoord - linkTooltipHeight - 8;

    if (configs.addCircleShadow)
        dyToShow += 15;

    /// Check for overflow on top
    if (dyToShow < 0) dyToShow += canvasRadius + linkTooltipHeight + 14;

    // linkTooltip.style.transform = `translate(${dxToShow}px, ${realTopCoord + configs.circleRadius - (linkTooltip.clientHeight / 2)}px) scale(0.0)`;
    switch (configs.showCircleAnimation) {
        case 'noAnimation': {
            linkTooltip.style.opacity = configs.circleOpacity ?? 1.0;
            linkTooltip.style.transform = `translate(${dxToShow}px, ${dyToShow}px) scale(1.0)`;
        } break;
        case 'fade': {
            linkTooltip.style.opacity = 0.0;
            linkTooltip.style.transform = `translate(${dxToShow}px, ${dyToShow}px) scale(1.0)`;
        } break;
        case 'scale': {
            linkTooltip.style.opacity = 0.0;
            // linkTooltip.style.transform = `translate(${dxToShow}px, ${realTopCoord + configs.circleRadius - (linkTooltip.clientHeight / 2)}px) scale(0.0)`;
            linkTooltip.style.transform = `translate(${dxToShow}px, ${dyToShow}px) scale(1.0)`;
        } break;
    }

    setTimeout(function () {
        linkTooltip.style.transition = `transform ${configs.animationDuration}ms ease-out, opacity ${configs.animationDuration}ms ease-out`;
        // linkTooltip.style.transform = `translate(${dxToShow}px, ${dyToShow}px) scale(1.0)`;
        linkTooltip.style.opacity = configs.circleOpacity ?? 1.0;
    }, 1);
}

function hideLinkTooltip() {
    if (linkTooltip == undefined || linkTooltip == null) return;

    // const dxShown = realLeftCoord + (canvasRadius / 2) - (linkTooltip.clientWidth / 2);

    switch (configs.hideCircleAnimation) {
        case 'noAnimation': {
            linkTooltip.style.transition = '';
            linkTooltip.style.opacity = 0.0;
        } break;
        case 'fade': {
            linkTooltip.style.opacity = 0.0;
        } break;
        case 'scale': {
            linkTooltip.style.opacity = 0.0;
            // linkTooltip.style.transform = `translate(${dxShown}px, ${realTopCoord + configs.circleRadius - (linkTooltip.clientHeight / 2)}px) scale(0.0)`;
        } break;
    }

    setTimeout(function () {
        if (linkTooltip !== null && linkTooltip.parentNode !== null)
            linkTooltip.remove();;
        linkTooltip = null;
    }, configs.hideCircleAnimation == 'noAnimation' ? 0 : configs.animationDuration);
}

