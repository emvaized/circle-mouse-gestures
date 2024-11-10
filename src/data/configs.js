/// Configs
const configs = {
    'debugMode': false,
    'cmgEnabled': true,
    'storeCurrentScrollPosition': false,
    'animateHideRelativeToSelected': false,
    'animationDuration': 200,
    'hideCircleIfNoActionSelected': true,
    'useMouseWheelGestures': true,
    'addTextLabels': true,
    'dimBackground': true,
    'backgroundDimmerOpacity': 0.05,
    'circleOpacity': 1.0,
    'innerCircleRadius': 21,
    'circleRadius': 115,
    'interactiveCircleRadius': 57,
    'gapBetweenCircles': 8,
    'gapBeforeInteractiveCircle': 8,
    'addCircleOutlines': true,
    'showRegularMenuIfNoAction': true,
    'copyNotification': true,
    'labelOpacity': 0.75,
    'iconOpacity': 1.0,
    'inactiveMenuBehavior': 'regularMenuFallback', /// possible values: 'regularMenuFallback', 'doNothing'
    'openCircleOn': 'rightClick', /// possible values: 'rightClick', 'longLeftClick'
    'delayForLongLeftClick': 500, /// ms

    /// 'Replace' will display interactive menu only (link, image, selected text),
    /// and 'combine' will add it as outer circle level
    'interactiveMenusBehavior': 'replace',  /// possible values: 'replace', 'combine'
    'addLinkTooltip': false,
    // 'showFullLinkInTooltip': false,
    'showCategoryIconInTooltip': true,
    // 'showLinkTextInTooltip': true,
    'showLinkTooltipForPageItself': false,
    'linkTooltipOpacity': 1.0,
    'addCircleShadow': false,
    'highlightElementOnHover': false,
    'showTitleOnHoverWhenHidden': true,
    'horizontalWheelActionsEnabled': false,
    'continiousVerticalScrollDetection': true,
    'continiousHorizontalScrollDetection': true,
    'applySettingsImmediately': false,
    'delayToShowTitleOnHoverWhenHidden': 600, // ms
    'circleShadowOpacity': 0.3,
    'circleLocation': 'cursorOverflow', /// possible values: 'alwaysCursor', 'alwaysCorner', cursorCorner', 'cursorOverflow
    'longLeftClickThreshold': 21,
    'addBlur': false,
    'addGhostPointer': true,
    'blurRadius': 4,
    'showActionIcons': true,
    'hideLabelIfNoSpace': true,
    'showUpdateNotification': true,
    'checkButtonsAvailability': true,
    'requireModifierForSpecificMenus': false,
    'addBorderToHoveredElement': true,
    'segmentsIndent': 0,
    'excludedDomains': '',
    'showCircleAnimation': 'scale', /// possible values: 'noAnimation', 'fade', 'scale'
    'hideCircleAnimation': 'scale', /// possible values: 'noAnimation', 'fade', 'scale'
    'mouseLeaveBehavior': 'hideMenu', /// possible values: 'doNothing', 'hideMenu', 'hideMenuAndSelect'

    /// Menus
    'regularMenu': {
        'color': "#4c4c4c",
        'rockerLeftClick': 'reloadTab',
        'rockerMiddleClick': 'noAction',
        'mouseWheelUpAction': 'pageZoomIn',
        'mouseWheelDownAction': 'pageZoomOut',
        'mouseWheelLeftAction': 'showTabSwitcherHorizontal',
        'mouseWheelRightAction': 'showTabSwitcherHorizontal',
        'levels': [
            {
                'width': 100,
                'buttons': [
                    { 'id': 'goForward' },
                    { 'id': 'newTab' },
                    { 'id': 'goBack' },
                    { 'id': 'closeCurrentTab' },
                    // { 'id': 'openUrl', 'url': 'translate.google.com', 'label': 'Translate' },
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
                    // { 'id': 'translate' },
                    { 'id': 'selectLastVisitedTab' },
                    { 'id': 'scrollToTop' },
                    { 'id': 'copyUrl' },
                ]
            },
        ]
    },

    'linkMenu': {
        'color': "#3777CD",
        'rockerLeftClick': 'openInBgTab',
        'rockerMiddleClick': 'openInFgTab',
        'mouseWheelUpAction': 'scrollToTop',
        'mouseWheelDownAction': 'scrollToBottom',
        'mouseWheelLeftAction': 'noAction',
        'mouseWheelRightAction': 'noAction',
        'levels': [
            {
                'buttons': [
                    // { 'id': 'openInFgTab' },
                    { 'id': 'openInBgTab' },
                    { 'id': 'copyUrl' },
                    { 'id': 'copyLinkText' },
                    { 'id': 'openLinkPreview' },
                ]
            }
        ]
    },

    'selectionMenu': {
        'color': "#B44141",
        'rockerLeftClick': 'copyText',
        'rockerMiddleClick': 'noAction',
        'mouseWheelUpAction': 'scrollToTop',
        'mouseWheelDownAction': 'scrollToBottom',
        'mouseWheelLeftAction': 'noAction',
        'mouseWheelRightAction': 'noAction',
        'levels': [
            {
                'buttons': [
                    { 'id': 'searchText' },
                    { 'id': 'copyText' },
                    { 'id': 'translate' },
                    { 'id': 'selectMore' },
                ]
            }
        ]
    },

    'textFieldMenu': {
        'width': 100,
        'color': "#499447",
        'rockerLeftClick': 'pasteText',
        'rockerMiddleClick': 'noAction',
        'mouseWheelUpAction': 'scrollToTop',
        'mouseWheelDownAction': 'scrollToBottom',
        'mouseWheelLeftAction': 'noAction',
        'mouseWheelRightAction': 'noAction',
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
        'color': "#F05705",
        'rockerLeftClick': 'openInFgTab',
        'rockerMiddleClick': 'noAction',
        'mouseWheelUpAction': 'scrollToTop',
        'mouseWheelDownAction': 'scrollToBottom',
        'mouseWheelLeftAction': 'noAction',
        'mouseWheelRightAction': 'noAction',
        'levels': [
            {
                'buttons': [
                    { 'id': 'copyUrl' },
                    { 'id': 'downloadUrlAs' },
                    { 'id': 'searchImageOnGoogle' },
                    { 'id': 'copyImage' },
                    { 'id': 'openImageFullscreen' },
                ]
            },
        ]
    },

    'imageLinkMenu': {
        'color': "#F05705",
        'rockerLeftClick': 'openInFgTab',
        'rockerMiddleClick': 'noAction',
        'mouseWheelUpAction': 'scrollToTop',
        'mouseWheelDownAction': 'scrollToBottom',
        'mouseWheelLeftAction': 'noAction',
        'mouseWheelRightAction': 'noAction',
        'levels': [
            {
                'width': 120,
                'buttons': [
                    { 'id': 'copyImageUrl' },
                    { 'id': 'downloadUrlAs' },
                    { 'id': 'searchImageOnGoogle' },
                    { 'id': 'copyImage' },
                    { 'id': 'openImageFullscreen' },
                ]
            },

            {
                'color': "#3777CD",
                'width': 57,
                'buttons': [
                    // { 'id': 'openInFgTab' },
                    { 'id': 'openInBgTab' },
                    { 'id': 'copyUrl' },
                    { 'id': 'copyLinkText' },
                    { 'id': 'openLinkPreview' },
                ]
            }
        ]
    },

    'playerMenu': {
        'color': "#000000",
        'rockerLeftClick': 'playPauseVideo',
        'rockerMiddleClick': 'noAction',
        'mouseWheelUpAction': 'scrollToTop',
        'mouseWheelDownAction': 'scrollToBottom',
        'mouseWheelLeftAction': 'noAction',
        'mouseWheelRightAction': 'noAction',
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


/// Methods
function loadUserConfigs(callback) {
    const keys = Object.keys(configs);
    chrome.storage.local.get(
        keys, function (userConfigs) {
            const l = keys.length;
            for (var i = 0; i < l; i++) {
                let key = keys[i];

                if (userConfigs[key] !== null && userConfigs[key] !== undefined)
                    configs[key] = userConfigs[key];
            }

            if (configs.debugMode) { console.log('CMG user configs loaded from memory:'); console.log(userConfigs); }

            /// Check for domain to be in black list
            // configs.excludedDomains = userConfigs.excludedDomains || '';
            if (configs.excludedDomains !== null && configs.excludedDomains !== undefined && configs.excludedDomains !== '')
                configs.excludedDomains.split(',').forEach(function (domain) {
                    if (window.location.href.includes(domain.trim().toLowerCase())) configs.cmgEnabled = false;
                });

            if (callback)
                callback();
        });
}


function saveAllSettings(userConfigs) {
    chrome.storage.local.set(userConfigs ?? configs);
}


/// Default values
/// Default configs
const defaultConfigs = {
    'debugMode': false,
    'cmgEnabled': true,
    'storeCurrentScrollPosition': false,
    'animateHideRelativeToSelected': false,
    'animationDuration': 200,
    'hideCircleIfNoActionSelected': true,
    'useMouseWheelGestures': true,
    'addTextLabels': true,
    'dimBackground': true,
    'backgroundDimmerOpacity': 0.05,
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
    'openCircleOn': 'rightClick', /// possible values: 'rightClick', 'longLeftClick'
    'delayForLongLeftClick': 500, /// ms
    'interactiveMenusBehavior': 'replace',  /// possible values: 'replace', 'combine'
    'addLinkTooltip': false,
    // 'showFullLinkInTooltip': false,
    'showCategoryIconInTooltip': true,
    'showLinkTextInTooltip': false,
    'showLinkTooltipForPageItself': false,
    'linkTooltipOpacity': 1.0,
    'circleHideAnimation': true,
    'addCircleShadow': false,
    'highlightElementOnHover': false,
    'showTitleOnHoverWhenHidden': true,
    'horizontalWheelActionsEnabled': false,
    'continiousVerticalScrollDetection': true,
    'continiousHorizontalScrollDetection': true,
    'applySettingsImmediately': false,
    'delayToShowTitleOnHoverWhenHidden': 600, // ms
    'circleShadowOpacity': 0.3,
    'circleLocation': 'cursorOverflow', /// possible values: 'alwaysCursor', 'alwaysCorner', cursorCorner', 'cursorOverflow'
    'longLeftClickThreshold': 21,
    'addGhostPointer': true,
    'addBlur': false,
    'showActionIcons': true,
    'hideLabelIfNoSpace': true,
    'showUpdateNotification': true,
    'checkButtonsAvailability': true,
    'requireModifierForSpecificMenus': false,
    'blurRadius': 4,
    'excludedDomains': '',
    'showCircleAnimation': 'scale', /// possible values: 'noAnimation', 'fade', 'scale'
    'hideCircleAnimation': 'scale', /// possible values: 'noAnimation', 'fade', 'scale'
    'mouseLeaveBehavior': 'hideMenu', /// possible values: 'doNothing', 'hideMenu', 'hideMenuAndSelect'

    /// Menus
    'regularMenu': {
        'color': "#4c4c4c",
        'rockerLeftClick': 'reloadTab',
        'rockerMiddleClick': 'noAction',
        'mouseWheelUpAction': 'pageZoomIn',
        'mouseWheelDownAction': 'pageZoomOut',
        'mouseWheelLeftAction': 'showTabSwitcherHorizontal',
        'mouseWheelRightAction': 'showTabSwitcherHorizontal',
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
                    // { 'id': 'translate' },
                    { 'id': 'selectLastVisitedTab' },
                    { 'id': 'scrollToTop' },
                    { 'id': 'copyUrl' },
                ]
            },
        ]
    },

    'linkMenu': {
        'color': "#3777CD",
        'rockerLeftClick': 'openInBgTab',
        'rockerMiddleClick': 'openInFgTab',
        'mouseWheelUpAction': 'scrollToTop',
        'mouseWheelDownAction': 'scrollToBottom',
        'mouseWheelLeftAction': 'noAction',
        'mouseWheelRightAction': 'noAction',
        'levels': [
            {
                'buttons': [
                    // { 'id': 'openInFgTab' },
                    { 'id': 'openInBgTab' },
                    { 'id': 'copyUrl' },
                    { 'id': 'copyLinkText' },
                    { 'id': 'openLinkPreview' },
                ]
            }
        ]
    },

    'selectionMenu': {
        'color': "#B44141",
        'rockerLeftClick': 'copyText',
        'rockerMiddleClick': 'noAction',
        'mouseWheelUpAction': 'scrollToTop',
        'mouseWheelDownAction': 'scrollToBottom',
        'mouseWheelLeftAction': 'noAction',
        'mouseWheelRightAction': 'noAction',
        'levels': [
            {
                'buttons': [
                    { 'id': 'searchText' },
                    { 'id': 'copyText' },
                    { 'id': 'translate' },
                    { 'id': 'selectMore' },
                ]
            }
        ]
    },

    'textFieldMenu': {
        'width': 100,
        'color': "#499447",
        'rockerLeftClick': 'pasteText',
        'rockerMiddleClick': 'noAction',
        'mouseWheelUpAction': 'scrollToTop',
        'mouseWheelDownAction': 'scrollToBottom',
        'mouseWheelLeftAction': 'noAction',
        'mouseWheelRightAction': 'noAction',
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
        'color': "#F05705",
        'rockerLeftClick': 'openInFgTab',
        'rockerMiddleClick': 'noAction',
        'mouseWheelUpAction': 'scrollToTop',
        'mouseWheelDownAction': 'scrollToBottom',
        'mouseWheelLeftAction': 'noAction',
        'mouseWheelRightAction': 'noAction',
        'levels': [
            {
                'buttons': [
                    { 'id': 'copyUrl' },
                    { 'id': 'downloadUrlAs' },
                    { 'id': 'searchImageOnGoogle' },
                    { 'id': 'copyImage' },
                    { 'id': 'openImageFullscreen' },
                ]
            }
        ]

    },

    'playerMenu': {
        'color': "#000000",
        'rockerLeftClick': 'playPauseVideo',
        'rockerMiddleClick': 'noAction',
        'mouseWheelUpAction': 'scrollToTop',
        'mouseWheelDownAction': 'scrollToBottom',
        'mouseWheelLeftAction': 'noAction',
        'mouseWheelRightAction': 'noAction',
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
