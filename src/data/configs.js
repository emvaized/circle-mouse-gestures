/// Configs
var configs = {
    'debugMode': true,
    'animationDuration': 200,
    'hideCircleIfNoActionSelected': true,
    'useMouseWheelGestures': true,
    'addTextLabels': true,

    'circleOpacity': 1.0,
    'circleRadius': 115,
    'innerCircleRadius': 30,
    'gapBetweenCircles': 8,
    'addCircleOutlines': true,
    'labelOpacity': 0.75,
    'iconOpacity': 1.0,

    'addLinkTooltip': false,
    'showFullLinkInTooltip': true,
    'showLinkTextInTooltip': true,
    'showLinkTooltipForPageItself': true,
    'linkTooltipOpacity': 1.0,

    /// Menus
    'regularMenu': {
        'color': "#4c4c4c",
        'rockerAction': 'reloadTab',
        'levels': [
            {
                'width': 90,
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
                    { 'id': 'translatePage' },
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
        'levels': [
            {
                'buttons': [
                    { 'id': 'openInFgTab' },
                    { 'id': 'copyLinkText' },
                    { 'id': 'openInBgTab' },
                    { 'id': 'copyUrl' },
                ]
            }
        ],

    },

    'imageMenu': {
        'color': "#c69a15",
        'rockerAction': 'openInFgTab',
        'levels': [
            {
                'buttons': [
                    { 'id': 'openInFgTab' },
                    { 'id': 'downloadUrlAs' },
                    { 'id': 'openInBgTab' },
                    { 'id': 'searchImageOnGoogle' },
                    { 'id': 'copyUrl' },
                ]
            }
        ],

    }
};



function loadUserConfigs(callback) {
    let keys = Object.keys(configs);
    chrome.storage.local.get(
        keys, function (userConfigs) {
            for (var i = 0; i < keys.length; i++) {
                let key = keys[i];

                if (userConfigs[key])
                    configs[key] = userConfigs[key];
            }

            if (configs.debugMode)
                console.log('CMG user configs loaded from memory');

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