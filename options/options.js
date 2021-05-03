let defaultConfigs;
var delayToAddListeners = 1;
var bodyMarginLeft = 0.0;

function init() {
    defaultConfigs = configs;

    try {
        loadUserConfigs(function (conf) {
            // loadButtons();
            drawCirclePreview('regularMenu');
            generateButtonsControls();
            generateAppearanceControls();
            generateBehaviorConfigs();
            positionSettingsInCenter();
            drawCirclePreview('regularMenu');

            preselectedButtons = {};

            document.getElementById('circle-preview').addEventListener('mousedown', function (e) {
                // document.body.addEventListener('mouseup', function (e) {
                selectedButtons = {};
                preselectedButtons = {};

                drawCircle(e, 'regularMenu', true, false, true);
                // try {
                //     generateSegmentRelatedControls();
                // } catch (e) { console.log(e); }
                generateButtonsControls();
            });
        })
    } catch (e) { console.log(e); }
}

/// Circle preview
function drawCirclePreview(typeOfMenu = 'regularMenu') {
    try {
        document.getElementById('circle-preview-title').innerHTML = chrome.i18n.getMessage('circlePreview');
        document.getElementById('clickSegmentToHighlight').innerHTML = chrome.i18n.getMessage('clickSegmentToHighlight');

        totalCircleRadius = 0.0;

        if (configs.interactiveMenusBehavior == 'combine' || typeOfMenu == 'regularMenu') {
            for (var i = 0; i < configs['regularMenu'].levels.length; i++) {
                if (configs['regularMenu'].levels[i].enabled !== false)
                    totalCircleRadius += configs.gapBetweenCircles + (configs['regularMenu'].levels[i].width ?? configs.circleRadius);
            }
            canvasRadius = totalCircleRadius * 2 + 2;
        }
        else {
            totalCircleRadius = configs.gapBetweenCircles + configs.circleRadius;
            canvasRadius = totalCircleRadius * 2;
        }

        if (typeOfMenu !== 'regularMenu' && configs.interactiveMenusBehavior == 'combine') {
            canvasRadius += (configs.interactiveCircleRadius + configs.gapBeforeInteractiveCircle) * 2;
        }

        let circle = document.getElementById('circle-preview');
        // canvasRadius = (configs.addSecondLevel && typeOfMenu == 'regularMenu' ? secondCircleRadius * 2 : firstCircleRadius * 2) + (configs.addCircleOutlines ? 2 : 0);
        circle.setAttribute('width', `${canvasRadius}px !imporant`);
        circle.setAttribute('height', `${canvasRadius}px !imporant`);
        circle.parentNode.setAttribute('style', `float:left;`);
        ctx = circle.getContext('2d');

        leftCoord = circle.getBoundingClientRect().left;
        topCoord = circle.getBoundingClientRect().top;

        drawCircle(false, 'regularMenu', true, false, true);

        positionSettingsInCenter();
        // setTimeout(positionSettingsInCenter, 1);
    } catch (e) {
        console.log(e);
    }
}

/// Appearance configs
function generateAppearanceControls() {
    /// Translate title
    document.getElementById('appearanceTitle').innerHTML = chrome.i18n.getMessage('appearanceHeader');

    /// Set background color selector
    let colorSelect = document.getElementById('backgroundColor');
    colorSelect.setAttribute('value', configs.regularMenu.color);
    colorSelect.parentNode.innerHTML = chrome.i18n.getMessage('backgroundColor') + ' ' + colorSelect.parentNode.innerHTML;

    setTimeout(function () {
        let colorSelect = document.getElementById('backgroundColor');

        colorSelect.addEventListener("input", function (e) {
            configs.regularMenu.color = colorSelect.value;
            drawCirclePreview();
        });

        colorSelect.addEventListener("change", function (e) {
            console.log('saved bg color');
            saveAllSettings();
        });
    }, 300);


    let appearanceContainer = document.getElementById('appearance-config');

    let innerWidthSlider = generateRangeSlider('innerWidth', configs.innerCircleRadius, function (newVal) {
        configs.innerCircleRadius = newVal;
    }, 0, 100);
    appearanceContainer.appendChild(innerWidthSlider);

    let gapBetweenLevelsSlider = generateRangeSlider('gapBetweenCircles', configs.gapBetweenCircles, function (newVal) {
        configs.gapBetweenCircles = newVal;
    }, 0, 100);
    appearanceContainer.appendChild(gapBetweenLevelsSlider);
}

