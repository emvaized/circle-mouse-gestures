# <sub><img src="https://github.com/emvaized/circle-mouse-gestures/blob/master/icons/icon-monotone-48.png" height="48" width="48"></sub> Circle Mouse Gestures

This extension introduces convenient circle menu (so-called pie menu) to improve interaction with your browser. 
Just hold down the right mouse button, highlight one of the actions and release the button. 

Circle menu recreates the way mouse gestures were represented in good old Opera 12 browser, and allows to clearly see all available gestures, with no need to remember them all.
CMG is supposed to provide a better implementation of mouse gestures and drag gestures, while replacing the regular context menu at the same time — but regular context menu is always there whenever you need it. Perfect for fullscreen browsing!

Extension features:
- separate gestures for links, images, input fields etc.
- support for rocker gestures, mouse wheel gestures
- supports horizontal mouse wheel gestures - great on mouses wheel horizontal wheel, such as MX Master
- image preview and link preview (like in Safari on mac)
- vertical and horizontal tab switcher
- gestures on long left click (works great on macbook)
- great customization options
... and many more


Download for Firefox:
https://addons.mozilla.org/ru/firefox/addon/circle-mouse-gestures/

Download for Chrome:
https://chrome.google.com/webstore/detail/circle-mouse-gestures/kkknhbbfjlibfjagilggkcelmcobgefa


----

### FAQ

**How to open regular context menu?**
* Double right click on element should always open regular context menu, 
* Right click while holding the left mouse button
* Right click while holding the CTRL key
* On Windows, it will also get open on right mouse up if no circle section was selected (while "Show regular menu if no action selected" setting is on)

**Why extension doesn't work on new tab page?**
* This is basic security limitation in most modern browsers. Browser extension could not execute it's scripts on new tab page (speed dial), as well as on service pages (`chrome://`, `about:*`, etc.) and in extensions store

**Blur option is not working in Firefox**
* As it stated [here](https://bugzilla.mozilla.org/show_bug.cgi?id=1578503), you would need first to enable this feature in your browser by visiting `about:config` page and setting `layout.css.backdrop-filter.enabled` to *true* 

**How to add CMG settings as Vivaldi side panel?**
* Use this URL: *chrome-extension://*{ID OF EXTENSION}*/options/options.html*, where {ID OF EXTENSION} is a unique extension ID on your computer. You can get this from extension details page in `chrome://extensions`

----