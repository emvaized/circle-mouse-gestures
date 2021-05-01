let defaultConfigs;

function init() {
    defaultConfigs = configs;

    try {
        loadUserConfigs(function (conf) {
            // loadButtons();
            drawCirclePreview('regularMenu');
            generateButtonsControls();
            generateAppearanceControls();

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

    document.getElementById('circle-preview-title').innerHTML = chrome.i18n.getMessage('circlePreview');
    document.getElementById('clickSegmentToHighlight').innerHTML = chrome.i18n.getMessage('clickSegmentToHighlight');

    totalCircleRadius = 0.0;

    if (configs.interactiveMenusBehavior == 'combine' || typeOfMenu == 'regularMenu') {
        for (var i = 0; i < configs['regularMenu'].levels.length; i++) {
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
        document.getElementById('backgroundColor').addEventListener("input", function (e) {
            let colorSelect = document.getElementById('backgroundColor');
            configs.regularMenu.color = colorSelect.value;
            drawCirclePreview();
        });
    }, 300);


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
                    console.log('current configs:');
                    console.log(configs);
                    drawCirclePreview();
                    saveAllSettings();
                    console.log(`saved value ${input.getAttribute('type') == 'checkbox' ? input.checked : input.value} for ${inputId}`);
                    console.log('configs after change:');
                    console.log(configs);
                } catch (error) {
                    console.log(error);
                }

            });
        }, 300);
    });


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
    var delayToAddListeners = 1;

    var container = document.createElement('div');
    container.setAttribute('style', 'float:left; padding: 15px; border: 1px solid lightGrey; margin-top: 15px; margin-right: 30px;');
    container.innerHTML = '';

    let title = document.createElement('span');
    title.textContent = chrome.i18n.getMessage('circleLevel') + ' ' + (levelIndex + 1).toString();
    container.appendChild(title);

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

                var movedItem = configs.regularMenu.levels[parts[1]].buttons[parts[2]];
                configs.regularMenu.levels[parts[1]].buttons.splice(parts[2], 1);
                if (parts[2] > 0) {
                    /// Move item at previous index
                    configs.regularMenu.levels[parts[1]].buttons.splice(parts[2] - 1, 0, movedItem);
                    preselectedButtons[levelIndex] = parts[2] - 1;
                } else {
                    /// Item is first in list - move to end
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
                        /// Item is last in list - move to start
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
    addButton.setAttribute('style', 'width: 100%; margin-top: 10px;');
    addButton.textContent = chrome.i18n.getMessage("addLabel") + ' ＋';
    addButton.onmouseup = function () {
        configs.regularMenu.levels[levelIndex].buttons.push({
            'id': 'noAction',
        });
        drawCirclePreview();
        generateButtonsControls();
        saveAllSettings();
    };
    container.appendChild(addButton);
}

document.addEventListener("DOMContentLoaded", init);





function generateSegmentRelatedControls() {
    let selectedButton;
    let selectedLevel;
    let anyButtonIsSelected = false;

    let keys = Object.keys(selectedButtons);

    for (var i = 0; i < keys.length; i++) {
        let key = keys[i];
        if (selectedButtons[key] !== null && selectedButtons[key] !== undefined) {
            anyButtonIsSelected = true;
            selectedButton = selectedButtons[key];
            selectedLevel = key;
            break;
        }
    }
    let placeholder = document.getElementById('circle-segment-controls');
    placeholder.innerHTML = '';
    if (anyButtonIsSelected) {
        let entry = createQuickActionsSegment(selectedLevel, selectedButton);

        placeholder.appendChild(entry);
    } else {

    }
}

