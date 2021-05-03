/// Configs
var configs = {
    'debugMode': true,
    'animationDuration': 200,
    'hideCircleIfNoActionSelected': true,
    'useMouseWheelGestures': true,
    'addTextLabels': true,
    'dimBackground': false,
    'backgroundDimmerOpacity': 0.25,
    'circleOpacity': 1.0,
    'innerCircleRadius': 30,
    'circleRadius': 115,
    'interactiveCircleRadius': 57,
    'gapBetweenCircles': 8,
    'gapBeforeInteractiveCircle': 8,
    'addCircleOutlines': true,
    'labelOpacity': 0.75,
    'iconOpacity': 1.0,

    /// 'Replace' will display interactive menu only (link, image, selected text),
    /// and 'combine' will add it as outer circle level
    'interactiveMenusBehavior': 'replace',  /// possible values: 'replace', 'combine'
    'addLinkTooltip': true,
    'showFullLinkInTooltip': true,
    'showLinkTextInTooltip': false,
    'showLinkTooltipForPageItself': false,
    'linkTooltipOpacity': 1.0,
    'circleHideAnimation': false,
    'circleAppearAnimation': false,

    /// Menus
    'regularMenu': {
        'color': "#4c4c4c",
        'rockerAction': 'reloadTab',
        'mouseWheelUpAction': 'scrollToTop',
        'mouseWheelDownAction': 'scrollToBottom',
        'levels': [
            {
                'width': 100,
                'color': '#000000',
                'buttons': [
                    { 'id': 'goForward' },
                    { 'id': 'newTab' },
                    { 'id': 'goBack' },
                    { 'id': 'closeCurrentTab' },
                ]
            },
            {
                'width': 57,
                'buttons': [
                    { 'id': 'switchToNextTab' },
                    { 'id': 'reloadTab' },
                    { 'id': 'scrollToBottom' },
                    { 'id': 'restoreClosedTab' },
                    { 'id': 'switchToPreviousTab' },
                    // { 'id': 'translatePage' },
                    { 'id': 'translate' },
                    { 'id': 'scrollToTop' },
                    { 'id': 'copyUrl' },
                ]
            },
            // {
            //     'width': 57,
            //     'buttons': [
            //         { 'id': 'goForward' },
            //         { 'id': 'newTab' },
            //         { 'id': 'newTab' },
            //         { 'id': 'goBack' },
            //         { 'id': 'closeCurrentTab' },
            //     ]
            // },
        ]
    },

    'linkMenu': {
        'color': "#3777CD",
        'rockerAction': 'openInFgTab',
        'buttons': [
            { 'id': 'openInFgTab' },
            { 'id': 'copyLinkText' },
            { 'id': 'openInBgTab' },
            { 'id': 'copyUrl' },
        ]
    },

    'selectionMenu': {
        'color': "#000000",
        'rockerAction': 'copyText',
        'buttons': [
            { 'id': 'copyText' },
            { 'id': 'searchText' },
            { 'id': 'translate' },
        ]
    },

    'imageMenu': {
        // 'color': "#c69a15",
        'color': "#d80000",
        'rockerAction': 'openInFgTab',
        'buttons': [
            { 'id': 'openInFgTab' },
            { 'id': 'downloadUrlAs' },
            { 'id': 'openInBgTab' },
            { 'id': 'searchImageOnGoogle' },
            { 'id': 'copyUrl' },
        ]

    },
};



function loadUserConfigs(callback) {
    let keys = Object.keys(configs);
    chrome.storage.local.get(
        keys, function (userConfigs) {
            for (var i = 0; i < keys.length; i++) {
                let key = keys[i];

                if (userConfigs[key] !== null && userConfigs[key] !== undefined)
                    configs[key] = userConfigs[key];
            }

            if (configs.debugMode)
                console.log('CMG user configs loaded from memory');


            /// Dark mode handling
            // try {
            //     let websiteBackgroundColor = document.body.style.backgroundColor;

            //     if (websiteBackgroundColor !== null && websiteBackgroundColor !== undefined) {
            //         const prefersDark = isColorDark(websiteBackgroundColor);

            //         if (prefersDark) {
            //             configs['regularMenu']['color'] = '#ffffff';
            //         }
            //     }
            // } catch (e) { console.log(e); }


            callback();
        });


}


function saveAllSettings(userConfigs) {
    chrome.storage.local.set(userConfigs ?? configs);

    // var dataToSave = {};

    // let keys = Object.keys(configs);
    // keys.forEach(function (key) {
    //     var input = document.querySelector(`#${key}`);
    //     dataToSave[key] = input.type == 'checkbox' ? input.checked : input.value;
    // });
    // chrome.storage.local.set(dataToSave);

}