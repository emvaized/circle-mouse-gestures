/// Open options page after install
chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason == 'install') {
        chrome.runtime.openOptionsPage();
    }
    // else if (details.reason == 'update') {
    //             // show update notification
    //             if (Config.get("Settings.General.updateNotification")) {
    //                 // get manifest for new version number
    //                 const manifest = browser.runtime.getManifest();
    //                 // show update notification and open changelog on click
    //                 displayNotification(
    //                     browser.i18n.getMessage('addonUpdateNotificationTitle', manifest.name),
    //                     browser.i18n.getMessage('addonUpdateNotificationMessage', manifest.version),
    //                     "https://github.com/Robbendebiene/Gesturefy/releases"
    //                 );
    //             }
    // }
});

/// Listener to open url in new tab
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        // if (request.typeOfAction == 'mgc-regular-menu')
        switch (request.actionToDo) {
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

            case 'goBack': {
                chrome.tabs.goBack(sender.tab.id);
            } break;

            case 'goForward': {
                chrome.tabs.goForward(sender.tab.id);
            } break;

            case 'openInBgTab': {
                let index = sender.tab.index;
                chrome.tabs.create({
                    url: request.url, active: false, index: index + 1
                });
            } break;

            case 'openInFgTab': {
                let index = sender.tab.index;
                chrome.tabs.create({
                    url: request.url, active: true, index: index + 1
                });
            } break;

            case 'searchText': {
                let index = sender.tab.index;
                chrome.tabs.create({
                    url: 'https://www.google.com/search?q=' + request.selectedText, active: true, index: index + 1
                });
            } break;

            case 'translate': {
                let index = sender.tab.index;
                chrome.tabs.create({
                    url: (request.url.includes('https://') || request.url.includes('http://') ?
                        'https://translate.google.com/translate?sl=auto&tl=ru&u=' :
                        'https://translate.google.com/?sl=auto&tl=ru&text=') + encodeURI(request.url), active: true, index: index + 1
                });
            } break;

            case 'downloadUrl': {
                var fileName = request.url.split('#').shift().split('?').shift().split('/').pop();
                chrome.downloads.download({
                    url: request.url,
                    filename: fileName ?? 'image',
                    saveAs: false
                });
            } break;

            case 'downloadUrlAs': {
                var fileName = request.url.split('#').shift().split('?').shift().split('/').pop();
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
                let index = sender.tab.index;
                chrome.tabs.create({
                    url: 'http://images.google.com/searchbyimage?image_url=' + request.url, active: true, index: index + 1
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
                    if (nextTab) {
                        chrome.tabs.update(nextTab.id, { active: true });
                    }
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
                    if (!sessionInfos.length) {
                        // if (configs.debugMode) 
                        console.log("No sessions found")
                        return;
                    }
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

            case 'copyImageFirefox': {
                copyImageFirefox(request.url, function (result) {
                    sendResponse(result);
                });

                return true;
            } break;
        }
    }
);


async function copyImageFirefox(src, callback) {
    try {
        const response = await fetch(src);
        const mimeType = response.headers.get("Content-Type");

        switch (mimeType) {
            case "image/jpeg": {
                const buffer = await response.arrayBuffer();
                await chrome.clipboard.setImageData(buffer, "jpeg");
            } break;

            case "image/png": {
                const buffer = await response.arrayBuffer();
                await chrome.clipboard.setImageData(buffer, "png");
            } break;

            // convert other file types to png using the canvas api
            default: {
                const image = await new Promise((resolve, reject) => {
                    const image = new Image();
                    image.onload = () => resolve(image);
                    image.onerror = reject;
                    image.src = src;
                });

                const canvas = document.createElement('canvas');
                canvas.width = image.naturalWidth;
                canvas.height = image.naturalHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(image, 0, 0);

                // read png image from canvas as blob and write it to clipboard
                const blob = await new Promise((resolve) => canvas.toBlob(resolve), "image/png");
                const buffer = await blob.arrayBuffer();
                await chrome.clipboard.setImageData(buffer, "png");
            } break;
        }

        // confirm success
        // return true;
        callback(true);
    } catch (e) { callback(false); }
}

function timeoutPromise(ms, promise) {
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            reject(new Error("promise timeout"))
        }, ms);
        promise.then(
            (res) => {
                clearTimeout(timeoutId);
                resolve(res);
            },
            (err) => {
                clearTimeout(timeoutId);
                reject(err);
            }
        );
    })
}





/**
 * displays a browser notification
 * opens an URL on click if specified (non-specified)
 **/
function displayNotification(title, message, link, image) {
    // create notification
    // const createNotification = 
    chrome.notifications.create({
        "type": "basic",
        "iconUrl": image ?? "../../icons/icon-monotone-48.png",
        "title": title,
        "message": message
    });
}


