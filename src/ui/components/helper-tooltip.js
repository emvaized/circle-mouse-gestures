function showLinkTooltip() {
    if (configs.debugMode) console.log('showing link tooltip...');

    let fgColorRgb = getTextColorForBackground(configs[typeOfMenu].color);

    linkTooltip = document.createElement('div');
    linkTooltip.setAttribute('class', 'cmg-link-tooltip');
    linkTooltip.setAttribute('style', `left: 0px; top: 0px;max-width: ${configs.circleRadius * 2}px;z-index: 99999; font-size: 13.5px;opacity: 0.0; align-items: center;display:inline-block !important; position: absolute !important;background: ${configs[typeOfMenu].color}; border-radius: 9px;color: white; text-align: center; padding: 6px; pointer-events: none;`);

    /// Set title
    let label = document.createElement('span');
    label.innerHTML = typeOfMenu == 'linkMenu' ?
        configs.showLinkTextInTooltip && hoveredLinkTitle !== null && hoveredLinkTitle !== undefined && hoveredLinkTitle !== ''
            && hoveredLinkTitle !== hoveredLink && hoveredLinkTitle !== hoveredLink.replaceAll('http://', '').replaceAll('https://', '')
            ? (hoveredLinkTitle.length > 24 ? hoveredLinkTitle.substring(0, 24) + '...' : hoveredLinkTitle)
            : chrome.i18n.getMessage('link')
        : typeOfMenu == 'imageMenu' ? chrome.i18n.getMessage('image')
            : typeOfMenu == 'playerMenu' ? chrome.i18n.getMessage('player')
                : typeOfMenu == 'selectionMenu' || (typeOfMenu == 'textFieldMenu' && textSelection.toString() !== '') ? chrome.i18n.getMessage('selectedText') :
                    typeOfMenu == 'textFieldMenu' ? chrome.i18n.getMessage('inputField') : chrome.i18n.getMessage('page');


    /// Draw type icon
    if (configs.showCategoryIconInTooltip) {
        var typeIcon = document.createElement('div');
        typeIcon.setAttribute('style', `color: rgba(256,256,256,0.7); font-size: 12px !important;display: inline-block; margin-right: 3px;`);

        let iconData = helperTooltipIcons[typeOfMenu];
        if (iconData.length <= 3) {
            /// Show unicode icon
            typeIcon.textContent = iconData;

        } else {
            /// Show SVG icon
            let svgIcon = document.createElement('canvas');
            svgIcon.setAttribute('height', '12px');
            svgIcon.setAttribute('width', '12px');
            svgIcon.setAttribute('style', 'transform: translate(0, 1.5px)');
            typeIcon.appendChild(svgIcon);

            let svgCanvasContext = svgIcon.getContext('2d');
            svgCanvasContext.save();

            /// Set color
            svgCanvasContext.fillStyle = `rgba(${fgColorRgb.red}, ${fgColorRgb.green}, ${fgColorRgb.blue}, 0.75)`;
            svgCanvasContext.scale(0.5, 0.5);

            let p = new Path2D(iconData);
            svgCanvasContext.fill(p);
            svgCanvasContext.restore();
        }

        linkTooltip.appendChild(typeIcon);
    }

    label.innerHTML += '<br />';
    label.setAttribute('style', `color: rgba(${fgColorRgb.red}, ${fgColorRgb.green}, ${fgColorRgb.blue}, 0.75); vertical-align: middle;`);
    linkTooltip.appendChild(label);

    /// Set body
    let text = document.createElement('span');
    let maxSymbolsInBody = 33;

    if (typeOfMenu == 'imageMenu' || typeOfMenu == 'playerMenu') {
        let fileName;
        try {
            fileName = hoveredLink.split('#').shift().split('?').shift().split('/').pop();
        } catch (e) { if (configs.debugMode) console.log(e); }
        text.innerHTML = fileName !== null && fileName !== undefined ? fileName : configs.showFullLinkInTooltip ? hoveredLink : hoveredLink.substring(0, 26);
    } else {
        if (typeOfMenu == 'selectionMenu' || (typeOfMenu == 'textFieldMenu' && textSelection.toString() !== '')) {
            let textSelectionString = textSelection.toString();
            text.innerHTML = textSelectionString.length > maxSymbolsInBody ? textSelectionString.substring(0, maxSymbolsInBody - 3) + '...' : textSelectionString;
        } else if (typeOfMenu == 'textFieldMenu') {
            if (currentClipboardContent !== null && currentClipboardContent !== undefined && currentClipboardContent !== '') {
                text.innerHTML = currentClipboardContent.length > maxSymbolsInBody ? currentClipboardContent.substring(0, maxSymbolsInBody - 3) + '...' : currentClipboardContent;
                label.innerHTML = chrome.i18n.getMessage('clipboard') + '<br />';
            }
        }
        else
            text.innerHTML = configs.showFullLinkInTooltip ? hoveredLink : hoveredLink.length > maxSymbolsInBody ? hoveredLink.substring(0, maxSymbolsInBody - 3) + '...' : hoveredLink;
    }

    text.setAttribute('style', `color: rgba(${fgColorRgb.red}, ${fgColorRgb.green}, ${fgColorRgb.blue}, 1.0); word-break:break-all;${typeOfMenu == 'selectionMenu' ? '' : 'text-decoration: underline;'}`);
    linkTooltip.appendChild(text);

    // if (configs.showFullLinkInTooltip == false) {
    //     let threeDots = document.createElement('span');
    //     threeDots.innerHTML = '...';
    //     linkTooltip.appendChild(threeDots);
    // }

    document.body.appendChild(linkTooltip);

    // let dxToShow = leftCoord + configs.circleRadius - (linkTooltip.clientWidth / 2);
    let dxToShow = leftCoord + (canvasRadius / 2) - (linkTooltip.clientWidth / 2);
    let dyToShow = topCoord - (linkTooltip.clientHeight) - 8;

    linkTooltip.style.transform = `translate(${dxToShow}px, ${topCoord + configs.circleRadius - (linkTooltip.clientHeight / 2)}px)`;

    setTimeout(function () {
        linkTooltip.style.transition = `transform ${configs.animationDuration}ms ease-in-out, opacity ${configs.animationDuration}ms ease-in-out`;
        linkTooltip.style.transform = `translate(${dxToShow}px, ${dyToShow}px)`;
        // linkTooltip.style.opacity = configs.linkTooltipOpacity;
        linkTooltip.style.opacity = configs.circleOpacity ?? 1.0;
    }, 1);
}

function hideLinkTooltip() {
    if (linkTooltip == null) return;

    // let dxShown = leftCoord + configs.circleRadius - (linkTooltip.clientWidth / 2);
    let dxShown = leftCoord + (canvasRadius / 2) - (linkTooltip.clientWidth / 2);
    linkTooltip.style.transform = `translate(${dxShown}px, ${topCoord + configs.circleRadius - (linkTooltip.clientHeight / 2)}px)`;
    linkTooltip.style.opacity = `0.0`;
    setTimeout(function () {
        if (linkTooltip.parentNode !== null)
            linkTooltip.parentNode.removeChild(linkTooltip);
        linkTooltip = null;
    }, 200);
}

