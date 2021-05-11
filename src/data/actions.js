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
            'reloadTab',
            'restoreClosedTab',
            'toggleFullscreen',
        ],
        'page': [
            'pageZoomIn',
            'pageZoomOut',
            'copyUrl',
            'translate',
            'addToBookmarks',
            'undoAction',
            'redoAction',
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
        ],
        '—': [
            'noAction'
        ]
    },
};