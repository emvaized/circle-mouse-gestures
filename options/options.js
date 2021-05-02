let defaultConfigs;
var delayToAddListeners = 1;

function init() {
    defaultConfigs = configs;

    try {
        loadUserConfigs(function (conf) {
            // loadButtons();
            drawCirclePreview('regularMenu');
            generateButtonsControls();
            generateAppearanceControls();
            generateBehaviorConfigs();

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
}


function generateRangeSlider(id, value, callbackOnChange, min = 50, max = 200) {
    /// Level width input
    let sliderContainer = document.createElement('div');
    sliderContainer.setAttribute('style', 'vertical-align: middle; align-items: center; width: 100%; margin-top: 5px;');

    let widthLabel = document.createElement('span');
    widthLabel.setAttribute('style', 'opacity: 0.5');
    widthLabel.innerHTML = (chrome.i18n.getMessage(id) ?? id) + ' ';
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

            drawCirclePreview();
            /// Update width indicator
            document.getElementById(widthInputId + '-indicator').innerHTML = inp.value;
            saveAllSettings();
        });

        inp.addEventListener('change', function () {
            console.log(`saved value for ${id}`)
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


/// Buttons configs
function generateButtonsControls() {
    document.getElementById('buttons-config-container').innerHTML = '';

    let buttonsHeader = document.createElement('span');
    buttonsHeader.innerHTML = chrome.i18n.getMessage('buttonsHeader') + '<br />';
    // buttonsHeader.setAttribute('style', 'float: bottom');
    buttonsHeader.setAttribute('class', 'header');
    document.getElementById('buttons-config-container').appendChild(buttonsHeader);

    for (var i = 0; i < configs.regularMenu.levels.length; i++) {
        generateButtonsList(i);
    }
}

function generateButtonsList(levelIndex = 0) {
    var container = document.createElement('div');
    container.setAttribute('style', 'float:left; padding: 15px; border: 1px solid lightGrey; margin-top: 15px; margin-right: 30px;');
    container.innerHTML = '';

    if (configs.regularMenu.levels[levelIndex].enabled == false)
        container.style.opacity = 0.5;


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
    // container.appendChild(title);

    headerContainer.appendChild(title);
    container.appendChild(headerContainer);

    document.getElementById('buttons-config-container').appendChild(container);

    for (var i = 0; i < configs.regularMenu.levels[levelIndex].buttons.length; i++) {
        var item = configs.regularMenu.levels[levelIndex].buttons[i];

        var entry = document.createElement('div');
        entry.setAttribute('class', 'buttons-item');
        // entry.setAttribute('style', 'align-items: end;padding-bottom: 10px;');
        entry.setAttribute('style', 'padding:10px;');
        let entryIdentifier = `buttonConfigEntry-${levelIndex}-${i}`;
        entry.setAttribute('id', entryIdentifier);

        /// Highlight the button when segment was selected by mouse
        // if (preselectedButtons[levelIndex] == i)
        if (selectedButtons[levelIndex] == i || preselectedButtons[levelIndex] == i)
            entry.style.background = 'lightGrey';

        /// Counter
        let numberText = document.createElement('span');
        numberText.textContent = (i + 1).toString();
        numberText.setAttribute('style', 'color: grey; position: relative; left: -20px; top: 0px;');
        entry.appendChild(numberText);

        /// Button action dropdown
        let identifier = `actionDropdown-${levelIndex}-${i}`;

        var select = document.createElement('select');
        select.setAttribute('id', identifier);
        Object.keys(actionIcons).forEach((function (key) {
            let option = document.createElement('option');
            option.innerHTML = chrome.i18n.getMessage(key);
            option.setAttribute('value', key);
            if (key == item.id) option.setAttribute('selected', true);
            select.appendChild(option);
        }));

        entry.appendChild(select);

        /// Set dropdown listener
        setTimeout(function () {
            document.getElementById(identifier).addEventListener("change", function (e) {
                let newValue = this.value;

                let parts = identifier.split('-');
                configs.regularMenu.levels[parts[1]].buttons[parts[2]] = { 'id': newValue };
                drawCirclePreview();
                generateButtonsControls();
                saveAllSettings();
            });
        }, delayToAddListeners);

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
    let widthContainer = document.createElement('div');
    widthContainer.setAttribute('style', 'vertical-align: middle; align-items: center; width: 100%; margin-top: 5px;');

    let widthLabel = document.createElement('span');
    widthLabel.setAttribute('style', 'opacity: 0.5');
    widthLabel.innerHTML = chrome.i18n.getMessage("levelWidth") + ' ';
    widthContainer.appendChild(widthLabel);

    let widthInput = document.createElement('input');
    let widthInputId = `widthInput-${levelIndex}`;

    widthInput.setAttribute('type', 'range');
    widthInput.setAttribute('id', widthInputId);
    widthInput.setAttribute('style', 'margin-right: 5px;');
    widthInput.setAttribute('min', '50');
    widthInput.setAttribute('max', '200');
    widthInput.setAttribute('step', '1');
    widthInput.setAttribute('value', configs.regularMenu.levels[levelIndex].width ?? configs.circleRadius);

    setTimeout(function () {
        let inp = document.getElementById(widthInputId);

        inp.addEventListener('input', function () {
            let ind = widthInputId.split('-')[1];
            configs.regularMenu.levels[ind].width = parseInt(inp.value);

            drawCirclePreview();
            /// Update width indicator
            document.getElementById(`widthIndicator-${levelIndex}`).innerHTML = inp.value;
            // generateButtonsControls();
            saveAllSettings();
        });

        inp.addEventListener('change', function () {
            saveAllSettings();
        });
    }, delayToAddListeners);

    widthContainer.appendChild(widthInput);

    /// Current value indicator
    let widthIndicator = document.createElement('span');
    widthIndicator.setAttribute('id', `widthIndicator-${levelIndex}`);
    widthIndicator.innerHTML = widthInput.value;
    widthContainer.appendChild(widthIndicator);

    container.appendChild(widthContainer);
}

document.addEventListener("DOMContentLoaded", init);





// function generateSegmentRelatedControls() {
//     let selectedButton;
//     let selectedLevel;
//     let anyButtonIsSelected = false;

//     let keys = Object.keys(selectedButtons);

//     for (var i = 0; i < keys.length; i++) {
//         let key = keys[i];
//         if (selectedButtons[key] !== null && selectedButtons[key] !== undefined) {
//             anyButtonIsSelected = true;
//             selectedButton = selectedButtons[key];
//             selectedLevel = key;
//             break;
//         }
//     }
//     let placeholder = document.getElementById('circle-segment-controls');
//     placeholder.innerHTML = '';
//     if (anyButtonIsSelected) {
//         let entry = createQuickActionsSegment(selectedLevel, selectedButton);

//         placeholder.appendChild(entry);
//     } else {

//     }
// }

// function createQuickActionsSegment(levelIndex, i) {
//     var item = configs.regularMenu.levels[levelIndex].buttons[i];

//     var entry = document.createElement('div');
//     entry.setAttribute('class', 'buttons-item');
//     entry.setAttribute('style', 'align-items: end;padding-bottom: 10px;');

//     /// Mini-header
//     let h = document.createElement('span');
//     h.setAttribute('style', 'color: grey');
//     h.textContent = chrome.i18n.getMessage('quickActions') + ':';
//     entry.appendChild(h);
//     entry.innerHTML += '<br />';

//     /// Counter
//     // let numberText = document.createElement('span');
//     // numberText.textContent = (i + 1).toString();
//     // numberText.setAttribute('style', 'color: grey; position: relative; left: -20px; top: 0px;');
//     // entry.appendChild(numberText);

//     /// Button action dropdown
//     let selectIdentifier = `quickActions-actionDropdown-${levelIndex}-${i}`;

//     var select = document.createElement('select');
//     select.setAttribute('id', selectIdentifier);
//     Object.keys(actionIcons).forEach((function (key) {
//         let option = document.createElement('option');
//         option.innerHTML = chrome.i18n.getMessage(key);
//         option.setAttribute('value', key);
//         if (key == item.id) option.setAttribute('selected', true);
//         select.appendChild(option);
//     }));

//     entry.appendChild(select);

//     /// Set dropdown listener
//     setTimeout(function () {
//         document.getElementById(selectIdentifier).addEventListener("change", function (e) {
//             let newValue = this.value;

//             let parts = selectIdentifier.split('-');
//             configs.regularMenu.levels[parts[1]].buttons[parts[2]] = { 'id': newValue };
//             drawCirclePreview();
//             generateButtonsControls();
//             saveAllSettings();
//         });
//     }, 300);


//     /// Delete button
//     var deleteButton = document.createElement('button');
//     let deleteButtonIdentifier = `quickActions-deleteButton-${levelIndex}-${i}`;

//     deleteButton.textContent = chrome.i18n.getMessage("deleteLabel");
//     deleteButton.setAttribute('style', 'padding: 1px; margin: 1px; align-items: center');
//     deleteButton.setAttribute('id', deleteButtonIdentifier);

//     setTimeout(function () {
//         document.getElementById(deleteButtonIdentifier).addEventListener("mouseup", function (e) {
//             let parts = deleteButtonIdentifier.split('-');
//             configs.regularMenu.levels[parts[1]].buttons.splice(parts[2], 1);
//             drawCirclePreview();
//             generateButtonsControls();
//             saveAllSettings();
//         });
//     }, 300);

//     entry.appendChild(deleteButton);


//     /// Move up/down buttons
//     var actionButtonsContainer = document.createElement('div');
//     actionButtonsContainer.setAttribute('style', 'padding-top: 3px;');

//     let moveUpButtonIdentifier = `quickActions-moveUpButton-${levelIndex}-${i}`;
//     var moveUpButton = document.createElement('button');
//     moveUpButton.textContent = '⭯ ' + chrome.i18n.getMessage("moveCounterClockwise");
//     moveUpButton.setAttribute('style', ' padding: 1px; align-items: center; margin-right: 3px');
//     moveUpButton.setAttribute('id', moveUpButtonIdentifier);
//     moveUpButton.setAttribute('title', chrome.i18n.getMessage("moveUpLabel"));

//     setTimeout(function () {
//         document.getElementById(moveUpButtonIdentifier).addEventListener("mouseup", function (e) {
//             let parts = moveUpButtonIdentifier.split('-');

//             var movedItem = configs.regularMenu.levels[parts[1]].buttons[parts[2]];
//             configs.regularMenu.levels[parts[1]].buttons.splice(parts[2], 1);
//             if (parts[2] > 0) {
//                 configs.regularMenu.levels[parts[1]].buttons.splice(parts[2] - 1, 0, movedItem);
//             } else {
//                 configs.regularMenu.levels[parts[1]].buttons.splice(configs.regularMenu.levels[parts[1]].buttons.length, 0, movedItem);
//             }

//             drawCirclePreview();
//             generateButtonsControls();
//             generateButtonsControls();
//             saveAllSettings();
//         });
//     }, 300);

//     let moveDownButtonIdentifier = `quickActions-moveDownButton-${levelIndex}-${i}`;

//     var moveDownButton = document.createElement('button');
//     moveDownButton.textContent = chrome.i18n.getMessage("moveClockwise") + ' ⭮';
//     moveDownButton.setAttribute('style', 'padding: 1px;  align-items: center');
//     moveDownButton.setAttribute('id', moveDownButtonIdentifier);
//     moveDownButton.setAttribute('title', chrome.i18n.getMessage("moveDownLabel"));

//     setTimeout(function () {
//         document.getElementById(moveDownButtonIdentifier).addEventListener("mouseup", function (e) {
//             let parts = moveDownButtonIdentifier.split('-');

//             console.log('parts[2]');
//             console.log(parts[2]);
//             console.log('parts[2] + 1');
//             console.log(parts[2] + 1);

//             let movedItem = configs.regularMenu.levels[parts[1]].buttons[parts[2]];
//             configs.regularMenu.levels[parts[1]].buttons.splice(parts[2], 1);

//             if (parts[2] < configs.regularMenu.levels[parts[1]].buttons.length) {
//                 configs.regularMenu.levels[parts[1]].buttons.splice(parseInt(parts[2]) + 1, 0, movedItem);
//             } else {
//                 configs.regularMenu.levels[parts[1]].buttons.splice(0, 0, movedItem);
//             }


//             drawCirclePreview();
//             generateButtonsControls();
//             saveAllSettings();
//         });
//     }, 300);


//     actionButtonsContainer.appendChild(moveUpButton);
//     actionButtonsContainer.appendChild(moveDownButton);

//     entry.appendChild(actionButtonsContainer);

//     entry.innerHTML += '<br />';
//     return entry;
// }