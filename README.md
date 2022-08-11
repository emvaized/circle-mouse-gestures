# <sub><img src="https://github.com/emvaized/circle-mouse-gestures/blob/master/icons/icon-monotone-48.png" height="48" width="48"></sub> Circle Mouse Gestures

This extension introduces convenient circle menu (so-called pie menu) to improve interaction with your browser. 
Just hold down the right mouse button, highlight one of the actions and release the button. 

Circle menu recreates the way mouse gestures were represented in good old Opera 12 browser, and allows to clearly see all available gestures, with no need to remember them all.
CMG is supposed to provide a better implementation of mouse gestures and drag gestures, while replacing the regular context menu at the same time — but regular context menu is always there whenever you need it. Perfect for fullscreen browsing!

Extension features:
- Regular actions, such as 'Go back', 'New tab', 'Scroll to top' etc.
- Separate gestures for links, images, input fields etc.
- Support for rocker gestures and mouse wheel gestures
- Supports horizontal wheel gestures - great on mouses with horizontal wheel, such as MX Master
- Support for trigger on long left click
- Great customization options - add actions levels, set their width and color for each action

Additional tools:
- Link preview (like in Safari on mac)
- Tab switcher (vertical/horizontal/grid), with ability to quickly switch, search and close tabs
- Bookmarks viewer (list/grid), with ability to search and open bookmarks
- Image viewer, with ability to view given image in fullscreen, zoom it and rotate 
- Page shrinker, which adds horizontal space to page for easier reading on some websites

<img src="https://github.com/emvaized/circle-mouse-gestures/blob/master/screenshots/screenshot.png">

Download for Chrome:
https://chrome.google.com/webstore/detail/circle-mouse-gestures-pie/kkknhbbfjlibfjagilggkcelmcobgefa

Download for Firefox:
https://addons.mozilla.org/firefox/addon/circle-mouse-gestures/

---

### FAQ

**How to open regular context menu?**
* Double right click on element should always open regular context menu, 
* Right click while holding the left mouse button
* Right click while holding the CTRL key
* On Windows, it will also get open on right mouse button up if no circle section was selected (while "Show regular menu if no action selected" setting is on). On Linux and MacOS this behavior can achieved only in Firefox by changing `ui.context_menus.after_mouseup` flag to `true` on `about:config` page.

**Why extension doesn't work on new tab page?**
* This is basic security limitation in most modern browsers. Browser extension could not execute it's scripts on new tab page (speed dial), as well as on service pages (`chrome://`, `about:*`, etc.) and in extensions store

**Blur option is not working in Firefox**
* As it stated [here](https://bugzilla.mozilla.org/show_bug.cgi?id=1578503), you would need first to enable this feature in your browser by visiting `about:config` page, search for `layout.css.backdrop-filter.enabled` and set it to *true* 

**Favicons are not shown for "Open URL" action and/or in tab switcher**
* CMG fetches favicons for websites from Google. It is possible that you have Ad-blocker installed, which blocks all requests to Google services. It may also be that current website blocks all external requests at all for security reasons, which prevents CMG from loading favicons.

**Favicon for "Open URL" action shows blue globe**
* Perhaps there's no corresponding favicon in Google's favicon database. Try to play around with url.

**Link preview is not working**
* Link preview's functionality is based on embedded iframes, and some websites restrict those for security considerations. It's not possible to get around this.

**"Copy image" action is not working**
* Due to the limitations of browser extensions, it is not possible sometimes to copy image protected by CORS policy. I'm not aware of any way to overcome it.

**How to get tab thumbnails (previews) in tab switcher?**
* This functionality is currently only available in [Vivaldi](https://vivaldi.com/) and [Firefox](https://www.mozilla.org/firefox/new/), and is working out of the box. Other browsers do not provide such ability to get this data for browser extensions (or I didn't find those).

**How to add CMG settings as Vivaldi side panel?**
* Use this URL: *chrome-extension://*{ID OF EXTENSION}*/options/options.html*, where {ID OF EXTENSION} is a unique extension ID on your computer. You can get this from extension details page in `chrome://extensions`

---

### Ideas for future releases
* Import/export settings
* Action to execute custom Javascript
* Option to set custom favicon for 'Open URL' action

---

### Donate
If you really enjoy this product, you may also consider making a small donation for a coffee :)

<a href="https://www.paypal.com/donate/?business=2KDNGXNUVZW7N&no_recurring=0&currency_code=USD"><img src="https://www.paypalobjects.com/en_US/DK/i/btn/btn_donateCC_LG.gif" height="25"/></a>

---

### Links to my other browser extensions
* [Selecton](https://github.com/emvaized/selecton-extension) – smart text selection popup
* [Google Tweaks](https://github.com/emvaized/google-tiles-extension) – set of tweaks for Google search page to make it easier to use
