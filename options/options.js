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

    let innerWidthSlider = createRangeSlider('innerWidth', configs.innerCircleRadius, function (newVal) {
        configs.innerCircleRadius = newVal;
    }, 0, 100);
    appearanceContainer.appendChild(innerWidthSlider);

    let gapBetweenLevelsSlider = createRangeSlider('gapBetweenCircles', configs.gapBetweenCircles, function (newVal) {
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
    let dropdown = createActionDropdownButton(rockerIidentifier, configs.regularMenu.rockerAction, function (newValue) {
        configs.regularMenu.rockerAction = newValue;
        saveAllSettings();
    }, chrome.i18n.getMessage('rockerAction'));
    rockerActionContainer.appendChild(dropdown);

    document.getElementById('behavior-config').appendChild(rockerActionContainer);

    /// Wheel up action dropdown
    let wheelUpdropdownContainer = document.createElement('div');
    wheelUpdropdownContainer.setAttribute('class', 'option');

    let wheelUpIidentifier = `regularWheelUpActionDropdown`;
    let wheelUpdropdown = createActionDropdownButton(wheelUpIidentifier, configs.regularMenu.mouseWheelUpAction, function (newValue) {
        configs.regularMenu.mouseWheelUpAction = newValue;
        saveAllSettings();
    }, chrome.i18n.getMessage('mouseWheelUpAction'));
    wheelUpdropdownContainer.appendChild(wheelUpdropdown);

    document.getElementById('behavior-config').appendChild(wheelUpdropdownContainer);

    /// Wheel down action dropdown
    let wheelDowndropdownContainer = document.createElement('div');
    wheelDowndropdownContainer.setAttribute('class', 'option');

    let wheelDownIidentifier = `regularWheelDownActionDropdown`;
    let wheelDowndropdown = createActionDropdownButton(wheelDownIidentifier, configs.regularMenu.mouseWheelDownAction, function (newValue) {
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
    /// Generate header
    let headerContainer = document.createElement('span');
    headerContainer.setAttribute('style', 'vertical-align: center;');

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
    title.setAttribute('style', 'font-size: 14px; margin-left: 5px; opacity: 0.7;');
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


    /// Generate level configs container
    var container = document.createElement('div');
    container.setAttribute('style', 'float:left; padding: 15px; border: 1px solid lightGrey; margin-top: 15px; margin-right: 30px;  max-width: 300px;');
    container.setAttribute('class', 'level-configs');
    container.innerHTML = '';

    if (configs.regularMenu.levels[levelIndex].enabled == false)
        container.style.opacity = 0.5;

    container.appendChild(headerContainer);
    document.getElementById('buttons-config-container').appendChild(container);

    /// Generate entries
    for (var i = 0; i < configs.regularMenu.levels[levelIndex].buttons.length; i++) {
        let item = configs.regularMenu.levels[levelIndex].buttons[i];

        let entry = document.createElement('div');
        entry.setAttribute('class', 'buttons-item');
        entry.setAttribute('style', 'padding:10px; cursor: pointer;');
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

        let actionDropdown = createActionDropdownButton(dropdownIdentifier, item.id, function (newValue) {
            let parts = dropdownIdentifier.split('-');
            configs.regularMenu.levels[parts[1]].buttons[parts[2]] = { 'id': newValue };
            drawCirclePreview();
            generateButtonsControls();
            saveAllSettings();
        });
        entry.appendChild(actionDropdown);

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

    /// Generate entries approach with splitting too long columns in halfs

    // let maxButtonsInColumn = 5;
    // var splittedButtons = chunk(configs.regularMenu.levels[levelIndex].buttons, maxButtonsInColumn);

    // for (var i2 = 0; i2 < splittedButtons.length; i2++) {

    //     let buttonsChunkContainer = document.createElement('div');
    //     buttonsChunkContainer.setAttribute('style', 'float: left;');
    //     container.appendChild(buttonsChunkContainer);

    //     /// Generate entries
    //     for (var i = 0; i < splittedButtons[i2].length; i++) {
    //         let item = splittedButtons[i2][i];

    //         let entry = document.createElement('div');
    //         entry.setAttribute('class', 'buttons-item');
    //         entry.setAttribute('style', 'padding:10px; cursor: pointer;');
    //         let entryIdentifier = `buttonConfigEntry-${levelIndex}-${i}`;
    //         entry.setAttribute('id', entryIdentifier);

    //         /// Highlight the button when segment was selected by mouse
    //         if (selectedButtons[levelIndex] == i || preselectedButtons[levelIndex] == i)
    //             entry.style.background = 'lightGrey';

    //         /// Counter
    //         let numberText = document.createElement('span');
    //         numberText.textContent = (i + 1).toString();
    //         numberText.setAttribute('style', 'color: grey; position: relative; left: -20px; top: 0px;');
    //         entry.appendChild(numberText);

    //         /// Button action dropdown
    //         let dropdownIdentifier = `actionDropdown-${levelIndex}-${i}`;

    //         let actionDropdown = createActionDropdownButton(dropdownIdentifier, item.id, function (newValue) {
    //             let parts = dropdownIdentifier.split('-');
    //             configs.regularMenu.levels[parts[1]].buttons[parts[2]] = { 'id': newValue };
    //             drawCirclePreview();
    //             generateButtonsControls();
    //             saveAllSettings();
    //         });
    //         entry.appendChild(actionDropdown);

    //         entry.innerHTML += '<br />';

    //         /// Move up/down buttons
    //         var actionButtonsContainer = document.createElement('div');
    //         actionButtonsContainer.setAttribute('style', 'position: relative; right: -7px; padding-top: 3px ');

    //         let moveUpButtonIdentifier = `moveUpButton-${levelIndex}-${i}`;
    //         var moveUpButton = document.createElement('button');
    //         moveUpButton.textContent = 'ᐱ';
    //         moveUpButton.setAttribute('style', 'max-width: 1px; padding: 1px; align-items: center');
    //         moveUpButton.setAttribute('id', moveUpButtonIdentifier);
    //         moveUpButton.setAttribute('title', chrome.i18n.getMessage("moveUpLabel"));

    //         setTimeout(function () {
    //             document.getElementById(moveUpButtonIdentifier).addEventListener("mouseup", function (e) {
    //                 let parts = moveUpButtonIdentifier.split('-');

    //                 let movedItem = configs.regularMenu.levels[parts[1]].buttons[parts[2]];
    //                 configs.regularMenu.levels[parts[1]].buttons.splice(parts[2], 1);
    //                 if (parts[2] > 0) {
    //                     /// Move item at previous index
    //                     configs.regularMenu.levels[parts[1]].buttons.splice(parts[2] - 1, 0, movedItem);
    //                     preselectedButtons[levelIndex] = parts[2] - 1;
    //                 } else {
    //                     /// Item is first in list - move item to end

    //                     let lastIndex = configs.regularMenu.levels[parts[1]].buttons.length - 1;
    //                     let lastItem = configs.regularMenu.levels[parts[1]].buttons[lastIndex];
    //                     configs.regularMenu.levels[parts[1]].buttons.splice(lastIndex, 1);
    //                     configs.regularMenu.levels[parts[1]].buttons.splice(0, 0, lastItem);

    //                     configs.regularMenu.levels[parts[1]].buttons.splice(configs.regularMenu.levels[parts[1]].buttons.length, 0, movedItem);
    //                     preselectedButtons[levelIndex] = configs.regularMenu.levels[parts[1]].buttons.length - 1;
    //                 }

    //                 drawCirclePreview();
    //                 generateButtonsControls();
    //                 saveAllSettings();
    //             });
    //         }, delayToAddListeners);

    //         let moveDownButtonIdentifier = `moveDownButton-${levelIndex}-${i}`;

    //         var moveDownButton = document.createElement('button');
    //         moveDownButton.textContent = 'ᐯ';
    //         moveDownButton.setAttribute('style', 'max-width: 1px; padding: 1px; align-items: center');
    //         moveDownButton.setAttribute('id', moveDownButtonIdentifier);
    //         moveDownButton.setAttribute('title', chrome.i18n.getMessage("moveDownLabel"));

    //         setTimeout(function () {
    //             document.getElementById(moveDownButtonIdentifier).addEventListener("mouseup", function (e) {
    //                 try {
    //                     let parts = moveDownButtonIdentifier.split('-');
    //                     let movedItem = configs.regularMenu.levels[parts[1]].buttons[parts[2]];
    //                     configs.regularMenu.levels[parts[1]].buttons.splice(parts[2], 1);

    //                     if (parts[2] < configs.regularMenu.levels[parts[1]].buttons.length) {
    //                         /// Move item at next index
    //                         configs.regularMenu.levels[parts[1]].buttons.splice(parseInt(parts[2]) + 1, 0, movedItem);
    //                         preselectedButtons[levelIndex] = parseInt(parts[2]) + 1;
    //                     } else {
    //                         /// Item is last in list - move item to start

    //                         let lastIndex = configs.regularMenu.levels[parts[1]].buttons.length - 1;
    //                         let firstItem = configs.regularMenu.levels[parts[1]].buttons[0];
    //                         configs.regularMenu.levels[parts[1]].buttons.splice(0, 1);
    //                         configs.regularMenu.levels[parts[1]].buttons.splice(lastIndex, 0, firstItem);

    //                         configs.regularMenu.levels[parts[1]].buttons.splice(0, 0, movedItem);
    //                         preselectedButtons[levelIndex] = 0;
    //                     }

    //                     drawCirclePreview();
    //                     generateButtonsControls();
    //                     saveAllSettings();

    //                 } catch (error) {
    //                     console.log(error);
    //                 }
    //             });
    //         }, delayToAddListeners);


    //         /// Delete button
    //         let deleteButtonIdentifier = `deleteButton-${levelIndex}-${i}`;

    //         var deleteButton = document.createElement('button');
    //         deleteButton.textContent = chrome.i18n.getMessage("deleteLabel");
    //         deleteButton.setAttribute('style', 'display: inline-block; max-width: 100px;');
    //         deleteButton.setAttribute('id', deleteButtonIdentifier);

    //         setTimeout(function () {
    //             document.getElementById(deleteButtonIdentifier).addEventListener("mouseup", function (e) {
    //                 let parts = deleteButtonIdentifier.split('-');
    //                 configs.regularMenu.levels[parts[1]].buttons.splice(parts[2], 1);
    //                 drawCirclePreview();
    //                 generateButtonsControls();
    //                 saveAllSettings();
    //             });
    //         }, delayToAddListeners);

    //         actionButtonsContainer.appendChild(moveUpButton);
    //         actionButtonsContainer.appendChild(moveDownButton);
    //         actionButtonsContainer.appendChild(deleteButton);

    //         entry.appendChild(actionButtonsContainer);

    //         /// Set on click listener for entry
    //         setTimeout(function () {
    //             document.getElementById(entryIdentifier).addEventListener('mousedown', function (e) {
    //                 var el = document.elementFromPoint(e.clientX, e.clientY);
    //                 console.log(`clicked on ${el.tagName}`);

    //                 /// Prevent listener from blocking select dropdowns behavior
    //                 if (el.tagName == 'SELECT') {
    //                     return;
    //                 }

    //                 selectedButtons = {};
    //                 preselectedButtons = {};

    //                 let parts = deleteButtonIdentifier.split('-');
    //                 preselectedButtons[parts[1]] = parts[2];

    //                 drawCirclePreview();
    //                 generateButtonsControls();
    //             });
    //         }, delayToAddListeners / 2);

    //         buttonsChunkContainer.appendChild(entry);
    //     }
    // }

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
    let levelWidthSlider = createRangeSlider(widthInputId, configs.regularMenu.levels[levelIndex].width ?? configs.circleRadius, function (newVal) {
        let ind = widthInputId.split('-')[1];
        configs.regularMenu.levels[ind].width = newVal;
    }, 50, 200, chrome.i18n.getMessage("levelWidth"));
    container.appendChild(levelWidthSlider);

    container.innerHTML += '<br />';

    /// 'Use custom color' switch
    var customColorContainer = document.createElement('div');
    customColorContainer.setAttribute('class', 'option');

    let useCustomColorSwitch = document.createElement('input');
    let useCustomColorSwitchId = 'useCustomColorSwitch-' + levelIndex.toString();
    useCustomColorSwitch.setAttribute('type', 'checkbox');
    useCustomColorSwitch.setAttribute('id', useCustomColorSwitchId);

    let selectedColor = configs.regularMenu.levels[levelIndex].color;
    let switched = selectedColor == null || selectedColor == undefined;
    if (switched == false)
        useCustomColorSwitch.setAttribute('checked', 0);

    let label = document.createElement('label');
    // label.setAttribute('class', 'option');

    label.appendChild(useCustomColorSwitch);

    setTimeout(function () {
        let useCustomColorSwitch = document.getElementById(useCustomColorSwitchId);

        useCustomColorSwitch.parentNode.addEventListener('change', function (e) {

            console.log('clicked!')

            let selectedColor = configs.regularMenu.levels[levelIndex].color;

            if (selectedColor !== null && selectedColor !== undefined) {
                configs.regularMenu.levels[levelIndex].color = null;
                drawCirclePreview();
            } else {
                configs.regularMenu.levels[levelIndex].color = configs.regularMenu.color;
            }

            saveAllSettings();
            generateButtonsControls();
        });
    }, 1);

    label.innerHTML += ' ' + chrome.i18n.getMessage("useCustomColor");
    // container.appendChild(label);

    customColorContainer.appendChild(label);

    if (selectedColor !== null && selectedColor !== undefined) {
        /// Custom icon URL field
        let customColorInput = document.createElement('input');
        let customColorInputId = `customColorInput-${levelIndex}`;
        customColorInput.setAttribute('type', 'color');
        customColorInput.setAttribute('style', 'float: right; transform: translate(0, -5px)');
        customColorInput.setAttribute('id', customColorInputId);
        customColorInput.value = selectedColor;

        setTimeout(function () {
            let customColorInput = document.getElementById(customColorInputId);
            customColorInput.addEventListener("input", function (e) {
                let ind = customColorInputId.split('-')[1];
                configs.regularMenu.levels[ind].color = customColorInput.value;
                drawCirclePreview();
            });

            customColorInput.addEventListener("change", function (e) {
                console.log('saved custom color for level ' + levelIndex.toString());
                saveAllSettings();
            });
        }, delayToAddListeners);

        customColorContainer.appendChild(customColorInput);
    }

    container.appendChild(customColorContainer);


    /// Custom color chooser
    // if (selectedColor !== null && selectedColor !== undefined) {
    //     var customColorInputContainer = document.createElement('div');
    //     customColorInputContainer.setAttribute('class', 'option');
    //     customColorInputContainer.setAttribute('style', 'margin-top: 3px;');

    //     let customColorLabel = document.createElement('span');
    //     customColorLabel.setAttribute('style', 'display: inline;opacity: 0.5;');
    //     customColorLabel.textContent = chrome.i18n.getMessage("colorLabel") + ' ';
    //     customColorInputContainer.appendChild(customColorLabel);

    //     /// Custom icon URL field
    //     var customColorInput = document.createElement('input');
    //     let customColorInputId = `customColorInput-${levelIndex}`;
    //     customColorInput.setAttribute('type', 'color');
    //     customColorInput.setAttribute('id', customColorInputId);
    //     customColorInput.value = selectedColor;

    //     setTimeout(function () {
    //         let customColorInput = document.getElementById(customColorInputId);
    //         customColorInput.addEventListener("input", function (e) {
    //             let ind = customColorInputId.split('-')[1];
    //             configs.regularMenu.levels[ind].color = customColorInput.value;
    //             drawCirclePreview();
    //         });

    //         customColorInput.addEventListener("change", function (e) {
    //             console.log('saved custom color for level ' + levelIndex.toString());
    //             saveAllSettings();
    //         });
    //     }, delayToAddListeners);


    //     customColorInputContainer.appendChild(customColorInput);

    //     container.innerHTML += '<br />';
    //     container.appendChild(customColorInputContainer);
    // }
}

function generateAddLevelButton() {

    if (configs.regularMenu.levels.length == 4) return;

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


/// Service functions

function createActionDropdownButton(id, initialValue, cbOnChange, label) {
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

    /// Generate sorted options
    Object.keys(sortedRegularMenuButtons).forEach(function (key) {
        let optGroup = document.createElement('optgroup');
        optGroup.setAttribute('label', key == '—' ? key : chrome.i18n.getMessage(key + 'CategoryLabel'));

        let items = sortedRegularMenuButtons[key];
        items.forEach(function (item) {
            let option = document.createElement('option');
            option.innerHTML = chrome.i18n.getMessage(item);
            option.setAttribute('value', item);
            if (item == initialValue) option.setAttribute('selected', true);
            optGroup.appendChild(option);
        });

        select.appendChild(optGroup);
    })

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

function createRangeSlider(id, value, callbackOnChange, min = 50, max = 200, label) {
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

    if (allLevelConfigs.length > 3)
        // allLevelConfigs = [allLevelConfigs[0], allLevelConfigs[1], allLevelConfigs[2],];
        allLevelConfigs.splice(3, 1);


    allLevelConfigs.forEach(function (el) {
        occupiedWidth += el.clientWidth;
    });

    let occupiedPercent = occupiedWidth / window.screen.width * 100;

    bodyMarginLeft = (100 - occupiedPercent) / 2.5;

    document.getElementById('content').style.marginLeft = `${bodyMarginLeft}%`;
    // document.body.style.marginLeft = `${bodyMarginLeft}%`;
    // document.body.style.transform = `translate(${bodyMarginLeft}%, 0)`;

}



function chunk(arr, len) {
    var chunks = [],
        i = 0,
        n = arr.length;

    while (i < n) {
        chunks.push(arr.slice(i, i += len));
    }

    return chunks;
}


document.addEventListener("DOMContentLoaded", init);