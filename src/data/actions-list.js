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
            'showTabSwitcherGrid',
        ],
        'tab': [
            'newTab',
            'closeCurrentTab',
            'duplicateTab',
            'pinTab',
            'closeAllTabsExceptCurrent',
            'reloadTab',
            'reloadTabWithoutCache',
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
            'maximizeWindow',
            'minimizeWindow',
            'closeWindow',
        ],
        'bookmarks': [
            'addToBookmarks',
            'showBookmarksVertical',
            'showBookmarksGrid',
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
            'openInPopupWindow',
            'openInSideWindow',
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
            'translateInPopup',
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
            'copyImageUrl',
            'openImageFullscreen',
        ],
        '—': [
            'noAction'
        ]
    },

    'imageLinkMenu':
    {
        'linkMenu': [
            'openInFgTab',
            'copyLinkText',
            'openInBgTab',
            'copyUrl',
            'openLinkPreview',
            'openInPopupWindow',
            'openInSideWindow',
        ],
        'imageMenu': [
            'openInFgTab',
            'downloadUrl',
            'downloadUrlAs',
            'openInBgTab',
            'searchImageOnGoogle',
            'copyImageUrl',
            'copyImage',
            'copyImageUrl',
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