/// Behavior configs
function generateBehaviorConfigs() {
    /// Translate title
    document.getElementById('behaviorTitle').innerHTML = chrome.i18n.getMessage('behaviorTitle');

    /// Options for boolean cofnigs
    let inputIds = [
        'addTextLabels',
        'dimBackground',
        'hideCircleIfNoActionSelected',
        'circleHideAnimation',
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

        inputField.parentNode.innerHTML = chrome.i18n.getMessage(inputId) + ' ' + inputField.parentNode.innerHTML + '<br />';

        setTimeout(function () {
            document.getElementById(inputId).addEventListener("input", function (e) {
                try {
                    let input = document.getElementById(inputId);

                    configs[inputId] = input.getAttribute('type') == 'checkbox' ? input.checked : input.value;
                    drawCirclePreview();
                    saveAllSettings();
                } catch (error) {
                    console.log(error);
                }
            });
        }, 300);
    });

    /// Rocker action dropdown
    let rockerActionContainer = document.createElement('div');
    rockerActionContainer.setAttribute('class', 'option');

    let rockerIidentifier = `regularRockerActionDropdown`;
    let dropdown = generateActionDropdownButton(rockerIidentifier, configs.regularMenu.rockerAction, function (newValue) {
        configs.regularMenu.rockerAction = newValue;
        saveAllSettings();
    }, chrome.i18n.getMessage('rockerAction'));
    rockerActionContainer.appendChild(dropdown);

    document.getElementById('behavior-config').appendChild(rockerActionContainer);

    /// Wheel up action dropdown
    let wheelUpdropdownContainer = document.createElement('div');
    wheelUpdropdownContainer.setAttribute('class', 'option');

    let wheelUpIidentifier = `regularWheelUpActionDropdown`;
    let wheelUpdropdown = generateActionDropdownButton(wheelUpIidentifier, configs.regularMenu.mouseWheelUpAction, function (newValue) {
        configs.regularMenu.mouseWheelUpAction = newValue;
        saveAllSettings();
    }, chrome.i18n.getMessage('mouseWheelUpAction'));
    wheelUpdropdownContainer.appendChild(wheelUpdropdown);

    document.getElementById('behavior-config').appendChild(wheelUpdropdownContainer);

    /// Wheel down action dropdown
    let wheelDowndropdownContainer = document.createElement('div');
    wheelDowndropdownContainer.setAttribute('class', 'option');

    let wheelDownIidentifier = `regularWheelDownActionDropdown`;
    let wheelDowndropdown = generateActionDropdownButton(wheelDownIidentifier, configs.regularMenu.mouseWheelDownAction, function (newValue) {
        configs.regularMenu.mouseWheelDownAction = newValue;
        saveAllSettings();
    }, chrome.i18n.getMessage('mouseWheelDownAction'));
    wheelDowndropdownContainer.appendChild(wheelDowndropdown);

    document.getElementById('behavior-config').appendChild(wheelDowndropdownContainer);
}



/// Buttons configs
function generateButtonsControls() {
    document.getElementById('buttons-config-container').innerHTML = '';

    let buttonsHeader = document.createElement('span');
    buttonsHeader.innerHTML = chrome.i18n.getMessage('buttonsHeader') + '<br />';
    // buttonsHeader.setAttribute('style', 'float: bottom');
    buttonsHeader.setAttribute('class', 'header');
    document.getElementById('buttons-config-container').appendChild(buttonsHeader);

    for (var i = 0; i < configs.regularMenu.levels.length; i++) {
        generateLevelConfigs(i);
    }

    generateAddLevelButton();
}


