/// Currently non-configurable variables
var checkAvailabilityForButtons = true;
var showRockerActionInCenter = false;
var scaleDownRockerIconWhenNonHovered = false;
var useRectangularShape = false;
var addShadows = false;

/// Menu colors

var mouseWheelUpAction = 'scrollToTop';
var mouseWheelDownAction = 'scrollToBottom';


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

/// Index of level: index of button
var selectedButtons = {};



