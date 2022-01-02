function openTabSwitcher(tabs, isVertical = true, initScrollDirection, isGridView = false) {

    if (configs.debugMode) {
        console.log('List of tabs for tabs switcher:');
        console.log(tabs);
    }

    const transitionDuration = 200;
    const verticalFaviconSize = 20;
    let horizontalFaviconSize = 60;
    const verticalScrollAlign = 'nearest'; // 'center'
    const horizontalScrollAlign = 'nearest'; // 'center'
    const borderRadius = 3;
    const enabledContiniousScrollDetection = ((isVertical && configs.continiousVerticalScrollDetection) || (!isVertical && configs.continiousHorizontalScrollDetection));
    let filterInput, topControlsContainer;
    const filteredTiles = [];

    /// main container
    const container = document.createElement('div');
    container.className = 'cmg-tab-switcher';
    container.style.transition = `opacity ${transitionDuration}ms ease-out, box-shadow ${transitionDuration}ms ease-out`;
    container.style.borderRadius = borderRadius + 'px';
    if (isVertical) {
        container.classList.add('vertical-switcher');
    } else {
        container.classList.add('horizontal-switcher');
    }

    /// apply grid view styling
    if (isGridView) {
        container.classList.add('grid-view-switcher');
        container.style.maxHeight = `${window.screen.height * 0.8}px`;
        container.style.maxWidth = `${window.screen.width * 0.8}px`;
    }

    /// align switcher at screen center
    container.classList.add('center-aligned-switcher');

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

        /// use tab thumbnail image if available
        let imgSrc;
        if (!isVertical && tab.extData) {
            let parsed = JSON.parse(tab.extData);
            if (parsed.thumbnail) {
                imgSrc = parsed.thumbnail;
                favicon.style.aspectRatio = 'auto';
                favicon.style.width = 'unset';
                horizontalFaviconSize = isGridView ? 120 : 75;

                /// add website favicon when using thumbnail
                setTimeout(function () {
                    let siteFavicon = document.createElement('img');
                    siteFavicon.setAttribute('height', '15px');
                    siteFavicon.setAttribute('width', '15px');
                    siteFavicon.src = tab.favIconUrl;
                    // siteFavicon.style.height = '15px';

                    siteFavicon.style.display = 'block';
                    siteFavicon.style.margin = '3px auto';
                    tabTile.prepend(siteFavicon);
                    title.style.width = '110px';
                }, 1)
            }
        }

        if (!imgSrc) imgSrc = tab.favIconUrl;
        if (!imgSrc) imgSrc = 'https://www.google.com/s2/favicons?sz=64&domain_url=' + tab.url.split('/')[2]; /// try using google favicons
        favicon.src = imgSrc;

        if (!isGridView)
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
        if (tab.active) {
            tabTile.style.border = '1.5px solid blue';
            focusedTile = i;
            setTimeout(function () {
                tabTile.scrollIntoView({ block: 'center', inline: 'center' });
            }, 1)
        }

        container.appendChild(tabTile);
        tabTiles.push(tabTile);
    }

    /// initial scroll action
    if (initScrollDirection && enabledContiniousScrollDetection) {
        if (initScrollDirection == 'up' && focusedTile > 0) {
            focusedTile -= 1;
            tabTiles[focusedTile].classList.add('highlighted-tab');
            tabTiles[focusedTile].scrollIntoView({ block: verticalScrollAlign, inline: horizontalScrollAlign });
        } else if (initScrollDirection == 'down' && focusedTile < tabs.length - 1) {
            focusedTile += 1;
            tabTiles[focusedTile].classList.add('highlighted-tab');
            tabTiles[focusedTile].scrollIntoView({ block: verticalScrollAlign, inline: horizontalScrollAlign });
        }
    }

    /// Make switcher controllable by scroll
    if (rightClickIsHolded && enabledContiniousScrollDetection) {
        document.addEventListener('mouseup', mouseUpScrollListener);
        document.addEventListener('wheel', scrollListener, { passive: false });
        container.style.pointerEvents = 'none';
    } else {
        /// static switcher
        document.addEventListener('keydown', keyboardListener);
    }

    /// append switcher to the document
    document.body.appendChild(container);

    /// trigger show-up transition
    setTimeout(function () {
        container.style.opacity = 1;
        container.classList.add('cmg-overlay-shadow');
    }, 1);

    /// add controls after delay 
    setTimeout(function () {
        /// add search query only when in static mode
        if (!rightClickIsHolded || !enabledContiniousScrollDetection) {
            const switcherRect = container.getBoundingClientRect();
            // container.classList.remove('center-aligned-switcher');
            // container.style.top = `${switcherRect.top}px`;
            // container.style.left = `${switcherRect.left}px`;

            const closeButtonSize = 24;

            /// add filter input
            filterInput = document.createElement('input');
            filterInput.className = 'cmg-tab-switcher-filter';
            filterInput.style.top = `${switcherRect.top - 50}px`;
            filterInput.style.left = `${switcherRect.left}px`;
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
                filteredTiles.splice(0);

                for (i = 0; i < tabsLength; i++) {
                    if (tabs[i].title.toLowerCase().indexOf(val) > -1 || tabs[i].url.toLowerCase().indexOf(val) > -1) {
                        tabTiles[i].style.display = "";
                        atLeastOneTabVisible = true;
                        filteredTiles.push(tabTiles[i]);
                    } else {
                        tabTiles[i].style.display = "none";
                    }
                    tabTiles[i].classList.remove('highlighted-tab');
                }

                /// make placeholder visible
                if (atLeastOneTabVisible) {
                    noTabsMatchingPlaceholder.style.display = 'none';
                    filteredTiles[focusedTile].classList.add('highlighted-tab');
                } else {
                    noTabsMatchingPlaceholder.style.display = '';
                    focusedTile = -1;
                }

            });

            /// Add close button in top right corner
            let btnInnerPadding = 15;

            topControlsContainer = document.createElement('div');
            topControlsContainer.setAttribute('style', `all:revert; position: fixed; z-index:100003; left: ${switcherRect.left + switcherRect.width + (closeButtonSize / 2)}px; top: ${switcherRect.top - (closeButtonSize * 2.5)}px; transition: opacity ${transitionDuration}ms ease-in-out`);

            /// Add close button
            const closeButton = document.createElement('div');
            closeButton.setAttribute('title', chrome.i18n.getMessage("closeLabel") ? chrome.i18n.getMessage("closeLabel") : 'Close');
            closeButton.setAttribute('class', 'cmg-link-preview-button');
            closeButton.style.width = `${closeButtonSize + btnInnerPadding}px`;
            closeButton.style.height = `${closeButtonSize + btnInnerPadding}px`;
            closeButton.style.fontSize = `${closeButtonSize}px`;

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
    }, transitionDuration / 3);

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
        selectTab(focusedTile);
    }

    /// Keyboard listener
    function keyboardListener(e) {
        if (e.key === "Escape") { // escape key maps to keycode `27`
            e.preventDefault();
            closeTabSwitcher();
        } else if (e.key == 'Enter') {
            e.preventDefault();
            closeTabSwitcher(false);
            selectTab(focusedTile);
        }

        if ((isVertical && e.key == 'ArrowUp') || (!isVertical && e.key == 'ArrowLeft')) {
            e.preventDefault();
            highlightUpperTab();
        } else if ((isVertical && e.key == 'ArrowDown') || (!isVertical && e.key == 'ArrowRight')) {
            e.preventDefault();
            highlightLowerTab();
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


    /// Utility functions
    function highlightUpperTab() {
        const tiles = filteredTiles.length > 0 ? filteredTiles : tabTiles;

        if (focusedTile > 0) {
            tiles[focusedTile].classList.remove('highlighted-tab');
            focusedTile -= 1;
            tiles[focusedTile].classList.add('highlighted-tab');
            tiles[focusedTile].scrollIntoView({ block: verticalScrollAlign, inline: horizontalScrollAlign });
        }
    }

    function highlightLowerTab() {
        const tiles = filteredTiles.length > 0 ? filteredTiles : tabTiles;

        if (focusedTile < tiles.length - 1) {
            tiles[focusedTile].classList.remove('highlighted-tab');
            focusedTile += 1;
            tiles[focusedTile].classList.add('highlighted-tab');
            tiles[focusedTile].scrollIntoView({ block: verticalScrollAlign, inline: horizontalScrollAlign });
        }
    }

    function selectTab(index) {
        let tileToSelect = filteredTiles.length > 0 ? filteredTiles[index] : tabTiles[index];
        let tabToSelect = tabs[tabTiles.indexOf(tileToSelect)];

        chrome.runtime.sendMessage({ actionToDo: 'switchToIndexedTab', id: tabToSelect.id });
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
        container.classList.remove('cmg-overlay-shadow');

        setTimeout(function () {
            container.remove();
        }, transitionDuration);

        setTimeout(function () {
            try {
                filterInput.remove();
            } catch (e) { }
        }, 0)

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
                try {
                    backgroundDimmer.remove();
                    topControlsContainer.remove();
                } catch (e) { }

            }, transitionDuration);
        }
    }
}