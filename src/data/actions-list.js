/// Map of actions available to be selected from dropdown
const sortedActionButtons = {
    'regularMenu': {
        'navigation': [
            'goBack',
            'goForward',
            'switchToPreviousTab',
            'switchToNextTab',
            'selectLastVisitedTab',

            'openUrl',
            'showTabSwitcherVertical',
            'showTabSwitcherHorizontal',
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
        'window': [
            'newWindow',
            'moveToNewWindow',
            'newPrivateWindow',
            'openInPrivateWindow',
            'closeWindow',
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
            'downloadUrl',
            'downloadUrlAs',
            'openInBgTab',
            'searchImageOnGoogle',
            'copyUrl',
            'copyImage',
            'openImageFullscreen',
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
            'downloadUrl',
            'downloadUrlAs',
            'downloadVideoSavefromNet',
            'playerFullScreen',
            'normalPlaybackSpeed',
            'slowerPlaybackSpeed',
            'fasterPlaybackSpeed',
            'increasePlayerVolume',
            'decreasePlayerVolume',
            'mutePlayer',
            'openImageFullscreen',
        ],
        '—': [
            'noAction'
        ]
    },
};