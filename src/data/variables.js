/// Currently non-configurable variables
var checkAvailabilityForButtons = true;
var showRockerActionInCenter = false;
var rockerCircleOpacity = 0.75;
var scaleDownRockerIconWhenNonHovered = false;
var useRectangularShape = false;

/// Service variables
var canvasRadius = configs.circleRadius * 4;
var firstCircleRadius = configs.circleRadius;
var firstCircleInnerRadius = configs.innerCircleRadius;
var secondCircleRadius = configs.circleRadius * 1.5;
var secondCircleInnerRadius = configs.circleRadius + configs.gapBetweenCircles;

var ctx;
var leftCoord = 0.0, topCoord = 0.0;
var realLeftCoord = 0.0, realTopCoord = 0.0;
var selectedButtonSecondLevel;
var typeOfMenu = 'regularMenu';
var hoveredLink;
var hoveredLinkTitle;
var textSelection;
var circle;
var circleIsShown = false;
var rocketButtonPressed;
var leftClickIsHolded = false;
var rightClickIsHolded = false;
var linkTooltip;
var rockerCircle;
var backgroundDimmer;
var elementUnderCursor;
var currentClipboardContent;
var fullscreenImageIsOpen = false;
var cornerMousePointer;
var ghostMousePointerRadius = 5;
var circleShownInCorner = false;
var showMousePointer = false;
const cornerSidePadding = 30;
var blurCircle;

var selectedButtons = {}; /// index of level: index of button
var preselectedButtons = {};

var buttonsAvailability = {};
var buttonsStatuses = {};

var previousScrollPosition = {};
var scrollingElementUnderCursor;

/// Timer used in order to redraw circle when background script requests are finished.
/// For example, to update tab-related segments availability - or state for fullscreen or pin tab segments
var timerToRedrawCircleOnAsyncUpdate;
var timerToRedrawCircleOnAsyncUpdateDelay = 1; /// 1ms is usually enough for background checks to finish and return value

/// Default configs
var defaultConfigs = {
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
    'showFullLinkInTooltip': false,
    'showCategoryIconInTooltip': true,
    'showLinkTextInTooltip': true,
    'showLinkTooltipForPageItself': false,
    'linkTooltipOpacity': 1.0,
    'circleHideAnimation': true,
    'addCircleShadow': false,
    'highlightElementOnHover': false,
    'showTitleOnHoverWhenHidden': true,
    'horizontalWheelActionsEnabled': false,
    'continiousVerticalScrollDetection': true,
    'continiousHorizontalScrollDetection': false,
    'applySettingsImmediately': false,
    'delayToShowTitleOnHoverWhenHidden': 600, // ms
    'circleShadowOpacity': 0.3,
    'circleLocation': 'cursorOverflow', /// possible values: 'alwaysCursor', 'alwaysCorner', cursorCorner', 'cursorOverflow'
    'longLeftClickThreshold': 21,
    'addBlur': false,
    'blurRadius': 4,
    'excludedDomains': '',
    'showCircleAnimation': 'scale', /// possible values: 'noAnimation', 'fade', 'scale'
    'hideCircleAnimation': 'scale', /// possible values: 'noAnimation', 'fade', 'scale'

    /// Menus
    'regularMenu': {
        'color': "#4c4c4c",
        'rockerLeftClick': 'reloadTab',
        'rockerMiddleClick': 'noAction',
        'mouseWheelUpAction': 'pageZoomIn',
        'mouseWheelDownAction': 'pageZoomOut',
        'mouseWheelLeftAction': 'noAction',
        'mouseWheelRightAction': 'noAction',
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
                    { 'id': 'translate' },
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