function openTabSwitcher(tabs, isVertical = true, initScrollDirection) {
    const transitionDuration = 200;
    const verticalFaviconSize = 20;
    const horizontalFaviconSize = 60;
    const verticalScrollAlign = 'nearest'; // 'center'
    const horizontalScrollAlign = 'nearest'; // 'center'
    const borderRadius = 3;

    let filterInput;

    /// main container
    const container = document.createElement('div');
    container.className = 'cmg-tab-switcher';
    container.style.transition = `opacity ${transitionDuration}ms ease-out`;
    container.style.borderRadius = borderRadius + 'px';
    if (isVertical) {
        container.classList.add('vertical-switcher');
    } else {
        container.classList.add('horizontal-switcher');
    }

    /// align at center
    container.classList.add('center-aligned-switcher');


    /// trigger show-up transition
    setTimeout(function () {
        container.style.opacity = 1;

        /// add search query only when in static mode
        if (!rightClickIsHolded) {
            const switcherRect = container.getBoundingClientRect();
            container.classList.remove('center-aligned-switcher');
            container.style.top = `${switcherRect.top}px`
            container.style.left = `${switcherRect.left}px`

            /// add filter input
            filterInput = document.createElement('input');
            filterInput.className = 'cmg-tab-switcher-filter';
            // filterInput.setAttribute('autofocus', true);
            filterInput.style.top = `${switcherRect.top - 50}px`;
            filterInput.style.left = `${switcherRect.left + 50}px`;
            filterInput.style.width = `${switcherRect.width}px`;
            filterInput.placeholder = `${tabs.length} ${chrome.i18n.getMessage('tabsAmount').toLowerCase()} — ${chrome.i18n.getMessage('typeToQuery').toLowerCase()}...`;
            document.body.appendChild(filterInput);
            filterInput.focus();

            /// add 'no tabs matching' placeholder
            let noTabsMatchingPlaceholder = document.createElement('span');
            noTabsMatchingPlaceholder.textContent = chrome.i18n.getMessage('noMatchingTabsFound');
            noTabsMatchingPlaceholder.style.display = 'none';
            container.appendChild(noTabsMatchingPlaceholder);

            filterInput.addEventListener('input', function (q) {
                let val = filterInput.value.toLowerCase();
                let atLeastOneTabVisible = false;

                focusedTile = 0;

                for (i = 0; i < tabsLength; i++) {
                    if (tabs[i].title.toLowerCase().indexOf(val) > -1 || tabs[i].url.toLowerCase().indexOf(val) > -1) {
                        tabTiles[i].style.display = "";
                        atLeastOneTabVisible = true;
                    } else {
                        tabTiles[i].style.display = "none";
                    }
                }

                /// make placeholder visible
                if (atLeastOneTabVisible) {
                    noTabsMatchingPlaceholder.style.display = 'none';
                } else {
                    noTabsMatchingPlaceholder.style.display = '';
                }

            });
        }

    }, 0);

    /// Generate tab tiles
    const tabTiles = [];
    let focusedTile = -1;

    const tabsLength = tabs.length;
    for (let i = 0; i < tabsLength; i++) {
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


    /// Buttons in top right corner
    if (!rightClickIsHolded) {
        let buttonSize = 24;
        let btnInnerPadding = 15;
        let headerTopPadding = 30;

        let topControlsContainer = document.createElement('div');
        topControlsContainer.setAttribute('style', `all:revert; position: fixed; z-index:100003; right: ${headerTopPadding}px; top: ${headerTopPadding - (buttonSize / 2)}px; transition: opacity ${transitionDuration}ms ease-in-out`);

        /// Add close button
        const closeButton = document.createElement('div');
        closeButton.setAttribute('title', chrome.i18n.getMessage("closeLabel") ? chrome.i18n.getMessage("closeLabel") : 'Close');
        closeButton.setAttribute('class', 'cmg-link-preview-button');
        closeButton.style.width = `${buttonSize + btnInnerPadding}px`;
        closeButton.style.height = `${buttonSize + btnInnerPadding}px`;
        closeButton.style.fontSize = `${buttonSize}px`;

        const btnLabel = document.createElement('span');
        btnLabel.style.verticalAlign = 'middle';
        btnLabel.innerText = '✕';
        closeButton.appendChild(btnLabel);
        topControlsContainer.appendChild(closeButton);

        closeButton.addEventListener('mousedown', function () {
            closeTabSwitcher();
        });

        document.body.appendChild(topControlsContainer);
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

    /// Close functions

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
        }, transitionDuration);

        try {
            filterInput.remove();
        } catch (e) { }
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
                topControlsContainer.remove();
            }, transitionDuration);
        }

    }
}