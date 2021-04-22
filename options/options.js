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

        generateButtonsList();
    });
}

function generateButtonsList() {
    var container = document.getElementById('buttons-config-container');
    container.innerHTML = '';

    for (var i = 0; i < regularMenuButtons.length; i++) {
        var item = regularMenuButtons[i];

        var entry = document.createElement('div');
        entry.setAttribute('class', 'option');

        /// Enabled checkbox
        // var checkbox = document.createElement('input');
        // checkbox.setAttribute('type', 'checkbox');
        // checkbox.setAttribute('style', 'pointer: cursor; vertical-align: middle !important;');
        // checkbox.value = item['enabled'];
        // if (item['enabled'])
        //     checkbox.setAttribute('checked', 0);
        // else checkbox.removeAttribute('checked', 0);
        // checkbox.setAttribute('id', 'checkbox' + i.toString());
        // checkbox.addEventListener("input", function (e) {
        //     regularMenuButtons[parseInt(this.id.replaceAll('checkbox', ''))]['enabled'] = this.checked;
        //     saveCustomSearchButtons();
        // });
        // entry.appendChild(checkbox);

        /// Create favicon preview
        // var imgButton = document.createElement('img');
        // var icon = item['icon'];
        // imgButton.setAttribute('src', icon !== null && icon !== undefined && icon !== '' ? icon : 'https://www.google.com/s2/favicons?domain=' + item['url'].split('/')[2])
        // imgButton.setAttribute('width', '18px');
        // imgButton.setAttribute('height', '18px');
        // imgButton.setAttribute('style', 'margin-left: 3px; padding: 1px; vertical-align: middle !important;');
        // entry.appendChild(imgButton);

        /// Title field
        var title = document.createElement('span');
        // title.setAttribute('type', 'text');
        // title.setAttribute('placeholder', 'Title');
        // title.setAttribute('style', 'max-width: 90px; margin: 0px 6px;');
        title.innerHTML = chrome.i18n.getMessage(item) + '</br>';
        // title.setAttribute('id', 'title' + i.toString());
        // title.addEventListener("input", function (e) {
        //     // alert(this.id.replaceAll('title', ''));
        //     customSearchButtonsList[parseInt(this.id.replaceAll('title', ''))]['title'] = this.value;
        //     saveCustomSearchButtons();
        // });
        entry.appendChild(title);


        /// Custom icon URL field
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
                var movedItem = regularMenuButtons[currentIndex];
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
    var select = document.createElement('select');
    select.setAttribute('id', 'addNewButton');
    select.innerHTML = chrome.i18n.getMessage('addNewButton') + '<br />' + select.innerHTML;
    document.body.appendChild(select);

    Object.keys(actionIcons).forEach((function (key) {
        let option = document.createElement('option');
        option.innerHTML = chrome.i18n.getMessage(key);
        option.setAttribute('value', key);
        select.appendChild(option);
    }));

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