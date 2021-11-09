function openTabSwitcher(tabs, isVertical = true, initScrollDirection) {
    const transitionDuration = 200;
    const verticalFaviconSize = 20;
    const horizontalFaviconSize = 60;
    const verticalScrollAlign = 'nearest'; // 'center'
    const horizontalScrollAlign = 'nearest'; // 'center'
    const borderRadius = 4;

    /// main container
    const container = document.createElement('div');
    container.className = 'cmg-tab-switcher';
    container.style.transition = `opacity ${transitionDuration}ms ease-out`;
    if (isVertical) {
        container.classList.add('vertical-switcher');
    } else {
        container.classList.add('horizontal-switcher');
    }


    /// trigger show-up transition
    setTimeout(function () {
        container.style.opacity = 1;
    }, 0);

    /// Generate tab tiles
    const tabTiles = [];
    let focusedTile = -1;

    const l = tabs.length;
    for (let i = 0; i < l; i++) {
        const tab = tabs[i];

        const tabTile = document.createElement('div');
        tabTile.className = 'cmg-tab-switcher-entry';
        tabTile.style.borderRadius = borderRadius + 'px';

        /// favicon
        const favicon = document.createElement('img');
        favicon.src = tab.favIconUrl;
        favicon.setAttribute('height', isVertical ? `${verticalFaviconSize}px` : `${horizontalFaviconSize}px`);
        favicon.setAttribute('width', isVertical ? `${verticalFaviconSize}px` : `${horizontalFaviconSize}px`);
        favicon.style.display = 'inline';
        favicon.style.marginRight = '6px';
        // favicon.aspectRadio = 'unset';
        // favicon.crossOrigin = "anonymous";
        tabTile.appendChild(favicon);

        /// title
        const title = document.createElement('span');
        title.textContent = (tab.audible ? '🔊 ' : '') + tab.title;
        title.style.verticalAlign = 'super';
        title.style.color = 'black';

        /// special styling for horizontal layout
        if (!isVertical) {
            tabTile.style.display = 'inline';
            tabTile.style.textAlign = 'center';
            tabTile.style.padding = '0px 12px';

            title.classList.add('horizontal-tab-switcher-label');
            title.title = tab.title;
        } else {
            title.classList.add('vertical-tab-switcher-label');
        }
        tabTile.appendChild(title);

        /// select on mouse down
        tabTile.addEventListener('mousedown', function () {
            closeTabSwitcher(false);
            selectTab(i);
        })

        /// draw border around selected
        if (tab.selected) {
            tabTile.style.border = '1.5px solid blue';
            focusedTile = i;
            setTimeout(function () {
                tabTile.scrollIntoView({ block: 'center', inline: 'center' });
            }, 1)
        }

        container.appendChild(tabTile);
        tabTiles.push(tabTile);
    }

    /// initial scroll direction
    if (initScrollDirection) {
        if (initScrollDirection == 'up') {
            focusedTile -= 1;
            tabTiles[focusedTile].classList.add('highlighted-tab');
            tabTiles[focusedTile].scrollIntoView({ block: verticalScrollAlign, inline: horizontalScrollAlign });
        } else if (initScrollDirection == 'down') {
            focusedTile += 1;
            tabTiles[focusedTile].classList.add('highlighted-tab');
            tabTiles[focusedTile].scrollIntoView({ block: verticalScrollAlign, inline: horizontalScrollAlign });
        }
    }

    /// Make switcher controllable by scroll
    if (rightClickIsHolded) {
        document.addEventListener('mouseup', mouseUpScrollListener);
        document.addEventListener('wheel', scrollListener, { passive: false });
        container.style.pointerEvents = 'none';
    } else {
        /// static switcher
        document.addEventListener('keydown', keyboardListener);
    }

    document.body.appendChild(container);

    /// Scroll listener
    function scrollListener(event) {
        event.preventDefault();

        if (event.deltaY < 0 || event.deltaX < 0) {
            highlightUpperTab();
        } else if (event.deltaY > 0 || event.deltaX > 0) {
            highlightLowerTab();
        }
    }

    /// Mouse up listener
    function mouseUpScrollListener(e) {
        closeTabSwitcher(false);
        document.removeEventListener('wheel', scrollListener, { passive: false });
        chrome.runtime.sendMessage({ actionToDo: 'switchToIndexedTab', index: focusedTile });
    }

    /// Keyboard listener
    function keyboardListener(e) {
        if (e.key === "Escape") { // escape key maps to keycode `27`
            e.preventDefault();
            closeTabSwitcher();
        } else if (e.key == 'ArrowUp') {
            e.preventDefault();
            highlightUpperTab();
        } else if (e.key == 'ArrowDown') {
            e.preventDefault();
            highlightLowerTab();
        } else if (e.key == 'Enter') {
            e.preventDefault();
            closeTabSwitcher(false);
            selectTab(focusedTile);
        }
    }


    /// Utility functions
    function highlightUpperTab() {
        if (focusedTile > 0) {
            tabTiles[focusedTile].classList.remove('highlighted-tab');
            focusedTile -= 1;
            tabTiles[focusedTile].classList.add('highlighted-tab');
            tabTiles[focusedTile].scrollIntoView({ block: verticalScrollAlign, inline: horizontalScrollAlign });
        }
    }

    function highlightLowerTab() {
        if (focusedTile < tabs.length - 1) {
            tabTiles[focusedTile].classList.remove('highlighted-tab');
            focusedTile += 1;
            tabTiles[focusedTile].classList.add('highlighted-tab');
            tabTiles[focusedTile].scrollIntoView({ block: verticalScrollAlign, inline: horizontalScrollAlign });
        }
    }

    function selectTab(index) {
        chrome.runtime.sendMessage({ actionToDo: 'switchToIndexedTab', index: index });
    }


    /// Background dimmer
    let bgOpacity = 0.5;
    let clickOutsideToExit = true;
    let reduceDimmerOpacityOnHover = false;
    let multiplierToReduceBgOpacityOnHover = 0.85;
    let regulateDimmerOpacityByScroll = false;

    const backgroundDimmer = document.createElement('div');

    backgroundDimmer.setAttribute('style', `${clickOutsideToExit ? 'cursor: pointer;' : ''}z-index: 99999; width:100%;height: 100%;  opacity: 0.0; transition: opacity ${transitionDuration}ms ease-out; position:fixed; background: black !important; top: 0px; left: 0px;`);
    document.body.appendChild(backgroundDimmer);

    /// Add dimmer listeners
    setTimeout(function () {
        backgroundDimmer.style.opacity = bgOpacity;
        if (clickOutsideToExit)
            backgroundDimmer.onmousedown = function () {
                closeTabSwitcher();
            }

        if (reduceDimmerOpacityOnHover) {
            backgroundDimmer.onmouseover = function () {
                if (backgroundDimmer !== null && backgroundDimmer !== undefined) {
                    if (backgroundDimmer.style.transition == '')
                        backgroundDimmer.style.transition = `opacity ${transitionDuration}ms ease-out`;
                    backgroundDimmer.style.opacity = bgOpacity * multiplierToReduceBgOpacityOnHover;
                }
            }

            backgroundDimmer.onmouseout = function () {
                if (backgroundDimmer !== null && backgroundDimmer !== undefined) {
                    if (backgroundDimmer.style.transition == '')
                        backgroundDimmer.style.transition = `opacity ${transitionDuration}ms ease-out`;
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


    function closeTabSwitcher(transition = true) {
        hideBgDimmer();
        hideSwitcher(transition);

        document.removeEventListener('wheel', scrollListener, { passive: false });
        document.removeEventListener('mouseup', mouseUpScrollListener);
        document.removeEventListener('keydown', keyboardListener);
    }

    function hideSwitcher(transition = true) {
        if (!transition) container.style.transition = '';
        container.style.opacity = 0;
        setTimeout(function () {
            container.remove();
        }, transitionDuration)
    }

    function hideBgDimmer(transition = true) {
        if (backgroundDimmer !== null && backgroundDimmer !== undefined) {
            if (!transition) backgroundDimmer.style.transition = '';
            backgroundDimmer.style.transition = `opacity ${transitionDuration}ms ease-out`;
            backgroundDimmer.style.opacity = 0.0;
            backgroundDimmer.onmousedown = null;
            backgroundDimmer.onmouseover = null;
            backgroundDimmer.onmouseout = null;

            setTimeout(function () {
                backgroundDimmer.remove();
            }, transitionDuration);
        }

    }
}