/// Configs
var debugMode = true;
var circleOpacity = 1.0;
var linkTooltipOpacity = 1.0;
var circleRadius = 115;
var innerCircleRadius = 30;
var animationDuration = 200;
var showFullLinkInTooltip = true;
var showLinkTooltipForPageItself = true;
var showRockerActionInCenter = false;
var scaleDownRockerIconWhenNonHovered = false;
var useMouseWheelGestures = true;
var addShadows = false;

var addSecondLevel = true;
var canvasRadius = circleRadius * 4;
var firstCircleRadius = circleRadius;
var firstCircleInnerRadius = innerCircleRadius;
var gapBetweenCircles = 8;
var secondCircleRadius = circleRadius * 1.5;
var secondCircleInnerRadius = circleRadius + gapBetweenCircles;
var labelOpacity = 0.75;
var iconOpacity = 1.0;

var addLinkTooltip = false;

var addCircleOutlines = true;
var circleOutlinesColor = 'white';

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
    // 'scrollPageDown',
    'restoreClosedTab',
    'switchToPreviousTab',
    'translatePage',
    'scrollToTop',
    // 'scrollPageUp',
    'copyUrl',
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
var ctx;
var leftCoord = 0.0;
var topCoord = 0.0;
var selectedButton;
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