function createQuickActionsSegment(levelIndex, i) {
    var item = configs.regularMenu.levels[levelIndex].buttons[i];

    var entry = document.createElement('div');
    entry.setAttribute('class', 'buttons-item');
    entry.setAttribute('style', 'align-items: end;padding-bottom: 10px;');

    /// Mini-header
    let h = document.createElement('span');
    h.setAttribute('style', 'color: grey');
    h.textContent = chrome.i18n.getMessage('quickActions') + ':';
    entry.appendChild(h);
    entry.innerHTML += '<br />';

    /// Counter
    // let numberText = document.createElement('span');
    // numberText.textContent = (i + 1).toString();
    // numberText.setAttribute('style', 'color: grey; position: relative; left: -20px; top: 0px;');
    // entry.appendChild(numberText);

    /// Button action dropdown
    let selectIdentifier = `quickActions-actionDropdown-${levelIndex}-${i}`;

    var select = document.createElement('select');
    select.setAttribute('id', selectIdentifier);
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
        document.getElementById(selectIdentifier).addEventListener("change", function (e) {
            let newValue = this.value;

            let parts = selectIdentifier.split('-');
            configs.regularMenu.levels[parts[1]].buttons[parts[2]] = { 'id': newValue };
            drawCirclePreview();
            generateButtonsControls();
            saveAllSettings();
        });
    }, 300);


    /// Delete button

    let deleteButtonIdentifier = `quickActions-deleteButton-${levelIndex}-${i}`;

    var deleteButton = document.createElement('button');
    deleteButton.textContent = chrome.i18n.getMessage("deleteLabel");
    deleteButton.setAttribute('style', 'padding: 1px; margin: 1px; align-items: center');
    deleteButton.setAttribute('id', deleteButtonIdentifier);

    setTimeout(function () {
        document.getElementById(deleteButtonIdentifier).addEventListener("mouseup", function (e) {
            let parts = deleteButtonIdentifier.split('-');
            configs.regularMenu.levels[parts[1]].buttons.splice(parts[2], 1);
            drawCirclePreview();
            generateButtonsControls();
            saveAllSettings();
        });
    }, 300);

    entry.appendChild(deleteButton);


    /// Move up/down buttons
    var actionButtonsContainer = document.createElement('div');
    actionButtonsContainer.setAttribute('style', 'padding-top: 3px;');
    // actionButtonsContainer.setAttribute('style', 'display: inline;');

    let moveUpButtonIdentifier = `quickActions-moveUpButton-${levelIndex}-${i}`;

    var moveUpButton = document.createElement('button');
    moveUpButton.textContent = '⭯ ' + chrome.i18n.getMessage("moveCounterClockwise");
    moveUpButton.setAttribute('style', ' padding: 1px; align-items: center; margin-right: 3px');
    moveUpButton.setAttribute('id', moveUpButtonIdentifier);
    moveUpButton.setAttribute('title', chrome.i18n.getMessage("moveUpLabel"));

    setTimeout(function () {
        document.getElementById(moveUpButtonIdentifier).addEventListener("mouseup", function (e) {
            let parts = moveUpButtonIdentifier.split('-');

            var movedItem = configs.regularMenu.levels[parts[1]].buttons[parts[2]];
            configs.regularMenu.levels[parts[1]].buttons.splice(parts[2], 1);
            if (parts[2] > 0) {
                configs.regularMenu.levels[parts[1]].buttons.splice(parts[2] - 1, 0, movedItem);
            } else {
                configs.regularMenu.levels[parts[1]].buttons.splice(configs.regularMenu.levels[parts[1]].buttons.length, 0, movedItem);
            }

            drawCirclePreview();
            generateButtonsControls();
            generateButtonsControls();
            saveAllSettings();
        });
    }, 300);

    let moveDownButtonIdentifier = `quickActions-moveDownButton-${levelIndex}-${i}`;

    var moveDownButton = document.createElement('button');
    moveDownButton.textContent = chrome.i18n.getMessage("moveClockwise") + ' ⭮';
    moveDownButton.setAttribute('style', 'padding: 1px;  align-items: center');
    moveDownButton.setAttribute('id', moveDownButtonIdentifier);
    moveDownButton.setAttribute('title', chrome.i18n.getMessage("moveDownLabel"));

    setTimeout(function () {
        document.getElementById(moveDownButtonIdentifier).addEventListener("mouseup", function (e) {
            let parts = moveDownButtonIdentifier.split('-');

            console.log('parts[2]');
            console.log(parts[2]);
            console.log('parts[2] + 1');
            console.log(parts[2] + 1);

            let movedItem = configs.regularMenu.levels[parts[1]].buttons[parts[2]];
            configs.regularMenu.levels[parts[1]].buttons.splice(parts[2], 1);

            if (parts[2] < configs.regularMenu.levels[parts[1]].buttons.length) {
                configs.regularMenu.levels[parts[1]].buttons.splice(parseInt(parts[2]) + 1, 0, movedItem);
            } else {
                configs.regularMenu.levels[parts[1]].buttons.splice(0, 0, movedItem);
            }


            drawCirclePreview();
            generateButtonsControls();
            saveAllSettings();
        });
    }, 300);


    actionButtonsContainer.appendChild(moveUpButton);
    actionButtonsContainer.appendChild(moveDownButton);

    entry.appendChild(actionButtonsContainer);

    entry.innerHTML += '<br />';


    // entry.innerHTML += '< br />';
    return entry;
}