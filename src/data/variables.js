

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


var regularMenuButtons = [
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
    {
        'width': 57,
        'buttons': [
            { 'id': 'goForward' },
            { 'id': 'newTab' },
            { 'id': 'newTab' },
            { 'id': 'goBack' },
            { 'id': 'closeCurrentTab' },
        ]
    },
];


var linkMenuButtons = [
    { 'id': 'openInFgTab' },
    { 'id': 'copyLinkText' },
    { 'id': 'openInBgTab' },
    { 'id': 'copyUrl' },
];


var imageMenuButtons = [
    { 'id': 'openInFgTab' },
    { 'id': 'downloadUrlAs' },
    { 'id': 'openInBgTab' },
    { 'id': 'searchImageOnGoogle' },
    { 'id': 'copyUrl' },
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



