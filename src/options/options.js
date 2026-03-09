///
/// This options page code is quite messy, ideally it should be rewritten

var delayToAddListeners = 1;
var bodyMarginLeft = 0.0;

const isFirefox = navigator.userAgent.indexOf("Firefox") > -1;
let selectedMenuType = 'regularMenu';
let importedConfigs;
let exportFileName = 'cmg-settings.json';

function optionsInit() {
    document.title = chrome.i18n.getMessage('settings') + ' — CMG';

    let inputsWithTooltip = document.querySelectorAll('.tooltip');
    inputsWithTooltip.forEach(function (el) {
        let tooltipHint = document.createElement('div');
        tooltipHint.className = 'tooltipHint';
        tooltipHint.innerText = '?';
        el.prepend(tooltipHint);
    })

    try {
        loadUserConfigs(function (conf) {
            setMenuTypeDropdown();
            drawCirclePreview(selectedMenuType);
            generateButtonsControls();
            generateAppearanceControls();
            generateBehaviorConfigs();
            generateGesturesConfigs();
            positionSettingsInCenter();
            setTimeout(function () {
                drawCirclePreview(selectedMenuType);
            }, 0)
            preselectedButtons = {};

            document.getElementById('navbar-settings-label').innerHTML = ' ' + chrome.i18n.getMessage('settings').toLowerCase();
            document.getElementById('circleShadowOpacity').parentNode.setAttribute('title', chrome.i18n.getMessage('opacity'));
            document.getElementById('blurRadius').parentNode.setAttribute('title', chrome.i18n.getMessage('blurRadiusHint'));
            document.getElementById('delayToShowTitleOnHoverWhenHidden').parentNode.setAttribute('title', chrome.i18n.getMessage('delay') + ' (ms)');
            document.getElementById('backgroundDimmerOpacity').parentNode.setAttribute('title', chrome.i18n.getMessage('opacity'));
            // document.getElementById('updateToApplyLabel').innerHTML = chrome.i18n.getMessage('updateToApply');
            document.getElementById('manageSettingsLabel').innerHTML = chrome.i18n.getMessage('manageSettingsLabel');
            document.getElementById('importSettingsButton').innerHTML = chrome.i18n.getMessage('importSettings');
            document.getElementById('exportSettings').innerHTML = chrome.i18n.getMessage('exportSettings');
            document.getElementById('resetSettings').innerHTML = chrome.i18n.getMessage('resetSettings');

            /// Transition centering + recalculate on window resize
            // setTimeout(function () {
            //     let contentEl = document.getElementById('content');
            //     contentEl.classList.add('content-transition');

            //     window.addEventListener('resize', function () {
            //         contentEl.classList.remove('content-transition');
            //         positionSettingsInCenter();
            //         contentEl.classList.add('content-transition');
            //     })
            // }, delayToAddListeners);

            /// Circle preview
            document.getElementById('circle-preview-title').innerHTML = chrome.i18n.getMessage('circlePreview');
            document.getElementById('circle-preview').onmousedown = function (e) {
                selectedButtons = {};
                preselectedButtons = {};

                drawCircle(e, selectedMenuType, true, false, true);
                const buttonsContainer = generateButtonsControls();
                buttonsContainer.scrollIntoView({block: "nearest", inline: "nearest", behavior: "smooth"});
            }
        })
    } catch (e) { if (configs.debugMode) console.log(e); }

    setImportExportButtons()
}

/// Dropdown on top of screen to switch menu type
function setMenuTypeDropdown() {
    let options = [
        'regularMenu',
        'linkMenu',
        'imageMenu',
        'imageLinkMenu',
        'textFieldMenu',
        'selectionMenu',
        'playerMenu',
    ];

    let navBar = document.getElementById('navbar');
    let menuTypeDropdownContainer = document.createElement('div');

    let menuTypeDropdown = document.createElement('select');
    let menuTypeDropdownId = 'typeOfMenuDropdown';
    menuTypeDropdown.setAttribute('id', menuTypeDropdownId);
    menuTypeDropdownContainer.appendChild(menuTypeDropdown);

    /// Add arrow dropdown indicator
    // let isFirefox = navigator.userAgent.indexOf("Firefox") > -1;
    // if (isFirefox == false) {
    //     let arrowIndicator = document.createElement('div');
    //     arrowIndicator.innerHTML = '>';
    //     arrowIndicator.setAttribute('id', 'typeOfMenuDropdownArrow');
    //     menuTypeDropdownContainer.appendChild(arrowIndicator);
    // }

    options.forEach(function (val) {
        let option = document.createElement('option');
        option.innerHTML = chrome.i18n.getMessage(val) ?? val;
        option.setAttribute('value', val);
        if (selectedMenuType == val) option.setAttribute('selected', true);

        menuTypeDropdown.appendChild(option);
    })

    setTimeout(function () {
        let listenedDropdown = document.getElementById(menuTypeDropdownId);
        listenedDropdown.addEventListener("change", function (e) {
            let newValue = listenedDropdown.value;
            selectedMenuType = newValue;
            preselectedButtons = {};
            selectedButtons = {};

            drawCirclePreview(selectedMenuType);
            generateButtonsControls();
            generateAppearanceControls();
            generateGesturesConfigs();
            positionSettingsInCenter();

            setTimeout(function () {
                drawCirclePreview(selectedMenuType);
            }, 100)

        });
    }, delayToAddListeners);

    // navBar.appendChild(menuTypeDropdown);
    navBar.appendChild(menuTypeDropdownContainer);
}

/// Circle preview
function drawCirclePreview(typeOfMenu = selectedMenuType) {
    try {
        updateDisabledOptions();

        totalCircleRadius = 0.0;

        if (configs.interactiveMenusBehavior == 'combine' || typeOfMenu == selectedMenuType) {
            for (var i = 0; i < configs[selectedMenuType].levels.length; i++) {
                if (configs[selectedMenuType].levels[i].enabled !== false)
                    totalCircleRadius += configs.gapBetweenCircles + (configs[selectedMenuType].levels[i].width ?? configs.circleRadius);
            }
            canvasRadius = totalCircleRadius * 2 + 2;
        }
        else {
            totalCircleRadius = configs.gapBetweenCircles + configs.circleRadius;
            canvasRadius = totalCircleRadius * 2;
        }

        if (typeOfMenu !== selectedMenuType && configs.interactiveMenusBehavior == 'combine') {
            canvasRadius += (configs.interactiveCircleRadius + configs.gapBeforeInteractiveCircle) * 2;
        }

        let circle = document.getElementById('circle-preview');
        // canvasRadius = (configs.addSecondLevel && typeOfMenu == selectedMenuType ? secondCircleRadius * 2 : firstCircleRadius * 2) + (configs.addCircleOutlines ? 2 : 0);
        circle.setAttribute('width', `${canvasRadius}px !imporant`);
        circle.setAttribute('height', `${canvasRadius}px !imporant`);
        circle.parentNode.setAttribute('style', `float:left;`);
        circle.style.opacity = configs.circleOpacity;
        ctx = circle.getContext('2d');

        // leftCoord = circle.getBoundingClientRect().left;
        // topCoord = circle.getBoundingClientRect().top;

        /// Add small delay to cover body's margin left transition
        setTimeout(function () {
            leftCoord = circle.getBoundingClientRect().left;
            topCoord = circle.offsetTop;
        }, 10);
        // }, 250);

        drawCircle(false, selectedMenuType, true, false, true);
        // positionSettingsInCenter();
    } catch (e) {
        if (configs.debugMode) console.log(e);
    }
}

