
function init() {
    try {
        loadUserConfigs(function (conf) {
            // loadButtons();
            drawCirclePreview('regularMenu');
            generateButtonsControls();
        })
    } catch (e) { console.log(e); }


}

function loadButtons() {
    chrome.storage.local.get(['configs.regularMenu.levels'], function (value) {
        configs.regularMenu.levels = value.configs.regularMenu.levels ?? [
            'goForward',
            'newTab',
            'goBack',
            'closeCurrentTab',
        ];

        drawCirclePreview('regularMenu');
        generateButtonsControls();
    });
}


function drawCirclePreview(typeOfMenu = 'regularMenu') {

    document.getElementById('circle-preview-title').innerHTML = chrome.i18n.getMessage('circlePreview');

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
    circle.setAttribute('style', `float:left;`);
    ctx = circle.getContext('2d');


    leftCoord = circle.clientLeft;
    topCoord = circle.clientTop;

    // circle.addEventListener('mousemove', function (e) {
    //     drawCircle(e, 'regularMenu');
    // })
    drawCircle(false, 'regularMenu');
}

function generateButtonsControls() {
    document.getElementById('buttons-config-container').innerHTML = '';

    for (var i = 0; i < configs.regularMenu.levels.length; i++) {
        generateButtonsList(i);
    }
}

function generateButtonsList(levelIndex = 0) {
    var container = document.createElement('div');
    container.setAttribute('style', 'float:left; padding: 15px; border: 1px solid lightGrey; margin: 20px;');
    container.innerHTML = '';

    let title = document.createElement('span');
    title.textContent = chrome.i18n.getMessage('circleLevel') + ' ' + (levelIndex + 1).toString();
    container.appendChild(title);

    document.getElementById('buttons-config-container').appendChild(container);

    for (var i = 0; i < configs.regularMenu.levels[levelIndex].buttons.length; i++) {
        var item = configs.regularMenu.levels[levelIndex].buttons[i];

        var entry = document.createElement('div');
        entry.setAttribute('class', 'buttons-item');
        entry.setAttribute('style', 'align-items: end;padding-bottom: 10px;');

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
        }, 300);

        entry.innerHTML += '<br />';

        /// Move up/down buttons
        var actionButtonsContainer = document.createElement('div');
        actionButtonsContainer.setAttribute('style', 'float: right; padding-top: 5px;');

        let moveUpButtonIdentifier = `moveUpButton-${levelIndex}-${i}`;
        var moveUpButton = document.createElement('button');
        moveUpButton.textContent = 'ᐱ';
        moveUpButton.setAttribute('style', 'max-width: 1px; padding: 1px; align-items: center');
        moveUpButton.setAttribute('id', moveUpButtonIdentifier);
        moveUpButton.setAttribute('title', chrome.i18n.getMessage("moveUpLabel"));

        setTimeout(function () {
            document.getElementById(moveUpButtonIdentifier).addEventListener("mouseup", function (e) {
                let parts = moveUpButtonIdentifier.split('-');
                if (parts[2] > 0) {
                    var movedItem = configs.regularMenu.levels[parts[1]].buttons[parts[2]];
                    configs.regularMenu.levels[parts[1]].buttons.splice(parts[2], 1);
                    configs.regularMenu.levels[parts[1]].buttons.splice(parts[2] - 1, 0, movedItem);

                    drawCirclePreview();
                    generateButtonsControls();
                    saveAllSettings();
                }

            });
        }, 300);

        let moveDownButtonIdentifier = `moveDownButton-${levelIndex}-${i}`;

        var moveDownButton = document.createElement('button');
        moveDownButton.textContent = 'ᐯ';
        moveDownButton.setAttribute('style', 'max-width: 1px; padding: 1px; align-items: center');
        moveDownButton.setAttribute('id', moveDownButtonIdentifier);
        moveDownButton.setAttribute('title', chrome.i18n.getMessage("moveDownLabel"));

        setTimeout(function () {
            document.getElementById(moveDownButtonIdentifier).addEventListener("mouseup", function (e) {
                let parts = moveDownButtonIdentifier.split('-');
                if (parts[2] < configs.regularMenu.levels[parts[1]].buttons.length) {

                    console.log('parts[2]');
                    console.log(parts[2]);
                    console.log('parts[2] + 1');
                    console.log(parts[2] + 1);

                    let movedItem = configs.regularMenu.levels[parts[1]].buttons[parts[2]];
                    configs.regularMenu.levels[parts[1]].buttons.splice(parts[2], 1);
                    configs.regularMenu.levels[parts[1]].buttons.splice(parseInt(parts[2]) + 1, 0, movedItem);

                    drawCirclePreview();
                    generateButtonsControls();
                    saveAllSettings();
                }
            });
        }, 300);


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
        }, 300);


        actionButtonsContainer.appendChild(moveUpButton);
        actionButtonsContainer.appendChild(moveDownButton);
        actionButtonsContainer.appendChild(deleteButton);

        entry.appendChild(actionButtonsContainer);

        entry.innerHTML += '<br />';


        // entry.innerHTML += '< br />';
        container.appendChild(entry);
    }

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


    /// Dropdown new button
    // var select = document.createElement('select');
    // select.setAttribute('id', 'addNewButton');
    // select.innerHTML = chrome.i18n.getMessage('addNewButton') + '<br />' + select.innerHTML;
    // document.body.appendChild(select);

    // Object.keys(actionIcons).forEach((function (key) {
    //     let option = document.createElement('option');
    //     option.innerHTML = chrome.i18n.getMessage(key);
    //     option.setAttribute('value', key);
    //     select.appendChild(option);
    // }));

    // select.parentNode.innerHTML = chrome.i18n.getMessage('convertToCurrency') + '<br />' + select.parentNode.innerHTML;

    // setTimeout(function () {
    //     document.getElementById('addNewButton').addEventListener("input", function (e) {
    //         // var selectInput = document.getElementById('addNewButton');
    //         configs.regularMenu.levels.push(e.value);
    //         // chrome.storage.local.set({ 'convertToCurrency': selectInput.value.split(' — ')[0] });
    //     });
    // }, 300);
}


document.addEventListener("DOMContentLoaded", init);

// document.addEventListener('mousemove', function (e) { drawCirclesOnCanvas(e); });