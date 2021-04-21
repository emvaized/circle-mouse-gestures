function showLinkTooltip() {
    console.log('showing link tooltip...');


    // linkTooltip = document.createElement('div');
    // linkTooltip.setAttribute('style', `z-index: 99999;opacity: 0.0;width: ${circleRadius * 2}px; align-items: center; position: absolute; `);

    linkTooltip = document.createElement('div');
    linkTooltip.setAttribute('class', 'cmg-link-tooltip');
    linkTooltip.setAttribute('style', `left: 0px; top: 0px;max-width: ${circleRadius * 2}px;z-index: 99999;opacity: 0.0; align-items: center;display:inline-block !important; position: absolute !important;background: ${typeOfMenu == 'link-menu' ? linkSegmentColor : imageSegmentColor}; border-radius: 9px;color: white; text-align: center; padding: 6px; pointer-events: none;`);

    let label = document.createElement('span');
    // label.innerHTML = typeOfMenu == 'link-menu' ? chrome.i18n.getMessage('Link') : chrome.i18n.getMessage('Image');
    label.innerHTML = typeOfMenu == 'link-menu' ?
        hoveredLinkTitle !== null && hoveredLinkTitle !== hoveredLink ? (hoveredLinkTitle.length > 24 ? hoveredLinkTitle.substring(0, 24) + '...' : hoveredLinkTitle)
            : chrome.i18n.getMessage('Link') : chrome.i18n.getMessage('Image');

    // let imagIcon = document.createElement('img');
    // imagIcon.setAttribute('src', 'https://icon-library.com/images/chain-icon/chain-icon-16.jpg');
    // imagIcon.setAttribute('height', '15px');
    // imagIcon.setAttribute('width', '15px');
    // imagIcon.setAttribute('style', 'display: inline; color: white;');
    // label.appendChild(imagIcon);

    label.innerHTML += '<br />';
    label.setAttribute('style', 'color: rgba(256,256,256,0.7); vertical-align: middle;');
    linkTooltip.appendChild(label);


    let text = document.createElement('span');

    if (typeOfMenu == 'image-menu') {
        let fileName;
        try {
            fileName = hoveredLink.split('#').shift().split('?').shift().split('/').pop();
        } catch (e) { console.log(e); }
        text.innerHTML = fileName !== null && fileName !== undefined ? fileName : showFullLinkInTooltip ? hoveredLink : hoveredLink.substring(0, 26);
    } else {
        text.innerHTML = showFullLinkInTooltip ? hoveredLink : hoveredLink.substring(0, 26)
    }

    text.setAttribute('style', `word-break:break-all;text-decoration: underline;`);
    linkTooltip.appendChild(text);

    if (showFullLinkInTooltip == false) {
        let threeDots = document.createElement('span');
        threeDots.innerHTML = '...';
        linkTooltip.appendChild(threeDots);
    }

    document.body.appendChild(linkTooltip);

    // let dxToShow = leftCoord + circleRadius - (linkTooltip.clientWidth / 2);
    let dxToShow = leftCoord + (canvasRadius / 2) - (linkTooltip.clientWidth / 2);
    let dyToShow = topCoord - (linkTooltip.clientHeight) - 15;

    linkTooltip.style.transform = `translate(${dxToShow}px, ${topCoord + circleRadius - (linkTooltip.clientHeight / 2)}px)`;

    setTimeout(function () {
        linkTooltip.style.transition = `transform ${animationDuration}ms ease-in-out, opacity ${animationDuration}ms ease-in-out`;
        linkTooltip.style.transform = `translate(${dxToShow}px, ${dyToShow}px)`;
        linkTooltip.style.opacity = linkTooltipOpacity;
    }, 1);
}

function hideLinkTooltip() {
    if (linkTooltip == null) return;

    let dxShown = leftCoord + circleRadius - (linkTooltip.clientWidth / 2);
    linkTooltip.style.transform = `translate(${dxShown}px, ${topCoord + circleRadius - (linkTooltip.clientHeight / 2)}px)`;
    linkTooltip.style.opacity = `0.0`;
    setTimeout(function () {
        linkTooltip.parentNode.removeChild(linkTooltip);
        linkTooltip = null;
    }, 200);
}