/// Appearance configs
function generateAppearanceControls() {
    /// Translate title
    document.getElementById('appearanceTitle').innerHTML = chrome.i18n.getMessage('appearanceHeader');
    document.getElementById('generalSettingsTitle').innerHTML = chrome.i18n.getMessage('generalSettings');
    // document.getElementById('addTextLabelsTooltip').innerHTML = chrome.i18n.getMessage('addTextLabelsTooltip');

    let appearanceContainer = document.getElementById('appearance-config');

    /// Create inner width slider
    if (document.getElementById('innerWidth') == undefined) {
        let innerWidthSlider = createRangeSlider('innerWidth', configs.innerCircleRadius, 'px', function (newVal) {
            configs.innerCircleRadius = newVal;
        }, 0, 100);
        innerWidthSlider.style.padding = '0px 5px';

        /// Attach tooltip
        innerWidthSlider.firstChild.setAttribute('class', 'tooltip');
        let tooltipText = document.createElement('span');
        tooltipText.innerText = chrome.i18n.getMessage('innerWidthTooltip');
        tooltipText.setAttribute('class', 'tooltiptext');
        innerWidthSlider.firstChild.appendChild(tooltipText);
        appearanceContainer.appendChild(innerWidthSlider);
    }

    /// Create gap between circles slider
    if (document.getElementById('gapBetweenCircles') == undefined) {
        let gapBetweenLevelsSlider = createRangeSlider('gapBetweenCircles', configs.gapBetweenCircles, 'px', function (newVal) {
            configs.gapBetweenCircles = newVal;
        }, 0, 100);
        gapBetweenLevelsSlider.style.padding = '0px 5px';
        appearanceContainer.appendChild(gapBetweenLevelsSlider);
    }

    /// Create gap between segments slider
    if (document.getElementById('segmentsIndent') == undefined) {
        let gapBetweenSegmentsSlider = createRangeSlider('segmentsIndent', configs.segmentsIndent, '%', function (newVal) {
            configs.segmentsIndent = newVal;
        }, 0.0, 0.1, undefined, 0.01);
        gapBetweenSegmentsSlider.style.padding = '0px 5px';
        appearanceContainer.appendChild(gapBetweenSegmentsSlider);
    }

    let opacitySliders = document.getElementById('placeholder-opacity-sliders');

    /// Create whole circle opacity slider
    if (document.getElementById('circleOpacity') == undefined) {
        let circleOpacitySlider = createRangeSlider('circleOpacity', configs.circleOpacity, null, function (newVal) {
            configs.circleOpacity = newVal;
        }, 0.1, 1.0, null, 0.1);
        circleOpacitySlider.style.padding = '0px 5px';

        // appearanceContainer.appendChild(circleOpacitySlider);
        opacitySliders.appendChild(circleOpacitySlider);
    }

    /// Create label opacity slider
    if (document.getElementById('labelOpacity') == undefined) {
        let labelOpacitySlider = createRangeSlider('labelOpacity', configs.labelOpacity, null, function (newVal) {
            configs.labelOpacity = newVal;
        }, 0.1, 1.0, null, 0.1);
        labelOpacitySlider.style.padding = '0px 5px';

        // appearanceContainer.appendChild(labelOpacitySlider);
        opacitySliders.appendChild(labelOpacitySlider);
    }

    /// Create icons opacity slider
    if (document.getElementById('iconOpacity') == undefined) {
        let iconOpacitySlider = createRangeSlider('iconOpacity', configs.iconOpacity, null, function (newVal) {
            configs.iconOpacity = newVal;
        }, 0.1, 1.0, null, 0.1);
        iconOpacitySlider.style.padding = '0px 5px';

        // appearanceContainer.appendChild(iconOpacitySlider);
        opacitySliders.appendChild(iconOpacitySlider);
    }


    /// Set menu color selector
    let menuTypeColor = document.getElementById('menuTypeColor');
    document.getElementById('menuTypeColorLabel').innerText = chrome.i18n.getMessage('menuColor');
    menuTypeColor.setAttribute('value', configs[selectedMenuType].color);
    setTimeout(function () {

        menuTypeColor.addEventListener('input', function (newVal) {
            configs[selectedMenuType].color = menuTypeColor.value;
            drawCirclePreview();
        });

        menuTypeColor.addEventListener('change', function (newVal) {
            saveAllSettings();
            generateButtonsControls();
        });

    }, delayToAddListeners);

}

/// Behavior configs
function generateBehaviorConfigs() {
    /// Translate title
    document.getElementById('behaviorTitle').innerHTML = chrome.i18n.getMessage('behaviorTitle');

    /// Options for boolean cofnigs
    let inputIds = [
        'addTextLabels',
        'hideLabelIfNoSpace',
        'showActionIcons',
        'showTitleOnHoverWhenHidden',
        'delayToShowTitleOnHoverWhenHidden',
        'dimBackground',
        'hideCircleIfNoActionSelected',
        'debugMode',
        'addLinkTooltip',
        'showRegularMenuIfNoAction',
        // 'applySettingsImmediately',

        'addCircleShadow',
        'circleShadowOpacity',
        'addBlur',
        'blurRadius',

        'backgroundDimmerOpacity',
        'storeCurrentScrollPosition',
        // 'highlightElementOnHover',
        'continiousVerticalScrollDetection',
        'continiousHorizontalScrollDetection',
        'copyNotification',
        'showUpdateNotification',
        'addGhostPointer',
        'addBorderToHoveredElement',
        'checkButtonsAvailability',
        'requireModifierForSpecificMenus',
        'searchUrlFormat'
        // 'animateHideRelativeToSelected',
        // 'circleHideAnimation',
    ];

    inputIds.forEach(function (inputId) {
        let inputField = document.getElementById(inputId);
        if (configs[inputId] !== null && configs[inputId] !== undefined) {
            if (inputField.getAttribute('type') == 'checkbox') {
                if (configs[inputId] == true)
                    inputField.setAttribute('checked', true);
            }
            else
                inputField.setAttribute('value', configs[inputId]);
        }

        inputField.parentNode.innerHTML = chrome.i18n.getMessage(inputId) + ' ' + inputField.parentNode.innerHTML;

        setTimeout(function () {
            document.getElementById(inputId).addEventListener("input", function (e) {
                try {
                    let input = document.getElementById(inputId);

                    configs[inputId] = input.getAttribute('type') == 'checkbox' ? input.checked : input.value;
                    // drawCirclePreview();
                    drawCircle(false, selectedMenuType, true, false, true);
                    saveAllSettings();
                    updateDisabledOptions();
                } catch (error) {
                    if (configs.debugMode) console.log(error);
                }
            });
        }, 300);
    });

    /// Set translated tooltips
    document.getElementById('dimBackgroundTooltip').innerText = chrome.i18n.getMessage('dimBackgroundTooltip');
    document.getElementById('windowsOnlyTooltip').innerText = chrome.i18n.getMessage('windowsOnly');
    document.getElementById('addLinkTooltipTooltip').innerText = chrome.i18n.getMessage('addLinkTooltipTooltip');
    document.getElementById('searchUrlFormatTooltip').innerText = chrome.i18n.getMessage('searchUrlFormatTooltip');
    // document.getElementById('highlightElementOnHoverTooltip').innerText = chrome.i18n.getMessage('highlightElementOnHoverTooltip');
    document.getElementById('storeCurrentScrollPositionTooltip').innerText = chrome.i18n.getMessage('storeCurrentScrollPositionTooltip');
    document.getElementById('showTitleOnHoverWhenHiddenTooltip').innerText = chrome.i18n.getMessage('showTitleOnHoverWhenHiddenTooltip');   
    document.getElementById('requireModifierForSpecificMenusTooltip').innerText = chrome.i18n.getMessage('requireModifierForSpecificMenusTooltip');

    document.getElementById('continiousVerticalScrollDetectionTooltip').innerText = chrome.i18n.getMessage('continiousScrollDetectionHint');
    document.getElementById('continiousHorizontalScrollDetectionTooltip').innerText = chrome.i18n.getMessage('continiousScrollDetectionHint');
    // document.getElementById('applySettingsImmediatelyTooltip').innerText = chrome.i18n.getMessage('applySettingsImmediatelyTooltip');
    document.getElementById('addBlurTooltip').innerText = chrome.i18n.getMessage('addBlurTooltip');
    document.getElementById('addGhostPointerTooltip').innerText = chrome.i18n.getMessage('addGhostPointerTooltip');
    document.getElementById('checkButtonsAvailabilityTooltip').innerText = chrome.i18n.getMessage('checkButtonsAvailabilityTooltip');

    /// Proccess 'inactive menu for item behavior' dropdown
    let inactiveMenuBehavior = document.getElementById('inactiveMenuBehavior');
    inactiveMenuBehavior.parentNode.innerHTML = chrome.i18n.getMessage('inactiveMenuBehavior') + '<br/>' + inactiveMenuBehavior.parentNode.innerHTML;
    setTimeout(function () {
        let inactiveMenuBehavior = document.getElementById('inactiveMenuBehavior');
        inactiveMenuBehavior.addEventListener('change', function () {
            console.log('changed value');
            console.log(inactiveMenuBehavior.value);
            configs.inactiveMenuBehavior = inactiveMenuBehavior.value;
            saveAllSettings();
        })
    }, delayToAddListeners);

    /// Set translated and selected options
    document.getElementById('inactiveMenuBehavior').querySelectorAll('option').forEach(function (option) {
        option.innerHTML = chrome.i18n.getMessage(option.getAttribute('value'));
        if (configs.inactiveMenuBehavior == option.getAttribute('value'))
            option.setAttribute('selected', 0);
    })

    /// Create animation duration config
    if (document.getElementById('animationDuration') == undefined) {
        let animationDurationSlider = createRangeSlider('animationDuration', configs.animationDuration, 'ms', function (newVal) {
            console.log(newVal);
            configs.animationDuration = newVal;
        }, 0, 600, null, 50);
        animationDurationSlider.style.padding = '0px 5px 5px 5px';

        document.getElementById('behavior-config').appendChild(animationDurationSlider);
    }

    /// Proccess 'circle location' dropdown
    let circleLocation = document.getElementById('circleLocation');
    circleLocation.parentNode.innerHTML = chrome.i18n.getMessage('circleLocation') + ':<br/> ' + circleLocation.parentNode.innerHTML;
    setTimeout(function () {
        let circleLocation = document.getElementById('circleLocation');
        circleLocation.addEventListener('change', function () {
            configs.circleLocation = circleLocation.value;
            saveAllSettings();
            document.querySelector("#addGhostPointer").parentNode.parentNode.className = document.querySelector("#circleLocation").value == 'alwaysCursor' ? 'hidden-option' : 'option visible-option';
        })
    }, delayToAddListeners);

    /// set translated and selected options
    document.getElementById('circleLocation').querySelectorAll('option').forEach(function (option) {
        if (chrome.i18n.getMessage(option.getAttribute('value')))
            option.innerHTML = chrome.i18n.getMessage(option.getAttribute('value'));
        if (configs.circleLocation == option.getAttribute('value'))
            option.setAttribute('selected', 0);
    });


    /// Proccess 'mouseLeaveBehavior' dropdown
    let mouseLeaveBehavior = document.getElementById('mouseLeaveBehavior');
    mouseLeaveBehavior.parentNode.innerHTML = chrome.i18n.getMessage('mouseLeaveBehavior') + ':<br/> ' + mouseLeaveBehavior.parentNode.innerHTML;
    setTimeout(function () {
        let mouseLeaveBehavior = document.getElementById('mouseLeaveBehavior');
        mouseLeaveBehavior.addEventListener('change', function () {
            configs.mouseLeaveBehavior = mouseLeaveBehavior.value;
            saveAllSettings();
        })
    }, delayToAddListeners);

    /// set translated and selected options
    document.getElementById('mouseLeaveBehavior').querySelectorAll('option').forEach(function (option) {
        if (chrome.i18n.getMessage(option.getAttribute('value')))
            option.innerHTML = chrome.i18n.getMessage(option.getAttribute('value'));
        if (configs.mouseLeaveBehavior == option.getAttribute('value'))
            option.setAttribute('selected', 0);
    });


    /// Proccess 'show animation' dropdown
    let showCircleAnimation = document.getElementById('showCircleAnimation');
    // showCircleAnimation.parentNode.innerHTML = chrome.i18n.getMessage('showCircleAnimation') + ': ' + showCircleAnimation.parentNode.innerHTML;
    showCircleAnimation.parentNode.innerHTML = chrome.i18n.getMessage('showCircleAnimation') + ': ' + showCircleAnimation.parentNode.innerHTML;
    setTimeout(function () {
        let showCircleAnimation = document.getElementById('showCircleAnimation');
        showCircleAnimation.addEventListener('change', function () {
            configs.showCircleAnimation = showCircleAnimation.value;
            saveAllSettings();
        })
    }, delayToAddListeners);

    /// set translated and selected options
    document.getElementById('showCircleAnimation').querySelectorAll('option').forEach(function (option) {
        if (chrome.i18n.getMessage(option.getAttribute('value')))
            option.innerHTML = chrome.i18n.getMessage(option.getAttribute('value'));
        if (configs.showCircleAnimation == option.getAttribute('value'))
            option.setAttribute('selected', 0);
    })

    /// Proccess 'hide animation' dropdown
    let hideCircleAnimation = document.getElementById('hideCircleAnimation');
    // hideCircleAnimation.parentNode.innerHTML = chrome.i18n.getMessage('hideCircleAnimation') + ':<br/> ' + hideCircleAnimation.parentNode.innerHTML;
    hideCircleAnimation.parentNode.innerHTML = chrome.i18n.getMessage('hideCircleAnimation') + ': ' + hideCircleAnimation.parentNode.innerHTML;
    setTimeout(function () {
        let hideCircleAnimation = document.getElementById('hideCircleAnimation');
        hideCircleAnimation.addEventListener('change', function () {
            configs.hideCircleAnimation = hideCircleAnimation.value;
            saveAllSettings();
        })
    }, delayToAddListeners);

    /// set translated and selected options
    document.getElementById('hideCircleAnimation').querySelectorAll('option').forEach(function (option) {
        if (chrome.i18n.getMessage(option.getAttribute('value')))
            option.innerHTML = chrome.i18n.getMessage(option.getAttribute('value'));
        if (configs.hideCircleAnimation == option.getAttribute('value'))
            option.setAttribute('selected', 0);
    });
}

