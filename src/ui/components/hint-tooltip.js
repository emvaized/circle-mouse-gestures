/// Shows action name on hover when it's icon-only (because disabled or level is too thin)

let hintTooltip, tooltipTimer;
const hintSpacing = 5, fadeTransitionForHint = 100, curve = 'ease-out', borderRadius = 4;

function showHintTooltip(text, bgColor, fgColor, isOnTop, opacity = 1.0) {
    // if (hintTooltip != null) return;
    if (configs.debugMode)
        console.log('showing hint tooltip for ' + text);
    hintTooltip = document.createElement('div');
    hintTooltip.className = 'cmg-circle-hint-tooltip';
    hintTooltip.style.backgroundColor = bgColor;
    hintTooltip.style.color = fgColor;
    hintTooltip.style.borderRadius = borderRadius + 'px';
    hintTooltip.style.padding = '4px 8px';
    hintTooltip.style.opacity = 0.0;
    hintTooltip.style.zIndex = 9999999;
    hintTooltip.style.fontSize = '15px';
    hintTooltip.style.textAlign = 'center';
    hintTooltip.style.transition = `opacity ${fadeTransitionForHint}ms ${curve}`;
    hintTooltip.innerText = text;

    hintTooltip.style.position = 'fixed';
    document.body.appendChild(hintTooltip);

    hintTooltip.style.top = isOnTop && (linkTooltip == null || linkTooltip == undefined)
        ? `${realTopCoord - hintTooltip.clientHeight - hintSpacing}px`
        : `${realTopCoord + canvasRadius + hintSpacing}px`;

    hintTooltip.style.left = `${realLeftCoord + (canvasRadius / 2) - (hintTooltip.clientWidth / 2)}px`;

    setTimeout(function () {
        hintTooltip.style.opacity = opacity;
    }, 1);
}

function hideHintTooltip() {
    if (configs.showTitleOnHoverWhenHidden == false) return;
    if (tooltipTimer != null) clearTimeout(tooltipTimer);
    if (hintTooltip != null && hintTooltip != undefined) {
        hintTooltip.style.opacity = 0.0;
        setTimeout(function () {
            if (hintTooltip == null || hintTooltip == undefined) return;
            hintTooltip.remove();
            hintTooltip = null;
        }, fadeTransitionForHint);
    }
}