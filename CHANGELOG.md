1.5
- CMG now always applies most settings immediately, no need to reload the page
- Fix options page bug with click on preview stopped working after scroll
- Scroll to selected segment after click on preview in options page
- Disabled centering settings to avoid layout issues
- Updated extension icon
- Project cleanup for better performance

1.4.5
- Migrated to Manifest V3 to comply with new Chrome Web Store requirements
- Released code is now minified, and extension should now become much faster and lighter
- Implemented import/export/reset settings buttons
- Added option to require modifier key for non-regular menus to show (link, image etc)
- Slightly updated extension icon, added outlines
- Small fixes and improvements

1.4.0
- Removed shadow from Image viewer for better visibility with transparent images
- Improved text field detection

1.3.9
- Fix non working 'Open in popup window' action
- Add action 'Translate in popup window'
- Reduced amount of false image detections
- Added Dutch translation
- Other small fixes and improvements

1.3.8
- Add action 'Reload without cache'
- Fix for black backdrop on some pages
- Fix for an issue with extra slash in links
- Fix for regular context menu still open after secondary button action was triggered
- Update donate link to PayPal

1.3.7
- New actions for links: "Open in side window" and "Open in popup window" (as an alternative to "Link preview" action)
- Small fixes for ‘long left click’ mode

1.3.6
- Add possibility to add gap between segments
- Options page small improvements
- Fixed popup icons
- Fixes for ‘long left click’ mode
- Possible fix for show-up transition not working sometimes
- 'Open URL' action now accepts few additional params

1.3.5
- Changed support/donate link to the new Ko-Fi page
- Fixed 'Add a review' link always leading to 'ru' page in Firefox

1.3.4
- Added "Bookmarks list" action, with ability to query and open bookmarks
- Tab switcher performance improved
- Updated README

1.3.3
- Fixed continuous scroll detection getting stuck after called regular context menu
- Fixed bug when on-hover tooltip for icon-only action appeared after circle is closed

1.3.2
- Added Minimize/Maximize window actions
- Add grid view tab switcher action
- Tab switcher now is able to fetch thumbnails(previews) in Firefox
- Added basic video support for "View" action
- Less false positive image detections
- Fixed image viewer not working on Medium
- Added Spanish translation
- Small fixes

1.3.1
- Fixed copy notification lag on Firefox
- Improve naming of downloaded images
- Separated 'Download' and 'Download as' actions, so to be able to download images immediately
- Improved image recognition
- Add small shadow to fullscreen overlays (link preview, view image, tab switcher)
- Options page fixes & improvements

1.3.0
- Added tab switcher action (vertical and horizontal). It can be controlled with mouse wheel and provides search field
- Added "Open URL" action, with ability to set any URL and label
- Added "Recent tab" action, which switches between current and last used tab
- Added extension update notification, with the ability to disable in settings
- Added config "Check buttons availability"
- Performance improvements and bug fixes

1.2.9
- Improved 'scroll' functions
- Changed scroll animation to work in more browsers
- Show options hints only when hovering question mark + added delay before hint shown
- Changed blur mechanism for better compatibility on websites
- Various fixes and improvements

1.2.8
- Added option to disable showing icons, for text-only appearance
- Added option to not hide text labels when there's no enough space
- Fixed issue with animated scroll on some websites
- Fixes for 'cursor leave window' setting

1.2.7
- Added new config 'Behavior when cursor leaves window'
- Added option to disable ghost pointer when circle is not under cursor
- Improved popup design + added "Add review" button
- Debug mode now prints stored configs in console
- Updated translations

1.2.6
- Clicking on 'What's new' in popup now closes the popup
- Excluded domains config is not case-sensitive now
- Background dimmer no longer messes up with 'Open regular menu if no action selected'
- Added small delay before options tooltip gets revealed
- Changed default config for blur to false

1.2.5
- Added configs for circle show and hide animations
- Added blur effect config
- Added 'long left click threshold' option
- Added 'Excluded domains' config in popup
- Settings page layout & design improvements
- Circle no longer appears when dragging scrollbars while 'long left click to open' is enabled
- 'Copy link' command now removes 'mailto:' from links
- Changed default setting for 'Circle position' to 'cursorOverflow'