/// Gesture configs
function generateGesturesConfigs() {
    /// Translate title
    let gesturesTitle = document.getElementById('gesturesTitle');
    gesturesTitle.innerHTML = chrome.i18n.getMessage('gesturesTitle');

    let gesturesConfigs = document.getElementById('gestures-config');
    gesturesConfigs.innerHTML = '';

    /// Subheader
    let gesturesSubheader = document.createElement('div');
    gesturesSubheader.setAttribute('class', 'sub-header');
    gesturesSubheader.setAttribute('style', 'margin-bottom: 8px;');
    gesturesSubheader.innerHTML = '+ ' + chrome.i18n.getMessage('secondAction').toLowerCase() + ':';
    gesturesConfigs.appendChild(gesturesSubheader);

    let rockerActionContainer = document.createElement('div');
    rockerActionContainer.setAttribute('class', 'option');

    /// Rocker action dropdown
    let rockerIidentifier = 'regularRockerActionDropdown';
    let leftClickDropdown = createActionDropdownButton(rockerIidentifier, configs[selectedMenuType].rockerLeftClick, function (newValue) {
        configs[selectedMenuType].rockerLeftClick = newValue;
        saveAllSettings();
    }, chrome.i18n.getMessage('leftClick'));

    rockerActionContainer.appendChild(leftClickDropdown);
    gesturesConfigs.appendChild(rockerActionContainer);

    /// Middle click action dropdown
    let middleClickDropdownContainer = document.createElement('div');
    middleClickDropdownContainer.setAttribute('class', 'option');

    let middleClickIidentifier = `middleClickActionDropdown`;
    let middleClickDropdown = createActionDropdownButton(middleClickIidentifier, configs[selectedMenuType].rockerMiddleClick, function (newValue) {
        configs[selectedMenuType].rockerMiddleClick = newValue;
        saveAllSettings();
    }, chrome.i18n.getMessage('rockerMiddleClick'));
    middleClickDropdownContainer.appendChild(middleClickDropdown);
    gesturesConfigs.appendChild(middleClickDropdownContainer);

    /// Wheel up action dropdown
    let wheelUpdropdownContainer = document.createElement('div');
    wheelUpdropdownContainer.setAttribute('class', 'option');

    let wheelUpIidentifier = `regularWheelUpActionDropdown`;
    let wheelUpdropdown = createActionDropdownButton(wheelUpIidentifier, configs[selectedMenuType].mouseWheelUpAction, function (newValue) {
        configs[selectedMenuType].mouseWheelUpAction = newValue;
        saveAllSettings();
    }, chrome.i18n.getMessage('mouseWheelUpAction'));
    wheelUpdropdownContainer.appendChild(wheelUpdropdown);

    gesturesConfigs.appendChild(wheelUpdropdownContainer);

    /// Wheel down action dropdown
    let wheelDowndropdownContainer = document.createElement('div');
    wheelDowndropdownContainer.setAttribute('class', 'option');
    let wheelDownIidentifier = `regularWheelDownActionDropdown`;
    let wheelDowndropdown = createActionDropdownButton(wheelDownIidentifier, configs[selectedMenuType].mouseWheelDownAction, function (newValue) {
        configs[selectedMenuType].mouseWheelDownAction = newValue;
        saveAllSettings();
    }, chrome.i18n.getMessage('mouseWheelDownAction'));
    wheelDowndropdownContainer.appendChild(wheelDowndropdown);

    gesturesConfigs.appendChild(wheelDowndropdownContainer);

    /// Horizontal wheel gestures

    /// Swicher
    let horizontalWheelSwitcherDiv = document.createElement('div');
    horizontalWheelSwitcherDiv.className = 'option';
    horizontalWheelSwitcherDiv.style.marginTop = '15px';
    let horWheelLabel = document.createElement('label');
    horWheelLabel.innerText = chrome.i18n.getMessage('horizontalWheelActionsEnabled') + '   ';
    horizontalWheelSwitcherDiv.appendChild(horWheelLabel);
    let horWheelInput = document.createElement('input');
    horWheelInput.type = 'checkbox';
    horWheelInput.id = 'horizontalWheelActionsEnabled';
    if (configs.horizontalWheelActionsEnabled) horWheelInput.setAttribute('checked', true);

    let horizontalWheelWrapper = document.createElement('div');

    horWheelInput.addEventListener('change', function (newVal) {
        configs.horizontalWheelActionsEnabled = horWheelInput.checked;
        saveAllSettings();
        horizontalWheelWrapper.className = configs.horizontalWheelActionsEnabled ? 'visible-option' : 'hidden-option';
        document.getElementById('continiousHorizontalScrollDetection').parentNode.parentNode.className = configs.horizontalWheelActionsEnabled ? 'option visible-option' : 'option hidden-option';
    })

    horWheelLabel.appendChild(horWheelInput);
    gesturesConfigs.appendChild(horizontalWheelSwitcherDiv);

    /// Gestures
    let wheelLeftDropdownContainer = document.createElement('div');
    wheelLeftDropdownContainer.setAttribute('class', 'option');
    let wheelLeftIidentifier = `regularWheelLeftActionDropdown`;
    let wheelLeftDropdown = createActionDropdownButton(wheelLeftIidentifier, configs[selectedMenuType].mouseWheelLeftAction ?? 'noAction', function (newValue) {
        configs[selectedMenuType].mouseWheelLeftAction = newValue;
        saveAllSettings();
    }, chrome.i18n.getMessage('mouseWheelLeftAction'));
    wheelLeftDropdownContainer.appendChild(wheelLeftDropdown);

    let wheelRightDropdownContainer = document.createElement('div');
    wheelRightDropdownContainer.setAttribute('class', 'option');
    let wheelRightIidentifier = `regularWheelRightActionDropdown`;
    let wheelRightDropdown = createActionDropdownButton(wheelRightIidentifier, configs[selectedMenuType].mouseWheelRightAction ?? 'noAction', function (newValue) {
        configs[selectedMenuType].mouseWheelRightAction = newValue;
        saveAllSettings();
    }, chrome.i18n.getMessage('mouseWheelRightAction'));
    wheelRightDropdownContainer.appendChild(wheelRightDropdown);

    horizontalWheelWrapper.appendChild(wheelLeftDropdownContainer);
    horizontalWheelWrapper.appendChild(wheelRightDropdownContainer);
    gesturesConfigs.appendChild(horizontalWheelWrapper);

    /// Set disabled sections
    gesturesConfigs.className = configs.openCircleOn == 'rightClick' ? 'configs-container visible-option' : 'configs-container hidden-option';
    horizontalWheelWrapper.className = configs.horizontalWheelActionsEnabled ? 'visible-option' : 'hidden-option';
    document.getElementById('continiousHorizontalScrollDetection').parentNode.parentNode.className = configs.horizontalWheelActionsEnabled ? 'option visible-option' : 'option hidden-option';

    /// Add 'open circle on' dropdown
    let openMenuOnDropdown = document.getElementById('openCircleOn');
    if (!openMenuOnDropdown.parentNode.innerHTML.includes('<br'))
        openMenuOnDropdown.parentNode.innerHTML = chrome.i18n.getMessage('openCircleOn') + '<br/>' + openMenuOnDropdown.parentNode.innerHTML;
    setTimeout(function () {
        let openMenuOnDropdown = document.getElementById('openCircleOn');
        openMenuOnDropdown.addEventListener('change', function (val) {
            configs.openCircleOn = openMenuOnDropdown.value;
            document.querySelector("#delayForLongLeftClick").parentNode.className = openMenuOnDropdown.value == 'longLeftClick' ? 'visible-option' : 'hidden-option';
            document.querySelector("#longLeftClickThreshold").parentNode.parentNode.className = openMenuOnDropdown.value == 'longLeftClick' ? 'visible-option' : 'hidden-option';
            gesturesConfigs.className = openMenuOnDropdown.value == 'rightClick' ? 'configs-container visible-option' : 'configs-container hidden-option';
            saveAllSettings();
            updateDisabledOptions();
        })
    }, delayToAddListeners);

    /// Set translated and selected options
    document.getElementById('openCircleOn').querySelectorAll('option').forEach(function (option) {
        option.innerHTML = chrome.i18n.getMessage(option.getAttribute('value'));
        if (configs.openCircleOn == option.getAttribute('value'))
            option.setAttribute('selected', 0);
    })

    /// Add long left click duration slider
    if (!document.getElementById('delayForLongLeftClick')) {
        let longLeftClickDelay = createRangeSlider('delayForLongLeftClick', configs.delayForLongLeftClick, 'ms', function (newVal) {
            configs.delayForLongLeftClick = newVal;
        }, 50, 2000, null, 25);
        longLeftClickDelay.style.padding = '0px 5px 12px';
        longLeftClickDelay.className = configs.openCircleOn == 'longLeftClick' ? 'visible-option' : 'hidden-option';
        document.getElementById('openCircleOnContainer').appendChild(longLeftClickDelay);
    }

    /// Add config for long left click threshold to not register (px)
    if (!document.getElementById('longLeftClickThreshold')) {
        let longLeftClickThresholdContainer = document.createElement('div');
        longLeftClickThresholdContainer.className = 'option';
        longLeftClickThresholdContainer.style.padding = '0px 5px 12px';

        /// input
        let longLeftClickThreshold = document.createElement('input');
        longLeftClickThreshold.setAttribute('type', 'number');
        longLeftClickThreshold.setAttribute('min', '1');
        longLeftClickThreshold.setAttribute('max', '1000');
        longLeftClickThreshold.setAttribute('title', 'px');
        longLeftClickThreshold.setAttribute('id', 'longLeftClickThreshold');
        longLeftClickThreshold.setAttribute('value', configs.longLeftClickThreshold);

        setTimeout(function () {
            longLeftClickThreshold.addEventListener('change', function (nevVal) {
                configs.longLeftClickThreshold = longLeftClickThreshold.value;
                saveAllSettings();
            });
        }, delayToAddListeners);

        /// label
        let longLeftClickThresholdLabel = document.createElement('label');
        longLeftClickThresholdLabel.innerText = chrome.i18n.getMessage('longLeftClickThreshold') + ': ';
        longLeftClickThresholdLabel.className = 'tooltip';

        /// tooltip
        let longLeftClickThresholdTooltip = document.createElement('span');
        longLeftClickThresholdTooltip.innerText = chrome.i18n.getMessage('longLeftClickThresholdTooltip');
        longLeftClickThresholdTooltip.className = 'tooltiptext';

        let hoverHint = document.createElement('div');
        hoverHint.innerHTML = '?';
        hoverHint.className = 'tooltipHint';

        longLeftClickThresholdLabel.appendChild(longLeftClickThreshold);
        longLeftClickThresholdLabel.appendChild(hoverHint);
        longLeftClickThresholdLabel.appendChild(longLeftClickThresholdTooltip);
        longLeftClickThresholdContainer.appendChild(longLeftClickThresholdLabel);
        document.getElementById('openCircleOnContainer').appendChild(longLeftClickThresholdContainer);
        longLeftClickThresholdContainer.className = configs.openCircleOn == 'longLeftClick' ? 'visible-option' : 'hidden-option';
    }


}

