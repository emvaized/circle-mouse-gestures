/// Listener to open url in new tab
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
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