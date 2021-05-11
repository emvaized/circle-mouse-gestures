/// Configs
var configs = {
    'debugMode': false,
    'cmgEnabled': true,
    'animationDuration': 200,
    'hideCircleIfNoActionSelected': true,
    'useMouseWheelGestures': true,
    'addTextLabels': true,
    'dimBackground': false,
    'backgroundDimmerOpacity': 0.2,
    'circleOpacity': 1.0,
    'innerCircleRadius': 30,
    'circleRadius': 115,
    'interactiveCircleRadius': 57,
    'gapBetweenCircles': 8,
    'gapBeforeInteractiveCircle': 8,
    'addCircleOutlines': true,
    'showRegularMenuIfNoAction': true,
    'labelOpacity': 0.75,
    'iconOpacity': 1.0,
    'inactiveMenuBehavior': 'regularMenuFallback', /// possible values: 'regularMenuFallback', 'doNothing'

    /// 'Replace' will display interactive menu only (link, image, selected text),
    /// and 'combine' will add it as outer circle level
    'interactiveMenusBehavior': 'replace',  /// possible values: 'replace', 'combine'
    'addLinkTooltip': true,
    'showFullLinkInTooltip': false,
    'showCategoryIconInTooltip': true,
    'showLinkTextInTooltip': true,
    'showLinkTooltipForPageItself': false,
    'linkTooltipOpacity': 1.0,
    'circleHideAnimation': true,
    'addCircleShadow': false,
    'highlightElementOnHover': false,
    'circleShadowOpacity': 0.3,

    /// Menus
    'regularMenu': {
        'color': "#4c4c4c",
        'rockerAction': 'reloadTab',
        'mouseWheelUpAction': 'scrollToTop',
        'mouseWheelDownAction': 'scrollToBottom',
        'levels': [
            {
                'width': 100,
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
        ]
    },

    'linkMenu': {
        'color': "#3777CD",
        'rockerAction': 'openInFgTab',
        'mouseWheelUpAction': 'noAction',
        'mouseWheelDownAction': 'noAction',
        'levels': [
            {
                'buttons': [
                    { 'id': 'openInFgTab' },
                    { 'id': 'copyUrl' },
                    { 'id': 'openInBgTab' },
                    { 'id': 'copyLinkText' },
                ]
            }
        ]
    },

    'selectionMenu': {
        'color': "#B44141",
        'rockerAction': 'copyText',
        'mouseWheelUpAction': 'noAction',
        'mouseWheelDownAction': 'noAction',
        'levels': [
            {
                'buttons': [
                    { 'id': 'copyText' },
                    { 'id': 'searchText' },
                    { 'id': 'translate' },
                ]
            }
        ]
    },

    'textFieldMenu': {
        'width': 100,
        'color': "#499447",
        'rockerAction': 'pasteText',
        'mouseWheelUpAction': 'noAction',
        'mouseWheelDownAction': 'noAction',
        'levels': [
            {
                'buttons': [
                    { 'id': 'copyText' },
                    { 'id': 'pasteText' },
                    { 'id': 'cutText' },
                    { 'id': 'selectAllText' },
                    { 'id': 'clearInputField' },
                ]
            }
        ]
    },

    'imageMenu': {
        // 'color': "#c69a15",
        'color': "#F05705",
        'rockerAction': 'openInFgTab',
        'levels': [
            {
                'buttons': [
                    { 'id': 'openInFgTab' },
                    { 'id': 'downloadUrlAs' },
                    { 'id': 'openInBgTab' },
                    { 'id': 'copyImage' },
                    { 'id': 'copyUrl' },
                ]
            }
        ]

    },

    'playerMenu': {
        'color': "#000000",
        'rockerAction': 'playPauseVideo',
        'levels': [
            {
                'buttons': [
                    { 'id': 'downloadUrlAs' },
                    { 'id': 'playPauseVideo' },
                    { 'id': 'replayVideo' },
                    { 'id': 'rewindVideo' },
                    { 'id': 'fastForwardVideo' },
                ]
            }
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
                if (configs.debugMode) console.log('CMG user configs loaded from memory');

            callback();
        });


}


function saveAllSettings(userConfigs) {
    chrome.storage.local.set(userConfigs ?? configs);
}

