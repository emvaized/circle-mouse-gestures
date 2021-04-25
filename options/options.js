var regularMenuButtons;

function init() {
    loadButtons();
}

function loadButtons() {
    chrome.storage.local.get(['regularMenuButtons'], function (value) {
        regularMenuButtons = value.regularMenuButtons ?? [
            'goForward',
            'newTab',
            'goBack',
            'closeCurrentTab',
        ];

        drawCirclePreview();
        generateButtonsList();
    });
}

function drawCirclePreview() {
    let circle = document.getElementById('circle-preview');
    canvasRadius = (addSecondLevel && typeOfMenu == 'regular-menu' ? secondCircleRadius * 2 : firstCircleRadius * 2) + (addCircleOutlines ? 2 : 0);
    circle.setAttribute('width', `${canvasRadius}px !imporant`);
    circle.setAttribute('height', `${canvasRadius}px !imporant`);
    ctx = circle.getContext('2d');
    drawCirclesOnCanvas(false, true);
}

function generateButtonsList() {
    var container = document.getElementById('buttons-config-container');
    container.innerHTML = '';

    for (var i = 0; i < regularMenuButtons.length; i++) {
        var item = regularMenuButtons[i];

        var entry = document.createElement('div');
        entry.setAttribute('class', 'buttons-item');

        /// Counter
        let numberText = document.createElement('span');
        numberText.textContent = i.toString();
        numberText.setAttribute('style', 'color: grey; position: relative; left: -20px; top: 0px;');
        entry.appendChild(numberText);

        /// Button action dropdown
        var select = document.createElement('select');
        // select.setAttribute('id', 'addNewButton');
        Object.keys(actionIcons).forEach((function (key) {
            let option = document.createElement('option');
            option.innerHTML = chrome.i18n.getMessage(key);
            option.setAttribute('value', key);
            if (key == item) option.setAttribute('selected', true);
            select.appendChild(option);
        }));

        entry.appendChild(select);

        entry.innerHTML += '<br />';

        /// Move up/down buttons
        var moveButtonsContainer = document.createElement('div');
        moveButtonsContainer.setAttribute('style', 'display: inline');

        var moveUpButton = document.createElement('button');
        moveUpButton.textContent = 'ᐱ';
        moveUpButton.setAttribute('style', 'max-width: 1px; padding: 1px; align-items: center');
        moveUpButton.setAttribute('id', 'moveup' + i.toString());
        moveUpButton.setAttribute('title', chrome.i18n.getMessage("moveUpLabel"));
        moveUpButton.onmouseup = function () {
            var currentIndex = parseInt(this.id.replaceAll('moveup', ''), 10);
            if (currentIndex > 0) {
                var movedItem = regularMenuButtons[currentIndex];
                regularMenuButtons.splice(currentIndex, 1);
                regularMenuButtons.splice(currentIndex - 1, 0, movedItem);
                saveCustomSearchButtons();
                generateButtonsList();
            }
        };

        var moveDownButton = document.createElement('button');
        moveDownButton.textContent = 'ᐯ';
        moveDownButton.setAttribute('style', 'max-width: 1px; padding: 1px; align-items: center');
        moveDownButton.setAttribute('id', 'movedown' + i.toString());
        moveDownButton.setAttribute('title', chrome.i18n.getMessage("moveDownLabel"));
        moveDownButton.onmouseup = function () {
            var currentIndex = parseInt(this.id.replaceAll('movedown', ''), 10);
            if (currentIndex < regularMenuButtons.length) {
                let movedItem = regularMenuButtons[currentIndex];
                regularMenuButtons.splice(currentIndex, 1);
                regularMenuButtons.splice(currentIndex + 1, 0, movedItem);
                saveCustomSearchButtons();
                generateButtonsList();
            }
        };
        moveButtonsContainer.appendChild(moveUpButton);
        moveButtonsContainer.appendChild(moveDownButton);
        entry.appendChild(moveButtonsContainer);


        /// Delete button
        var deleteButton = document.createElement('button');
        deleteButton.textContent = chrome.i18n.getMessage("deleteLabel");
        deleteButton.setAttribute('style', 'display: inline-block; max-width: 100px;');
        deleteButton.setAttribute('id', 'delete' + i.toString());
        deleteButton.onmouseup = function () {
            var index = parseInt(this.id.replaceAll('delete', ''));
            if (regularMenuButtons[index] !== null && regularMenuButtons[index] !== undefined) {
                regularMenuButtons.splice(parseInt(this.id.replaceAll('delete', ''), 10), 1);
                saveCustomSearchButtons();
                generateButtonsList();
            }

        };
        entry.appendChild(deleteButton);

        // entry.innerHTML += '< br />';
        container.appendChild(entry);
    }

    // var addButton = document.createElement('button');
    // addButton.textContent = chrome.i18n.getMessage("addButton") + ' ＋';
    // addButton.onmouseup = function () {
    //     regularMenuButtons.push({
    //         'url': '',
    //         'title': '',
    //         'enabled': true,
    //         // 'icon': ''
    //     });
    //     saveCustomSearchButtons();
    //     generateButtonsList();
    // };
    // container.appendChild(addButton);


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

    setTimeout(function () {
        document.getElementById('addNewButton').addEventListener("input", function (e) {
            // var selectInput = document.getElementById('addNewButton');
            regularMenuButtons.push(e.value);
            // chrome.storage.local.set({ 'convertToCurrency': selectInput.value.split(' — ')[0] });
        });
    }, 300);
}


document.addEventListener("DOMContentLoaded", init);

// document.addEventListener('mousemove', function (e) { drawCirclesOnCanvas(e); });