let leftPadding = 400;
let rightPadding = 400;
let handleSize = 15;
let handleOpacity = 0.5;
let handleOpacityHovered = 0.75;
let handleOpacityFocused = 1.0;
let transitionDuration = 300;
// let handlesColor = '#3B3E43';
let handlesColor = 'grey';
let initialHandlesPercent = 90;
let repositionHandlesVerticallyOnDrag = true;
let handlePadding = 0;
let handleShape = 'arrow'; /// Possible values: circle, arrow
let correctScrollPosition = true;
let emptyAreaClickBehavior = 'singleclick'; /// possible values: 'singleclick', 'doubleclick'
let highlightEmptyAreaOnHover = true;

let handlesTopPadding = window.innerHeight * (initialHandlesPercent / 100);
let maxPadding = window.innerWidth * 0.35;
let initialPageStyle;
let bodyChildrenMargins = {};

let rightHandle;
let leftHandle;
let rightOverlayContainer;
let leftOverlayContainer;

function trimPage() {

    /// Return if already applied
    if (document.querySelector('.ttl-drag-handle') !== null) { untrim(); return; }

    let handleStyle = `all: revert; opacity: 0; z-index: 9998; transition: opacity ${transitionDuration}ms ease-out; cursor: grab;`;
    let circleHandleStyle = `background: ${handlesColor};border-radius: 50%; height: ${handleSize}px; width: ${handleSize}px;`;
    let rectangleLeftHandleStyle = `width: 0px; height: 0px; border-top: ${handleSize}px solid transparent; border-bottom: ${handleSize}px solid transparent; border-left: ${handleSize}px solid ${handlesColor};`;
    let rectangleRightHandleStyle = `width: 0px; height: 0px; border-top: ${handleSize}px solid transparent; border-bottom: ${handleSize}px solid transparent; border-right: ${handleSize}px solid ${handlesColor};`;

    /// Grab min-width param from body to restrict range
    let bodyStyle = document.body.currentStyle || window.getComputedStyle(document.body);
    if (bodyStyle.minWidth !== null && bodyStyle.minWidth !== '0px') {
        maxPadding = (window.innerWidth - bodyStyle.minWidth.replaceAll('px', '')) / 2;
    }

    /// Adding overlay containers on sides
    let overlayStyle = `all: revert; cursor: pointer; transition: opacity 150ms ease-out; background: grey; opacity: 0.0; position: fixed; z-index: -1; top: 0px; height: ${window.innerHeight}px;`;

    rightOverlayContainer = document.createElement('div');
    rightOverlayContainer.setAttribute('style', overlayStyle + ` width: ${rightPadding - handleSize - handleSize}px; right:0px`);
    rightOverlayContainer.setAttribute('class', 'ttl-padding-overlay');
    document.body.appendChild(rightOverlayContainer);

    leftOverlayContainer = document.createElement('div');
    leftOverlayContainer.setAttribute('style', overlayStyle + `width: ${leftPadding - handleSize - handleSize}px; left:0px`);
    leftOverlayContainer.setAttribute('class', 'ttl-padding-overlay');
    document.body.appendChild(leftOverlayContainer);

    document.body.querySelectorAll('.ttl-padding-overlay').forEach(function (overlay) {
        if (emptyAreaClickBehavior == 'singleclick')
            overlay.onclick = untrim;
        else
            overlay.ondblclick = untrim;

        if (highlightEmptyAreaOnHover) {
            overlay.onmouseover = function () {
                overlay.style.opacity = 0.15;
            }

            overlay.onmouseout = function () {
                overlay.style.opacity = 0;
            }
        }
    })

    /// Adding handles
    leftHandle = document.createElement('div');
    leftHandle.setAttribute('class', 'ttl-drag-handle');
    let leftHandleStyle = handleStyle + `position: fixed; top: 0px; left: 0px;transform: translate(${leftPadding - handleSize}px, ${handlesTopPadding}px);`
    leftHandle.setAttribute('style', leftHandleStyle + (handleShape == 'circle' ? circleHandleStyle : rectangleLeftHandleStyle));
    document.body.appendChild(leftHandle);

    leftHandle.onmouseover = () => leftHandle.style.opacity = handleOpacityHovered;
    leftHandle.onmouseout = () => leftHandle.style.opacity = handleOpacity;
    leftHandle.onmousedown = function (e) {
        e.preventDefault();

        // leftHandle.style.cursor = 'unset';
        leftHandle.style.opacity = handleOpacityFocused;
        leftHandle.onmouseover = null;
        leftHandle.onmouseout = null;
        document.body.style.transition = '';

        function mouseMoveListener(e) {
            e.preventDefault();

            leftPadding += e.movementX;
            if (leftPadding > maxPadding)
                leftPadding = maxPadding;

            leftHandle.style.transform = `translate(${leftPadding - handleSize}px, ${repositionHandlesVerticallyOnDrag ? e.clientY : handlesTopPadding}px)`
            document.body.style.marginLeft = `${leftPadding}px`;
            leftOverlayContainer.style.width = `${leftPadding - handleSize - handleSize}px`;

            if (!e.ctrlKey) {
                rightPadding += e.movementX;
                if (rightPadding > maxPadding)
                    rightPadding = maxPadding;
                // rightPadding = leftPadding;
                document.body.style.marginRight = `${rightPadding}px`;
                rightOverlayContainer.style.width = `${rightPadding - handleSize - handleSize}px`;
            }
            rightHandle.style.transform = `translate(-${rightPadding - handleSize}px, ${repositionHandlesVerticallyOnDrag ? e.clientY : handlesTopPadding}px)`
        }

        document.addEventListener('mousemove', mouseMoveListener)

        document.addEventListener('mouseup', function (e) {
            e.preventDefault();
            // leftHandle.style.cursor = 'ew-resize';
            leftHandle.style.opacity = handleOpacity;
            leftHandle.onmouseover = () => leftHandle.style.opacity = handleOpacityHovered;
            leftHandle.onmouseout = () => leftHandle.style.opacity = handleOpacity;
            document.removeEventListener('mousemove', mouseMoveListener)
        })
    }

    rightHandle = document.createElement('div');
    rightHandle.setAttribute('class', 'ttl-drag-handle');
    let rightHandleStyle = handleStyle + `position: fixed; top: 0px; right: 0px; transform: translate(-${rightPadding - handleSize}px, ${handlesTopPadding}px);`
    rightHandle.setAttribute('style', rightHandleStyle + (handleShape == 'circle' ? circleHandleStyle : rectangleRightHandleStyle));
    document.body.appendChild(rightHandle);

    rightHandle.onmouseover = () => rightHandle.style.opacity = handleOpacityHovered;
    rightHandle.onmouseout = () => rightHandle.style.opacity = handleOpacity;
    rightHandle.onmousedown = function (e) {
        e.preventDefault();

        // rightHandle.style.cursor = 'unset';
        rightHandle.style.opacity = handleOpacityFocused;
        rightHandle.onmouseover = null;
        rightHandle.onmouseout = null;
        document.body.style.transition = '';

        function mouseMoveListener(e) {
            e.preventDefault();

            rightPadding -= e.movementX;
            if (rightPadding > maxPadding)
                rightPadding = maxPadding;

            rightHandle.style.transform = `translate(-${rightPadding - handleSize}px, ${repositionHandlesVerticallyOnDrag ? e.clientY : handlesTopPadding}px)`
            document.body.style.marginRight = `${rightPadding}px`;
            rightOverlayContainer.style.width = `${rightPadding - handleSize - handleSize}px`;

            if (!e.ctrlKey) {
                leftPadding -= e.movementX;
                if (leftPadding > maxPadding)
                    leftPadding = maxPadding;
                document.body.style.marginLeft = `${leftPadding}px`;
                leftOverlayContainer.style.width = `${rightPadding - handleSize - handleSize}px`;
            }
            leftHandle.style.transform = `translate(${leftPadding - handleSize}px, ${repositionHandlesVerticallyOnDrag ? e.clientY : handlesTopPadding}px)`
        }

        document.addEventListener('mousemove', mouseMoveListener)

        document.addEventListener('mouseup', function (e) {
            e.preventDefault();
            // rightHandle.style.cursor = 'ew-resize';
            rightHandle.style.opacity = handleOpacity;
            rightHandle.onmouseover = () => rightHandle.style.opacity = handleOpacityHovered;
            rightHandle.onmouseout = () => rightHandle.style.opacity = handleOpacity;
            document.removeEventListener('mousemove', mouseMoveListener)
        })
    }


    function trim() {
        let scrollHeightBeforeTrim = document.body.scrollHeight;

        /// Trimming page
        initialPageStyle = document.body.getAttribute('style');
        let styleToApply = `margin-left: ${leftPadding}px !important; margin-right: ${rightPadding}px !important;`;
        styleToApply += `transition: margin-left ${transitionDuration}ms ease-out, margin-right ${transitionDuration}ms ease-out`
        document.body.setAttribute('style', document.body.getAttribute('style') + styleToApply);

        /// Reverting left/right margins for body direct children
        let bodyChildren = document.body.children;
        for (let i = 0; i < bodyChildren.length; i++) {
            let child = bodyChildren[i];

            var style = child.currentStyle || window.getComputedStyle(child);

            /// TODO: Add handling for 'width'
            let marginLeft = style.marginLeft;
            let marginRight = style.marginRight;

            let elementId = child.getAttribute('id');
            if (elementId == null) {
                elementId = `ttl-addedElementId-${i}`;
                child.setAttribute('id', elementId);
                bodyChildrenMargins[elementId] = {};
                bodyChildrenMargins[elementId]['hasModifiedId'] = true;
            }

            if (child.style && marginLeft !== null && marginLeft !== undefined && marginLeft !== '0px') {
                if (bodyChildrenMargins[elementId] == undefined) bodyChildrenMargins[elementId] = {};
                bodyChildrenMargins[elementId]['marginLeft'] = marginLeft;
                child.style.marginLeft = '0px';
            }

            if (child.style && marginRight !== null && marginRight !== undefined && marginRight !== '0px') {
                if (bodyChildrenMargins[elementId] == undefined) bodyChildrenMargins[elementId] = {};
                bodyChildrenMargins[elementId]['marginRight'] = marginRight;
                child.style.marginRight = '0px';
            }

            /// Trim body elements that have % width between 90 and 100
            try {
                let elementWidth = style.width;

                if (child.style && elementWidth !== null && elementWidth !== undefined && elementWidth.includes('px')) {
                    let widthPercent = elementWidth.replaceAll('px', '') / window.innerWidth * 100;
                    if (widthPercent > 90 && widthPercent < 100) {
                        if (bodyChildrenMargins[elementId] == undefined) bodyChildrenMargins[elementId] = {};
                        // bodyChildrenMargins[elementId]['elementWidth'] = elementWidth;
                        bodyChildrenMargins[elementId]['elementWidth'] = child.style.width;
                        child.style.width = '100%';
                        bodyChildrenMargins[elementId]['boxSizing'] = style.boxSizing;
                        child.style.boxSizing = 'border-box';
                    }
                }
            } catch (e) { }
        }

        /// Correct scroll position
        if (correctScrollPosition)
            setTimeout(function () {
                if (document.body.scrollHeight !== scrollHeightBeforeTrim) {
                    window.scrollTo({ top: window.scrollY * (document.body.scrollHeight / scrollHeightBeforeTrim) })
                }

                rightHandle.style.opacity = handleOpacity;
                leftHandle.style.opacity = handleOpacity;
            }, transitionDuration)
    }

    function untrim() {
        let scrollHeightBeforeUntrim = document.body.scrollHeight;

        document.body.setAttribute('style', initialPageStyle + `transition: margin-left ${transitionDuration}ms ease-out, margin-right ${transitionDuration}ms ease-out`);

        document.body.style.marginLeft = `0px`;
        document.body.style.marginRight = `0px`;

        rightHandle.parentNode.removeChild(rightHandle);
        leftHandle.parentNode.removeChild(leftHandle);
        rightOverlayContainer.parentNode.removeChild(rightOverlayContainer);
        leftOverlayContainer.parentNode.removeChild(leftOverlayContainer);

        rightHandle = null;
        leftHandle = null;
        rightOverlayContainer = null;
        leftOverlayContainer = null;

        /// Set back body children margins
        setTimeout(function () {
            if (bodyChildrenMargins !== {}) {
                let bodyChildren = document.body.children;
                for (let i = 0; i < bodyChildren.length; i++) {

                    let child = bodyChildren[i];
                    let elementId = child.getAttribute('id');

                    child.style.width = null;
                    child.style.boxSizing = null;

                    if (bodyChildrenMargins[elementId] !== null && bodyChildrenMargins[elementId] !== undefined && bodyChildrenMargins[elementId] !== {}) {
                        let objectMargins = bodyChildrenMargins[elementId];

                        if (objectMargins.marginLeft) {
                            child.style.marginLeft = objectMargins.marginLeft;
                        }

                        if (objectMargins.marginRight) {
                            child.style.marginRight = objectMargins.marginRight;
                        }

                        if (objectMargins.elementWidth) {
                            child.style.width = objectMargins.elementWidth;
                        }

                        if (objectMargins.boxSizing) {
                            child.style.boxSizing = objectMargins.boxSizing;
                        }

                        if (objectMargins.hasModifiedId) {
                            child.removeAttribute('id');
                        }
                    }
                }
            }
        }, transitionDuration / 1.5)

        /// Set back body style
        setTimeout(function () {
            /// Correct scroll position
            if (correctScrollPosition)
                if (document.body.scrollHeight !== scrollHeightBeforeUntrim) {
                    window.scrollTo({ top: window.scrollY * (document.body.scrollHeight / scrollHeightBeforeUntrim) })
                }

            document.body.setAttribute('style', initialPageStyle);

            bodyChildrenMargins = {};

        }, transitionDuration)
    }

    trim();



}

