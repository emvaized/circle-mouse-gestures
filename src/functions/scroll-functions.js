function getScrollParent(node) {
    const isElement = node instanceof HTMLElement;
    const overflowY = isElement && window.getComputedStyle(node).overflowY;
    const overflowX = isElement && window.getComputedStyle(node).overflowX;
    const isScrollable = overflowY !== 'visible' && overflowY !== 'hidden' && overflowX !== 'auto';

    if (!node) {
        return null;
    } else if (isScrollable && node.scrollHeight >= node.clientHeight) {
        return node;
    }

    return getScrollParent(node.parentNode) || document.scrollingElement || document.body;
}


function scrollElementUnderCursor(scrollingElement, offset, id) {

    let currentScrollPosition;

    function saveCurrentScrollPosition() {
        if (id !== null) {
            previousScrollPosition[id == 'scrollToTop' ? 'scrollToBottom' : 'scrollToTop'] = currentScrollPosition;
            if (configs.debugMode) {
                console.log('stored current scroll position:');
                console.log(currentScrollPosition);
            }
        }
    }

    if (scrollingElement == null || scrollingElement.scrollHeight == document.body.scrollHeight) {
        currentScrollPosition = window.scrollY;
        window.scrollTo({ top: offset, behavior: 'smooth' });
    }
    else {

        currentScrollPosition = scrollingElement.scrollTop;
        scrollingElement.scrollTo({ top: offset, behavior: 'smooth' });

        /// If element's scroll posiiton has not change after 1ms, scroll the window instead
        setTimeout(function () {
            if (scrollingElement.scrollTop == currentScrollPosition) {
                currentScrollPosition = window.scrollY;
                window.scrollTo({ top: offset, behavior: 'smooth' });
                saveCurrentScrollPosition();
            }
        }, 1)
    }

    saveCurrentScrollPosition();
}

// var scrollingElementUnderCursor;

function scrollElementToTop(element) {
    if (scrollingElementUnderCursor == null || scrollingElementUnderCursor == undefined)
        scrollingElementUnderCursor = getScrollParent(element);

    try {
        // let bottomOffset = scrollingElementUnderCursor.scrollHeight - scrollingElementUnderCursor.clientHeight;

        // let currentScrollPosition = scrollingElementUnderCursor.scrollTop ?? window.scrollY;

        // if (configs.storeCurrentScrollPosition && currentScrollPosition !== bottomOffset)
        //     previousScrollPosition['scrollToBottom'] = currentScrollPosition;


        scrollElementUnderCursor(scrollingElementUnderCursor, 0, 'scrollToTop')
    } catch (e) { if (configs.debugMode) console.log(e); }
}

function scrollElementToBottom(element) {

    if (scrollingElementUnderCursor == null || scrollingElementUnderCursor == undefined)
        scrollingElementUnderCursor = getScrollParent(element);

    let scrollHeight = scrollingElementUnderCursor.scrollHeight;
    let clientHeight = scrollingElementUnderCursor.clientHeight;
    let amountToScroll = scrollHeight > clientHeight ? scrollHeight - clientHeight : scrollHeight;

    if (configs.debugMode)
        console.log(`scrolling to ${amountToScroll}...`);

    try {
        scrollElementUnderCursor(scrollingElementUnderCursor, amountToScroll, 'scrollToBottom');
    } catch (e) { if (configs.debugMode) console.log(e); }

}

function scrollElementToAmount(element, amount) {
    if (scrollingElementUnderCursor == null || scrollingElementUnderCursor == undefined)
        scrollingElementUnderCursor = getScrollParent(element);

    try {
        scrollElementUnderCursor(scrollingElementUnderCursor, amount)
    } catch (e) { console.log(e); }
}


function canScrollTop(element) {

    if (scrollingElementUnderCursor == null || scrollingElementUnderCursor == undefined)
        scrollingElementUnderCursor = getScrollParent(element);

    let scrollAmount;

    if (scrollingElementUnderCursor == null || scrollingElementUnderCursor.scrollHeight == document.body.scrollHeight)
        scrollAmount = window.scrollY;
    else {
        scrollAmount = scrollingElementUnderCursor.scrollTop;
    }

    let isActionAvailable = scrollAmount !== 0.0;
    buttonsAvailability['scrollToTop'] = isActionAvailable;

    // return scrollAmount !== 0.0;
    return isActionAvailable;
}

function canScrollBottom(element) {

    try {
        if (scrollingElementUnderCursor == null || scrollingElementUnderCursor == undefined)
            scrollingElementUnderCursor = getScrollParent(element);

        let scrollAmount;
        let bottomOffset;
        let isActionAvailable;

        if (scrollingElementUnderCursor == null || scrollingElementUnderCursor.scrollHeight == document.body.scrollHeight) {
            scrollAmount = window.scrollY;
            let scrollingElement = (document.scrollingElement || document.body);
            bottomOffset = scrollingElement.scrollHeight;
            isActionAvailable = window.screen.height + window.scrollY < bottomOffset;
        }
        else {
            scrollAmount = scrollingElementUnderCursor.scrollTop;
            bottomOffset = scrollingElementUnderCursor.scrollHeight - scrollingElementUnderCursor.clientHeight;
            isActionAvailable = scrollAmount < bottomOffset;
        }

        if (isActionAvailable == null || isActionAvailable == undefined) return true;

        buttonsAvailability['scrollToBottom'] = isActionAvailable;
        return isActionAvailable;

    } catch (err) { console.log(err); return true; }

}