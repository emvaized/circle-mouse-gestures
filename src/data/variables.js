/// Configs
var configs = {
    'debugMode': true,
    'animationDuration': 200,
    'hideCircleIfNoActionSelected': false,
    'useMouseWheelGestures': true,
    'addSecondLevel': true,

    'circleOpacity': 1.0,
    'circleRadius': 115,
    'innerCircleRadius': 30,
    'gapBetweenCircles': 8,
    'addCircleOutlines': true,
    'circleOutlinesColor': 'rgba(256,256,256,0.6)',
    'labelOpacity': 0.75,
    'iconOpacity': 1.0,

    'addLinkTooltip': false,
    'showFullLinkInTooltip': true,
    'showLinkTextInTooltip': true,
    'showLinkTooltipForPageItself': true,
    'linkTooltipOpacity': 1.0,
};

/// Currently non-configurable variables
var checkAvailabilityForButtons = true;
var showRockerActionInCenter = false;
var scaleDownRockerIconWhenNonHovered = false;
var useRectangularShape = false;
var addShadows = false;


/// Colors

/// Regular menu colors
var regularSegmentColor = "#4c4c4c";
var hoveredRegularSegmentColor = "#8b8b8b";
/// Link menu colors
var linkSegmentColor = "#3777CD";
var hoveredLinkSegmentColor = "#93d4ff";
/// Image menu colors
var imageSegmentColor = "#c69a15";
var hoveredImageSegmentColor = "#e6b319";

var regularRockerAction = 'reloadTab';
var linkRockerAction = 'openInFgTab';
var imageRockerAction = 'openInFgTab';

var mouseWheelUpAction = 'scrollToTop';
var mouseWheelDownAction = 'scrollToBottom';

var regularMenuAllButtons = [
    {
        'width': 90,
        'buttons': [
            'goForward',
            'newTab',
            'goBack',
            'closeCurrentTab',
        ]
    },
    {
        'width': 56,
        'buttons': [
            'switchToNextTab',
            'reloadTab',
            'scrollToBottom',
            'restoreClosedTab',
            'switchToPreviousTab',
            'translatePage',
            'scrollToTop',
            'copyUrl',
        ]
    },
    // {
    //     'width': 56,
    //     'color': 'blue',
    //     'hoveredColor': 'lightBlue',
    //     'buttons': [
    //         'goForward',
    //         'newTab',
    //         'goBack',
    //         'closeCurrentTab',
    //     ]
    // },
];

var regularMenuButtons = [
    'goForward',
    'newTab',
    'goBack',
    'closeCurrentTab',
];

var regularMenuButtonsLevelTwo = [
    'switchToNextTab',
    'reloadTab',
    'scrollToBottom',
    'restoreClosedTab',
    'switchToPreviousTab',
    'translatePage',
    'scrollToTop',
    'copyUrl',
    // 'pageZoomIn',
    // 'pageZoomOut',
    // 'toggleFullscreen',
];

var linkMenuButtons = [
    'openInFgTab',
    'copyLinkText',
    'openInBgTab',
    'copyUrl',
];


var imageMenuButtons = [
    'openInFgTab',
    'downloadUrlAs',
    'openInBgTab',
    'searchImageOnGoogle',
    'copyUrl',
];


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
var typeOfMenu = 'regular-menu';
var hoveredLink;
var hoveredLinkTitle;
var circle;
var circleIsShown = false;
var rocketButtonPressed;
var leftClickIsHolded = false;
var linkTooltip;
var rockerCircle;

/// Index of level: index of button
var selectedButtons = {};



