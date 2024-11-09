/// Currently non-configurable variables
let checkAvailabilityForButtons = true;
let showRockerActionInCenter = false;
let rockerCircleOpacity = 0.75;
let scaleDownRockerIconWhenNonHovered = false;
let useRectangularShape = false;

/// Service variables
let canvasRadius = configs.circleRadius * 4;
let firstCircleRadius = configs.circleRadius;
let firstCircleInnerRadius = configs.innerCircleRadius;
let secondCircleRadius = configs.circleRadius * 1.5;
let secondCircleInnerRadius = configs.circleRadius + configs.gapBetweenCircles;

let ctx;
let leftCoord = 0.0, topCoord = 0.0;
let realLeftCoord = 0.0, realTopCoord = 0.0;
let selectedButtonSecondLevel;
let typeOfMenu = 'regularMenu';
let hoveredLink;
let hoveredLinkTitle;
let hoveredImageLink;
let textSelection;
let circle;
let circleIsShown = false;
let rocketButtonPressed;
let leftClickIsHolded = false;
let rightClickIsHolded = false;
let linkTooltip;
let rockerCircle;
let backgroundDimmer;
let elementUnderCursor;
let currentClipboardContent;
let fullscreenImageIsOpen = false;
let cornerMousePointer;
let ghostMousePointerRadius = 5;
let circleShownInCorner = false;
let showMousePointer = false;
const cornerSidePadding = 30;
let blurCircle;

let selectedButtons = {}; /// index of level: index of button
let preselectedButtons = {};

let buttonsAvailability = {};
let buttonsStatuses = {};

let previousScrollPosition = {};
let scrollingElementUnderCursor;

/// Timer used in order to redraw circle when background script requests are finished.
/// For example, to update tab-related segments availability - or state for fullscreen or pin tab segments
let timerToRedrawCircleOnAsyncUpdate;
let timerToRedrawCircleOnAsyncUpdateDelay = 1; /// 1ms is usually enough for background checks to finish and return value