function generateLevelConfigs(levelIndex = 0) {
    var container = document.createElement('div');
    container.setAttribute('style', 'float:left; padding: 15px; border: 1px solid lightGrey; margin-top: 15px; margin-right: 30px;');
    container.setAttribute('class', 'level-configs');
    container.innerHTML = '';

    if (configs.regularMenu.levels[levelIndex].enabled == false)
        container.style.opacity = 0.5;

    /// Generate header
    let headerContainer = document.createElement('span');

    /// Enabled checkbox
    let enabledCheckbox = document.createElement('input');
    let enabledCheckboxId = `enabledCheckbox-${levelIndex}`;

    enabledCheckbox.setAttribute('type', 'checkbox');
    enabledCheckbox.setAttribute('style', 'margin-right: 5px;cursor: pointer;');
    enabledCheckbox.setAttribute('id', enabledCheckboxId);
    if (configs.regularMenu.levels[levelIndex].enabled !== false) {
        enabledCheckbox.setAttribute('checked', 0);
    }

    setTimeout(function () {
        document.getElementById(enabledCheckboxId).addEventListener('input', function () {
            let ind = enabledCheckboxId.split('-')[1];
            console.log('hit checkbox on ' + ind.toString());
            configs.regularMenu.levels[ind].enabled = configs.regularMenu.levels[ind].enabled ? false : true;

            drawCirclePreview();
            generateButtonsControls();
            saveAllSettings();
        });
    }, delayToAddListeners);

    headerContainer.appendChild(enabledCheckbox);

    /// Level title
    let title = document.createElement('span');
    title.textContent = chrome.i18n.getMessage('circleLevel') + ' ' + (levelIndex + 1).toString();
    headerContainer.appendChild(title);

    /// Remove level button
    let removeLevelButton = document.createElement('a');
    let removeLevelButtonId = `removeLevelButton-${levelIndex}`;
    removeLevelButton.setAttribute('style', 'float: right; cursor: pointer;');
    removeLevelButton.setAttribute('id', removeLevelButtonId);
    removeLevelButton.innerText = chrome.i18n.getMessage("deleteLabel");
    headerContainer.appendChild(removeLevelButton);

    setTimeout(function () {
        let removeLevelButton = document.getElementById(removeLevelButtonId);
        removeLevelButton.addEventListener('click', function () {
            let ind = removeLevelButtonId.split('-')[1];
            configs.regularMenu.levels.splice(ind, 1);

            drawCirclePreview();
            generateButtonsControls();
            positionSettingsInCenter();
            drawCirclePreview();

            saveAllSettings();
        });
    }, delayToAddListeners);

    headerContainer.innerHTML += '<br /><br />';
    container.appendChild(headerContainer);

    /// Append to buttons-cfg container
    document.getElementById('buttons-config-container').appendChild(container);

    /// Generate entries
    for (var i = 0; i < configs.regularMenu.levels[levelIndex].buttons.length; i++) {
        var item = configs.regularMenu.levels[levelIndex].buttons[i];

        var entry = document.createElement('div');
        entry.setAttribute('class', 'buttons-item');
        entry.setAttribute('style', 'padding:10px;');
        let entryIdentifier = `buttonConfigEntry-${levelIndex}-${i}`;
        entry.setAttribute('id', entryIdentifier);

        /// Highlight the button when segment was selected by mouse
        if (selectedButtons[levelIndex] == i || preselectedButtons[levelIndex] == i)
            entry.style.background = 'lightGrey';

        /// Counter
        let numberText = document.createElement('span');
        numberText.textContent = (i + 1).toString();
        numberText.setAttribute('style', 'color: grey; position: relative; left: -20px; top: 0px;');
        entry.appendChild(numberText);

        /// Button action dropdown
        let dropdownIdentifier = `actionDropdown-${levelIndex}-${i}`;

        let actionDropdown = generateActionDropdownButton(dropdownIdentifier, item.id, function (newValue) {
            let parts = dropdownIdentifier.split('-');
            configs.regularMenu.levels[parts[1]].buttons[parts[2]] = { 'id': newValue };
            drawCirclePreview();
            generateButtonsControls();
            saveAllSettings();
        });
        entry.appendChild(actionDropdown);


        // let identifier = `actionDropdown-${levelIndex}-${i}`;

        // var select = document.createElement('select');
        // select.setAttribute('id', identifier);
        // Object.keys(actionIcons).forEach((function (key) {
        //     let option = document.createElement('option');
        //     option.innerHTML = chrome.i18n.getMessage(key);
        //     option.setAttribute('value', key);
        //     if (key == item.id) option.setAttribute('selected', true);
        //     select.appendChild(option);
        // }));

        // entry.appendChild(select);

        // /// Set dropdown listener
        // setTimeout(function () {
        //     document.getElementById(identifier).addEventListener("change", function (e) {
        //         let newValue = this.value;

        //         let parts = identifier.split('-');
        //         configs.regularMenu.levels[parts[1]].buttons[parts[2]] = { 'id': newValue };
        //         drawCirclePreview();
        //         generateButtonsControls();
        //         saveAllSettings();
        //     });
        // }, delayToAddListeners);

        entry.innerHTML += '<br />';

        /// Move up/down buttons
        var actionButtonsContainer = document.createElement('div');
        actionButtonsContainer.setAttribute('style', 'position: relative; right: -7px; padding-top: 3px ');

        let moveUpButtonIdentifier = `moveUpButton-${levelIndex}-${i}`;
        var moveUpButton = document.createElement('button');
        moveUpButton.textContent = 'ᐱ';
        moveUpButton.setAttribute('style', 'max-width: 1px; padding: 1px; align-items: center');
        moveUpButton.setAttribute('id', moveUpButtonIdentifier);
        moveUpButton.setAttribute('title', chrome.i18n.getMessage("moveUpLabel"));

        setTimeout(function () {
            document.getElementById(moveUpButtonIdentifier).addEventListener("mouseup", function (e) {
                let parts = moveUpButtonIdentifier.split('-');

                let movedItem = configs.regularMenu.levels[parts[1]].buttons[parts[2]];
                configs.regularMenu.levels[parts[1]].buttons.splice(parts[2], 1);
                if (parts[2] > 0) {
                    /// Move item at previous index
                    configs.regularMenu.levels[parts[1]].buttons.splice(parts[2] - 1, 0, movedItem);
                    preselectedButtons[levelIndex] = parts[2] - 1;
                } else {
                    /// Item is first in list - move item to end

                    let lastIndex = configs.regularMenu.levels[parts[1]].buttons.length - 1;
                    let lastItem = configs.regularMenu.levels[parts[1]].buttons[lastIndex];
                    configs.regularMenu.levels[parts[1]].buttons.splice(lastIndex, 1);
                    configs.regularMenu.levels[parts[1]].buttons.splice(0, 0, lastItem);

                    configs.regularMenu.levels[parts[1]].buttons.splice(configs.regularMenu.levels[parts[1]].buttons.length, 0, movedItem);
                    preselectedButtons[levelIndex] = configs.regularMenu.levels[parts[1]].buttons.length - 1;
                }

                drawCirclePreview();
                generateButtonsControls();
                saveAllSettings();
            });
        }, delayToAddListeners);

        let moveDownButtonIdentifier = `moveDownButton-${levelIndex}-${i}`;

        var moveDownButton = document.createElement('button');
        moveDownButton.textContent = 'ᐯ';
        moveDownButton.setAttribute('style', 'max-width: 1px; padding: 1px; align-items: center');
        moveDownButton.setAttribute('id', moveDownButtonIdentifier);
        moveDownButton.setAttribute('title', chrome.i18n.getMessage("moveDownLabel"));

        setTimeout(function () {
            document.getElementById(moveDownButtonIdentifier).addEventListener("mouseup", function (e) {
                try {
                    let parts = moveDownButtonIdentifier.split('-');
                    let movedItem = configs.regularMenu.levels[parts[1]].buttons[parts[2]];
                    configs.regularMenu.levels[parts[1]].buttons.splice(parts[2], 1);

                    if (parts[2] < configs.regularMenu.levels[parts[1]].buttons.length) {
                        /// Move item at next index
                        configs.regularMenu.levels[parts[1]].buttons.splice(parseInt(parts[2]) + 1, 0, movedItem);
                        preselectedButtons[levelIndex] = parseInt(parts[2]) + 1;
                    } else {
                        /// Item is last in list - move item to start

                        let lastIndex = configs.regularMenu.levels[parts[1]].buttons.length - 1;
                        let firstItem = configs.regularMenu.levels[parts[1]].buttons[0];
                        configs.regularMenu.levels[parts[1]].buttons.splice(0, 1);
                        configs.regularMenu.levels[parts[1]].buttons.splice(lastIndex, 0, firstItem);

                        configs.regularMenu.levels[parts[1]].buttons.splice(0, 0, movedItem);
                        preselectedButtons[levelIndex] = 0;
                    }

                    drawCirclePreview();
                    generateButtonsControls();
                    saveAllSettings();

                } catch (error) {
                    console.log(error);
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
                configs.regularMenu.levels[parts[1]].buttons.splice(parts[2], 1);
                drawCirclePreview();
                generateButtonsControls();
                saveAllSettings();
            });
        }, delayToAddListeners);

        actionButtonsContainer.appendChild(moveUpButton);
        actionButtonsContainer.appendChild(moveDownButton);
        actionButtonsContainer.appendChild(deleteButton);

        entry.appendChild(actionButtonsContainer);

        /// Set on click listener for entry
        setTimeout(function () {
            document.getElementById(entryIdentifier).addEventListener('mousedown', function (e) {
                var el = document.elementFromPoint(e.clientX, e.clientY);
                console.log(`clicked on ${el.tagName}`);

                /// Prevent listener from blocking select dropdowns behavior
                if (el.tagName == 'SELECT') {
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
            configs.regularMenu.levels[addButtonId.split('-')[1]].buttons.push({
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
    let levelWidthSlider = generateRangeSlider(widthInputId, configs.regularMenu.levels[levelIndex].width ?? configs.circleRadius, function (newVal) {
        let ind = widthInputId.split('-')[1];
        configs.regularMenu.levels[ind].width = newVal;
    }, 50, 200, chrome.i18n.getMessage("levelWidth"));
    container.appendChild(levelWidthSlider);
}

function generateAddLevelButton() {
    let addLevelButton = document.createElement('div');
    addLevelButton.setAttribute('id', 'addLevelButton');
    addLevelButton.setAttribute('title', 'Add circle level');
    addLevelButton.textContent = '+';
    document.getElementById('buttons-config-container').appendChild(addLevelButton);

    addLevelButton.addEventListener('click', function () {
        configs.regularMenu.levels.push({
            'width': 60,
            'buttons': [
                { 'id': 'goForward' },
                { 'id': 'newTab' },
                { 'id': 'goBack' },
                { 'id': 'closeCurrentTab' },
            ]
        });

        drawCirclePreview();
        generateButtonsControls();
        positionSettingsInCenter();
        drawCirclePreview();
        saveAllSettings();
    });
}


function generateActionDropdownButton(id, initialValue, cbOnChange, label) {
    let selectContainer = document.createElement('div');
    selectContainer.setAttribute('style', 'display: inline');

    /// Generate label
    if (label !== null && label !== undefined && label !== '') {
        let span = document.createElement('span');
        span.textContent = label + ':  ';
        selectContainer.appendChild(span);
    }

    /// Generate dropdown button
    let select = document.createElement('select');
    select.setAttribute('id', id);
    Object.keys(actionIcons).forEach((function (key) {
        let option = document.createElement('option');
        option.innerHTML = chrome.i18n.getMessage(key);
        option.setAttribute('value', key);
        if (key == initialValue) option.setAttribute('selected', true);
        select.appendChild(option);
    }));

    setTimeout(function () {
        let listenedDropdown = document.getElementById(id);
        listenedDropdown.addEventListener("change", function (e) {
            let newValue = listenedDropdown.value;

            cbOnChange(newValue);
            // configs.regularMenu.rockerAction = newValue;
            // saveAllSettings();
        });
    }, delayToAddListeners);

    selectContainer.appendChild(select);

    return selectContainer;
}

function generateRangeSlider(id, value, callbackOnChange, min = 50, max = 200, label) {
    let updatePreviewInRealTime = false;

    /// Level width input
    let sliderContainer = document.createElement('div');
    sliderContainer.setAttribute('style', 'vertical-align: middle; align-items: center; width: 100%; margin-top: 5px;');

    let widthLabel = document.createElement('span');
    widthLabel.setAttribute('style', 'opacity: 0.5');
    widthLabel.innerHTML = (label ?? chrome.i18n.getMessage(id) ?? id) + ' ';
    sliderContainer.appendChild(widthLabel);

    let widthInput = document.createElement('input');
    let widthInputId = id;

    widthInput.setAttribute('type', 'range');
    widthInput.setAttribute('id', widthInputId);
    widthInput.setAttribute('style', 'margin-right: 5px;');
    widthInput.setAttribute('min', `${min}`);
    widthInput.setAttribute('max', `${max}`);
    widthInput.setAttribute('step', '1');
    widthInput.setAttribute('value', value);

    setTimeout(function () {
        let inp = document.getElementById(widthInputId);

        inp.addEventListener('input', function () {
            // let ind = widthInputId.split('-')[1];
            // configs.regularMenu.levels[ind].width = parseInt(inp.value);

            callbackOnChange(parseInt(inp.value));

            /// Update width indicator
            document.getElementById(widthInputId + '-indicator').innerHTML = inp.value;
            if (updatePreviewInRealTime)
                drawCirclePreview();

            saveAllSettings();
        });

        inp.addEventListener('change', function () {
            console.log(`saved value for ${id}`);
            drawCirclePreview();
            saveAllSettings();
        });
    }, delayToAddListeners);

    sliderContainer.appendChild(widthInput);

    /// Current value indicator
    let widthIndicator = document.createElement('span');
    widthIndicator.setAttribute('id', id + '-indicator');
    widthIndicator.innerHTML = value;
    sliderContainer.appendChild(widthIndicator);

    return sliderContainer;
}

function positionSettingsInCenter() {
    let circlePreviewSegment = document.getElementById('circle-preview');

    let occupiedWidth = circlePreviewSegment.clientWidth;

    let allLevelConfigs = document.querySelectorAll('.level-configs');

    allLevelConfigs.forEach(function (el) {
        occupiedWidth += el.clientWidth;
    });

    let occupiedPercent = occupiedWidth / window.screen.width * 100;

    bodyMarginLeft = (100 - occupiedPercent) / 2.5;

    // document.body.style.marginLeft = `${bodyMarginLeft}%`;
    document.body.style.transform = `translate(${bodyMarginLeft}%, 0)`;

}

document.addEventListener("DOMContentLoaded", init);