/// Buttons configs
function generateButtonsControls() {
    const buttonsConfigContainer = document.getElementById('buttons-config-container');
    buttonsConfigContainer.innerHTML = '';

    let buttonsHeader = document.createElement('span');
    // buttonsHeader.innerHTML = chrome.i18n.getMessage('buttonsHeader') + '<br />';
    buttonsHeader.innerHTML = chrome.i18n.getMessage('levels') + '<br />';
    buttonsHeader.setAttribute('class', 'header');
    buttonsHeader.setAttribute('style', '');
    buttonsConfigContainer.appendChild(buttonsHeader);

    for (var i = 0; i < configs[selectedMenuType].levels.length; i++) {
        generateLevelConfigs(i);
    }

    generateAddLevelButton();
    return buttonsConfigContainer;
}

function generateLevelConfigs(levelIndex = 0) {
    /// Generate header
    let headerContainer = document.createElement('span');
    headerContainer.setAttribute('style', 'vertical-align: center;');

    /// Enabled checkbox
    let enabledCheckbox = document.createElement('input');
    let enabledCheckboxId = `enabledCheckbox-${levelIndex}`;

    enabledCheckbox.setAttribute('type', 'checkbox');
    enabledCheckbox.setAttribute('title', chrome.i18n.getMessage("enabled"));
    enabledCheckbox.setAttribute('style', 'margin-right: 5px;cursor: pointer;');
    enabledCheckbox.setAttribute('id', enabledCheckboxId);
    if (configs[selectedMenuType].levels[levelIndex].enabled !== false) {
        enabledCheckbox.setAttribute('checked', 0);
    }

    setTimeout(function () {
        document.getElementById(enabledCheckboxId).addEventListener('input', function () {
            let ind = enabledCheckboxId.split('-')[1];
            if (configs.debugMode) console.log('hit checkbox on ' + ind.toString());
            configs[selectedMenuType].levels[ind].enabled = configs[selectedMenuType].levels[ind].enabled ? false : true;

            drawCirclePreview();
            generateButtonsControls();
            positionSettingsInCenter();
            saveAllSettings();
        });
    }, delayToAddListeners);

    headerContainer.appendChild(enabledCheckbox);

    /// Level title
    let title = document.createElement('span');
    title.setAttribute('style', 'font-size: 14px; margin-left: 5px; opacity: 0.7;');
    title.textContent = chrome.i18n.getMessage('circleLevel') + ' ' + (levelIndex + 1).toString();
    headerContainer.appendChild(title);

    /// Remove level button
    let removeLevelButton = document.createElement('a');
    let removeLevelButtonId = `removeLevelButton-${levelIndex}`;
    removeLevelButton.setAttribute('style', 'float: right; cursor: pointer;');
    removeLevelButton.setAttribute('class', 'delete-level-button');
    removeLevelButton.setAttribute('id', removeLevelButtonId);
    removeLevelButton.innerText = chrome.i18n.getMessage("deleteLabel");
    headerContainer.appendChild(removeLevelButton);

    setTimeout(function () {
        let removeLevelButton = document.getElementById(removeLevelButtonId);
        removeLevelButton.addEventListener('click', function () {
            let ind = removeLevelButtonId.split('-')[1];
            configs[selectedMenuType].levels.splice(ind, 1);

            drawCirclePreview();
            generateButtonsControls();
            positionSettingsInCenter();
            drawCirclePreview();
            saveAllSettings();
        });
    }, delayToAddListeners);

    headerContainer.innerHTML += '<br /><br />';

    /// Generate level configs container
    let container = document.createElement('div');
    container.setAttribute('class', 'level-configs');
    container.innerHTML = '';

    if (configs[selectedMenuType].levels[levelIndex].enabled == false)
        container.style.opacity = 0.5;

    container.appendChild(headerContainer);

    const levelButtons = configs[selectedMenuType].levels[levelIndex].buttons;

    /// Generate entries
    for (let i = 0, l = levelButtons.length; i < l; i++) {
        let item = levelButtons[i];

        const entry = document.createElement('div');
        entry.setAttribute('class', 'buttons-item');
        const entryIdentifier = `buttonConfigEntry-${levelIndex}-${i}`;
        entry.setAttribute('id', entryIdentifier);
        entry.style.borderRadius = '5px'

        /// Highlight the button when segment was selected by mouse
        if (selectedButtons[levelIndex] == i || preselectedButtons[levelIndex] == i)
            entry.style.background = 'lightgray';

        /// Counter
        const numberText = document.createElement('span');
        numberText.textContent = (i + 1).toString();
        numberText.setAttribute('style', 'color: grey; position: relative; left: -20px; top: 0px;');
        entry.appendChild(numberText);

        /// Button action dropdown
        const dropdownIdentifier = `actionDropdown-${levelIndex}-${i}`;

        const actionDropdown = createActionDropdownButton(dropdownIdentifier, item.id, function (newValue) {
            let parts = dropdownIdentifier.split('-');
            configs[selectedMenuType].levels[parts[1]].buttons[parts[2]] = { 'id': newValue };
            drawCirclePreview();
            generateButtonsControls();
            saveAllSettings();
        });
        entry.appendChild(actionDropdown);
        entry.innerHTML += '<br />';

        /// "Open url" customization
        if (item.id == 'openUrl') {

            const openUrlContainer = document.createElement('div');
            openUrlContainer.style.padding = '5px';

            /// URL input
            const urlInput = document.createElement('input');
            const urlInputIdentifier = `urlInput-${levelIndex}-${i}`;
            urlInput.id = urlInputIdentifier;
            urlInput.title = 'URL';
            urlInput.placeholder = 'URL';
            urlInput.style.width = '100%';
            // urlInput.style.marginLeft = '12px';
            if (item.url) urlInput.setAttribute('value', item.url);

            setTimeout(function () {
                const inp = document.getElementById(urlInputIdentifier);
                inp.addEventListener('change', function (newVal) {

                    let parts = urlInputIdentifier.split('-');
                    configs[selectedMenuType].levels[parts[1]].buttons[parts[2]]['url'] = inp.value;
                    generateButtonsControls();
                    saveAllSettings();
                    drawCirclePreview();
                })
            }, delayToAddListeners);

            /// add hint
            let urlInputContainer = document.createElement('div');
            let urlTooltip = document.createElement('span');
            urlTooltip.innerText = chrome.i18n.getMessage('openUrlHint');
            urlTooltip.className = 'tooltiptext';
            let hoverHint = document.createElement('div');
            hoverHint.innerHTML = '?';
            hoverHint.className = 'tooltipHint';
            hoverHint.style.border = '1px solid white';
            hoverHint.style.top = '2.5px';

            urlInputContainer.classList.add('tooltip');
            urlInputContainer.appendChild(urlInput);
            urlInputContainer.appendChild(hoverHint);
            urlInputContainer.appendChild(urlTooltip);
            urlInputContainer.style.width = '100%';

            openUrlContainer.appendChild(urlInputContainer);

            /// label input
            const labelInput = document.createElement('input');
            const labelInputIdentifier = `labelInput-${levelIndex}-${i}`;
            labelInput.id = labelInputIdentifier;
            labelInput.title = chrome.i18n.getMessage('label') ?? 'Label';
            labelInput.placeholder = chrome.i18n.getMessage('label') ?? 'Label';
            labelInput.style.width = '100%';
            labelInput.style.marginTop = '2px';
            if (item.label) labelInput.setAttribute('value', item.label);

            setTimeout(function () {
                const inp = document.getElementById(labelInputIdentifier);
                inp.addEventListener('change', function (newVal) {

                    let parts = labelInputIdentifier.split('-');
                    configs[selectedMenuType].levels[parts[1]].buttons[parts[2]]['label'] = inp.value;
                    drawCirclePreview();
                    generateButtonsControls();
                    saveAllSettings();
                })
            }, delayToAddListeners)

            openUrlContainer.appendChild(labelInput);

            /// custom icon URL
            const iconInput = document.createElement('input');
            const iconInputIdentifier = `iconInput-${levelIndex}-${i}`;
            iconInput.id = iconInputIdentifier;
            iconInput.title = chrome.i18n.getMessage('iconUrlPlaceholder') ?? 'Custom icon URL or Base64 string (data:image/png;base64, ...)';
            iconInput.placeholder = chrome.i18n.getMessage('iconUrl') ?? 'Custom icon URL';
            iconInput.style.resize = 'both';
            iconInput.style.width = '100%';
            iconInput.style.marginTop = '2px';
            if (item.iconUrl) iconInput.setAttribute('value', item.iconUrl);

            setTimeout(function () {
                const inp = document.getElementById(iconInputIdentifier);
                inp.addEventListener('change', function (newVal) {
                    let parts = iconInputIdentifier.split('-');
                    configs[selectedMenuType].levels[parts[1]].buttons[parts[2]]['iconUrl'] = inp.value;
                    drawCirclePreview();
                    generateButtonsControls();
                    saveAllSettings();
                })
            }, delayToAddListeners)

            openUrlContainer.appendChild(iconInput);

            entry.appendChild(openUrlContainer);
        }


        /// Move up/down buttons
        const actionButtonsContainer = document.createElement('div');
        actionButtonsContainer.setAttribute('style', 'position: relative; right: -7px; padding-top: 3px ');

        const moveUpButtonIdentifier = `moveUpButton-${levelIndex}-${i}`;
        const moveUpButton = document.createElement('button');
        moveUpButton.textContent = 'ᐱ';
        moveUpButton.setAttribute('style', 'max-width: 40px; min-width: 40px; padding: 1px; align-items: center');
        moveUpButton.setAttribute('id', moveUpButtonIdentifier);
        moveUpButton.setAttribute('title', chrome.i18n.getMessage("moveUpLabel"));

        setTimeout(function () {
            document.getElementById(moveUpButtonIdentifier).addEventListener("mouseup", function (e) {
                let parts = moveUpButtonIdentifier.split('-');

                let movedItem = configs[selectedMenuType].levels[parts[1]].buttons[parts[2]];
                configs[selectedMenuType].levels[parts[1]].buttons.splice(parts[2], 1);
                if (parts[2] > 0) {
                    /// Move item at previous index
                    configs[selectedMenuType].levels[parts[1]].buttons.splice(parts[2] - 1, 0, movedItem);
                    preselectedButtons[levelIndex] = parts[2] - 1;
                } else {
                    /// Item is first in list - move item to end

                    let lastIndex = configs[selectedMenuType].levels[parts[1]].buttons.length - 1;
                    let lastItem = configs[selectedMenuType].levels[parts[1]].buttons[lastIndex];
                    configs[selectedMenuType].levels[parts[1]].buttons.splice(lastIndex, 1);
                    configs[selectedMenuType].levels[parts[1]].buttons.splice(0, 0, lastItem);

                    configs[selectedMenuType].levels[parts[1]].buttons.splice(configs[selectedMenuType].levels[parts[1]].buttons.length, 0, movedItem);
                    preselectedButtons[levelIndex] = configs[selectedMenuType].levels[parts[1]].buttons.length - 1;
                }

                drawCirclePreview();
                generateButtonsControls();
                saveAllSettings();
            });
        }, delayToAddListeners);

        const moveDownButtonIdentifier = `moveDownButton-${levelIndex}-${i}`;
        const moveDownButton = document.createElement('button');
        moveDownButton.textContent = 'ᐯ';
        moveDownButton.setAttribute('style', 'max-width: 40px; min-width: 40px;  padding: 1px; align-items: center');
        moveDownButton.setAttribute('id', moveDownButtonIdentifier);
        moveDownButton.setAttribute('title', chrome.i18n.getMessage("moveDownLabel"));

        setTimeout(function () {
            document.getElementById(moveDownButtonIdentifier).addEventListener("mouseup", function (e) {
                try {
                    let parts = moveDownButtonIdentifier.split('-');
                    let movedItem = configs[selectedMenuType].levels[parts[1]].buttons[parts[2]];
                    configs[selectedMenuType].levels[parts[1]].buttons.splice(parts[2], 1);

                    if (parts[2] < configs[selectedMenuType].levels[parts[1]].buttons.length) {
                        /// Move item at next index
                        configs[selectedMenuType].levels[parts[1]].buttons.splice(parseInt(parts[2]) + 1, 0, movedItem);
                        preselectedButtons[levelIndex] = parseInt(parts[2]) + 1;
                    } else {
                        /// Item is last in list - move item to start

                        let lastIndex = configs[selectedMenuType].levels[parts[1]].buttons.length - 1;
                        let firstItem = configs[selectedMenuType].levels[parts[1]].buttons[0];
                        configs[selectedMenuType].levels[parts[1]].buttons.splice(0, 1);
                        configs[selectedMenuType].levels[parts[1]].buttons.splice(lastIndex, 0, firstItem);

                        configs[selectedMenuType].levels[parts[1]].buttons.splice(0, 0, movedItem);
                        preselectedButtons[levelIndex] = 0;
                    }

                    drawCirclePreview();
                    generateButtonsControls();
                    saveAllSettings();

                } catch (error) {
                    if (configs.debugMode) console.log(error);
                }
            });
        }, delayToAddListeners);


        /// Delete button
        let deleteButtonIdentifier = `deleteButton-${levelIndex}-${i}`;
        var deleteButton = document.createElement('button');
        deleteButton.textContent = chrome.i18n.getMessage("deleteLabel");
        deleteButton.setAttribute('style', 'display: inline-block; max-width: 100px;');
        deleteButton.setAttribute('id', deleteButtonIdentifier);

        setTimeout(function () {
            document.getElementById(deleteButtonIdentifier).addEventListener("mouseup", function (e) {
                let parts = deleteButtonIdentifier.split('-');
                configs[selectedMenuType].levels[parts[1]].buttons.splice(parts[2], 1);
                drawCirclePreview();
                generateButtonsControls();
                saveAllSettings();
            });
        }, delayToAddListeners);


        /// Reset color button
        let resetButtonColorButton = document.createElement('div');
        resetButtonColorButton.textContent = '↻';
        let resetButtonColorId = `resetButtonColor-${levelIndex}-${i}`;
        resetButtonColorButton.setAttribute('title', chrome.i18n.getMessage("resetColor"));
        resetButtonColorButton.setAttribute('id', resetButtonColorId);
        resetButtonColorButton.setAttribute('class', 'reset-segment-color-button');
        setTimeout(function () {
            let resetButtonColor = document.getElementById(resetButtonColorId);
            resetButtonColor.addEventListener("mouseup", function (e) {
                let parts = resetButtonColorId.split('-');
                let level = parts[1];
                let button = parts[2];
                configs[selectedMenuType].levels[level].buttons[button].color = null;
                saveAllSettings();
                drawCirclePreview();
                generateButtonsControls();
            });

            resetButtonColor.addEventListener("mouseover", function (e) {
                resetButtonColor.style.opacity = 1.0;
            });

            resetButtonColor.addEventListener("mouseout", function (e) {
                resetButtonColor.style.opacity = 0.5;
            });
        }, delayToAddListeners);


        /// Custom color input
        let customButtonColorInput = document.createElement('input');
        let customButtonColorInputId = `customButtonColorInput-${levelIndex}-${i}`;
        customButtonColorInput.setAttribute('type', 'color');
        // customButtonColorInput.setAttribute('style', 'display: inline-block; max-width: 30px;  padding: 0px; vertical-align: middle; float: right; transform: translate(2px, 0px) ');
        customButtonColorInput.setAttribute('style', 'display: inline-block; max-width: 30px;  padding: 0px; vertical-align: middle;  transform: translate(2px, 0px) ');
        customButtonColorInput.setAttribute('id', customButtonColorInputId);
        customButtonColorInput.setAttribute('title', chrome.i18n.getMessage("segmentColor"));

        if (isFirefox)
            customButtonColorInput.style.minWidth = '50px';

        let selectedColor = configs[selectedMenuType].levels[levelIndex].buttons[i].color;
        if (selectedColor !== null && selectedColor !== undefined)
            customButtonColorInput.setAttribute('value', selectedColor);
        else
            customButtonColorInput.setAttribute('value', configs[selectedMenuType].levels[levelIndex].color ?? configs[selectedMenuType].color);

        setTimeout(function () {
            let customButtonColorInput = document.getElementById(customButtonColorInputId);
            customButtonColorInput.addEventListener("input", function (e) {
                let parts = customButtonColorInputId.split('-');
                let level = parts[1];
                let button = parts[2];
                configs[selectedMenuType].levels[level].buttons[button].color = customButtonColorInput.value;
                drawCirclePreview();
            });

            customButtonColorInput.addEventListener("change", function (e) {
                if (configs.debugMode) console.log('saved custom color for button: ' + i.toString());
                saveAllSettings();
            });
        }, delayToAddListeners);


        actionButtonsContainer.appendChild(moveUpButton);
        actionButtonsContainer.appendChild(moveDownButton);
        actionButtonsContainer.appendChild(deleteButton);

        actionButtonsContainer.appendChild(resetButtonColorButton);
        actionButtonsContainer.appendChild(customButtonColorInput);

        entry.appendChild(actionButtonsContainer);

        /// Set on click listener for entry
        setTimeout(function () {
            document.getElementById(entryIdentifier).addEventListener('mousedown', function (e) {
                let el = document.elementFromPoint(e.clientX, e.clientY);

                /// Prevent listener from blocking select dropdowns behavior
                if (el.tagName == 'SELECT' || el.tagName == 'INPUT') {
                    return;
                }

                selectedButtons = {};
                preselectedButtons = {};

                let parts = deleteButtonIdentifier.split('-');
                preselectedButtons[parts[1]] = parts[2];

                drawCirclePreview();
                generateButtonsControls();
            });
        }, delayToAddListeners / 2);


        container.appendChild(entry);
    }

    /// Add new button

    var addButton = document.createElement('button');
    let addButtonId = `addButton-${levelIndex}`;
    addButton.setAttribute('style', 'width: 100%; margin-top: 10px;');
    addButton.setAttribute('id', addButtonId);
    addButton.textContent = chrome.i18n.getMessage("addLabel") + ' ＋';
    setTimeout(function () {
        let addButton = document.getElementById(addButtonId);
        addButton.onmouseup = function () {
            configs[selectedMenuType].levels[addButtonId.split('-')[1]].buttons.push({
                'id': 'noAction',
            });
            drawCirclePreview();
            generateButtonsControls();
            saveAllSettings();
        };
    }, delayToAddListeners);

    container.appendChild(addButton);

    /// Add separator
    container.innerHTML += '<br /><br /><hr />';


    /// Level settings

    /// Level width input
    let widthInputId = `widthInput-${levelIndex}`;
    let levelWidthSlider = createRangeSlider(widthInputId, configs[selectedMenuType].levels[levelIndex].width ?? configs.circleRadius, 'px', function (newVal) {
        let ind = widthInputId.split('-')[1];
        configs[selectedMenuType].levels[ind].width = newVal;
    }, 40, 200, chrome.i18n.getMessage("levelWidth"), 5);
    container.appendChild(levelWidthSlider);

    /// Custom level gap
    // if (levelIndex > 0) {
    //     let levelGapInputId = `levelGapInput-${levelIndex}`;
    //     let levelGapSlider = createRangeSlider(levelGapInputId, configs[selectedMenuType].levels[levelIndex].levelGap ?? configs.gapBetweenCircles, 'px', function (newVal) {
    //         let ind = levelGapInputId.split('-')[1];
    //         configs[selectedMenuType].levels[ind].levelGap = newVal;
    //     }, 0, 100, 'Level gap');
    //     container.appendChild(levelGapSlider);
    // }

    /// 'Use custom color' switch
    var customColorContainer = document.createElement('div');
    customColorContainer.setAttribute('class', 'option');

    let label = document.createElement('label');
    label.innerHTML += ' ' + chrome.i18n.getMessage("standardBackground");
    customColorContainer.appendChild(label);

    /// Reset color button
    let resetLevelColorButton = document.createElement('div');
    resetLevelColorButton.textContent = '↻';
    let resetLevelColorId = `resetLevelColor-${levelIndex}`;
    resetLevelColorButton.setAttribute('title', chrome.i18n.getMessage("resetColor"));
    resetLevelColorButton.setAttribute('style', 'display: inline-block; opacity: 0.5; float: right; transform: translate(-9px, -5px); font-size: 16px; vertical-align: middle; transition: opacity 150ms ease-out;');
    resetLevelColorButton.setAttribute('id', resetLevelColorId);
    setTimeout(function () {
        let resetLevelColorButton = document.getElementById(resetLevelColorId);
        resetLevelColorButton.addEventListener("mouseup", function (e) {
            let parts = resetLevelColorId.split('-');
            let level = parts[1];
            configs[selectedMenuType].levels[level].color = null;
            saveAllSettings();
            drawCirclePreview();
            generateButtonsControls();
        });

        resetLevelColorButton.addEventListener("mouseover", function (e) {
            resetLevelColorButton.style.opacity = 1.0;
        });

        resetLevelColorButton.addEventListener("mouseout", function (e) {
            resetLevelColorButton.style.opacity = 0.5;
        });
    }, delayToAddListeners);


    /// Custom color input
    let customLevelnColorInput = document.createElement('input');
    let customLevelColorInputId = `customLevelColorInput-${levelIndex}`;
    customLevelnColorInput.setAttribute('type', 'color');
    customLevelnColorInput.setAttribute('style', 'display: inline-block; max-width: 30px !important; padding: 0px; vertical-align: middle; float: right; transform: translate(-7px, -5px) ');

    if (isFirefox)
        customLevelnColorInput.style.minWidth = '50px';

    customLevelnColorInput.setAttribute('id', customLevelColorInputId);
    let selectedColor = configs[selectedMenuType].levels[levelIndex].color;
    if (selectedColor !== null && selectedColor !== undefined)
        customLevelnColorInput.setAttribute('value', selectedColor);
    else
        customLevelnColorInput.setAttribute('value', configs[selectedMenuType].color);

    setTimeout(function () {
        let customLevelnColorInput = document.getElementById(customLevelColorInputId);
        customLevelnColorInput.addEventListener("input", function (e) {
            let parts = customLevelColorInputId.split('-');
            let level = parts[1];
            configs[selectedMenuType].levels[level].color = customLevelnColorInput.value;
            drawCirclePreview();
        });

        customLevelnColorInput.addEventListener("change", function (e) {
            if (configs.debugMode) console.log('saved custom color for button: ' + i.toString());
            saveAllSettings();
            generateButtonsControls();
        });
    }, delayToAddListeners);

    /// Level opacity
    let levelOpacitySliderId = `levelOpacity-${levelIndex}`;
    let levelOpacitySlider = createRangeSlider(levelOpacitySliderId, configs[selectedMenuType].levels[levelIndex].opacity ?? 1.0, null, function (newVal) {
        let ind = levelOpacitySliderId.split('-')[1];
        configs[selectedMenuType].levels[ind].opacity = newVal;
    }, 0, 1, chrome.i18n.getMessage("backgroundOpacity"), 0.05);

    levelOpacitySlider.style.paddingTop = '5px';

    container.appendChild(levelOpacitySlider);
    container.innerHTML += '<br/>';

    customColorContainer.appendChild(customLevelnColorInput);
    customColorContainer.appendChild(resetLevelColorButton);
    container.appendChild(customColorContainer);

    document.getElementById('buttons-config-container').appendChild(container);
}

