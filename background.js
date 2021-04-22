/// Listener to open url in new tab
chrome.runtime.onMessage.addListener(
    async function (request, sender, sendResponse) {
        /// Regular menu
        // if (request.typeOfAction == 'mgc-regular-menu')
        switch (request.actionToDo) {
            case 'newTab': {
                // chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.create({ index: sender.tab.index + 1 });
                // });
            } break;
            case 'closeCurrentTab': {
                // chrome.tabs.getSelected(function (tab) {
                chrome.tabs.remove(sender.tab.id, function () { });
                // });
            } break;
            case 'reloadTab': {
                // chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.reload(sender.tab.id);
                // });

            } break;
            case 'goBack': {
                // chrome.tabs.getSelected(null, function (tab) {
                chrome.tabs.goBack(sender.tab.id);
                // });
            } break;
            case 'goForward': {
                // chrome.tabs.getCurrent(function (tab) {
                chrome.tabs.goForward(sender.tab.id);
                // });
            } break;

            /// URL menu
            case 'openInBgTab': {
                let index = sender.tab.index;
                chrome.tabs.create({
                    url: request.url, active: false, index: index + 1
                });
            } break;

            case 'openInFgTab': {
                // chrome.tabs.query({
                //     active: true, currentWindow: true
                // }, tabs => {
                let index = sender.tab.index;
                chrome.tabs.create({
                    url: request.url, active: true, index: index + 1
                });
                // }
                // );
            } break;

            case 'copyUrl': {
                var input = document.createElement('textarea');
                document.body.appendChild(input);
                input.value = request.url;
                input.focus();
                input.select();
                document.execCommand('Copy');
                input.remove();
            } break;

            case 'copyLinkText': {
                var input = document.createElement('textarea');
                document.body.appendChild(input);
                input.value = request.linkText;
                input.focus();
                input.select();
                document.execCommand('Copy');
                input.remove();
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

            case 'translatePage': {
                let index = sender.tab.index;
                chrome.tabs.create({
                    url: 'https://translate.google.com/translate?sl=auto&tl=ru&u=' + request.url, active: true, index: index + 1
                });
            } break;

            case 'switchToPreviousTab': {

                const queryInfo = {
                    active: false,
                    currentWindow: true
                }

                // // if (this.getSetting("excludeDiscarded")) queryInfo.discarded = false;

                chrome.tabs.query(queryInfo, function (tabs) {
                    let nextTab;
                    // if there is at least one tab to the left of the current
                    if (tabs.some(cur => cur.index < sender.tab.index)) {
                        // get closest tab to the left (if not found it will return the closest tab to the right)
                        nextTab = tabs.reduce((acc, cur) =>
                            (acc.index >= sender.tab.index && cur.index < acc.index) || (cur.index < sender.tab.index && cur.index > acc.index) ? cur : acc
                        );
                    }
                    // else get most right tab if tab cycling is activated
                    // else if (this.getSetting("cycling") && tabs.length > 0) {
                    //     nextTab = tabs.reduce((acc, cur) => acc.index > cur.index ? acc : cur);
                    // }
                    // focus next tab if available
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

                // if (this.getSetting("excludeDiscarded")) queryInfo.discarded = false;

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
        }

        /// Open url in new tab next to current one
        // if (request.type == 'selecton-open-new-tab')
        //     chrome.tabs.query({
        //         active: true, currentWindow: true
        //     }, tabs => {
        //         let index = tabs[0].index;
        //         chrome.tabs.create({
        //             url: request.url, active: request.focused, index: index + 1
        //         });
        //     }
        //     );
    }
);





chrome.runtime.onInstalled.addListener((details) => {
    // enable context menu on mouseup
    try {
        chrome.browserSettings.contextMenuShowEvent.set({ value: "mouseup" });
    }
    catch (error) {
        // console.warn("Gesturefy was not able to change the context menu behaviour to mouseup.", error);
    }

    // run this code after the config is loaded
    // Config.loaded.then(() => {

    //     switch (details.reason) {
    //         case "install":
    //             // show installation onboarding page
    //             browser.tabs.create({
    //                 url: browser.runtime.getURL("/views/installation/index.html"),
    //                 active: true
    //             });
    //             break;

    //         case "update":
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
    //             break;
    //     }
    // });
});