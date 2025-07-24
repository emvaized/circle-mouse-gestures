/// Open options page after install
chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason == 'install') {
        chrome.runtime.openOptionsPage();
    } else if (details.reason == 'update' && !details.temporary) {
        // show update notification
        let shouldShowNotification = true;
        const storageKey = 'showUpdateNotification';

        chrome.storage.local.get([storageKey], function (val) {
            if (val[storageKey] !== null && val[storageKey] !== undefined)
                shouldShowNotification = val[storageKey];

            if (shouldShowNotification) {
                // get manifest for new version number
                const manifest = chrome.runtime.getManifest();
                // show update notification and open changelog on click
                displayNotification(
                    chrome.i18n.getMessage('updateNotificationTitle', manifest.version),
                    chrome.i18n.getMessage('updateNotificationMessage'),
                    "https://github.com/emvaized/circle-mouse-gestures/blob/master/CHANGELOG.md"
                );
            }
        });
    }
});

/// Keep track of last 2 tabs ids for switching between them with 'Recent tab' action 
const recentTabIndexes = [];
chrome.tabs.onActivated.addListener(function (activeInfo) {
    recentTabIndexes.push(activeInfo.tabId);
    if (recentTabIndexes.length > 2) recentTabIndexes.shift();
});

/// keep track of window opened 'sidebar' via "openInSideWindow" action
let virtualSidebarWindowId;