function generateAddLevelButton() {

    if (configs[selectedMenuType].levels.length >= 3) return;

    let addLevelButton = document.createElement('div');
    addLevelButton.setAttribute('id', 'addLevelButton');
    // addLevelButton.setAttribute('title', 'Add circle level');
    addLevelButton.textContent = '+';
    document.getElementById('buttons-config-container').appendChild(addLevelButton);

    addLevelButton.addEventListener('click', function () {
        let buttonsToPush = defaultConfigs[selectedMenuType].levels[0].buttons;

        configs[selectedMenuType].levels.push({
            'width': 60,
            'buttons': buttonsToPush
        });

        drawCirclePreview();
        generateButtonsControls();
        positionSettingsInCenter();
        drawCirclePreview();
        saveAllSettings();
    });
}

/// Service functions
function createActionDropdownButton(id, initialValue, cbOnChange, label) {
    let selectContainer = document.createElement('div');
    selectContainer.style.display = 'inline';

    /// Generate label
    if (label !== null && label !== undefined && label !== '') {
        let span = document.createElement('span');
        span.textContent = label + ':  ';
        selectContainer.appendChild(span);
        selectContainer.innerHTML += '<br />';
    }

    /// Generate dropdown button
    let select = document.createElement('select');
    select.setAttribute('id', id);

    /// Exclude unavailable actions for Safari
    // const pageActions = sortedActionButtons['regularMenu']['page'];
    // let index = pageActions.indexOf("pageZoomIn");
    // if (index > -1) pageActions.splice(index, 1);
    // index = pageActions.indexOf("pageZoomOut");
    // if (index > -1) pageActions.splice(index, 1);
    // const tabActions = sortedActionButtons['regularMenu']['tab'];
    // index = tabActions.indexOf("restoreClosedTab");
    // if (index > -1) tabActions.splice(index, 1);

    /// Populate entries with regular menu actions
    let setValue = false;

    if (selectedMenuType !== 'regularMenu') {
        Object.keys(sortedActionButtons['regularMenu']).forEach(function (key) {
            if (key == '—') return;
            let optGroup = document.createElement('optgroup');
            optGroup.setAttribute('label', key == '—' ? key : chrome.i18n.getMessage(key));

            let items = sortedActionButtons['regularMenu'][key];
            items.forEach(function (item) {
                let option = document.createElement('option');
                option.innerText = chrome.i18n.getMessage(item);
                option.setAttribute('value', item);
                if (item == initialValue) {
                    option.setAttribute('selected', true);
                    setValue = true;
                }
                optGroup.appendChild(option);
            });

            select.appendChild(optGroup);
        });
    }

    /// Generate level-specific sorted options
    Object.keys(sortedActionButtons[selectedMenuType]).forEach(function (key) {
        let optGroup = document.createElement('optgroup');
        optGroup.setAttribute('label', key == '—' ? key : chrome.i18n.getMessage(key));

        let items = sortedActionButtons[selectedMenuType][key];
        items.forEach(function (item) {
            /// Exclude 'open url' from mouse button actions
            if (!id.includes('actionDropdown-') && item == 'openUrl') return;

            let option = document.createElement('option');
            option.innerText = chrome.i18n.getMessage(item);
            option.setAttribute('value', item);
            if (item == initialValue) {
                option.setAttribute('selected', true);
                setValue = true;
            }
            optGroup.appendChild(option);
        });

        select.appendChild(optGroup);
    });

    if (setValue == false) try { select.querySelector(`[value='noAction']`).setAttribute('selected', true); } catch (err) { }

    setTimeout(function () {
        let listenedDropdown = document.getElementById(id);
        listenedDropdown.addEventListener("change", function (e) {
            let newValue = listenedDropdown.value;

            cbOnChange(newValue, id);
            // configs[selectedMenuType].rockerAction = newValue;
            // saveAllSettings();
        });
    }, delayToAddListeners);

    selectContainer.appendChild(select);

    return selectContainer;
}

