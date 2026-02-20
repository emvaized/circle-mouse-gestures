
function restoreOptions() {
  setVersionLabel()

  /// Set 'enabled' checkbox value
  chrome.storage.local.get(
    ['cmgEnabled'], function (res) {
      document.querySelector("#enabledCheckbox").checked = res.cmgEnabled ?? true;
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

  /// Add this site button
  let addThisSiteButton = document.querySelector('#addThisSiteButton');
  
  function updateButtonState() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (!tabs[0]) return;
      
      try {
        const url = new URL(tabs[0].url);
        const domain = url.hostname;
        
        chrome.storage.local.get(['excludedDomains'], function(res) {
          const excludedDomains = res.excludedDomains || '';
          const domainsList = excludedDomains.split(',').map(d => d.trim().toLowerCase()).filter(d => d);
          
          if (domainsList.includes(domain.toLowerCase())) {
            addThisSiteButton.innerHTML = '<span style="color: #f44336; font-weight: bold; font-size: 1.3em; margin-right: 8px;">−</span>' + chrome.i18n.getMessage('removeSite');
            addThisSiteButton.dataset.isExcluded = 'true';
          } else {
            addThisSiteButton.innerHTML = '<span style="color: #4CAF50; font-weight: bold; font-size: 1.3em; margin-right: 8px;">+</span>' + chrome.i18n.getMessage('addSite');
            addThisSiteButton.dataset.isExcluded = 'false';
          }
        });
      } catch (e) {
        console.error('Failed to parse URL:', e);
      }
    });
  }
  
  updateButtonState();
  
  addThisSiteButton.addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (!tabs[0]) return;
      
      try {
        const url = new URL(tabs[0].url);
        const domain = url.hostname;
        
        chrome.storage.local.get(['excludedDomains'], function(res) {
          const excludedDomains = res.excludedDomains || '';
          const domainsList = excludedDomains.split(',').map(d => d.trim()).filter(d => d);
          
          if (addThisSiteButton.dataset.isExcluded === 'true') {
            // Remove domain
            const newDomainsList = domainsList.filter(d => d.toLowerCase() !== domain.toLowerCase());
            const newDomains = newDomainsList.join(', ');
            chrome.storage.local.set({ excludedDomains: newDomains }, function() {
              updateButtonState();
            });
          } else {
            // Add domain
            const newDomains = excludedDomains ? excludedDomains + ', ' + domain : domain;
            chrome.storage.local.set({ excludedDomains: newDomains }, function() {
              updateButtonState();
            });
          }
        });
      } catch (e) {
        console.error('Failed to parse URL:', e);
      }
    });
  });

  /// Manage domains button and dropdown
  let manageDomainsButton = document.querySelector('#manageDomainsButton');
  manageDomainsButton.setAttribute('title', chrome.i18n.getMessage('manageDomains'));
  let domainsDropdown = document.querySelector('#domainsDropdown');
  
  manageDomainsButton.addEventListener('click', function(e) {
    e.stopPropagation();
    if (domainsDropdown.style.display === 'none') {
      renderDomainsList();
      domainsDropdown.style.display = 'block';
    } else {
      domainsDropdown.style.display = 'none';
    }
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', function(e) {
    if (!domainsDropdown.contains(e.target) && e.target !== manageDomainsButton) {
      domainsDropdown.style.display = 'none';
    }
  });

  function renderDomainsList() {
    chrome.storage.local.get(['excludedDomains'], function(res) {
      const excludedDomains = res.excludedDomains || '';
      const domainsList = excludedDomains.split(',').map(d => d.trim()).filter(d => d);
      const domainsListEl = document.querySelector('#domainsList');
      domainsListEl.innerHTML = '';

      // Add input field with plus button at top
      const addItem = document.createElement('div');
      addItem.className = 'add-domain-item';
      
      const addInput = document.createElement('input');
      addInput.type = 'text';
      addInput.className = 'add-domain-input';
      addInput.placeholder = chrome.i18n.getMessage('addDomainManually');
      
      const addBtn = document.createElement('button');
      addBtn.textContent = '+';
      addBtn.className = 'add-domain-button';
      addBtn.title = chrome.i18n.getMessage('addDomainManually');
      addBtn.addEventListener('click', function() {
        addDomainManually(addInput);
      });
      
      addInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          addDomainManually(addInput);
        }
      });
      
      addItem.appendChild(addInput);
      addItem.appendChild(addBtn);
      domainsListEl.appendChild(addItem);

      if (domainsList.length === 0) {
        const noDomains = document.createElement('div');
        noDomains.className = 'no-domains';
        noDomains.textContent = chrome.i18n.getMessage('noDomains');
        domainsListEl.appendChild(noDomains);
      } else {
        domainsList.forEach(function(domain) {
          const item = document.createElement('div');
          item.className = 'domain-item';
          
          const removeBtn = document.createElement('button');
          removeBtn.textContent = '−';
          removeBtn.title = chrome.i18n.getMessage('removeDomain');
          removeBtn.addEventListener('click', function() {
            removeDomain(domain);
          });
          
          const domainSpan = document.createElement('span');
          domainSpan.textContent = domain;
          
          item.appendChild(removeBtn);
          item.appendChild(domainSpan);
          domainsListEl.appendChild(item);
        });
      }
    });
  }

  function removeDomain(domainToRemove) {
    chrome.storage.local.get(['excludedDomains'], function(res) {
      const excludedDomains = res.excludedDomains || '';
      const domainsList = excludedDomains.split(',').map(d => d.trim()).filter(d => d);
      const newDomainsList = domainsList.filter(d => d !== domainToRemove);
      const newDomains = newDomainsList.join(', ');
      chrome.storage.local.set({ excludedDomains: newDomains }, function() {
        renderDomainsList();
      });
    });
  }

  function addDomainManually(inputElement) {
    const domain = inputElement.value.trim();
    if (!domain) return;
    
    chrome.storage.local.get(['excludedDomains'], function(res) {
      const excludedDomains = res.excludedDomains || '';
      const domainsList = excludedDomains.split(',').map(d => d.trim().toLowerCase()).filter(d => d);
      
      if (domainsList.includes(domain.toLowerCase())) {
        alert(chrome.i18n.getMessage('domainAlreadyExcluded'));
        return;
      }
      
      const newDomains = excludedDomains ? excludedDomains + ', ' + domain : domain;
      chrome.storage.local.set({ excludedDomains: newDomains }, function() {
        inputElement.value = '';
        renderDomainsList();
      });
    });
  }

  /// Footer buttons
  let settingsButton = document.querySelector('#settingsButton'); settingsButton.innerHTML = chrome.i18n.getMessage("configure") + ' ' + settingsButton.innerHTML;
  let githubButton = document.querySelector('#githubPage'); githubButton.innerHTML = chrome.i18n.getMessage("githubPage") + ' ' + githubButton.innerHTML;
  githubButton.setAttribute('title', chrome.i18n.getMessage("githubHint"));
  let supportButton = document.querySelector('#supportButton'); supportButton.innerHTML = chrome.i18n.getMessage("supportButton") + ' ' + supportButton.innerHTML;
  let reviewButton = document.querySelector('#reviewButton'); reviewButton.innerHTML = chrome.i18n.getMessage("reviewButton") + ' ' + reviewButton.innerHTML;

  document.querySelector("#supportButton").addEventListener("click", function (val) {
    window.close();
    window.open('https://github.com/emvaized/emvaized.github.io/wiki/Donate-Page', '_blank');
  });
  document.querySelector("#githubPage").addEventListener("click", function (val) {
    window.close();
    window.open('https://github.com/emvaized/circle-mouse-gestures', '_blank');
  });
  document.querySelector("#settingsButton").addEventListener("click", function (val) {
    chrome.runtime.openOptionsPage();
    window.close();
  });
  document.querySelector("#reviewButton").addEventListener("click", function (val) {
    window.close();
    let isFirefox = navigator.userAgent.indexOf("Firefox") > -1;
    window.open(isFirefox ? 'https://addons.mozilla.org/firefox/addon/circle-mouse-gestures/' : 'https://chrome.google.com/webstore/detail/circle-mouse-gestures-pie/kkknhbbfjlibfjagilggkcelmcobgefa/reviews', '_blank');
  });
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



