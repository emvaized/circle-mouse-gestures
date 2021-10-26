
function restoreOptions() {
  setVersionLabel()

  /// Set 'enabled' checkbox value
  chrome.storage.local.get(
    ['cmgEnabled', 'excludedDomains'], function (res) {
      document.querySelector("#enabledCheckbox").checked = res.cmgEnabled ?? true;
      document.querySelector("#excludedDomains").value = res.excludedDomains ?? '';
    });

  /// Enabled checkbox
  let enabledCheckbox = document.querySelector('#enabledCheckbox');
  enabledCheckbox.parentNode.innerHTML = chrome.i18n.getMessage("enabled") + enabledCheckbox.parentNode.innerHTML;

  setTimeout(function () {
    document.querySelector('#enabledCheckbox').addEventListener('input', function (e) {
      chrome.storage.local.set({
        cmgEnabled: document.querySelector('#enabledCheckbox').checked,
      });
    });
  }, 3);


  /// Excluded domains field
  let excludedDomainsInput = document.querySelector("#excludedDomains");
  excludedDomainsInput.setAttribute('placeholder', 'example.com, another.example.com');
  excludedDomainsInput.parentNode.innerHTML = chrome.i18n.getMessage('excludedDomains') + ': <br />' + excludedDomainsInput.parentNode.innerHTML;

  setTimeout(function () {
    document.querySelector('#excludedDomains').addEventListener('change', function (e) {
      chrome.storage.local.set({
        excludedDomains: document.querySelector('#excludedDomains').value,
      });
    });
  }, 3);

  /// Footer buttons
  document.querySelector('#settingsButton').innerHTML += ' ' + chrome.i18n.getMessage("configure");
  document.querySelector('#githubPage').innerHTML += ' ' + chrome.i18n.getMessage("githubPage");
  document.querySelector('#supportButton').innerHTML += ' ' + chrome.i18n.getMessage("supportButton");

  document.querySelector("#supportButton").addEventListener("click", function (val) {
    window.close();
    window.open('https://emvaized.diaka.ua/donate', '_blank');
  });
  document.querySelector("#githubPage").addEventListener("click", function (val) {
    window.close();
    window.open('https://github.com/emvaized/circle-mouse-gestures', '_blank');
  });
  document.querySelector("#settingsButton").addEventListener("click", function (val) {
    chrome.runtime.openOptionsPage();
    window.close();
  });
  // document.querySelector("#writeAReviewButton").addEventListener("click", function (val) {
  //   window.close();
  //   let isFirefox = navigator.userAgent.indexOf("Firefox") > -1;
  //   window.open(isFirefox ? 'https://addons.mozilla.org/ru/firefox/addon/selection-actions/' : 'https://chrome.google.com/webstore/detail/selecton/pemdbnndbdpbelmfcddaihdihdfmnadi/reviews', '_blank');
  // });
}


function setVersionLabel() {
  let label = document.getElementById('extension-version');
  var manifestData = chrome.runtime.getManifest();
  label.innerHTML = manifestData.version + ` (<a target='_blank' href='https://github.com/emvaized/circle-mouse-gestures/blob/master/CHANGELOG.md'>${chrome.i18n.getMessage("whatsNew") ?? "What's new"}</a>)`;
  label.onclick = function () { window.close(); }
}


document.addEventListener('DOMContentLoaded', restoreOptions);

// document.addEventListener("click", (e) => {
//   if (e.target.classList.contains("settings")) {
//     chrome.runtime.openOptionsPage();
//     window.close();
//   }
//   else if (e.target.classList.contains("checkbox") || e.target.classList.contains("checkboxLabel")) {
//     saveOptions(e);
//   }
// });