function createRangeSlider(id, value, units, callbackOnChange, min = 50, max = 200, label, step = 1) {
    let updatePreviewInRealTime = false;

    /// Level width input
    let sliderContainer = document.createElement('div');
    sliderContainer.setAttribute('style', 'vertical-align: bottom; width: 100%; margin-top: 5px;');

    let rangeLabel = document.createElement('span');
    // rangeLabel.setAttribute('style', 'opacity: 0.7');

    let labelToAppend = label ?? chrome.i18n.getMessage(id) ?? id;
    if (!rangeLabel.innerHTML.includes(labelToAppend))
        rangeLabel.innerHTML = labelToAppend + ' ';
    sliderContainer.appendChild(rangeLabel);

    let widthInput = document.createElement('input');
    let widthInputId = id;

    widthInput.setAttribute('type', 'range');
    widthInput.setAttribute('id', widthInputId);
    widthInput.setAttribute('style', 'margin-right: 5px; transform:translate(0, 4px)');
    widthInput.setAttribute('min', `${min}`);
    widthInput.setAttribute('max', `${max}`);
    widthInput.setAttribute('step', `${step}`);
    widthInput.setAttribute('value', value);

    setTimeout(function () {
        let inp = document.getElementById(widthInputId);

        inp.addEventListener('input', function () {
            // let ind = widthInputId.split('-')[1];
            // configs[selectedMenuType].levels[ind].width = parseInt(inp.value);

            callbackOnChange(inp.value.includes('.') ? parseFloat(inp.value) : parseInt(inp.value));

            /// Update width indicator
            document.getElementById(widthInputId + '-indicator').innerHTML = inp.value;
            if (updatePreviewInRealTime)
                drawCirclePreview();

            saveAllSettings();
        });

        inp.addEventListener('change', function () {
            if (configs.debugMode) console.log(`saved value for ${id}`);
            document.getElementById(widthInputId + '-indicator').innerHTML += ` ${units ?? ''}`;

            drawCirclePreview();
            saveAllSettings();
        });
    }, delayToAddListeners);

    sliderContainer.appendChild(widthInput);

    /// Current value indicator
    let widthIndicator = document.createElement('span');
    widthIndicator.setAttribute('id', id + '-indicator');
    widthIndicator.setAttribute('style', 'opacity: 0.7');
    // widthIndicator.innerHTML = value;
    widthIndicator.innerHTML = `${value} ${(units ?? '')}`;
    sliderContainer.appendChild(widthIndicator);

    return sliderContainer;
}