/// Listener to open url in new tab
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        switch (request.actionToDo) {
            case 'selectLastVisitedTab': {
                chrome.windows.getCurrent({ populate: true }, (currentWindow) => {
                    if (!currentWindow) return;
                    const tabs = currentWindow.tabs;

                    /// Filter out the current tab and tabs without `lastAccessed`
                    const otherTabs = tabs
                        .filter(tab => !tab.active && typeof tab.lastAccessed === 'number');
                    if (otherTabs.length === 0) return;

                    /// Sort by lastAccessed descending
                    otherTabs.sort((a, b) => b.lastAccessed - a.lastAccessed);

                    /// Select the most recently accessed tab
                    const mostRecentTab = otherTabs[0];
                    if (mostRecentTab) chrome.tabs.update(mostRecentTab.id, { active: true });
                });
            } break;

            case 'newTab': {
                chrome.tabs.create({ index: sender.tab.index + 1 });
            } break;

            case 'newWindow': {
                if (request.url !== null && request.url !== sender.tab.url)
                    chrome.windows.create({ "url": request.url });
                else
                    chrome.windows.create({});
            } break;

            case 'newPrivateWindow': {
                chrome.windows.create({ incognito: true });
            } break;

            case 'closeWindow': {
                chrome.windows.getCurrent({}, function (window) {
                    chrome.windows.remove(window.id);
                });
            } break;

            case 'closeCurrentTab': {
                if (!sender.tab.pinned)
                    chrome.tabs.remove(sender.tab.id, function () { });
            } break;

            case 'closeAllTabsExceptCurrent': {
                chrome.tabs.query({ active: false, pinned: false, currentWindow: true }, function (tabs) {
                    tabs.forEach(function (tab) {
                        chrome.tabs.remove(tab.id, function () { });
                    })
                });
            } break;

            case 'reloadTab': {
                chrome.tabs.reload(sender.tab.id);
            } break;

            case 'reloadTabWithoutCache': {
                chrome.tabs.reload(sender.tab.id, { bypassCache: true });
            } break;

            case 'goBack': {
                chrome.tabs.goBack(sender.tab.id);
            } break;

            case 'goForward': {
                chrome.tabs.goForward(sender.tab.id);
            } break;

            case 'openInBgTab': {
                chrome.tabs.create({
                    url: request.url, active: false, index: sender.tab.index + 1
                });
            } break;

            case 'openInFgTab': {
                chrome.tabs.create({
                    url: request.url, active: true, index: sender.tab.index + 1
                });
            } break;

            case 'searchText': {
                chrome.tabs.create({
                    url: 'https://www.google.com/search?q=' + request.selectedText, active: true, index: sender.tab.index + 1
                });
            } break;

            case 'translate': {
                chrome.tabs.create({
                    url: (request.url.includes('https://') || request.url.includes('http://') ?
                        'https://translate.google.com/translate?sl=auto&u=' :
                        'https://translate.google.com/?sl=auto&text=') + encodeURI(request.url), active: true, index: sender.tab.index + 1
                });
            } break;

            case 'downloadUrl': {
                let fileName = request.url.split('#').shift().split('?').shift().split('/').pop();
                // if (fileName && !fileName.includes('.') && request.typeOfMenu) fileName += request.typeOfMenu == 'playerMenu' ? 'mp4' : '.jpg';
                if (fileName && !fileName.includes('.') && request.typeOfMenu) {
                    let extensionToAdd = '';
                    switch (request.typeOfMenu) {
                        case 'playerMenu': extensionToAdd = '.mp4'; break;
                        case 'imageMenu': extensionToAdd = '.jpg'; break;
                    }

                    fileName += extensionToAdd;
                }

                chrome.downloads.download({
                    url: request.url,
                    filename: fileName ?? 'image',
                    saveAs: false
                });
            } break;

            case 'downloadUrlAs': {
                let fileName = request.url.split('#').shift().split('?').shift().split('/').pop();
                if (fileName && !fileName.includes('.') && request.typeOfMenu) {
                    let extensionToAdd = '';
                    switch (request.typeOfMenu) {
                        case 'playerMenu': extensionToAdd = '.mp4'; break;
                        case 'imageMenu': extensionToAdd = '.jpg'; break;
                    }
                    fileName += extensionToAdd;
                }

                chrome.downloads.download({
                    url: request.url,
                    filename: fileName ?? 'image',
                    saveAs: true
                });
            } break;

            case 'addToBookmarks': {
                chrome.bookmarks.create({
                    url: sender.tab.url,
                    title: sender.tab.title
                });
            } break;

            case 'searchImageOnGoogle': {
                chrome.tabs.create({
                    url: 'http://images.google.com/searchbyimage?image_url=' + request.url, active: true, index: sender.tab.index + 1
                });
            } break;

            case 'switchToPreviousTab': {
                const queryInfo = {
                    active: false,
                    currentWindow: true
                }
                chrome.tabs.query(queryInfo, function (tabs) {
                    let nextTab;
                    // if there is at least one tab to the left of the current
                    if (tabs.some(cur => cur.index < sender.tab.index)) {
                        // get closest tab to the left (if not found it will return the closest tab to the right)
                        nextTab = tabs.reduce((acc, cur) =>
                            (acc.index >= sender.tab.index && cur.index < acc.index) || (cur.index < sender.tab.index && cur.index > acc.index) ? cur : acc
                        );
                    }
                    if (nextTab) chrome.tabs.update(nextTab.id, { active: true });
                });
            } break;

            case 'switchToNextTab': {
                const queryInfo = {
                    active: false,
                    currentWindow: true
                }

                chrome.tabs.query(queryInfo, function (tabs) {
                    let nextTab;
                    // if there is at least one tab to the right of the current
                    if (tabs.some(cur => cur.index > sender.tab.index)) {
                        // get closest tab to the right (if not found it will return the closest tab to the left)
                        nextTab = tabs.reduce((acc, cur) =>
                            (acc.index <= sender.tab.index && cur.index > acc.index) || (cur.index > sender.tab.index && cur.index < acc.index) ? cur : acc
                        );
                    }
                    // get the most left tab if tab cycling is activated
                    // else if (this.getSetting("cycling") && tabs.length > 0) {
                    //     nextTab = tabs.reduce((acc, cur) => acc.index < cur.index ? acc : cur);
                    // }
                    // focus next tab if available
                    if (nextTab) {
                        chrome.tabs.update(nextTab.id, { active: true });
                    }
                });
            } break;

            case 'restoreClosedTab': {
                chrome.sessions.getRecentlyClosed({
                    maxResults: 1
                }, function (sessionInfos) {
                    if (!sessionInfos.length) return;

                    let sessionInfo = sessionInfos[0];
                    if (sessionInfo.tab) {
                        chrome.sessions.restore(sessionInfo.tab.sessionId);
                    } else {
                        chrome.sessions.restore(sessionInfo.window.sessionId);
                    }
                });

            } break;

            case 'pageZoomIn': {
                const zoomSetting = 3.0;
                // try to get single number
                const zoomStep = Number(zoomSetting);
                // array of default zoom levels
                let zoomLevels = [.3, .5, .67, .8, .9, 1, 1.1, 1.2, 1.33, 1.5, 1.7, 2, 2.4, 3];
                // maximal zoom level
                let maxZoom = 3, newZoom;

                // if no zoom step value exists and string contains comma, assume a list of zoom levels
                if (!zoomStep && zoomSetting && zoomSetting.includes(",")) {
                    // get and override default zoom levels
                    zoomLevels = zoomSetting.split(",").map(z => parseFloat(z) / 100);
                    // get and override max zoom boundary but cap it to 300%
                    maxZoom = Math.min(Math.max(...zoomLevels), maxZoom);
                }

                chrome.tabs.getZoom(sender.tab.id, function (currentZoom) {
                    if (zoomStep) {
                        newZoom = Math.min(maxZoom, currentZoom + zoomStep / 100);
                    }
                    else {
                        newZoom = zoomLevels.reduce((acc, cur) => cur > currentZoom && cur < acc ? cur : acc, maxZoom);
                    }

                    if (newZoom > currentZoom) {
                        chrome.tabs.setZoom(sender.tab.id, newZoom);
                    }
                });

            } break;

            case 'pageZoomOut': {
                const zoomSetting = 3.0;
                // try to get single number
                const zoomStep = Number(zoomSetting);
                // array of default zoom levels
                let zoomLevels = [3, 2.4, 2, 1.7, 1.5, 1.33, 1.2, 1.1, 1, .9, .8, .67, .5, .3];
                // minimal zoom level
                let minZoom = .3, newZoom;

                // if no zoom step value exists and string contains comma, assume a list of zoom levels
                if (!zoomStep && zoomSetting && zoomSetting.includes(",")) {
                    // get and override default zoom levels
                    zoomLevels = zoomSetting.split(",").map(z => parseFloat(z) / 100);
                    // get min zoom boundary but cap it to 30%
                    minZoom = Math.max(Math.min(...zoomLevels), minZoom);
                }

                chrome.tabs.getZoom(sender.tab.id, function (currentZoom) {
                    if (zoomStep) {
                        newZoom = Math.max(minZoom, currentZoom - zoomStep / 100);
                    }
                    else {
                        newZoom = zoomLevels.reduce((acc, cur) => cur < currentZoom && cur > acc ? cur : acc, minZoom);
                    }

                    if (newZoom < currentZoom) {
                        chrome.tabs.setZoom(sender.tab.id, newZoom);
                    }
                });

            } break;

            case 'toggleFullscreen': {
                chrome.windows.get(sender.tab.windowId, function (window) {
                    chrome.windows.update(sender.tab.windowId, {
                        state: window.state === 'fullscreen' ? 'maximized' : 'fullscreen'
                    });
                });
            } break;

            case 'maximizeWindow': {
                chrome.windows.get(sender.tab.windowId, function (window) {
                    chrome.windows.update(sender.tab.windowId, {
                        state: window.state === 'maximized' ? 'normal' : 'maximized'
                    });
                });
            } break;

            case 'minimizeWindow': {
                chrome.windows.update(sender.tab.windowId, {
                    state: 'minimized'
                });
            } break;

            case 'getCurrentClipboardContent': {
                try {
                    navigator.clipboard.readText().then(text => sendResponse(text));
                } catch (e) {
                    sendResponse('');
                }
                return true;

            } break;

            case 'showBrowserNotification': {
                displayNotification(request.title, request.message, request.url, request.image)
            } break;

            case 'duplicateTab': {
                chrome.tabs.duplicate(sender.tab.id, function () { });
            } break;

            case 'openInPopupWindow': {
                if (request.url !== null) {
                    chrome.windows.get(
                        sender.tab.windowId,
                        function (parentWindow) {
                            /// if original window is fullscreen, unmaximize it
                            let originalWindowIsFullscreen = false;
                            // if (parentWindow.state == 'fullscreen') {
                            //     originalWindowIsFullscreen = true;
                            //     chrome.windows.update(parentWindow.id, {
                            //         'state': 'maximized'
                            //     });
                            // }

                            // let height = 600, width = 500;
                            let height = window.screen.height * 0.65, width = window.screen.height * 0.5;
                            height = parseInt(height); width = parseInt(width);
                            let dx = request.dx - (width / 2), dy = request.dy - (height / 2);

                            /// check for screen overflow
                            if (dx < 0) dx = 0;
                            if (dy < 0) dy = 0;
                            if (dx + width > window.screen.width) dx = dx - (dx + width - window.screen.width);
                            if (dy + height > window.screen.height) dy = dy - (dy + height - window.screen.height);

                            /// round numbers
                            dx = Math.round(dx);
                            dy = Math.round(dy);
                            height = Math.round(height);
                            width = Math.round(width);

                            /// create popup window
                            setTimeout(function () {
                                chrome.windows.create({
                                    'url': request.url, 'type': 'popup', 'width': width, 'height': height,
                                    'top': dy, 'left': dx
                                }, function (popupWindow) {
                                    /// set coordinates again (workaround for firefox bug)
                                    chrome.windows.update(popupWindow.id, {
                                        'top': dy, 'left': dx
                                    });

                                    /// close popup on click parent window
                                    function windowFocusListener(windowId) {
                                        if (windowId == sender.tab.windowId) {
                                            chrome.windows.onFocusChanged.removeListener(windowFocusListener);
                                            chrome.windows.remove(popupWindow.id);

                                            if (originalWindowIsFullscreen) chrome.windows.update(parentWindow.id, {
                                                'state': 'fullscreen'
                                            });
                                        }
                                    }

                                    setTimeout(function () {
                                        chrome.windows.onFocusChanged.addListener(windowFocusListener);
                                    }, 100);
                                });
                            }, originalWindowIsFullscreen ? 600 : 0)
                        }
                    );
                }
            } break;

            /// "Open in sidebar" experiment
            case 'openInSideWindow': {
                if (request.url !== null && request.url !== sender.tab.url) {

                    /// if 'sidebar' window already opened, open new tab in it
                    if (virtualSidebarWindowId) {
                        chrome.tabs.create({ windowId: virtualSidebarWindowId, active: true, url: request.url })
                    } else {
                        /// create new sidebar window
                        let sidebarPercent = 35;
                        let sidebarWidth = Math.round(window.screen.width * (sidebarPercent / 100));

                        chrome.windows.get(
                            sender.tab.windowId,
                            function (parentWindow) {

                                /// if original window is fullscreen, unmaximize it
                                let originalWindowIsFullscreen = false;
                                if (parentWindow.state == 'fullscreen') {
                                    chrome.windows.update(parentWindow.id, {
                                        'state': 'maximized'
                                    });
                                    originalWindowIsFullscreen = true;
                                }

                                /// store original window width
                                const initialWidth = originalWindowIsFullscreen ? window.screen.width : parentWindow.width;

                                /// resize original window
                                chrome.windows.update(parentWindow.id, {
                                    'width': initialWidth - sidebarWidth
                                });

                                /// create side window
                                chrome.windows.create({
                                    'url': request.url, 'width': sidebarWidth, 'height': window.screen.height,
                                    'top': parentWindow.top, 'left': window.screen.width - sidebarWidth,
                                    // 'type': 'popup',
                                }, function (sideWindow) {
                                    virtualSidebarWindowId = sideWindow.id;

                                    /// workaround for Firefox
                                    chrome.windows.update(sideWindow.id, {
                                        'top': parentWindow.top, 'left': window.screen.width - sidebarWidth
                                    });

                                    /// Listen to sidebar close to restore original window's width
                                    function onCloseListener(closedWindowId) {
                                        if (closedWindowId == sideWindow.id) {
                                            /// restore parent window original width
                                            chrome.windows.update(parentWindow.id, originalWindowIsFullscreen ? {
                                                'width': initialWidth,
                                                'state': 'fullscreen'
                                            } : {
                                                'width': initialWidth
                                            });

                                            chrome.windows.onRemoved.removeListener(onCloseListener);
                                            virtualSidebarWindowId = undefined;
                                        }
                                    }
                                    chrome.windows.onRemoved.addListener(onCloseListener);
                                });
                            }
                        );
                    }
                }
            } break;

            case 'moveToNewWindow': {
                if (request.url !== null && request.url !== sender.tab.url)
                    chrome.windows.create({ "url": request.url });
                else {
                    chrome.tabs.remove(sender.tab.id, function () { });

                    chrome.windows.create({}, function (window) {
                        chrome.tabs.move(sender.tab.id, { index: 0, windowId: window.id });
                        chrome.tabs.create({ windowId: window.id, index: 0, active: true, pinned: sender.tab.pinned, url: sender.tab.url })
                    });
                }
            } break;

            case 'openInPrivateWindow': {
                chrome.windows.create({ "url": request.url ?? sender.tab.url, "incognito": true });
            } break;

            case 'moveTabRight': {
                chrome.tabs.move(sender.tab.id, { index: sender.tab.index + 1 });
            } break;

            case 'moveTabLeft': {
                chrome.tabs.move(sender.tab.id, { index: sender.tab.index - 1 });
            } break;

            case 'pinTab': {
                if (sender.tab.pinned) {
                    chrome.tabs.create({
                        "url": sender.tab.url,
                        "pinned": false,
                        "index": sender.tab.index + 1
                    },
                        function (tab) {
                            tab.highlighted = true;
                            tab.active = true;

                            chrome.tabs.remove(sender.tab.id, function () { });
                        });
                } else {
                    chrome.tabs.create({
                        "url": sender.tab.url,
                        "pinned": true
                    },
                        function (tab) {
                            tab.highlighted = true;
                            tab.active = true;

                            chrome.tabs.remove(sender.tab.id, function () { });
                        });
                }
            } break;


            case 'checkNextTabAvailability': {
                chrome.tabs.query({}, function (tabs) {
                    sendResponse(sender.tab.index == tabs.length - 1);
                });
                return true;
            } break;

            case 'checkPrevTabAvailability': {
                sendResponse(sender.tab.index == 0);
            } break;

            case 'checkFullscreenToggleStatus': {
                chrome.windows.get(sender.tab.windowId, function (window) {
                    sendResponse(window.state === 'fullscreen');
                });
                return true;
            } break;

            case 'checkPinTabStatus': {
                sendResponse(sender.tab.pinned);
            } break;

            case 'inspectPage': {
                chrome.developerPrivate.openDevTools()
            } break;

            case 'returnAllTabs': {
                chrome.tabs.query({
                    currentWindow: true
                }, function (tabs) {
                    sendResponse(tabs);
                });
                return true;
            } break;

            case 'returnAllBookmarks': {
                const books = [];

                function process_bookmark(bookmarks, isInitial = false) {
                    for (let i = 0, l = bookmarks.length; i < l; i++) {
                        let bookmark = bookmarks[i];
                        if (bookmark.url) {
                            // console.log("bookmark: " + bookmark.title + " ~  " + bookmark.url);
                            books.push(bookmark);
                        }

                        if (bookmark.children) {
                            process_bookmark(bookmark.children);
                        }

                        if (isInitial && i == l - 1) {
                            // setTimeout(function () {
                            sendResponse(books);
                            // }, 3);
                        }
                    }
                }

                chrome.bookmarks.getTree(function (bookmarks) {
                    process_bookmark(bookmarks, true);
                });

                return true;

            } break;

            case 'switchToIndexedTab': {
                chrome.tabs.update(request.id, { active: true });
                return true;
            } break;

            case 'closeIndexedTab': {
                chrome.tabs.remove(request.id, function () { });
            } break;

            case 'copyPrefetchedImageFirefox': {
                copyPrefetchedImage(request.blob, function (result) {
                    sendResponse(result);
                });
                return true;
            } break;

            case 'firefoxCaptureTab': {
                const thumbWidth = window.screen.width / 1.5;

                const capturing = browser.tabs.captureTab(request.id, {
                    'format': 'jpeg', 'quality': 30, 'scale': window.devicePixelRatio * 0.2,
                    /// attempt to trim horizontal white space s
                    'rect': {
                        'x': (window.screen.width - thumbWidth) / 2.5,
                        'y': 0,
                        'width': thumbWidth,
                        'height': window.screen.height / 1.35,
                    }
                });
                capturing.then(function (result) {
                    sendResponse(result);
                }, function (error) {
                    sendResponse(error);
                });
                return true;
            } break;
        }
    }
);

async function copyPrefetchedImage(blob, callback) {
    try {
        const buffer = await blob.arrayBuffer();
        await chrome.clipboard.setImageData(buffer, "png");
        callback(true);
    } catch (e) {
        callback(false);
    }
}


/**
 * displays a browser notification
 * opens an URL on click if specified
 **/
function displayNotification(title, message, link, image) {
    // create notification
    // const createNotification =
    chrome.notifications.create({
        "type": "basic",
        "iconUrl": image ?? "./assets/icons/icon-new.png",
        "title": title,
        "message": message,
    }, function (notificationId) {
        // if an URL is specified register an onclick listener
        if (link)
            chrome.notifications.onClicked.addListener(function handleNotificationClick(id) {
                if (id === notificationId) {
                    chrome.tabs.create({
                        url: link,
                        active: true
                    });
                    // remove event listener
                    chrome.notifications.onClicked.removeListener(handleNotificationClick);
                }
            });
    });
}