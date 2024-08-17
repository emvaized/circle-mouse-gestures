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