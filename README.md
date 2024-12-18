# <sub><img src="./src/assets/icons/icon-new.png" height="48" width="48"></sub> Circle Mouse Gestures

[![Changelog](https://img.shields.io/chrome-web-store/v/kkknhbbfjlibfjagilggkcelmcobgefa?label=version&color=purple)](./CHANGELOG.md)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/users/kkknhbbfjlibfjagilggkcelmcobgefa?label=users&logo=googlechrome&logoColor=white&color=blue)](https://chrome.google.com/webstore/detail/circle-mouse-gestures-pie/kkknhbbfjlibfjagilggkcelmcobgefa)
[![Mozilla Add-on](https://img.shields.io/amo/users/circle-mouse-gestures?color=%23FF6611&label=users&logo=Firefox)](https://addons.mozilla.org/firefox/addon/circle-mouse-gestures/)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/rating/kkknhbbfjlibfjagilggkcelmcobgefa)](https://chrome.google.com/webstore/detail/circle-mouse-gestures-pie/kkknhbbfjlibfjagilggkcelmcobgefa/reviews)
[![Support project](https://shields.io/badge/Ko--fi-Support_project-ff5f5f?logo=Ko-Fi&style=for-the-badgeKo-fi)](https://ko-fi.com/emvaized)

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

<img src="./screenshots/screenshot.png">

Get for Firefox <br>
<a href="https://addons.mozilla.org/firefox/addon/circle-mouse-gestures/"><img src="https://user-images.githubusercontent.com/585534/107280546-7b9b2a00-6a26-11eb-8f9f-f95932f4bfec.png" alt="Get for Firefox"></a>

Get for Chrome (Edge, Brave, Vivaldi etc) <br> 
<a href="https://chrome.google.com/webstore/detail/circle-mouse-gestures-pie/kkknhbbfjlibfjagilggkcelmcobgefa"><img src="https://developer.chrome.com/static/docs/webstore/branding/image/iNEddTyWiMfLSwFD6qGq.png" alt="Get for Chrome" height=65 /></a>

## FAQ
Moved to the Wiki page – [read here](https://github.com/emvaized/circle-mouse-gestures/wiki/FAQ-(Frequently-Asked-Questions))


## Donate
If you really enjoy this project, please consider supporting its further development by making a small donation using one of the ways below! 

<a href="https://ko-fi.com/emvaized"><img src="https://storage.ko-fi.com/cdn/kofi1.png?v=6" alt="Support on Ko-fi" height="40"></a> &nbsp; <a href="https://liberapay.com/emvaized/donate"><img alt="Donate using Liberapay" src="https://liberapay.com/assets/widgets/donate.svg" height="40"></a> &nbsp; <a href="https://emvaized.github.io/donate/bitcoin/"><img src="https://github.com/emvaized/emvaized.github.io/blob/main/donate/bitcoin/assets/bitcoin-donate-button.png?raw=true" alt="Donate Bitcoin" height="40" /></a>

## Building
- `npm install` to install all dependencies
- `npm run build` to generate `dist` folder with minimized code of the extension

## Some ideas for future releases or contributions
- [x] Import/export settings
- [x] Option to set custom favicon for 'Open URL' action
- [ ] Action to execute custom Javascript
- [ ] Actions to switch to first/last tab
- [ ] Fix broken mouse detection on Vivaldi browser


## Links to my other browser extensions
* [Selecton](https://github.com/emvaized/selecton-extension) – smart text selection popup
* [Open in Popup Window](https://github.com/emvaized/open-in-popup-window-extension) – quickly open any links and images in a small popup window with no browser controls
* [Google Search Tweaks](https://github.com/emvaized/google-tiles-extension) – set of tweaks for Google search page to make it easier to use
* [Linkover](https://github.com/emvaized/linkover-extension) – load info about any link on mouse hover or on a long click