1.2.4
- Added separate configs for icons and labels opacity
- Added 'Circle location' config (always under cursor / always corner / under cursor + in corner when no space / under cursor + shift when no space)
- Resolved conflict with drag when 'long left click to open' is active
- Fixed issue when circle still had hide animation despite it's disabled in settings
- Improved image copy on Firefox
- Changed some default configs
- Small options page improvements

1.2.3
- Fixed circle transition not working on some websites

1.2.2
- Added support for continuous scroll detection for mouse wheel gestures! Works great with zoom in/out actions, or volume+- for players
- Added horizontal wheel scroll actions
- Added new option to show title hint on hovering action, when it's icon-only (default: on)
- 'Copy' commands now display browser notification on success
- Added player volume actions

- Performance optimizations
- Improvements for link preview + new nice open transition
- Improved 'long left click to open' functionality
- Other small fixes and improvements

1.2.1
- Improved 'long left click to open menu' functionality
- Improved settings layout and translations

1.2.0
- Added option to open circle on long left click instead of right click (esp. useful on macbooks)
- Added "Link preview" feature, somewhat like in Safari on Mac
- Fixed zoom not working for fullscreen image view
- Fixed bugs in options page + improved labels

1.1.4
- Small layout fixes and improvements

1.1.3
- Fixed player fullscreen action

1.1.2
- Fixed options layout for new Firefox update
- Added 'Print' action
- Background dimmer is now enabled by default
- Small layout fixes and improvements

1.1.1
- Fixed issues with disabled levels
- Options layout fixes

1.1.0
- Added new actions:
  * New private window
  * Open in private window
- Scroll actions can now work with embedded scrolling elements on page
- Previosly stored scrolled position is not cleared on wheel scroll
- "Open in new window" and "Open new window" actions now work for links
- Performance and animations improvements

1.0.9
- Various improvements to pinned tabs functionality
- Changed icon for 'duplicate tab' action
- Fixed layout issues on some websites
- Added new actions:
  * New window
  * Close window
  * Open in new window
  * Move tab right
  * Move tab left

1.0.8
- Added new actions:
  * Shrink page 
  * View image
  * Pin tab
  * Duplicate tab
  * Close other tabs
  * Playback speed actions (slower, faster etc)

- Implemented ability to change color for each action/segment
- Added ability to configure animation duration
- Redesigned settings page for better consistency
- Changed icons for 'go back' and 'go forward' actions
- Great performance optimizations

1.0.7
- Improved 'scroll to bottom' action, so that it works on more websites
- Implemented 'scroll back' feature
- Better compatibility with contenteditable input fields
- Improved 'Call regular menu if no action selected' feature
- Improved overall smoothness of extension
- Implemented 'Select all' and 'Select more' actions
- Added support for middle button rocker gesture
- 'Copy image' action improved (still works bad on Firefox)
- Code refactored + small bug fixes and improvements

1.0.6
- Improved link display in helper tooltip
- Improved 'copy image' functionality
- "Undo" and "Redo" actions are back (on Firefox will work only with 'contenteditable' fields)
- Added options 'Add shadow' and 'Highlight element on hover'
- Added ability to set different opacity for levels
- Added ability to configure page dimmer opacity

1.0.5
- Added special menu for HTML5 players (video/audio)
- Implemented ability to configure behavior when element menu is not active (show regular menu/do nothing)
- Added 'Copy all text' action for input fields
- Added 'Copy image' action for image menu (for now works only if image is placed on domain which allows CORS)
- Removed 'Undo' and 'Redo' actions for now, as they work unreliably
- Various small fixes and improvements

1.0.4
- Added circle opacity config
- Added 'Clear' action for input field menu
- Added 'Move caret to start' and 'Move caret to end' actions for input fields
- Added 'Undo' and 'Redo' actions for regular menu (doesn't work quite well yet)
- Fix for input field buttons being false-inactive on Firefox 
- Changed default buttons order and colors
- Fixed bug with screen shifting on focusing input

1.0.3
- Added separate menu for input fields
- Added option in settings to disable helper tooltip
- Fix for link/image/text selection menus not showing up

1.0.2
- Added option to show regular context menu if no action was selected
- Now link/image/text selection menus can be populated with regular menu actions
- It is now possible to deactive link/image/text selection menu by removing all of it's levels
- Improved options layout when window is not maximized
- Added few tooltips in options

1.0.1
- Added switch for debug mode in settings
- Updated description
- Bug fixes

1.0
- Initial release