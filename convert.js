"use strict";

// http://stackoverflow.com/a/901144/793367
function getParameterByName(urlString, name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(urlString);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function linkOnClick(info, tab) {
  console.log(JSON.stringify(info));
  var linkUrl = info["linkUrl"];
  var pageUrl = info["pageUrl"];
  var originalUrl = getParameterByName(linkUrl, "u2")
  console.log(originalUrl)
  if (originalUrl) {
    chrome.tabs.create({url: originalUrl});
  }
}

function isFirefox() {
  return navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
}

function onError(error) {
  console.error(`Error: ${error}`);
}

function sendMessageToTabs(tabs, msg) {
  for (let tab of tabs) {
    browser.tabs.sendMessage(
      tab.id,
      {msg: msg}
    ).then(response => {}
    ).catch(onError);
  }
}

function checkLink(info) {
  var linkUrl = info["linkUrl"];
  var pageUrl = info["pageUrl"];
  var originalUrl = getParameterByName(linkUrl, "u2");

  if (originalUrl) {
    chrome.tabs.create({url: originalUrl});
  } else if (isFirefox()) {
    let msg = "No original URL found.";
    browser.tabs.query({currentWindow: true, active: true})
      .then( t => sendMessageToTabs(t, msg) )
      .catch(onError);
  } else {
    window.alert("No original URL found.");
  }

}

var contextMenuId = chrome.contextMenus.create({
  "title": "Direct link",
  "contexts": ["link"],
  "onclick": checkLink,
  "documentUrlPatterns": ["*://slickdeals.net/*"]
});
