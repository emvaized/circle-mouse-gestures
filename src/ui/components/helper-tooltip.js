async function showLinkTooltip() {
    if (configs.debugMode) console.log('showing link tooltip...');

    let fgColorRgb = getTextColorForBackground(configs[typeOfMenu].color);

    linkTooltip = document.createElement('div');
    linkTooltip.setAttribute('class', 'cmg-link-tooltip');
    // linkTooltip.setAttribute('style', `left: 0px; top: 0px;max-width: ${configs.circleRadius * 2}px;z-index: 99999; font-size: 13.5px;opacity: 0.0; align-items: center;display:inline-block !important; position: absolute !important;background: ${configs[typeOfMenu].color}; border-radius: 9px;color: white; text-align: center; padding: 6px; pointer-events: none;`);
    linkTooltip.setAttribute('style', `left: 0px; top: 0px;max-width: ${configs.circleRadius * 2}px;z-index: 99999; font-size: 13.5px;opacity: 0.0; align-items: center;display:inline-block !important; position: fixed !important;background: ${configs[typeOfMenu].color}; border-radius: 9px;color: white; text-align: center; padding: 6px; pointer-events: none;`);

    if (configs.addCircleShadow)
        linkTooltip.style.boxShadow = `0px 5px 12px 0 rgba(0,0,0,${configs.circleShadowOpacity})`;

    let linkToDisplay = hoveredLink.replaceAll('http://', '').replaceAll('https://', '').replaceAll('www.', '').trim();
    if (linkToDisplay[linkToDisplay.length - 1] == '/') linkToDisplay = linkToDisplay.slice(0, -1);

    /// Set title
    let label = document.createElement('span');
    label.setAttribute('id', 'cmg-helper-tooltip-label');
    label.innerHTML = typeOfMenu == 'linkMenu' ?
        configs.showLinkTextInTooltip && hoveredLinkTitle !== null && hoveredLinkTitle !== undefined && hoveredLinkTitle !== ''
            && hoveredLinkTitle !== hoveredLink && hoveredLinkTitle !== linkToDisplay
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
    text.setAttribute('id', 'cmg-helper-tooltip-body');
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

            /// Set tooltip body to display current clipboard content
            let result = await getCurrentClipboard();

            currentClipboardContent = result;

            // currentClipboardContent = result;
            if (configs.debugMode) {
                console.log('current clipboard content:');
                console.log(currentClipboardContent);
            }

            if (currentClipboardContent !== null && currentClipboardContent !== undefined && currentClipboardContent !== '') {
                // let label = document.getElementById('cmg-helper-tooltip-label');
                // let text = document.getElementById('cmg-helper-tooltip-body');
                if (text !== null)
                    text.innerHTML = currentClipboardContent.length > maxSymbolsInBody ? currentClipboardContent.substring(0, maxSymbolsInBody - 3) + '...' : currentClipboardContent;
                if (label !== null)
                    label.innerHTML = chrome.i18n.getMessage('clipboard') + '<br />';


                let dxToShow = leftCoord + (canvasRadius / 2) - (linkTooltip.clientWidth / 2);
                let dyToShow = topCoord - (linkTooltip.clientHeight) - 8;
                linkTooltip.style.transform = `translate(${dxToShow}px, ${dyToShow}px)`;
            }


            // chrome.runtime.sendMessage({ actionToDo: 'getCurrentClipboardContent' }, function (res) {
            //     currentClipboardContent = res;

            //     // currentClipboardContent = result;
            //     if (configs.debugMode) {
            //         console.log('current clipboard content:');
            //         console.log(currentClipboardContent);
            //     }

            //     if (currentClipboardContent !== null && currentClipboardContent !== undefined && currentClipboardContent !== '') {
            //         // let label = document.getElementById('cmg-helper-tooltip-label');
            //         // let text = document.getElementById('cmg-helper-tooltip-body');
            //         if (text !== null)
            //             text.innerHTML = currentClipboardContent.length > maxSymbolsInBody ? currentClipboardContent.substring(0, maxSymbolsInBody - 3) + '...' : currentClipboardContent;
            //         if (label !== null)
            //             label.innerHTML = chrome.i18n.getMessage('clipboard') + '<br />';


            //         let dxToShow = leftCoord + (canvasRadius / 2) - (linkTooltip.clientWidth / 2);
            //         let dyToShow = topCoord - (linkTooltip.clientHeight) - 8;
            //         linkTooltip.style.transform = `translate(${dxToShow}px, ${dyToShow}px)`;
            //     }
            // })

        }
        else {
            text.innerHTML = configs.showFullLinkInTooltip ? linkToDisplay : linkToDisplay.length > maxSymbolsInBody ? linkToDisplay.substring(0, maxSymbolsInBody - 3) + '...' : linkToDisplay;

        }
    }

    text.setAttribute('style', `color: rgba(${fgColorRgb.red}, ${fgColorRgb.green}, ${fgColorRgb.blue}, 1.0); word-break:break-all;${typeOfMenu == 'selectionMenu' ? '' : 'text-decoration: underline;'}`);
    linkTooltip.appendChild(text);

    // if (configs.showFullLinkInTooltip == false) {
    //     let threeDots = document.createElement('span');
    //     threeDots.innerHTML = '...';
    //     linkTooltip.appendChild(threeDots);
    // }

    document.body.appendChild(linkTooltip);

    let dxToShow = leftCoord + (canvasRadius / 2) - (linkTooltip.clientWidth / 2);
    let dyToShow = topCoord - (linkTooltip.clientHeight) - 8;

    if (configs.addCircleShadow)
        dyToShow += 15;

    linkTooltip.style.transform = `translate(${dxToShow}px, ${topCoord + configs.circleRadius - (linkTooltip.clientHeight / 2)}px) scale(0.0)`;

    setTimeout(function () {
        linkTooltip.style.transition = `transform ${configs.animationDuration}ms ease-out, opacity ${configs.animationDuration}ms ease-out`;
        linkTooltip.style.transform = `translate(${dxToShow}px, ${dyToShow}px) scale(1.0)`;
        // linkTooltip.style.opacity = configs.linkTooltipOpacity;
        linkTooltip.style.opacity = configs.circleOpacity ?? 1.0;
    }, 1);
}

function hideLinkTooltip() {
    if (linkTooltip == null) return;

    // let dxShown = leftCoord + configs.circleRadius - (linkTooltip.clientWidth / 2);
    let dxShown = leftCoord + (canvasRadius / 2) - (linkTooltip.clientWidth / 2);
    linkTooltip.style.transform = `translate(${dxShown}px, ${topCoord + configs.circleRadius - (linkTooltip.clientHeight / 2)}px) scale(0.0)`;
    linkTooltip.style.opacity = `0.0`;
    setTimeout(function () {
        if (linkTooltip !== null && linkTooltip.parentNode !== null)
            linkTooltip.parentNode.removeChild(linkTooltip);
        linkTooltip = null;
    }, 200);
}

