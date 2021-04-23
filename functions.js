function triggerButtonAction(actionToPerform) {
    if (debugMode) {
        console.log('Action to perform: ');
        console.log(actionToPerform);
    }

    if (actionToPerform == 'scrollToTop') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (actionToPerform == 'scrollToBottom') {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    } else if (actionToPerform == 'scrollPageUp') {
        window.scrollTo({ top: window.scrollY - window.innerHeight * .9, behavior: 'smooth' });
    } else if (actionToPerform == 'scrollPageDown') {
        window.scrollTo({ top: window.scrollY + window.innerHeight * .9, behavior: 'smooth' });
    } else

        if (actionToPerform !== null && actionToPerform !== undefined) {
            if (typeOfMenu !== 'regular-menu') {
                let link = hoveredLink;

                if (debugMode) {
                    console.log('link:');
                    console.log(link);
                }
                chrome.runtime.sendMessage({ actionToDo: actionToPerform, url: link, linkText: hoveredLinkTitle })
            } else {
                chrome.runtime.sendMessage({ actionToDo: actionToPerform, url: window.location.href })
            }
        }
}

function wrapLabel(context, text, x, y, maxWidth, lineHeight) {
    var words = text.split(' ');
    var line = '';
    var verticallyShiftedAmount = 0;

    for (var n = 0; n < words.length; n++) {
        var testLine = line + words[n] + ' ';
        var metrics = context.measureText(testLine);
        var testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0 && verticallyShiftedAmount < 1) {
            verticallyShiftedAmount += 1;
            context.fillText(line, x, y - ((lineHeight / 2)));
            // context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight / 2;
        }
        else {
            line = testLine;
        }
    }
    context.fillText(line, x, y);
    return verticallyShiftedAmount * (lineHeight);
}