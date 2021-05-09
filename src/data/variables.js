/// Currently non-configurable variables
var checkAvailabilityForButtons = true;
var showRockerActionInCenter = false;
var rockerCircleOpacity = 0.75;
var scaleDownRockerIconWhenNonHovered = false;
var useRectangularShape = false;
var addShadows = false;

/// Service variables
var canvasRadius = configs.circleRadius * 4;
var firstCircleRadius = configs.circleRadius;
var firstCircleInnerRadius = configs.innerCircleRadius;
var secondCircleRadius = configs.circleRadius * 1.5;
var secondCircleInnerRadius = configs.circleRadius + configs.gapBetweenCircles;

var ctx;
var leftCoord = 0.0;
var topCoord = 0.0;
var selectedButtonSecondLevel;
var typeOfMenu = 'regularMenu';
var hoveredLink;
var hoveredLinkTitle;
var textSelection;
var circle;
var circleIsShown = false;
var rocketButtonPressed;
var leftClickIsHolded = false;
var linkTooltip;
var rockerCircle;
var backgroundDimmer;
var elementUnderCursor;
var currentClipboardContent;

/// Index of level: index of button
var selectedButtons = {};
var preselectedButtons = {};
var buttonsAvailability = {};

/// Default configs
var defaultConfigs = {
    'debugMode': false,
    'cmgEnabled': true,
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
    'showCategoryIconInTooltip': true,
    'linkTooltipOpacity': 1.0,
    'circleHideAnimation': true,

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
        'width': 100,
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
        'width': 100,
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