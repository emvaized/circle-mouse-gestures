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
            'closeAllTabsExceptCurrent',
            'reloadTab',
            'restoreClosedTab',
            'duplicateTab',
            'pinTab',
        ],
        'page': [
            'pageZoomIn',
            'pageZoomOut',
            'copyUrl',
            'translate',
            'addToBookmarks',
            'undoAction',
            'redoAction',
            'selectAll',
            'toggleFullscreen',
            'textTooLong' /// text-too-long
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
        ],
        '—': [
            'noAction'
        ]
    },
};