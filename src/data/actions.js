/// Map of actions available to be selected from dropdown
var sortedActionButtons = {
    'regularMenu': {
        'navigation': [
            'goBack',
            'goForward',
            'switchToPreviousTab',
            'switchToNextTab',
        ],
        'tab': [
            'newTab',
            'closeCurrentTab',
            'duplicateTab',
            'pinTab',
            'closeAllTabsExceptCurrent',
            'reloadTab',
            'restoreClosedTab',
            'moveTabLeft',
            'moveTabRight',
        ],
        'window': [
            'newWindow',
            'moveToNewWindow',
            'newPrivateWindow',
            'openInPrivateWindow',
            'closeWindow',
        ],
        'page': [
            'pageZoomIn',
            'pageZoomOut',
            'copyUrl',
            'translate',
            'print',
            // 'inspectPage', /// doesn't work
            'addToBookmarks',
            'undoAction',
            'redoAction',
            'selectAll',
            'toggleFullscreen',
            'textTooLong'
        ],
        'scroll': [
            'scrollToTop',
            'scrollToBottom',
            'scrollPageUp',
            'scrollPageDown',
        ],
        '—': [
            'noAction'
        ]
    },


    'linkMenu':
    {
        'linkMenu': [
            'openInFgTab',
            'copyLinkText',
            'openInBgTab',
            'copyUrl',
            'openLinkPreview',
        ],
        '—': [
            'noAction'
        ]
    },

    'selectionMenu':
    {
        'selectionMenu': [
            'copyText',
            'searchText',
            'translate',
            'selectMore',
        ],
        '—': [
            'noAction'
        ]
    },

    'textFieldMenu':
    {
        'textFieldMenu': [
            'copyText',
            'selectAllText',
            'copyAllText',
            'cutText',
            'pasteText',
            'clearInputField',
            'moveCaretToStart',
            'moveCaretToEnd',

            'boldText',
            'italicText',
            'underlineText',
            'strikeText',
        ],
        '—': [
            'noAction'
        ]
    },

    'imageMenu':
    {
        'imageMenu': [
            'openInFgTab',
            'downloadUrlAs',
            'openInBgTab',
            'searchImageOnGoogle',
            'copyUrl',
            'copyImage',
            'openImageFullscreen', /// Image-view
        ],
        '—': [
            'noAction'
        ]
    },

    'playerMenu':
    {
        'playerMenu': [
            'playPauseVideo',
            'replayVideo',
            'rewindVideo',
            'fastForwardVideo',
            'downloadUrlAs',
            'downloadVideoSavefromNet',
            'playerFullScreen',
            'normalPlaybackSpeed',
            'slowerPlaybackSpeed',
            'fasterPlaybackSpeed',
            'increasePlayerVolume',
            'decreasePlayerVolume',
            'mutePlayer',
        ],
        '—': [
            'noAction'
        ]
    },
};