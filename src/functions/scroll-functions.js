function getScrollParent(node) {
    const isElement = node instanceof HTMLElement;
    const overflowY = isElement && window.getComputedStyle(node).overflowY;
    // const overflowX = isElement && window.getComputedStyle(node).overflowX;
    // const isScrollable = overflowY !== 'visible' && overflowY !== 'hidden' && overflowX !== 'auto';
    const isScrollable = overflowY !== 'visible' && overflowY !== 'hidden';

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
        if (configs.storeCurrentScrollPosition && id !== null) {
            previousScrollPosition[id == 'scrollToTop' ? 'scrollToBottom' : 'scrollToTop'] = currentScrollPosition;
            if (configs.debugMode) {
                console.log('stored current scroll position:');
                console.log(currentScrollPosition);
            }
        }
    }

    if (scrollingElement == null || scrollingElement.scrollHeight == document.body.scrollHeight) {
        currentScrollPosition = window.scrollY;
        // window.scrollTo({ top: offset, behavior: 'smooth' });
        smoothScrollTo(offset, 350);

    } else {

        currentScrollPosition = scrollingElement.scrollTop;
        // scrollingElement.scrollTo({ top: offset, behavior: 'smooth' });
        smoothScrollTo(offset, 350, scrollingElement);

        /// If element's scroll posiiton has not change after 1ms, scroll the window instead
        setTimeout(function () {
            if (scrollingElement.scrollTop == currentScrollPosition) {
                currentScrollPosition = window.scrollY;
                // window.scrollTo({ top: offset, behavior: 'smooth' });
                smoothScrollTo(offset, 350);
                saveCurrentScrollPosition();
            }
        }, 1)
    }

    saveCurrentScrollPosition();
}

// Polyfilled smooth scrolling
/// source: https://gist.github.com/eyecatchup/d210786daa23fd57db59634dd231f341
const smoothScrollTo = (to, duration, elem) => {
    const element = elem ?? (document.scrollingElement || document.documentElement),
        start = element.scrollTop,
        change = to - start,
        startDate = +new Date();

    // t = current time
    // b = start value
    // c = change in value
    // d = duration
    const easeInOutQuad = (t, b, c, d) => {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    };

    const animateScroll = _ => {
        const currentDate = +new Date();
        const currentTime = currentDate - startDate;
        element.scrollTop = parseInt(easeInOutQuad(currentTime, start, change, duration));
        if (currentTime < duration) {
            requestAnimationFrame(animateScroll);
        }
        else {
            element.scrollTop = to;
        }
    };
    animateScroll();
};

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

    // if (scrollingElementUnderCursor == null || scrollingElementUnderCursor == undefined)
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
        // if (scrollingElementUnderCursor == null || scrollingElementUnderCursor == undefined)
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