function positionSettingsInCenter() {
    return; 
    // let circlePreviewSegment = document.getElementById('circle-preview');
    // let occupiedWidth = circlePreviewSegment.clientWidth;
    // let allLevelConfigs = document.querySelectorAll('.level-configs');

    // if (allLevelConfigs.length > 3)
    //     allLevelConfigs.splice(3, 1);

    // allLevelConfigs.forEach(function (el) {
    //     occupiedWidth += el.clientWidth + 30;
    // });

    // let screenWidth = window.innerWidth;
    // let occupiedPercent = occupiedWidth / screenWidth * 100;
    // bodyMarginLeft = (100 - occupiedPercent) / 2.5;

    // /// Center main content
    // document.getElementById('content').style.marginLeft = `${bodyMarginLeft}%`;

    // /// Center bottom settings container
    // let generalSettingsContainer = document.getElementById('general-settings-container');
    // generalSettingsContainer.style.marginLeft = `${(screenWidth / 2) - (generalSettingsContainer.clientWidth / 2) - (screenWidth * bodyMarginLeft / 100) - 35}px`;
}

function updateDisabledOptions() {

    /// Grey out settings when no levels added or enabled
    let enabledLevelsCount = 0;
    for (var i = 0; i < configs[selectedMenuType].levels.length; i++) {
        if (configs[selectedMenuType].levels[i].enabled !== false) enabledLevelsCount += 1;
    }

    if (configs[selectedMenuType].levels == null || configs[selectedMenuType].levels.undefined || configs[selectedMenuType].levels.length == 0 || enabledLevelsCount == 0) {
        document.getElementById('clickSegmentToHighlight').innerHTML = chrome.i18n.getMessage('addMoreLevelsToActivateMenu');
        document.getElementById('appearance-config').style.opacity = 0.3;
        document.getElementById('behavior-config').style.opacity = 0.3;
        document.getElementById('gestures-config').style.opacity = 0.3;
    } else {
        // document.getElementById('clickSegmentToHighlight').innerHTML = chrome.i18n.getMessage('clickSegmentToHighlight');
        document.getElementById('clickSegmentToHighlight').innerText = chrome.i18n.getMessage('clickSegmentToHighlight') + `\n(` + chrome.i18n.getMessage('refreshPageIfDoesntWork').toLowerCase() + ')';
        document.getElementById('appearance-config').style.opacity = 1.0;
        document.getElementById('behavior-config').style.opacity = 1.0;
        document.getElementById('gestures-config').style.opacity = 1.0;
    }

    /// Grey out unavailable optoins
    document.querySelector("#showRegularMenuIfNoAction").parentNode.parentNode.className = document.querySelector("#hideCircleIfNoActionSelected").checked && document.getElementById('openCircleOn').value == 'rightClick' ? 'option enabled-option' : 'option disabled-option';
    document.querySelector("#circleShadowOpacity").parentNode.className = document.querySelector("#addCircleShadow").checked ? 'visible-option' : 'hidden-option';
    document.querySelector("#blurRadius").parentNode.className = document.querySelector("#addBlur").checked ? 'visible-option' : 'hidden-option';
    document.querySelector("#delayToShowTitleOnHoverWhenHidden").parentNode.className = document.querySelector("#showTitleOnHoverWhenHidden").checked ? 'visible-option' : 'hidden-option';
    document.querySelector("#backgroundDimmerOpacity").parentNode.className = document.querySelector("#dimBackground").checked ? 'visible-option' : 'hidden-option';
    document.querySelector("#hideCircleIfNoActionSelected").parentNode.className = document.getElementById('openCircleOn').value == 'rightClick' ? 'enabled-option' : 'disabled-option';
    document.querySelector("#hideLabelIfNoSpace").parentNode.className = document.getElementById('addTextLabels').checked ? 'enabled-option' : 'disabled-option';
    // document.querySelector("#animateHideRelativeToSelected").parentNode.className = document.querySelector("#circleHideAnimation").checked ? 'visible-option' : 'hidden-option';
    document.querySelector("#addGhostPointer").parentNode.parentNode.className = document.querySelector("#circleLocation").value == 'alwaysCursor' ? 'hidden-option' : 'option visible-option';

}


