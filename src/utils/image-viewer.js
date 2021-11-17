function openImageFullscreen(elementUnderCursor) {

    let transitionDuration = 300;
    let bgOpacity = 0.5;
    let scale = 1.0;
    let minScale = 0.1;
    let maxScale = 50.0;
    let screenHeightToTakeInitially = 0.75;
    let headerTopPadding = 30;
    let borderRadius = 2;
    let clickOutsideToExit = true;
    let reduceDimmerOpacityOnHover = false;
    let multiplierToReduceBgOpacityOnHover = 0.85;
    let regulateDimmerOpacityByScroll = false;
    let preventScrollOnPage = false;

    let rotationSteps = [0, 90, 180, 270, 360];
    let rotationStepsCounter = 0;

    const originalImage = elementUnderCursor;
    const imageRect = originalImage.getBoundingClientRect();

    ///Initial scale calculation
    const originalHeight = originalImage.clientHeight;
    const originalWidth = originalImage.clientWidth;
    const desiredHeight = window.innerHeight * screenHeightToTakeInitially;
    scale = desiredHeight / originalHeight;

    if (originalWidth * scale > window.innerWidth)
        scale = (window.innerWidth - 150) / originalWidth;

    /// Final dx/dy calculation
    let dxToShow = window.innerWidth / 2 - (originalWidth * scale / 2);
    let dyToShow = window.innerHeight / 2 - (originalHeight * scale / 2);

    /// Storing values as initial
    const initialScale = scale;
    const initialDx = dxToShow;
    const initialDy = dyToShow;

    /// Make original image transparent
    let originalImageStyle = originalImage.currentStyle || window.getComputedStyle(originalImage);
    let originalImageTransition = originalImageStyle.transition;
    originalImage.style.transition = 'none';
    originalImage.style.opacity = 0;

    /// Background dimmer
    let imgBackgroundDimmer = document.createElement('div');
    imgBackgroundDimmer.setAttribute('style', `${clickOutsideToExit ? 'cursor: pointer;' : ''}z-index: 99999; width:100%;height:100%;  opacity: 0.0; transition: opacity ${transitionDuration}ms ease-in-out; position:fixed; background: black !important; top: 0px; left: 0px;`);
    document.body.appendChild(imgBackgroundDimmer);

    /// Add dimmer listeners
    setTimeout(function () {
        imgBackgroundDimmer.style.opacity = bgOpacity;
        if (clickOutsideToExit)
            imgBackgroundDimmer.onmousedown = function () {
                closeFullscreenView();
            }

        if (reduceDimmerOpacityOnHover) {
            imgBackgroundDimmer.onmouseover = function () {
                if (imgBackgroundDimmer !== null && imgBackgroundDimmer !== undefined) {
                    if (imgBackgroundDimmer.style.transition == '')
                        imgBackgroundDimmer.style.transition = `opacity ${transitionDuration}ms ease-in-out`;
                    imgBackgroundDimmer.style.opacity = bgOpacity * multiplierToReduceBgOpacityOnHover;
                }
            }

            imgBackgroundDimmer.onmouseout = function () {
                if (imgBackgroundDimmer !== null && imgBackgroundDimmer !== undefined) {
                    if (imgBackgroundDimmer.style.transition == '')
                        imgBackgroundDimmer.style.transition = `opacity ${transitionDuration}ms ease-in-out`;
                    imgBackgroundDimmer.style.opacity = bgOpacity;
                }
            }
        }

        if (regulateDimmerOpacityByScroll) {
            imgBackgroundDimmer.onwheel = function (e) {
                if (imgBackgroundDimmer.style.transition !== '')
                    imgBackgroundDimmer.style.transition = '';
                let wheelDelta = e.wheelDelta ?? -e.deltaY;
                bgOpacity += wheelDelta / 2000;
                if (bgOpacity > 1) bgOpacity = 1;
                if (bgOpacity < 0.2) bgOpacity = 0.2;
                imgBackgroundDimmer.style.opacity = bgOpacity;
            }
        }

    }, 1);

    /// Hint
    let hintSpan = document.createElement('span');
    hintSpan.innerHTML = chrome.i18n.getMessage("scrollToResize") ? chrome.i18n.getMessage("scrollToResize") : 'Scroll to resize';
    hintSpan.innerHTML += '.<br/>';
    hintSpan.innerHTML += chrome.i18n.getMessage("rightClickToClose") ? chrome.i18n.getMessage("rightClickToClose") : 'Right click to close';

    hintSpan.setAttribute('style', `all:revert; transition: opacity ${transitionDuration}ms ease-in-out; top: ${headerTopPadding}px; color: rgba(256,256,256,0.85); text-align: center;position: fixed; left: 50%; font-size: 18px; line-height: 1.25;font-family: Arial, sans-serif !important;`);
    hintSpan.setAttribute('id', 'smooth-image-view-top-hint');
    imgBackgroundDimmer.appendChild(hintSpan);
    hintSpan.style.transform = `translate(-${hintSpan.clientWidth / 2}px, 0px)`;

    setTimeout(function () {
        hintSpan.style.opacity = 0.0;
    }, 3000);

    /// Buttons in top right corner
    let buttonSize = 24;
    let btnInnerPadding = 15;
    let topControlsContainer = document.createElement('div');
    topControlsContainer.setAttribute('style', `all:revert; position: fixed; z-index:100003; right: ${headerTopPadding}px; top: ${headerTopPadding - (buttonSize / 2)}px; transition: opacity ${transitionDuration}ms ease-in-out`);

    /// Add close button
    const closeButton = document.createElement('div');
    closeButton.setAttribute('title', chrome.i18n.getMessage("closeLabel") ? chrome.i18n.getMessage("closeLabel") : 'Close');
    // closeButton.setAttribute('style', `all:revert;cursor: pointer; padding: ${btnInnerPadding}px; text-align: center;width: ${buttonSize + btnInnerPadding}px; height: ${buttonSize + btnInnerPadding}px; border-radius: 50%; color: rgba(256,256,256,0.7);font-size: ${buttonSize}px;`);
    closeButton.setAttribute('class', 'cmg-link-preview-button');
    closeButton.style.width = `${buttonSize + btnInnerPadding}px`;
    closeButton.style.height = `${buttonSize + btnInnerPadding}px`;
    closeButton.style.fontSize = `${buttonSize}px`;

    const btnLabel = document.createElement('span');
    btnLabel.style.verticalAlign = 'middle';
    btnLabel.innerText = '✕';
    closeButton.appendChild(btnLabel);
    topControlsContainer.appendChild(closeButton);

    closeButton.addEventListener('mousedown', function () {
        closeFullscreenView();
    });

    /// Add rotate button
    const rotateButton = document.createElement('div');
    rotateButton.setAttribute('title', chrome.i18n.getMessage("rotateLabel") ? chrome.i18n.getMessage("rotateLabel") : 'Rotate');
    // rotateButton.setAttribute('style', `all:revert;cursor: pointer; padding: ${btnInnerPadding}px !important; text-align: center;width: ${buttonSize + btnInnerPadding}px; height: ${buttonSize + btnInnerPadding}px; border-radius: 50%; color: rgba(256,256,256,0.7);font-size: ${buttonSize}px; line-height: 1.2;`);
    rotateButton.setAttribute('class', 'cmg-link-preview-button');
    rotateButton.style.width = `${buttonSize + btnInnerPadding}px`;
    rotateButton.style.height = `${buttonSize + btnInnerPadding}px`;
    rotateButton.style.fontSize = `${buttonSize}px`;

    const rotationLabel = document.createElement('span');
    rotationLabel.setAttribute('style', 'vertical-align: middle');
    // rotationLabel.innerText = '⟳';
    rotationLabel.innerText = '⭮';
    rotateButton.appendChild(rotationLabel);
    topControlsContainer.appendChild(rotateButton);

    rotateButton.addEventListener('mousedown', function () {
        if (hintSpan.style.opacity !== 0)
            hintSpan.style.opacity = 0;

        rotationStepsCounter += 1;
        if (rotationWrapper.style.transition == '')
            rotationWrapper.style.transition = `transform ${transitionDuration}ms ease-in-out`;

        rotationWrapper.style.transform = `rotate(${rotationSteps[rotationStepsCounter]}deg)`;
        img.classList.remove('cmg-overlay-shadow');

        /// Correct image position to fit height
        // if (rotationStepsCounter == 1 || rotationStepsCounter == 3) {
        // scale = initialScale;
        // dxToShow = initialDx;
        // dyToShow = initialDy;

        // if ((originalWidth * scale) > window.innerHeight * screenHeightToTakeInitially) {

        //     // let centerX = window.innerWidth / 2;
        //     // let centerY = window.innerHeight / 2;
        //     let centerX = dxToShow + (originalWidth * scale / 2);
        //     let centerY = dyToShow + (originalHeight * scale / 2);

        //     let xs = (centerX - dxToShow) / scale,
        //         ys = (centerY + window.scrollY - dyToShow) / scale;

        //     let factorToApply = (window.innerHeight * screenHeightToTakeInitially) / (originalWidth * scale);
        //     scale *= factorToApply;

        //     dxToShow = centerX - xs * scale;
        //     dyToShow = centerY + window.scrollY - ys * scale;
        //     copyOfImage.style.transform = `translate(${dxToShow}px, ${dyToShow}px) scale(${scale})`;
        // }
        // } else {
        //     // scale = initialScale;
        //     // dxToShow = initialDx;
        //     // dyToShow = initialDy;
        //     // copyOfImage.style.transform = `translate(${dxToShow}px, ${dyToShow}px) scale(${scale})`;
        // }

        /// Revert index when rotation is 360
        if (rotationStepsCounter == rotationSteps.length - 1) {
            setTimeout(function () {
                rotationStepsCounter = 0;
                rotationWrapper.style.transition = '';
                rotationWrapper.style.transform = `rotate(0deg)`;
            }, transitionDuration)
        }
    });

    document.body.appendChild(topControlsContainer);

    /// Create image
    let idForImage = 'cmg-fullscreen-image';
    let img = document.createElement('img');
    // img.setAttribute('height', `${originalHeight}px`);
    img.setAttribute('src', originalImage.getAttribute('src'));
    img.setAttribute('style', `border-radius: ${borderRadius}px;`);
    img.style.maxHeight = `${originalHeight}px`;

    const rotationWrapper = document.createElement('div');
    rotationWrapper.style.transition = `transform ${transitionDuration}ms ease-in-out`;
    rotationWrapper.appendChild(img);

    const copyOfImage = document.createElement('div');
    copyOfImage.setAttribute('id', idForImage);
    copyOfImage.setAttribute('style', `transform-origin: 0% 0%; cursor: grab; position: fixed; transition: transform ${transitionDuration}ms ease-in-out, box-shadow ${transitionDuration}ms ease-in-out; left: 0px; top: 0px; transform: translate(${imageRect.left}px, ${imageRect.top}px); z-index: 100002;`)
    copyOfImage.style.maxHeight = `${originalHeight}px`;
    copyOfImage.appendChild(rotationWrapper);

    document.body.appendChild(copyOfImage);

    /// Show fullscreen image
    setTimeout(function () {
        fullscreenImageIsOpen = true;

        // let copyOfImage = document.getElementById(idForImage);
        copyOfImage.style.transform = `translate(${dxToShow}px, ${dyToShow}px) scale(${scale})`;
        img.classList.add('cmg-overlay-shadow');

        copyOfImage.addEventListener('mousedown', function (e) {
            evt = e || window.event;
            if ("buttons" in evt) {
                if (evt.button == 1 || evt.button == 2) {
                    /// Middle or right button to close view
                    closeFullscreenView();
                } else if (evt.button == 0) {
                    /// Left button
                    panMouseDownListener(e)
                }
                // else if (evt.button == 2) {
                //     /// Right button
                //     rotateMouseDownListener(e)
                // }
            }
        })

        copyOfImage.addEventListener('wheel', imageWheelListener, { passive: false });
        document.addEventListener('keydown', keyboardListener);
        if (preventScrollOnPage) {
            document.addEventListener('wheel', preventPageScroll, { passive: false });
            document.addEventListener('scroll', preventPageScroll, { passive: false });
        }

        /// Double click to scale up listener
        let scaleSteps = [1.0, 2.0, 4.0]
        let stepsCounter = 0;

        copyOfImage.addEventListener('dblclick', function (e) {
            evt = e || window.event;
            if ("buttons" in evt) {
                if (evt.button == 0) {

                    /// take the scale into account with the offset
                    var xs = (e.clientX - dxToShow) / scale,
                        // ys = (e.clientY + window.scrollY - dyToShow) / scale;
                        ys = (e.clientY - dyToShow) / scale;

                    let scaleValueWithinSteps = false;
                    scaleSteps.forEach(function (step) {
                        if (scale == initialScale * step) scaleValueWithinSteps = true;
                    })

                    if (scaleValueWithinSteps) {
                        if (stepsCounter == scaleSteps.length - 1) {
                            stepsCounter = 0;
                            scale = initialScale;
                            dxToShow = initialDx;
                            dyToShow = initialDy;
                        }
                        else {
                            stepsCounter += 1;
                            scale = initialScale * scaleSteps[stepsCounter];
                            /// reverse the offset amount with the new scale
                            dxToShow = e.clientX - xs * scale;
                            // dyToShow = e.clientY + window.scrollY - ys * scale;
                            dyToShow = e.clientY - ys * scale;
                        }
                    }
                    else {
                        /// Return image to initial scale
                        scale = initialScale;
                        dxToShow = initialDx;
                        dyToShow = initialDy;
                        stepsCounter = 0;

                        rotationStepsCounter = 0;
                        rotationWrapper.style.transform = 'rotate(0deg)';
                    }

                    if (copyOfImage.style.transition == '')
                        copyOfImage.style.transition = `transform ${transitionDuration}ms ease-in-out, scale ${transitionDuration}ms ease-in-out`;
                    copyOfImage.style.transform = `translate(${dxToShow}px, ${dyToShow}px) scale(${scale})`;
                }
            }
        })
    }, 1);

    function panMouseDownListener(e) {
        e.preventDefault();

        hintSpan.style.opacity = 0;
        copyOfImage.style.cursor = 'grabbing';

        document.body.style.cursor = 'move';
        copyOfImage.style.transition = '';

        function mouseMoveListener(e) {
            dxToShow = dxToShow + e.movementX;
            dyToShow = dyToShow + e.movementY;
            copyOfImage.style.transform = `translate(${dxToShow}px, ${dyToShow}px) scale(${scale})`;
        }

        document.addEventListener('mousemove', mouseMoveListener);
        document.addEventListener('mouseup', function () {
            document.body.style.cursor = 'unset';
            copyOfImage.style.cursor = 'grab';
            document.removeEventListener('mousemove', mouseMoveListener);
        });
    }

    function keyboardListener(e) {
        if (e.key === "Escape") { // escape key maps to keycode `27`
            e.preventDefault();
            closeFullscreenView();
        } else if (e.key == 'ArrowUp') {
            e.preventDefault();
            scaleWholeImageUp(1.0);

        } else if (e.key == 'ArrowDown') {
            e.preventDefault();
            scaleWholeImageUp(-1.0);
        }
    }

    function imageWheelListener(e) {
        e.preventDefault();

        if (hintSpan.style.opacity !== 0)
            hintSpan.style.opacity = 0;

        /// take the scale into account with the offset
        var xs = (e.clientX - dxToShow) / scale,
            // ys = (e.clientY + window.scrollY - dyToShow) / scale;
            ys = (e.clientY - dyToShow) / scale;

        let wheelDelta = e.wheelDelta ?? -e.deltaY;

        scale += wheelDelta / 200;

        if (scale < minScale) scale = minScale;
        if (scale > maxScale) scale = maxScale;

        /// reverse the offset amount with the new scale
        dxToShow = e.clientX - xs * scale;
        // dyToShow = e.clientY + window.scrollY - ys * scale;
        dyToShow = e.clientY - ys * scale;

        copyOfImage.style.transition = '';
        copyOfImage.style.transform = `translate(${dxToShow}px, ${dyToShow}px) scale(${scale})`;
    }

    function scaleWholeImageUp(amount) {
        if (hintSpan.style.opacity !== 0)
            hintSpan.style.opacity = 0;

        let centerX = window.innerWidth / 2;;
        let centerY = window.innerHeight / 2;

        /// take the scale into account with the offset
        var xs = (centerX - dxToShow) / scale,
            // ys = (centerY + window.scrollY - dyToShow) / scale;
            ys = (centerY - dyToShow) / scale;

        scale += amount;
        /// reverse the offset amount with the new scale
        dxToShow = centerX - xs * scale;
        // dyToShow = centerY + window.scrollY - ys * scale;
        dyToShow = centerY - ys * scale;

        copyOfImage.style.transition = '';
        copyOfImage.style.transform = `translate(${dxToShow}px, ${dyToShow}px) scale(${scale})`;
    }

    function preventPageScroll(e) {
        e.preventDefault();
    }

    function closeFullscreenView() {
        hideBgDimmer();
        hideFullscreenImg();
        copyOfImage.removeEventListener('wheel', imageWheelListener, { passive: false });
        document.removeEventListener('keydown', keyboardListener);
        if (preventScrollOnPage) {
            document.removeEventListener('wheel', preventPageScroll, { passive: false });
            document.removeEventListener('scroll', preventPageScroll, { passive: false });
        }
    }

    function hideFullscreenImg() {
        if (copyOfImage.style.transition == '')
            copyOfImage.style.transition = `transform ${transitionDuration}ms ease-in-out, scale ${transitionDuration}ms ease-in-out, box-shadow ${transitionDuration}ms`;

        if (rotationWrapper.style.transition == '')
            rotationWrapper.style.transition = `transform ${transitionDuration}ms ease-in-out`;

        const updatedImageRect = originalImage.getBoundingClientRect();
        const shouldUseScaleAnimation = updatedImageRect.top < 0 || updatedImageRect.top > window.innerHeight;

        if (shouldUseScaleAnimation) {
            copyOfImage.style.transition = `opacity ${transitionDuration}ms ease-in-out`;
            copyOfImage.style.opacity = 0.0;
        } else
            copyOfImage.style.transform = `translate(${updatedImageRect.left}px, ${updatedImageRect.top}px)`;

        rotationWrapper.style.transform = `rotate(0deg)`;
        img.classList.remove('cmg-overlay-shadow');
        setTimeout(function () {
            /// Make original image transparent
            originalImage.style.opacity = 1;
            originalImage.style.transition = originalImageTransition;
            // document.body.removeChild(copyOfImage);
            copyOfImage.remove();
            fullscreenImageIsOpen = false;
        }, transitionDuration);
    }

    function hideBgDimmer() {
        if (imgBackgroundDimmer !== null && imgBackgroundDimmer !== undefined) {
            if (imgBackgroundDimmer.style.transition == '')
                imgBackgroundDimmer.style.transition = `opacity ${transitionDuration}ms ease-in-out`;
            imgBackgroundDimmer.style.opacity = 0.0;
            topControlsContainer.style.opacity = 0.0;
            imgBackgroundDimmer.onmousedown = null;
            imgBackgroundDimmer.onmouseover = null;
            imgBackgroundDimmer.onmouseout = null;

            setTimeout(function () {
                // imgBackgroundDimmer.parentNode.removeChild(imgBackgroundDimmer);
                // topControlsContainer.parentNode.removeChild(topControlsContainer);
                imgBackgroundDimmer.remove();
                topControlsContainer.remove();
                imgBackgroundDimmer = null;
                topControlsContainer = null;
            }, transitionDuration);
        }

        // if (scaleSlider !== null && scaleSlider !== undefined)
        //     scaleSlider.parentNode.removeChild(scaleSlider);
    }


    /// Add scale slider
    // let scaleSlider = document.createElement('input');
    // scaleSlider.setAttribute('type', 'range');
    // scaleSlider.setAttribute('class', 'cmg-fullscreen-image-slider');
    // scaleSlider.setAttribute('style', `z-index: 100000000;width: 50%; height: 10px; transform: rotate(270deg); transform-origin: 100% 100%; position: fixed; top: ${headerTopPadding + buttonSize + btnInnerPadding + 15}px; right: ${headerTopPadding + buttonSize + ((btnInnerPadding / 2))}px; `);
    // document.body.appendChild(scaleSlider);
    // scaleSlider.setAttribute('min', minScale);
    // scaleSlider.setAttribute('max', maxScale / 2);
    // scaleSlider.setAttribute('step', 0.5);
    // scaleSlider.setAttribute('value', scale);

    // scaleSlider.addEventListener('input', function (e) {
    // scaleWholeImageUp(scaleSlider.value);
    // })


    /// Listener for rotating image on mouse move
    // let rotation = 0;

    // function rotateMouseDownListener(e) {
    //     e.preventDefault();

    //     hintSpan.style.opacity = 0;
    //     copyOfImage.style.cursor = 'grabbing';

    //     // document.body.style.cursor = 'move';
    //     rotationWrapper.style.transition = '';


    //     let centerX = window.innerWidth / 2;;
    //     let centerY = window.innerHeight / 2;
    //     let mouse_x = evt.pageX;
    //     let mouse_y = evt.pageY;
    //     let radians = Math.atan2(mouse_x - centerX, mouse_y - centerY);
    //     let degree = (radians * (180 / Math.PI) * -1) + 90;

    //     let degreesChanged = degree;

    //     function mouseMoveListener(evt) {
    //         let centerX = window.innerWidth / 2;;
    //         let centerY = window.innerHeight / 2;
    //         let mouse_x = evt.pageX;
    //         let mouse_y = evt.pageY;
    //         let radians = Math.atan2(mouse_x - centerX, mouse_y - centerY);
    //         let degree = (radians * (180 / Math.PI) * -1) + 90;
    //         let delta = degree - degreesChanged;
    //         rotation += delta;

    //         rotationWrapper.style.transform = `rotate(${rotation}deg)`;
    //     }

    //     document.addEventListener('mousemove', mouseMoveListener);
    //     document.addEventListener('mouseup', function () {
    //         // document.body.style.cursor = 'unset';
    //         copyOfImage.style.cursor = 'grab';
    //         rotationWrapper.style.transition = `transform ${transitionDuration}ms ease-in-out`;
    //         document.removeEventListener('mousemove', mouseMoveListener);
    //     });
    // }

}