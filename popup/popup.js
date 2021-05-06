
function saveOptions(e) {
  chrome.storage.local.set({
    cmgEnabled: document.querySelector("#enabledCheckbox").checked,
  });
}

function restoreOptions() {

  setVersionLabel()

  /// Set 'enabled' checkbox value
  chrome.storage.local.get(
    'cmgEnabled', function (res) {
      document.querySelector("#enabledCheckbox").checked = res.cmgEnabled ?? true;
    });

  /// Translate labels
  var enabledCheckbox = document.querySelector('#enabledCheckbox');
  enabledCheckbox.parentNode.innerHTML = chrome.i18n.getMessage("enabled") + enabledCheckbox.parentNode.innerHTML;
  document.querySelector('#settingsButton').innerHTML += ' ' + chrome.i18n.getMessage("configure");
  document.querySelector('#githubPage').innerHTML += ' ' + chrome.i18n.getMessage("githubPage");
  document.querySelector('#supportButton').innerHTML += ' ' + chrome.i18n.getMessage("supportButton");
  document.querySelector('#writeAReview').innerHTML += ' ' + chrome.i18n.getMessage("writeAReview");

}

function setVersionLabel() {
  let label = document.getElementById('extension-version');
  var manifestData = chrome.runtime.getManifest();
  label.innerHTML = manifestData.version + ` (<a target='_blank' href='https://github.com/emvaized/circle-mouse-gestures/blob/master/CHANGELOG.md'>${chrome.i18n.getMessage("whatsNew") ?? "What's new"}</a>)`;
}


document.addEventListener('DOMContentLoaded', restoreOptions);
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("settings")) {
    chrome.runtime.openOptionsPage();
    window.close();
  }
  else if (e.target.classList.contains("checkbox") || e.target.classList.contains("checkboxLabel")) {
    saveOptions(e);
  }
});

document.querySelector("#supportButton").addEventListener("click", function (val) {
  window.close();
  window.open('https://emvaized.diaka.ua/donate', '_blank');
});
document.querySelector("#githubPage").addEventListener("click", function (val) {
  window.close();
  window.open('https://github.com/emvaized/circle-mouse-gestures', '_blank');
});
// document.querySelector("#writeAReviewButton").addEventListener("click", function (val) {
//   window.close();
//   let isFirefox = navigator.userAgent.indexOf("Firefox") > -1;
//   window.open(isFirefox ? 'https://addons.mozilla.org/ru/firefox/addon/selection-actions/' : 'https://chrome.google.com/webstore/detail/selecton/pemdbnndbdpbelmfcddaihdihdfmnadi/reviews', '_blank');
// });