function setImportExportButtons() {
    /// Export settings
    document.getElementById('exportSettings').onclick = function () {
        const filename = exportFileName;
        const jsonStr = JSON.stringify(configs);

        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(jsonStr));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        element.style.position = 'absolute';
        document.body.appendChild(element);
        element.click();
        element.remove();
    }

    /// reset settings
    document.getElementById('resetSettings').onclick = function () {
        if (window.confirm(chrome.i18n.getMessage('settingsWarning') ?? 'Are you sure? This will erase your current settings!')) {
            saveAllSettings(defaultConfigs);
            setTimeout(function(){
                window.location.reload();
            },100)
        }
    }

    /// Import settings
    const fileSelector = document.getElementById('importSettings');
    const importSettingsConfirmButton = document.getElementById('importSettingsButton');
    disableImportButton();

    importedConfigs = null;

    fileSelector.addEventListener('change', (event) => {
        const reader = new FileReader();
        reader.addEventListener('load', (event) => {
            const result = event.target.result;
            importedConfigs = JSON.parse(result);

            if (importedConfigs != null && importedConfigs !== undefined) {
                enableImportButton();
            }
        });
        reader.readAsText(event.target.files[0]);
    });

    importSettingsConfirmButton.addEventListener('click', function () {

        /// reset configs
        if (window.confirm(chrome.i18n.getMessage('settingsWarning') ?? 'Are you sure? This will erase your current settings!')) {
            saveAllSettings(importedConfigs);
            setTimeout(function(){
                window.location.reload();
            }, 100)
        }
        
        /// disable import button
        const fileSelector = document.getElementById('importSettings');
        fileSelector.value = null;
        disableImportButton();

    });

    function enableImportButton() {
        importSettingsConfirmButton.disabled = false;
        importSettingsConfirmButton.title = '';
    }

    function disableImportButton() {
        importSettingsConfirmButton.disabled = true;
        importSettingsConfirmButton.title = chrome.i18n.getMessage('chooseFileFirst');
    }
}

document.addEventListener("DOMContentLoaded", optionsInit);